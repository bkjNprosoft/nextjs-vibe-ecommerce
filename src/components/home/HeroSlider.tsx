'use client';

import { useState, useEffect } from 'react';

const slides = [
  { id: 1, text: '1', bgColor: 'bg-tertiary-300' },
  { id: 2, text: '2', bgColor: 'bg-tertiary-500' },
  { id: 3, text: '3', bgColor: 'bg-tertiary-700' },
];

const extendedSlides = [...slides, { ...slides[0], id: 'clone-' + slides[0].id }]; // Add a clone of the first slide at the end with a unique ID

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true); // Control CSS transition

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => prevSlide + 1);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentSlide === extendedSlides.length - 1 && isTransitioning) {
      // We just transitioned to the cloned slide. Now, instantly jump back to the first.
      const timeout = setTimeout(() => {
        setIsTransitioning(false); // Disable transition
        setCurrentSlide(0); // Jump to the first slide
      }, 700); // This timeout should match the transition duration (700ms)
      return () => clearTimeout(timeout);
    } else if (currentSlide === 0 && !isTransitioning) {
      // We just jumped to the first slide. Re-enable transition for the next normal slide.
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
      }, 50); // A very small delay to ensure the DOM has updated
      return () => clearTimeout(timeout);
    }
  }, [currentSlide, isTransitioning]);

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentSlide(index);
  };

  return (
    <section className="relative w-full h-[500px] overflow-hidden">
      <div 
        className={`flex h-full ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {extendedSlides.map((slide) => (
          <div
            key={slide.id} // Note: Using slide.id here might cause key warning if original slides have same IDs. For this simple case, it's fine.
            className={`w-full h-full flex-shrink-0 flex items-center justify-center text-white text-6xl font-bold ${slide.bgColor}`}
          >
            {slide.text}
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full bg-white transition-all duration-300
              ${index === (currentSlide % slides.length) ? 'scale-150 opacity-100' : 'opacity-50'}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;