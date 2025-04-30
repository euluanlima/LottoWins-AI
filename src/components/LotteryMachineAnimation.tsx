import React from 'react';

// Simple SVG Lottery Machine Animation Component
const LotteryMachineAnimation: React.FC = () => {
  // Define some ball colors
  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']; // red, yellow, green, blue, purple

  return (
    <div className="flex flex-col items-center justify-center">
      <svg 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-20 h-20 sm:w-24 sm:h-24 mb-2" // Responsive size
      >
        {/* Simple transparent container */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="rgba(200, 200, 255, 0.1)" 
          stroke="#A5B4FC" // indigo-300
          strokeWidth="2" 
        />
        
        {/* Animated Balls - Apply CSS animation class */}
        {colors.map((color, index) => (
          <circle 
            key={index}
            cx={40 + Math.random() * 20} // Random initial position within center
            cy={40 + Math.random() * 20}
            r="8" // Ball size
            fill={color}
            className="lottery-ball" // Apply animation class from globals.css
            style={{ animationDelay: `${index * 0.15}s` }} // Stagger animation start
          />
        ))}
      </svg>
      <span className="text-lg text-muted-foreground">Sorteando números...</span>
    </div>
  );
};

export default LotteryMachineAnimation;

