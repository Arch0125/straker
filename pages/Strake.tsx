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
import {StrakerContractABI} from '../ABIs/StrakerContractV2.js';
import {ShareTokenABI} from '../ABIs/ShareToken.js';

interface IStrakeProps {
    balance: string;
    account: string;
}

const Strake: React.FunctionComponent<IStrakeProps> = (props) => {

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

    const StrakerContractV2 = new ethers.Contract('0x80eb389A1E85689180C8812E83A248c14d15fbFc', StrakerContractABI, signer || undefined);
    const fDAIx = new ethers.Contract('0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00', ERC20ABI, signer || undefined);
    const fDAI = new ethers.Contract('0x88271d333C72e51516B67f5567c728E702b3eeE8', ERC20ABI, signer || undefined);
    const strDAI = new ethers.Contract('0xA3cd6a422aEcbD97Fa3B031AdA784040885aB6aA', ShareTokenABI, signer || undefined);

    console.log(StrakerContractV2);

    const approveCoins = async () => {
        await fDAIx.approve(StrakerContractV2?.address,"10000000000000000000000000");
        await fDAI.approve(StrakerContractV2?.address,"10000000000000000000000000")
        setApproved(true);
    };

    const stake = async () => {
        setLoading(true);
        await StrakerContractV2.stake(ethers.utils.parseEther(amount || '0'));
        await strDAI.mint(ethers.utils.parseEther(amount || '0'), address);
        setLoading(false);
    }

    const unstake = async () => {
        setLoading(true);
        await StrakerContractV2.unstake(ethers.utils.parseEther(amount || '0'));
        await strDAI.burn(ethers.utils.parseEther(amount || '0'), address);
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

          console.log(apiResponse);
    }

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
                <div className="stat-value">4%</div>
                <div className="stat-desc">APR</div>
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
                <div className="stat-title">Realtime Rewards</div>
                <div className="stat-value">{shares} fDAIx</div>
                <div className="stat-desc">{stakeshare}% of pool</div>
            </div>
            
        </div>
            <div className="form-control mt-3">
                <label className="label">
                    <span className="label-text">Enter amount</span>
                </label>
                <label className="input-group ">
                <span className='bg-primary text-white'>DAIx</span>
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
    </div>
  );
};

export default Strake;
