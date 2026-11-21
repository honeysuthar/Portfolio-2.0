import React from 'react';
import './App.css';

import NoiseOverlay    from './components/NoiseOverlay';
import CustomCursor    from './components/CustomCursor';
import Navbar          from './components/Navbar';
import Hero            from './components/Hero';
import ScrollStatement from './components/ScrollStatement';
import About           from './components/About';
import MarqueeBand     from './components/Marquee';
import FeaturedWork    from './components/FeaturedWork';
import Process         from './components/Process';
import Principles      from './components/Principles';
import Experience      from './components/Experience';
import Education       from './components/Education';
import Footer          from './components/Footer';

function App() {
  return (
    <div className="app">
      {/* Global immersive layers */}
      <NoiseOverlay />
      <CustomCursor />

      {/* Page */}
      <Navbar />
      <main>
        <Hero />
        <ScrollStatement />
        <About />
        <MarqueeBand />
        <FeaturedWork />
        <Process />
        <Principles />
        <Experience />
        <Education />
      </main>
      <Footer />
    </div>
  );
}

export default App;
