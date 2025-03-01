// components/Gradient1.tsx
import React, { CSSProperties } from 'react';

const Gradient1: React.FC = () => {
  const gradientStyle: CSSProperties = {
    zIndex: -10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    maskImage: 'radial-gradient(305vw 450px at 50% 0%, rgba(0, 0, 0, 1) 30%, transparent)',
    background: `radial-gradient(115vw 450px at 110% 10%, rgba(37, 99, 235, 0.4), transparent)`, // Adjust the color as needed
  };

  return <div style={gradientStyle} className="overflow-hidden" />;
};

export default Gradient1;
