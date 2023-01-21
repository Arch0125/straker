import Link from 'next/link';
import * as React from 'react';

interface ISidemenuProps {
}

const Sidemenu: React.FunctionComponent<ISidemenuProps> = (props) => {

  const[streampage, setStreampage] = React.useState(false);
  const[stakepage, setStakepage] = React.useState(true);
  const[faucetpage, setFaucetpage] = React.useState(false);

  const switchPage = (page: string) => {
    if(page === 'stream'){
      setStreampage(true);
      setStakepage(false);
      setFaucetpage(false);
    } else if(page === 'stake'){
      setStreampage(false);
      setStakepage(true);
      setFaucetpage(false);
    }
    else if(page === 'faucet'){
      setStreampage(false);
      setStakepage(false);
      setFaucetpage(true);
    }
  };

  const listyle={
    false:"",
    true:"active"
  }

  return(
    <div>
        <ul className="menu bg-base border-2 border-primary text-secondary w-56 p-2 rounded-box  ">
            <li className='text-primary' onClick={(e)=>switchPage("stream")} ><a className={` ${streampage === true ? "text-secondary active":"text-primary"} `}>Wrap/Unwrap</a></li>
            <Link href={'/Stakelist'} ><li onClick={(e)=>switchPage("stake")}><a className={` ${stakepage === true ? "text-secondary active":"text-primary"} `}>Stake</a></li></Link>
            <Link href={'/Faucet'} ><li onClick={(e)=>switchPage("faucet")}><a className={` ${faucetpage === true ? "text-secondary active":"text-primary"} `}>Faucet</a></li></Link>
        </ul>
    </div>
  );
};

export default Sidemenu;
