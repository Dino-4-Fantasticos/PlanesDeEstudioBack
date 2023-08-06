// import './globals.css'
import "../styles/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Footer from '../components/footer/Footer';
import Header from '../components/header/Header';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PDE ITESM',
  description: 'Planes de Estudios ITESM',
}

export default function RootLayout({
  children,
  pageProps,
}: {
  children: React.ReactNode,
  pageProps: any
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <div className="spacer" />
        <Footer />
      </body>
    </html>
  )
}
