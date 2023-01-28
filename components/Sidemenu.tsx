import Link from 'next/link';
import * as React from 'react';

interface ISidemenuProps {
}

const Sidemenu: React.FunctionComponent<ISidemenuProps> = (props) => {

  const[streampage, setStreampage] = React.useState(false);
  const[stakepage, setStakepage] = React.useState(false);
  const[faucetpage, setFaucetpage] = React.useState(false);
  const[notifpage, setNotifpage] = React.useState(false);
  const[strakepage, setStrakepage] = React.useState(false);

  const switchPage = (page: string) => {
    if(page === 'stream'){
      setStreampage(true);
      setStakepage(false);
      setFaucetpage(false);
      setNotifpage(false);
      setStrakepage(false);
    } else if(page === 'stake'){
      setStreampage(false);
      setStakepage(true);
      setFaucetpage(false);
      setNotifpage(false);
      setStrakepage(false);
    }
    else if(page === 'faucet'){
      setStreampage(false);
      setStakepage(false);
      setFaucetpage(true);
      setNotifpage(false);
      setStrakepage(false);
    }
    else if(page === 'notif'){
      setStreampage(false);
      setStakepage(false);
      setFaucetpage(false);
      setNotifpage(true);      
      setStrakepage(false);
    }
    else if(page === 'strake'){
      setStreampage(false);
      setStakepage(false);
      setFaucetpage(false);
      setNotifpage(false);
      setStrakepage(true);
    }
  };

  const listyle={
    false:"",
    true:"active"
  }

  return(
    <div>
        <ul className="menu bg-base border-2 border-primary text-secondary w-56 p-2 rounded-box  ">
            <Link href={'/Wrap'}><li className='text-primary' onClick={(e)=>switchPage("stream")} ><a className={` ${streampage === true ? "text-secondary active":"text-primary"} `}>Wrap/Unwrap</a></li></Link>
            <Link href={'/Stakelist'} ><li onClick={(e)=>switchPage("stake")}><a className={` ${stakepage === true ? "text-secondary active":"text-primary"} `}>Stake</a></li></Link>
            <Link href={'/Strake'} ><li onClick={(e)=>switchPage("strake")}><a className={` ${strakepage === true ? "text-secondary active":"text-primary"} `}>Strake</a></li></Link>
            <Link href={'/Faucet'} ><li onClick={(e)=>switchPage("faucet")}><a className={` ${faucetpage === true ? "text-secondary active":"text-primary"} `}>Faucet</a></li></Link>
            <Link href={'/Notifs'} ><li onClick={(e)=>switchPage("notif")}><a className={` ${notifpage === true ? "text-secondary active":"text-primary"} `}>Notifications</a></li></Link>
        </ul>
    </div>
  );
};

export default Sidemenu;
