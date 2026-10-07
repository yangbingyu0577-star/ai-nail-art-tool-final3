'use client';

import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import Studio from '@/components/Studio';

export default function Page() {
  const [view, setView] = useState<'landing' | 'studio'>('landing');

  if (view === 'landing') {
    return <LandingPage onEnter={() => setView('studio')} />;
  }
  return <Studio onBack={() => setView('landing')} />;
}
