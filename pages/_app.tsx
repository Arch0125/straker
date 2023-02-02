import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useLocation } from 'react-router-dom';
import { Epilogue, Montserrat } from '@next/font/google';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, goerli, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Navbar from '../components/Navbar';
import Sidemenu from '../components/Sidemenu';
import { useRouter } from 'next/router';
const { chains, provider } = configureChains(
  [polygonMumbai,goerli,polygon,mainnet],
  [
    alchemyProvider({apiKey:'gh4d1-dAT4B_1Khy86s7JUbFhQIclYqO'}),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

export const epilogue = Epilogue({weight:['400','600','700'],subsets:['latin']});
export const montserrat = Montserrat({weight:['400','600','700'],subsets:['latin']});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
      <main className={montserrat.className} >
      <div className='absolute z-2' >
        <Navbar/>
      </div>
      {
        router.pathname === '/' ? null : <div className='flex flex-col absolute z-1 h-screen justify-center ml-[10%]' >
        <Sidemenu/>
      </div>
      }
      
      <Component {...pageProps} />
      </main>
    </RainbowKitProvider>
    </WagmiConfig>)
}
