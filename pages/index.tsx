import Head from 'next/head'
import Image from 'next/image'
import { Inter, Michroma,Epilogue } from '@next/font/google'
import styles from '../styles/Home.module.css'
import giftimg from '../assets/gift.png'
import Link from 'next/link'


export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-row w-screen h-screen bg-base text-neutral' >
        <div className='flex flex-col h-screen w-1/2 justify-center items-start pl-[10%] ' >
          <p className={'text-[4vmax] font-bold'} >Realtime Rewards for staked assets.</p>
          <p className={'text-[1.2vmax] font-thin '} >Get staking rewards directly streamed to your wallet per second</p>
          <Link href='/Stakelist' ><button className='bg-primary text-white px-4 py-2 text-[1vmax] font-bold rounded-lg mt-5' >Launch App</button></Link>
        </div>
        <div className='flex flex-col h-screen w-1/2 justify-center items-center' >
          <Image src={giftimg} width={500} height={500} alt={''} />
        </div>
      </div>
    </>
  )
}
