
# Straker

A Liquid Staking Derivative powered by Superfluid Streams, enabling auto-claimable gasless staking rewards and real-time staking rewards in form of streams directly to your wallet



## Steps to stake

This project has the following staking options:

- **IDA Staking** : where the user just have to stake tokens and gets the share token, where shares are maintained by the IDA contracts as well, after the redeemable date, the contract automatically distributed the reward to the stakers to their wallet without interacting with the platform, hence it gets auto-claimed
- **CFA Staking** : Here the when the user stakes the token, the user gets LSD token in 1:1 ratio which can be traded in the secondary markets for same value, also this token manages the stream of reward token for the token holder. Hence even outside the platform, normal transaction with the lsd-tokens will affect the reward stream and update the stream for the new holder as well. For unstaking its similar, the flowrate gets modified or deleted based on the tokens unstaked and the lsd-tokens are burnt.


## IDA Staking

- Get some fDAI from the faucet
- Click on Stake option from the sidebar
- Approve fDAI and fDAIx spending 
- Enter amount and stake fDAI
- After successful staking, the interface will show the amount staked and the amount of share held in the pool
- Wait till the end of reward period, the distribute will be called by the staking contract and the rewards are distributed directly to wallets

## CFA Liquid Staking
- In this case process is same till staking fDAI
- After staking, strDAI will be minted to the address in 1:1 ratio which could be traded in secondary market
- Also the reward token (fDAIx) will start to strea directly to the address
- Transfer of strDAI manages the flow rate of reward tokens and also the shares in the staking pool.
- Transferring strDAI to an address which has not staked will start receiving rewards as well in proportion and will be given shares
- Unstaking happens when the staker burns strDAI tokens and gets equal amount of fDAI unlocked 

## Network 
- Goerli

