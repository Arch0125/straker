import * as React from 'react';

interface ISidemenuProps {
}

const Sidemenu: React.FunctionComponent<ISidemenuProps> = (props) => {
  return(
    <div>
        <ul className="menu bg-base border-2 text-secondary w-56 p-2 rounded-box  ">
            <li className='text-primary' ><a>My Streams</a></li>
            <li className='text-primary'><a>Stake</a></li>
            <li className='text-primary'><a>Create Pool</a></li>
        </ul>
    </div>
  );
};

export default Sidemenu;
