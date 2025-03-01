import React, { CSSProperties } from 'react';

const Gradient2: React.FC = () => {
  const gradientStyle: CSSProperties = {
    zIndex: -10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    maskImage: 'radial-gradient(302vw 220vh at -50% 70vh, rgba(0, 0, 0, 1) 30%, transparent)',
    background: `radial-gradient(115vw 450px at -50% 70vh, rgba(156, 163, 175, 0.2), transparent)`, // Adjust the color as needed
  };

  return <div style={gradientStyle} className="overflow-hidden" />;
};

export default Gradient2;
