import { useRef, useEffect } from 'react';
import { Galaxy } from './Galaxy';

/**
 * BackgroundParticles - Wrapper for React-Bits Galaxy + Organic SVG Noise + Aurora
 */
export const BackgroundParticles = () => {

  // Using SVG Filter for "Organic" Noise (Visual Snow)
  // feTurbulence creates a natural, non-pixelated noise texture
  // 'stitchTiles' ensures it repeats seamlessly without grid lines
  const noiseSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E`;

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#0a0a0a] overflow-hidden">

        {/* Diagonal Aurora Beams */}
        <div
          className="absolute top-[-20%] right-[-10%] w-[80%] h-[150%] bg-gradient-to-b from-cyan-900/0 via-cyan-900/20 to-blue-900/0 transform -rotate-45 blur-[80px] opacity-60 mix-blend-screen pointer-events-none"
        ></div>

        <div
          className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[150%] bg-gradient-to-t from-purple-900/0 via-purple-900/20 to-indigo-900/0 transform -rotate-45 blur-[90px] opacity-50 mix-blend-screen pointer-events-none"
        ></div>

        <div
          className="absolute top-[-50%] left-1/2 transform -translate-x-1/2 w-[400px] h-[200%] bg-gradient-to-b from-white/0 via-white/5 to-white/0 blur-[100px] opacity-30 pointer-events-none"
        ></div>

        <Galaxy
          starSpeed={0.3}
          density={0.5}
          hueShift={120}
          speed={0.2}
          glowIntensity={0.2}
          saturation={0}
          mouseRepulsion={true}
          repulsionStrength={0.5}
          twinkleIntensity={0.25}
          rotationSpeed={0.05}
          transparent={true}
        />
      </div>

      {/* Organic Noise Overlay - SVG Turbulence */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage: `url("${noiseSvg}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px', // Seamless tile
          filter: 'contrast(150%) brightness(100%)', // Enhance static look
        }}
      />
    </>
  );
};
