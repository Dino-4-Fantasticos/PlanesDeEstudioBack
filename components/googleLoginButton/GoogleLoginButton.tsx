"use client"

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GoogleLoginButton() {
  const router = useRouter();
  const { data: session } = useSession();
  console.log('GoogleLoginButton', session);

  useEffect(() => {
    if (session && session.user) {
      router.push('/home');
    }
  }, [router, session])

  return (
    <div>
      <button onClick={() => signIn('google')}>sign in with gooogle</button>
    </div>
  );
}
