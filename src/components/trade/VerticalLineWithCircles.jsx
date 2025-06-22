import React from 'react';

const VerticalLineWithCircles = ({ activeIndex, totalCircles }) => {
  if (!totalCircles || totalCircles <= 0) return null;
  
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      {Array.from({ length: totalCircles }).map((_, index) => (
        <React.Fragment key={index}>
          {index === activeIndex ? (
            <div className="w-4 h-4 rounded-full border border-purple-500 flex items-center justify-center overflow-hidden">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
            </div>
          ) : (
            <div className="w-4 h-4 rounded-full border border-purple-500"></div>
          )}
          
          {index < totalCircles - 1 && (
            <div className="w-[1px] h-18 bg-gradient-to-b from-purple-500 to-blue-500 mb-4"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default VerticalLineWithCircles;