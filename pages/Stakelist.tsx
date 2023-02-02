import * as React from 'react';
import { useAccount, useProvider, useSigner } from 'wagmi';
import GetAccount from '../hooks/GetAccount';
import GetBalance from '../hooks/GetBalance';
import GetSF from '../hooks/GetSF';
import { ethers } from 'ethers';
import {TokenSpreadABI} from '../ABIs/TokenSpreader.js';
import {SuperTokenABI} from '../ABIs/SuperTokenABI.js';
import {ERC20ABI} from '../ABIs/ERC20ABI.js';
import * as PushAPI from "@pushprotocol/restapi";

interface IStakelistProps {
    balance: string;
    account: string;
}

const Stakelist: React.FunctionComponent<IStakelistProps> = (props) => {

    const{address} = useAccount();
    const balance = GetBalance();
    const account = address;

    const[shares , setShares] = React.useState<string | null>('0');
    const[approved , setApproved] = React.useState(false);
    const[amount, setAmount] = React.useState<string | null>('0');
    const[loading, setLoading] = React.useState(false);
    const[staked, setStaked] = React.useState<string | null>('0');
    const[stakedamount, setStakedamount] = React.useState<string | null>('0');
    const[stakers, setStakers] = React.useState<string | null>('0');
    const[reward, setReward] = React.useState<string | null>('0');
    const[daibal, setDaibal] = React.useState<string | null>('0');
    const[daixbal, setDaixbal] = React.useState<string | null>('0');
    const[stakeshare, setStakeshare] = React.useState<number | null>(0);

    const{data:signer}=useSigner();
    const provider = useProvider();

    const TokenSpreaderContract = new ethers.Contract('0x39b0111bc468ca569ca8413cb4C64304Fa89df5F', TokenSpreadABI, signer || undefined);
    const fDAIx = new ethers.Contract('0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00', ERC20ABI, signer || undefined);
    const fDAI = new ethers.Contract('0x88271d333C72e51516B67f5567c728E702b3eeE8', ERC20ABI, signer || undefined);

    // console(TokenSpreaderContract);

    const approveCoins = async () => {
        await fDAIx.approve(TokenSpreaderContract?.address,"10000000000000000000000000");
        await fDAI.approve(TokenSpreaderContract?.address,"10000000000000000000000000")
        setApproved(true);
    };

    const stakeDetails= async () => {

        const sf = await GetSF();
        // console(sf);

        const share = await sf?.idaV1.getSubscription({
            superToken:fDAIx?.address,
            publisher:TokenSpreaderContract?.address,
            subscriber:account || '0x0',
            indexId:'0',
            providerOrSigner:signer || provider
        })

        const units = ethers.utils.formatEther(share?.units);
        setShares(units);

        const tStaked = await TokenSpreaderContract.totakStaked();
        const stakers = await TokenSpreaderContract.getStakers();
        const reward = await TokenSpreaderContract.rewardAmount();
        const total = ethers.utils.formatEther(tStaked.toString());
        const daibal = await fDAI.balanceOf(account);
        const daixbal = await fDAIx.balanceOf(account);
        // console(stakers.toString());
        const rewardamt = ethers.utils.formatEther(reward.toString());
        const daibalamt = ethers.utils.formatEther(daibal.toString());
        const daixbalamt = ethers.utils.formatEther(daixbal.toString());
        setStakers(stakers.toString());
        setStakedamount(total);
        setReward(rewardamt);
        setDaibal(daibalamt);
        setDaixbal(daixbalamt);
        setStakeshare((Number(units)/Number(total))*100);
    }

    const stakedCoins = async () => {
        const res = await TokenSpreaderContract.balanceOf(ethers.utils.getAddress(account || ''));
        const val = ethers.utils.formatEther(res?.toString());
        // console(val);
        setStaked(val);
    }

    const checkApprove =async () => {
        const res1 = await fDAIx.allowance(account,TokenSpreaderContract?.address);
        const res2 = await fDAI.allowance(account,TokenSpreaderContract?.address);
        // console(res1.toString());
        if(res1 > 0 && res2 > 0){
            setApproved(true);
        }else{
            setApproved(false);
        }
    }

    const stake = async () => {
        const sf = await GetSF();
        const apv = await sf.idaV1.approveSubscription({
            indexId:'0',
            superToken:fDAIx?.address,
            publisher:TokenSpreaderContract?.address,
        });
        apv.exec(signer!);
        setLoading(true);
        await TokenSpreaderContract.stake(ethers.utils.parseEther(amount || '0'));
        setLoading(false);
    }

    const unstake = async () => {
        setLoading(true);
        await TokenSpreaderContract.unStake(ethers.utils.parseEther(amount || '0'));
        setLoading(false);
    }

    const sendNotif = async () => {
        const apiResponse = await PushAPI.payloads.sendNotification({
            signer,
            type: 1, 
            identityType: 0, 
            notification: {
              title: `Reward distribution alert`,
              body: `Your staking rewards have been transferred to your account`
            },
            payload: {
              title: `[sdk-test] payload title`,
              body: `sample msg body`,
              cta: '',
              img: ''
            },
            channel: 'eip155:5:0xEdEFD55a9674550669Bdfe304f8d5c725b0817dF', // your channel address
            env: 'staging'
          });

          // console(apiResponse);
    }

    const distributeReward = async () => {
        TokenSpreaderContract.distribute();
        sendNotif();
    }

    React.useEffect(()=>{
        checkApprove();
        stakedCoins();
        stakeDetails();
    });

  return(
    <div className='flex flex-col w-screen h-screen bg-base items-center justify-center text-black pl-[10%] ' >
       <div className="stats stats-vertical lg:stats-horizontal shadow text-primary">
  
            <div className="stat">
                <div className="stat-title">Total Stakers</div>
                <div className="stat-value">{stakers}</div>
                <div className="stat-desc">Jan 1st - Feb 1st</div>
            </div>
            
            <div className="stat">
                <div className="stat-title">Staked Amount</div>
                <div className="stat-value">{stakedamount}</div>
                <div className="stat-desc">fDAI</div>
            </div>
            
            <div className="stat">
                <div className="stat-title">Rewards</div>
                <div className="stat-value">{reward} fDAIx</div>
                <div className="stat-desc">per month</div>
            </div>
            
        </div>
        <div className="flex flex-col artboard artboard-horizontal bg-white shadow rounded-xl mt-7 phone-3 items-center justify-center p-3">

        <p className='text-[1.5vmax] font-bold text-primary' >Stake DAI</p>
        <div className="divider"></div>
        <div className="stats shadow text-primary">
  
            <div className="stat place-items-left">
                <div className="stat-title">Available to Stake</div>
                <div className="stat-value">{Number(daibal).toFixed(2)}</div>
                <div className="stat-desc">fDAI</div>
            </div>
            
            <div className="stat place-items-left">
                <div className="stat-title">Staked Amount</div>
                <div className="stat-value ">{staked}</div>
                <div className="stat-desc ">fDAI</div>
            </div>
            
            <div className="stat place-items-left">
                <div className="stat-title">Stake Share</div>
                <div className="stat-value">{shares} fDAIx</div>
                <div className="stat-desc">{stakeshare}% of pool</div>
            </div>
            
        </div>
            <div className="form-control mt-3">
                <label className="label">
                    <span className="label-text">Enter amount</span>
                </label>
                <label className="input-group ">
                <span className='bg-primary text-white'>fDAI</span>
                    <input onChange={(e)=>setAmount(e.target.value)} type="text" placeholder="0.01" className="input input-bordered border-primary" />
                    <span className='bg-base text-primary'><button>MAX</button></span>
                </label>
                {
                    approved ?
                    <div className="flex flex-row w-full mt-3 pr-2">
                    <button onClick={stake} className="btn btn-wide btn-primary mt-2 w-full w-1/2 mr-1">Stake</button>
                    <button onClick={unstake} className="btn btn-wide btn-primary mt-2 w-full w-1/2 ml-1">Unstake</button>
                    </div>
                 : <button onClick={()=>approveCoins()} className="btn btn-wide btn-primary mt-2 w-full">Approve</button>
                }
                
            </div>
        </div>
        {
            address === '0xEdEFD55a9674550669Bdfe304f8d5c725b0817dF' ?
            (
                <button onClick={distributeReward} className="btn btn-wide btn-primary mt-6 w-fit">Distribute</button>
            ):null
        }
                
    </div>
  );
};

export default Stakelist;
