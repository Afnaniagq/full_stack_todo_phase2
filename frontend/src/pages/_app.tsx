import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import Layout from '@/components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReactQueryProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ReactQueryProvider>
  );
}