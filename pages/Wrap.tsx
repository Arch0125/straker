import * as React from 'react';
import { ethers } from 'ethers';
import GetSF from '../hooks/GetSF';
import { useAccount, useSigner } from 'wagmi';

interface IWrapProps {
}

const Wrap: React.FunctionComponent<IWrapProps> = (props) => {

    const[amount, setAmount] = React.useState<string | null>('0');

    const {data:signer} = useSigner();
    const{address}=useAccount();

    const upgrade = async () => {
        const sf= await GetSF();
        const daix = await sf.loadSuperToken("0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00");
        const approve =  daix.approve({
            receiver: address || '0x0',
            amount: amount || '0'
        });
        const apv = await approve.exec(signer!);
        apv.wait();
        const op =  daix.upgrade({ amount: amount || '0' });
        const res = op.exec(signer);
        await res.wait();
    }

  return(
    <div className='flex flex-col w-screen h-screen bg-base items-center justify-center text-black pl-[10%] ' >
        <div className="flex flex-col artboard artboard-horizontal phone-2 bg-white rounded-2xl shadow-lg items-center justify-center">
            <p className='text-[1.5vmax] font-bold text-primary'>Wrap/Unwrap</p>
            <div className="divider"></div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Enter amount</span>
                </label>
                <label className="input-group">
                    <input type="text" placeholder="0.01" className="input input-bordered" onChange={(e)=>setAmount(e.target.value)} />
                </label>
                <div className="flex flex-row w-full mt-3 pr-2">
                    <button onClick={upgrade} className="btn btn-wide btn-primary mt-2 w-full w-1/2 mr-1">to fDAIx</button>
                    <button className="btn btn-wide btn-primary mt-2 w-full w-1/2 ml-1">to fDAI</button>
                    </div>
            </div>
        </div>
    </div>
  );
};

export default Wrap;
