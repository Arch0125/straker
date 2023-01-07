import '../styles/globals.css'
import type { AppProps } from 'next/app'
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
const { chains, provider } = configureChains(
  [polygonMumbai,goerli,polygon,mainnet],
  [
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
  return (
    <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
      <main className={epilogue.className} >
      <Component {...pageProps} />
      </main>
    </RainbowKitProvider>
    </WagmiConfig>)
}
