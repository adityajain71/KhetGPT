import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Products from '../components/Products';
import Stats from '../components/Stats';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <Hero />
      <Features />
      <HowItWorks />
      <Products />
      <Stats />
    </div>
  );
};

export default HomePage;