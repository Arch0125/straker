// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import {ISuperfluid, ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {IInstantDistributionAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IInstantDistributionAgreementV1.sol";

import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenSpreader {

    /// @notice ERC20 token used for staking
    IERC20 public immutable stakingToken;

    /// @notice Super token to be distributed.
    ISuperToken public spreaderToken;

    /// @notice SuperToken Library
    using SuperTokenV1Library for ISuperToken;

    /// @notice Index ID. Never changes.
    uint32 public constant INDEX_ID = 0;

    uint256 public totakStaked;

    uint256 public Stakers;

    uint256 public immutable rewardAmount;

    mapping(address => uint256) public balanceOf;

    constructor(ISuperToken _spreaderToken, IERC20 _stakingToken, uint256 _rewardAmount, uint256 _liquidStakingAmount) {
        spreaderToken = _spreaderToken;
        stakingToken = _stakingToken;
        rewardAmount = _rewardAmount;
        spreaderToken.transferFrom(msg.sender,address(this), rewardAmount + _liquidStakingAmount);

        // Creates the IDA Index through which tokens will be distributed
        _spreaderToken.createIndex(INDEX_ID);
    }

    // Staking Operations

    /// @notice Takes the _amount to be staked from the user adn transfers it to the deployed contract, transfers the user same amount of Liquid Staking tokens as shares
    /// @param _amount of token to be staked
    function stake(uint256 _amount)public{
        require(_amount>0,"Amount cannot be 0");
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        totakStaked+=_amount;
        balanceOf[msg.sender]+=_amount;
        spreaderToken.transferFrom(address(this),msg.sender,_amount);
        gainShare(msg.sender, _amount);
        Stakers+=1;
    }

    /// @notice Takes the _amount to be unstaked by the user and transfers the locked tokens to the user, transfers the Liquid staking tokens from the user to the contract 
    /// @param _amount of tokens to be unstaked
    function unStake(uint256 _amount) public {
        require(_amount <= balanceOf[msg.sender],"Amount greater than staked");
        stakingToken.transferFrom(address(this),msg.sender,_amount);
        spreaderToken.transferFrom(msg.sender,address(this),_amount);
        totakStaked-=_amount;
        balanceOf[msg.sender]-=_amount;
        loseShare(msg.sender, _amount);
    }

    function getStakers() public view returns(uint256){
        return Stakers;
    }

    // ---------------------------------------------------------------------------------------------
    // IDA OPERATIONS

    /// @notice Takes the entire balance of the designated spreaderToken in the contract and distributes it out to unit holders w/ IDA
    function distribute() public {
        uint256 spreaderTokenBalance = rewardAmount;

        (uint256 actualDistributionAmount, ) = spreaderToken.calculateDistribution(
            address(this),
            INDEX_ID,
            spreaderTokenBalance
        );

        spreaderToken.distribute(INDEX_ID, actualDistributionAmount);
    }

    function claimShare(address subscriber) public {
        (, , uint256 currentUnitsHeld, ) = spreaderToken.getSubscription(
            address(this),
            INDEX_ID,
            subscriber
        );
        uint256 unclaimedAmount = spreaderToken.balanceOf(subscriber);
        require(spreaderToken.balanceOf(subscriber) > 0 && currentUnitsHeld == 0, "Not eligible for unclaimed shares");
        gainShare(subscriber, unclaimedAmount);
        Stakers+=1;
    }

    /// @notice lets an account gain a single distribution unit
    /// @param subscriber subscriber address whose units are to be incremented
    function gainShare(address subscriber, uint256 _stakedAmount) public {
        // Get current units subscriber holds
        (, , uint256 currentUnitsHeld, ) = spreaderToken.getSubscription(
            address(this),
            INDEX_ID,
            subscriber
        );

        // Update to current amount + 1
        spreaderToken.updateSubscriptionUnits(
            INDEX_ID,
            subscriber,
            uint128(currentUnitsHeld + _stakedAmount)
        );
    }

    /// @notice lets an account lose a single distribution unit
    /// @param subscriber subscriber address whose units are to be decremented
    function loseShare(address subscriber, uint256 _amount ) public {
        // Get current units subscriber holds
        (, , uint256 currentUnitsHeld, ) = spreaderToken.getSubscription(
            address(this),
            INDEX_ID,
            subscriber
        );

        // Update to current amount - 1 (reverts if currentUnitsHeld - 1 < 0, so basically if currentUnitsHeld = 0)
        spreaderToken.updateSubscriptionUnits(
            INDEX_ID,
            subscriber,
            uint128(currentUnitsHeld - _amount)
        );
    }

    /// @notice allows an account to delete its entire subscription this contract
    /// @param subscriber subscriber address whose subscription is to be deleted
    function deleteShares(address subscriber) public {
        spreaderToken.deleteSubscription(address(this), INDEX_ID, subscriber);
    }
}