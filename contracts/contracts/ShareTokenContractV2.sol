// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {
    ISuperfluid, 
    ISuperToken, 
    ISuperApp
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import { SuperTokenV1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";

import "./IERC20.sol";

import "./IShareToken.sol";

contract ShareToken is IShareToken {

    using SuperTokenV1Library for ISuperToken;
    ISuperToken public strakertoken;
    //fDAIx:0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00

    address public stakingcontract;

    uint256 rewardrate = 4;

    constructor(ISuperToken _strakertoken, address _stakingaddr){
        strakertoken = _strakertoken;
        stakingcontract = _stakingaddr;
    }
  
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    string public name = "Straker staked DAI";
    string public symbol = "strDAI";
    uint8 public decimals = 18;

    function updateStream(address _recipient, int96 flowrate) public {
        if(strakertoken.getFlowRate(stakingcontract, _recipient) == 0){
            strakertoken.createFlowFrom(stakingcontract, _recipient, flowrate);
        }else{
            strakertoken.updateFlowFrom(stakingcontract, _recipient, flowrate);
        }
    }

    function transfer(address recipient, uint256 amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        int256 rate = int256(rewardrate * balanceOf[msg.sender])/(100 * 31536000);
        int96 flowrate = int96(rate) ;
        if(balanceOf[msg.sender]==0){
            int256 totalrate = int256(rewardrate * amount/(100*31536000));
            int96 totalflowrate = int96(totalrate);
            strakertoken.deleteFlowFrom(stakingcontract,msg.sender);
            updateStream(recipient,totalflowrate);
        }else{
            updateStream(recipient,flowrate);
            updateStream(msg.sender,flowrate);
        }
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool) {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        int256 rate = int256(rewardrate * balanceOf[msg.sender])/(100 * 31536000);
        int96 flowrate = int96(rate) ;
        if(balanceOf[msg.sender]==0){
            int256 totalrate = int256(rewardrate * amount/(100*31536000));
            int96 totalflowrate = int96(totalrate);
            strakertoken.deleteFlowFrom(stakingcontract,msg.sender);
            updateStream(recipient,totalflowrate);      
        }else{
            updateStream(recipient,flowrate);
            updateStream(msg.sender,flowrate);
        }
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function mint(uint256 amount, address recipient) external returns (bool) {
        balanceOf[recipient] += amount;
        totalSupply += amount;
        int256 rate = int256(rewardrate * balanceOf[msg.sender])/(100 * 31536000);
        int96 flowrate = int96(rate) ;
        if(balanceOf[msg.sender]==0){
            strakertoken.deleteFlowFrom(stakingcontract,msg.sender);
        }else{
            updateStream(msg.sender,flowrate);
        }        emit Transfer(address(0), msg.sender, amount);
        return(true);
    }

    function burn(uint256 amount, address owner) external returns(bool) {
        balanceOf[owner] -= amount;
        totalSupply -= amount;
        int256 rate = int256(rewardrate * balanceOf[owner])/(100 * 31536000);
        int96 flowrate = int96(rate) ;
        if(balanceOf[owner]==0){
            strakertoken.deleteFlowFrom(stakingcontract,owner);
        }else{
            updateStream(owner,flowrate);
        }
        emit Transfer(owner, address(0), amount);
        return(true);
    }
}
