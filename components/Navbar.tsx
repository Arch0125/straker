import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as React from 'react';

interface INavbarProps {
}

const Navbar: React.FunctionComponent<INavbarProps> = (props) => {
  return(
    <div className='flex flex-row w-screen h-fit py-4 px-[10%] bg-bgcolor justify-between items-center text-primary' >
        <p className='text-[1.5vmax] font-bold' >Straker</p>
        <div className='flex flex-row ' >
        <ConnectButton />
        </div>
    </div>
  ) ;
};

export default Navbar;
