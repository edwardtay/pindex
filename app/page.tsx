'use client';

import { SwapInterface } from '@/components/SwapInterface';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <div className="container">
        <div style={{ maxWidth: '500px', margin: '4rem auto' }}>
          <SwapInterface />
        </div>
      </div>
      <Footer />
    </main>
  );
}


