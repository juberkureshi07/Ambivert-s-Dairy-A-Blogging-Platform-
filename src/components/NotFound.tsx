import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden font-nunito flex flex-col items-center justify-start text-white -m-4">
      {/* Background with stars and gradient */}
      <div 
        className="absolute inset-0 z-0 bg-[#05007A] bg-center bg-repeat"
        style={{ 
          backgroundImage: 'url("https://assets.codepen.io/1538474/star.svg"), linear-gradient(to bottom, #05007A, #4D007D)',
          backgroundAttachment: 'fixed'
        }}
      ></div>

      {/* Mars at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[27vh] z-10 bg-no-repeat bg-bottom bg-cover"
        style={{ backgroundImage: 'url("https://assets.codepen.io/1538474/mars.svg")' }}
      ></div>

      {/* Logo 404 */}
      <img 
        src="https://assets.codepen.io/1538474/404.svg" 
        alt="404"
        className="absolute top-[16vh] w-[30vh] z-20" 
      />

      {/* Meteor */}
      <img 
        src="https://assets.codepen.io/1538474/meteor.svg" 
        alt="meteor"
        className="absolute right-[2vh] top-[16vh] z-10 pointer-events-none" 
      />

      {/* Text Content */}
      <div className="relative z-30 flex flex-col items-center mt-[31vh] px-4 text-center">
        <h2 className="text-[5vh] font-semibold leading-tight mb-2">Oh no!!</h2>
        <p className="text-[3.5vh] font-normal opacity-90 mb-9">
          You’re either misspelling the URL <br className="hidden sm:block" /> or requesting a page that's no longer here.
        </p>
        
        <button
          onClick={() => navigate(-1)}
          className="border border-white text-white px-6 py-2 rounded-lg text-[2.5vh] hover:bg-white hover:text-[#4D007D] transition-all active:scale-95 whitespace-nowrap"
        >
          Back to previous page
        </button>
      </div>

      {/* Astronaut (Floating) */}
      <motion.img 
        src="https://assets.codepen.io/1538474/astronaut.svg" 
        alt="astronaut"
        className="absolute top-[18vh] left-[5vh] h-[30vh] z-20 pointer-events-none"
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Spaceship */}
      <img 
        src="https://assets.codepen.io/1538474/spaceship.svg" 
        alt="spaceship"
        className="absolute bottom-[13vh] right-[10vh] w-[20vh] z-20 pointer-events-none" 
      />
    </div>
  );
};
