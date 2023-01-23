import * as React from 'react';
import * as PushAPI from "@pushprotocol/restapi";
import { useAccount,useSigner } from 'wagmi';

const Notifs = (props) => {

    const{address}=useAccount();
    const{data:signer}=useSigner();
    const[notifs, setNotifs] = React.useState([]);


    const turnonNotifs = async () => {
        await PushAPI.channels.subscribe({
            signer: signer,
            channelAddress: 'eip155:5:0xEdEFD55a9674550669Bdfe304f8d5c725b0817dF', // channel address in CAIP
            userAddress: `eip155:5:${address}`, // user address in CAIP
            onSuccess: () => {
             console.log('opt in success');
            },
            onError: () => {
              console.error('opt in error');
            },
            env: 'staging'
          })
    }

    const getNotifs = async () => {
        const notifications = await PushAPI.user.getFeeds({
            user: `eip155:5:${address}`, // user address in CAIP
            env: 'staging'
          });

        setNotifs(notifications);
        console.log(notifications);
    }

    React.useEffect(()=>{
        getNotifs();
    },[address]);

  return(
    <div className='flex flex-col w-screen h-screen bg-base items-center justify-center text-black pl-[10%] ' >
        <div className="flex flex-col artboard artboard-horizontal phone-2 bg-white rounded-2xl shadow-lg p-10">
        <div className='flex flex-row justify-between items-center' >
        <p className='text-[1.5vmax] font-bold text-primary'>Notifications</p>
        <button onClick={turnonNotifs} className='bg-primary text-white rounded-lg px-4 py-2' >Turn On</button>
        </div>
        <div className="divider"></div>
        <div className='flex flex-col w-full h-full overflow-y-auto' >
            {
                notifs.map((notif)=>{
                    if(notif.app === 'Straker'){
                        return(
                            <div className='flex flex-col p-2 m-2 border-[1px] border-primary rounded-xl' >
                                <p className='text-[1vmax] font-bold text-primary'>{notif.title}</p>
                                <p className='text-[0.8vmax] font-thin text-black'>{notif.message}</p>
                            </div>
                        )
                    }
                })
            }
        </div>
        </div>
    </div>
  );
};

export default Notifs;
