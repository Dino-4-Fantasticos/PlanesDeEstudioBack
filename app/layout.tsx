import './globals.css'
// import React, { useEffect, useState, useCallback } from "react";
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { G_CLIENT_ID, authenticate } from '../utils/auth';
// import { UserContext } from "../utils/context";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PDE ITESM',
  description: 'Planes de Estudios ITESM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
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
      <GoogleOAuthProvider clientId={G_CLIENT_ID || ""}>
        {/* <UserContext.Provider value={loggedUser}> */}
          {children}
        {/* </UserContext.Provider> */}
      </GoogleOAuthProvider>
      </body>
    </html>
  )
}
