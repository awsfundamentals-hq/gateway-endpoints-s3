'use client';

import { useRef } from 'react';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import { StoriesRef } from './components/Stories';

export default function Home() {
  const storiesRef = useRef<StoriesRef>(null);

  return (
    <div>
      <Navigation />
      <main className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"></div>
      </main>
      <Footer />
    </div>
  );
}
