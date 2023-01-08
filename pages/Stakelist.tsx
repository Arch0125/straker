import * as React from 'react';

interface IStakelistProps {
}

const Stakelist: React.FunctionComponent<IStakelistProps> = (props) => {
  return(
    <div className='flex flex-col w-screen h-screen bg-bgcolor items-center justify-center text-black pl-[10%] ' >
       <div className="stats stats-vertical lg:stats-horizontal shadow text-primary">
  
            <div className="stat">
                <div className="stat-title">Total Stakers</div>
                <div className="stat-value">31K</div>
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
                <div className="stat-value">31K</div>
                <div className="stat-desc">fETH</div>
            </div>
            
            <div className="stat place-items-left">
                <div className="stat-title">Staked Amount</div>
                <div className="stat-value ">1.7</div>
                <div className="stat-desc ">fETH</div>
            </div>
            
            <div className="stat place-items-left">
                <div className="stat-title">You receive</div>
                <div className="stat-value">1.7 fETH</div>
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
                    <span className='bg-bgcolor text-primary'><button>MAX</button></span>
                </label>
            <button className="btn btn-wide btn-primary mt-2 w-full">Stake</button>
            </div>
        </div>
    </div>
  );
};

export default Stakelist;
