import './globals.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/App.scss";
// import React, { useEffect, useState, useCallback } from "react";
// import { SessionProvider } from "next-auth/react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { G_CLIENT_ID, authenticate } from '../utils/auth';
// import { UserContext } from "../utils/context";
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
  // const [loggedUser, setLoggedUser] = useState<undefined | null | Object>(undefined);

  // const checkSession = useCallback(async () => {
  //   await authenticate()
  //     .then(resAuth => setLoggedUser(resAuth))
  //     .catch((err) => {
  //       console.error('error iniciando sesion', err);
  //       alert(err.message);
  //       setLoggedUser(null);
  //     });
  // }, [setLoggedUser])

  // useEffect(() => {
  //   checkSession()
  // }, [checkSession]);

  // if (loggedUser === undefined) {
  //   return <div>Cargando...</div>;
  // }

  // if (loggedUser === null) {
  //   return <LoginScreen />;
  // }

  return (
    <html lang="en">
      <body className={inter.className}>
      {/* <GoogleOAuthProvider clientId={G_CLIENT_ID || ""}> */}
        {/* <UserContext.Provider value={loggedUser}> */}
          <Header />
          {children}
          <div className="spacer" />
          <Footer />
        {/* </UserContext.Provider> */}
      {/* </GoogleOAuthProvider> */}
      </body>
    </html>
  )
}
