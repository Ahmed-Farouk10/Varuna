import React from 'react';

// Spline-inspired colors - teal-green leaves and soft purple accents
const COLORS = [
  '#7AD7B1', // Vibrant teal-green (like Spline plant)
  '#4CAB5B', // Leaf green
  '#A3C76E', // Spring green
  '#B8E6D8', // Light teal (like Spline button hover)
  '#A49FFF', // Soft purple (like Spline text)
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

const PetalParticles = () => {
  const numPetals = 25; // More petals for flowing effect
  const petals = Array.from({ length: numPetals }).map((_, i) => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size = randomBetween(35, 70);
    const delay = randomBetween(0, 20);
    const speed = randomBetween(20, 40); // Slower for flowing effect
    const left = randomBetween(0, 100);
    const rotate = randomBetween(-60, 60);
    const horizontalDrift = randomBetween(-30, 30); // Sideways movement
    return { color, size, delay, speed, left, rotate, horizontalDrift, id: i };
  });

  return (
    <div 
      className="pointer-events-none fixed inset-0 w-full h-full z-0 overflow-hidden" 
      aria-hidden="true"
    >
      {petals.map((p) => (
        <svg
          key={p.id}
          width={p.size}
          height={p.size}
          viewBox="0 0 40 40"
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-60px',
            opacity: 0.75,
            transform: `rotate(${p.rotate}deg)`,
            zIndex: 0,
            animation: `petalFlow${p.id} ${p.speed}s ease-in-out ${p.delay}s infinite`,
            '--drift': `${p.horizontalDrift}px`,
          }}
        >
          {/* Leaf/petal shape inspired by Spline plant - more organic */}
          <path
            d="M20 3 Q28 12 32 20 Q28 28 20 37 Q12 28 8 20 Q12 12 20 3 Z"
            fill={p.color}
            opacity="0.85"
          />
          <ellipse cx="20" cy="20" rx="10" ry="14" fill="#fff" fillOpacity="0.15" />
          <path
            d="M20 3 L20 37 M12 12 L28 28 M28 12 L12 28"
            stroke="#fff"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
        </svg>
      ))}
      <style>{`
        ${petals.map((p) => `
          @keyframes petalFlow${p.id} {
            0% {
              transform: translateY(0) translateX(0) scale(0.7) rotate(${p.rotate - 20}deg);
              opacity: 0.5;
            }
            20% {
              transform: translateY(20vh) translateX(${p.horizontalDrift * 0.3}px) scale(0.9) rotate(${p.rotate - 10}deg);
              opacity: 0.8;
            }
            40% {
              transform: translateY(40vh) translateX(${p.horizontalDrift * 0.6}px) scale(1) rotate(${p.rotate}deg);
              opacity: 1;
            }
            60% {
              transform: translateY(60vh) translateX(${p.horizontalDrift * 0.8}px) scale(1.05) rotate(${p.rotate + 10}deg);
              opacity: 0.9;
            }
            80% {
              transform: translateY(80vh) translateX(${p.horizontalDrift * 1.2}px) scale(1.1) rotate(${p.rotate + 20}deg);
              opacity: 0.7;
            }
            100% {
              transform: translateY(110vh) translateX(${p.horizontalDrift * 1.5}px) scale(1.2) rotate(${p.rotate + 35}deg);
              opacity: 0;
            }
          }
        `).join('')}
      `}</style>
    </div>
  );
};

export default PetalParticles;
