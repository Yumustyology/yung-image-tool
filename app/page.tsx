'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen text-xl font-semibold">
      Redirecting to Dashboard...
    </div>
  );
};

export default LandingPage;
