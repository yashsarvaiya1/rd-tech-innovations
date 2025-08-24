'use client'
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useContentStore } from '@/stores/content';
import CompanyBrief from './CompanyBrief';
// import CompanyMarquee from './CompanyMarquee';
// import WhyUs from './WhyUs';
// import Vision from './Vision';

export default function AboutSection() {
  const { subscribeToRealTimeUpdates, fetchAllContent } = useContentStore();

  useEffect(() => {
    fetchAllContent();
    const unsubscribe = subscribeToRealTimeUpdates();
    return unsubscribe;
  }, [subscribeToRealTimeUpdates, fetchAllContent]);

  return (
    <div className="pt-20">
      {/* Main about content sections */}
      <CompanyBrief />
      {/* <CompanyMarquee />
      <WhyUs />
      <Vision /> */}
    </div>
  );
}
