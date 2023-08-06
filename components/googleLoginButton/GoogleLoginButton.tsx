"use client"

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function GoogleLoginButton() {
  const router = useRouter();
  return (
    <div>
      <button onClick={() => signIn('google').then(() => router.push('/home'))}>sign in with gooogle</button>
    </div>
  );
}
