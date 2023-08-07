"use client"
import React, { FC } from 'react';
import { SessionProvider } from 'next-auth/react'

function Providers ({ children }) {
  return (
    <SessionProvider>{children}</SessionProvider>
  )
}

export default Providers;
