import Link from 'next/link';
import * as React from 'react';

interface ISidemenuProps {
}

const Sidemenu: React.FunctionComponent<ISidemenuProps> = (props) => {

  const[streampage, setStreampage] = React.useState(false);
  const[stakepage, setStakepage] = React.useState(true);

  const switchPage = (page: string) => {
    if(page === 'stream'){
      setStreampage(true);
      setStakepage(false);
    } else if(page === 'stake'){
      setStreampage(false);
      setStakepage(true);
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
            <li onClick={(e)=>switchPage("stake")}><a className={` ${stakepage === true ? "text-secondary active":"text-primary"} `}><Link href={'/Stakelist'} >Stake</Link></a></li>
        </ul>
    </div>
  );
};

export default Sidemenu;
