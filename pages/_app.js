
import '../styles/globals.css'
import { ChakraProvider } from "@chakra-ui/react"
import Layout from './layout'
import { useRouter } from 'next/router';
import NextNProgress from "nextjs-progressbar";


function MyApp({ Component, pageProps }) {
  const { asPath } = useRouter();
  return (
    <>
      {asPath === '/dashboard' || asPath === '/materialeelev' || asPath === '/materiale'  || asPath==='/rezultateprof' || asPath === '/rezultate' || asPath === '/calendar' || asPath === '/calendarelev' || asPath === '/create' || asPath === '/appearance' || asPath === '/embeed' || asPath === '/settings' || asPath === '/availability' || asPath === '/jobs' ||asPath === '/elev' ? (

        <ChakraProvider>

            <Layout>
              <NextNProgress />
              <Component {...pageProps} />
            </Layout>

        </ChakraProvider>

      ) : (
        <ChakraProvider>
          <NextNProgress />
          <Component {...pageProps} />
        </ChakraProvider>
      )

      }

    </>
  )
}

export default MyApp
