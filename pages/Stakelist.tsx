import * as React from 'react';
import { useSigner } from 'wagmi';
import GetAccount from '../hooks/GetAccount';
import GetBalance from '../hooks/GetBalance';
import GetSF from '../hooks/GetSF';

interface IStakelistProps {
    balance: string;
    account: string;
}

const Stakelist: React.FunctionComponent<IStakelistProps> = (props) => {

    const balance = GetBalance();
    const account = GetAccount();

    const[shares , setShares] = React.useState('0');

    const{data:signer}=useSigner();

    React.useEffect(() => {
        getShare();
    }, [account]);

    async function stake(){
        const sf = await GetSF();
        console.log(sf);

        const approvedist = sf.idaV1.approveSubscription({
            indexId:'0',
            superToken:'0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00',
            publisher:'0xbf2799D43323aBa53D7936Fa8210804F5d97594F'
        });

        approvedist?.exec(signer);
    }

    async function getShare() {
        const sf = await GetSF();

        const share = await sf?.idaV1?.getSubscription({
            superToken:'0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00',
            publisher:'0xbf2799D43323aBa53D7936Fa8210804F5d97594F',
            indexId:'0',
            subscriber: account,
            providerOrSigner: signer
        })

        console.log(share?.units);
        setShares(share?.units);
    }

  return(
    <div className='flex flex-col w-screen h-screen bg-base items-center justify-center text-black pl-[10%] ' >
       <div className="stats stats-vertical lg:stats-horizontal shadow text-primary">
  
            <div className="stat">
                <div className="stat-title">Total Stakers</div>
                <div className="stat-value"></div>
                <div className="stat-desc">Jan 1st - Feb 1st</div>
            </div>
            
            <div className="stat">
                <div className="stat-title">Staked Amount</div>
                <div className="stat-value">4,200</div>
                <div className="stat-desc">↗︎ 400 (22%)</div>
            </div>
            
            <div className="stat">
                <div className="stat-title">Rewards</div>
                <div className="stat-value">10%</div>
                <div className="stat-desc">per month</div>
            </div>

            <div className="stat">
                <div className="stat-title">srETHx Marketcap</div>
                <div className="stat-value">$2.43</div>
                <div className="stat-desc">Billion</div>
            </div>
            
        </div>
        <div className="flex flex-col artboard artboard-horizontal bg-white shadow rounded-xl mt-7 phone-3 items-center justify-center p-3">

        <p className='text-[1.5vmax] font-bold text-primary' >Stake ETH</p>
        <div className="divider"></div>
        <div className="stats shadow text-primary">
  
            <div className="stat place-items-left">
                <div className="stat-title">Available to Stake</div>
                <div className="stat-value">{balance?.slice(0,4)}</div>
                <div className="stat-desc">fETH</div>
            </div>
            
            <div className="stat place-items-left">
                <div className="stat-title">Staked Amount</div>
                <div className="stat-value ">1.7</div>
                <div className="stat-desc ">fETH</div>
            </div>
            
            <div className="stat place-items-left">
                <div className="stat-title">Stake Share</div>
                <div className="stat-value">{shares}</div>
                <div className="stat-desc">1 ETH = 1 fETH</div>
            </div>
            
        </div>
            <div className="form-control mt-3">
                <label className="label">
                    <span className="label-text">Enter amount</span>
                </label>
                <label className="input-group ">
                <span className='bg-primary text-white'>ETH</span>
                    <input type="text" placeholder="0.01" className="input input-bordered border-primary" />
                    <span className='bg-base text-primary'><button>MAX</button></span>
                </label>
            <button onClick={()=>stake()} className="btn btn-wide btn-primary mt-2 w-full">Stake</button>
            </div>
        </div>
    </div>
  );
};

export default Stakelist;
