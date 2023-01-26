//SPDX-License-Identifier:MIT
pragma solidity 0.8.17;


import {
    ISuperfluid, 
    ISuperToken, 
    ISuperApp
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import { SuperTokenV1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StrakerContractV1 {

    using SuperTokenV1Library for ISuperToken;
    ISuperToken public strakertoken;
    //fDAIx:0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00

    IERC20 public stakingtoken;
    //fDAI:0x88271d333C72e51516B67f5567c728E702b3eeE8
    
    constructor(ISuperToken _strakertoken, IERC20 _stakingtoken) {
        strakertoken = _strakertoken;
        stakingtoken = _stakingtoken;
    }

    uint256 rewardrate = 4;

    mapping(address => uint256) public stakedAmount;

    uint256 public totalStaked;

    function initialDeposit(uint256 _deposit) public {
        strakertoken.transferFrom(msg.sender,address(this),_deposit);
    }

    /// @notice Create flow from contract to specified address.
    /// @param receiver Receiver of stream.
    /// @param flowRate Flow rate per second to stream.
    function createFlowFromContract(
        address receiver,
        int96 flowRate
    ) public {

        strakertoken.createFlow(receiver, flowRate);
    }

    /// @notice Update flow from contract to specified address.
    /// @param receiver Receiver of stream.
    /// @param flowRate Flow rate per second to stream.
    function updateFlowFromContract(
        address receiver,
        int96 flowRate
    ) public {

        strakertoken.updateFlow(receiver, flowRate);
    }

    /// @notice Delete flow from contract to specified address.
    /// @param receiver Receiver of stream.
    function deleteFlowFromContract(address receiver) public {

        strakertoken.deleteFlow(address(this), receiver);
    }

    function stake(uint256 _stakingAmount) public {
        require(_stakingAmount <= stakingtoken.balanceOf(msg.sender),"Staking amount more than balance");
        stakingtoken.transferFrom(msg.sender,address(this),_stakingAmount);
        stakedAmount[msg.sender]+=_stakingAmount;
        totalStaked+=_stakingAmount;
        int256 rate = int256(rewardrate * stakedAmount[msg.sender])/(100 * 31536000);
        int96 flowrate = int96(rate) ;
        createFlowFromContract(msg.sender, flowrate);
    }

    function unstake(uint256 _unstakingAmount) public {
        require(_unstakingAmount <= stakedAmount[msg.sender], "Amount cannot be greater than staked amount");
        require(_unstakingAmount <= totalStaked, "Amount cannot be greatter than total staked tokens");
        stakingtoken.transferFrom(address(this),msg.sender,_unstakingAmount);
        stakedAmount[msg.sender]-=_unstakingAmount;
        totalStaked-=_unstakingAmount;
        int256 rate = int256(rewardrate * stakedAmount[msg.sender])/(100 * 31536000);
        int96 flowrate = int96(rate) ;
        updateFlowFromContract(msg.sender, flowrate);

    }


}