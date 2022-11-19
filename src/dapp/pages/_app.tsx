import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { NearEnvironment, NearEnvironmentProvider, NearProvider } from 'react-near'
import { getNearConfig } from '../configs/near';

function MyApp({ Component, pageProps }: AppProps) {
  const nearConfig = getNearConfig();

  return (
    <NearEnvironmentProvider defaultEnvironment={nearConfig.networkId as NearEnvironment}>
      <NearProvider authContractId={nearConfig.contractId}>
        <Component {...pageProps} />
      </NearProvider>
    </NearEnvironmentProvider>
  )
}

export default MyApp
