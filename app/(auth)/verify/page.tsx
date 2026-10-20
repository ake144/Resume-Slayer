'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function VerifyMagicLinkPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState('Signing you in…');
  useEffect(() => {
    const token = params.get('token');
    if (!token) { setMessage('This sign-in link is invalid.'); return; }
    api.verifyMagicLink(token).then(() => router.replace('/dashboard')).catch(() => setMessage('This sign-in link is invalid or has expired.'));
  }, [params, router]);
  return <main className="flex min-h-screen items-center justify-center bg-[#050505] p-6 text-sm text-slate-300">{message}</main>;
}
