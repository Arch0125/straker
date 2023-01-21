import * as React from 'react';
import { useAccount, useSigner, useProvider } from 'wagmi';
import { ethers } from 'ethers';
import {ERC20ABI} from '../ABIs/ERC20ABI.js';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';


interface IFaucetProps {
}

const Faucet: React.FunctionComponent<IFaucetProps> = (props) => {

    const[amount, setAmount] = React.useState<string | null>('0');
    const[loading, setLoading] = React.useState<boolean>(false);
    
    const {address} = useAccount();
    const {data : signer} = useSigner();
    const provider = useProvider();

    const failed = () => toast.error('Transaction Failed !', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });

    const success = () => toast.success('Transaction Successful !', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });

    
    const fDAI = new ethers.Contract('0x88271d333C72e51516B67f5567c728E702b3eeE8', ERC20ABI, signer || provider || undefined);

    const mintdai = async () => {
        try{
        setLoading(true);
        await fDAI.mint(ethers.utils.getAddress(address || '0x0'), ethers.utils.parseEther(amount || '0'));
        setLoading(false);
        success();
        }catch(e){
            failed();
            setLoading(false);
        }
    }

  return(
    <div className='flex flex-col w-screen h-screen bg-base items-center justify-center text-black pl-[10%] ' >
        <ToastContainer />
    <div className="flex flex-col artboard artboard-horizontal phone-2 bg-white rounded-2xl shadow-lg items-center justify-center">
        <p className='text-[1.5vmax] font-bold text-primary' >fDAI Faucet</p>
        <div className="divider"></div>
        <div className="form-control">
            <label className="label">
                <span className="label-text">Enter amount</span>
            </label>
            <label className="input-group">
                <input type="text" placeholder="0.01" className="input input-bordered border-2 border-base" onChange={(e)=>setAmount(e.target.value)} />
                <span className='bg-base text-primary' >fDAI</span>
            </label>
            {
                loading ? <button className='btn btn-primary mt-3 '><progress className="progress w-56 bg-primary"></progress></button> : <button className='btn btn-primary mt-3' onClick={()=>mintdai()}>Get DAIx</button>
            }
        </div>
    </div>
    </div>
  ) ;
};

export default Faucet;
