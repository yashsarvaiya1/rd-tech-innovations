import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import HomePage from '@/components/pages/HomePage';

export const metadata: Metadata = {
  title: 'RD Tech Innovations - Transform Your Digital Dreams',
  description: 'Leading software development company specializing in cutting-edge web applications, mobile apps, and digital solutions that drive business growth.',
};

export default function Home() {
  return (
    <>
      <HomePage />
    </>
  );
}
