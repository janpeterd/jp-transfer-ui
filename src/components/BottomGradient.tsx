// components/BottomGradient.js
import { CSSProperties } from 'react';
import { hexToRgbA } from '@/lib/utils';


const BottomGradient = () => {
  const gradientStyle: CSSProperties = {
    zIndex: -10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    maskImage: 'radial-gradient(305vw 450px at 50% 50%, rgba(0, 0, 0, 1) 80%, transparent)',
    background: `url('/img/grain.webp'), radial-gradient(105vw 850px at 50% 120%, ${hexToRgbA("101233", 0.5)}, transparent)`,
  };

  return <div style={gradientStyle} />;
};

export default BottomGradient;
