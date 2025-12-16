'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignupPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login page which has signup tab
    router.replace('/login?tab=signup');
  }, [router]);

  return null;
}

