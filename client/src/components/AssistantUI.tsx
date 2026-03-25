import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Settings, X, Mic } from 'lucide-react';

// --- 1. The 3D Particle Sphere Animation ---
const ParticleSphere = () => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate a spherical distribution of 2500 particles
  const particlesPosition = useMemo(() => {
    const count = 2500;
    const positions = new Float32Array(count * 3);
    const radius = 2; // Size of the sphere

    for (let i = 0; i < count; i++) {
      // Mathematical distribution for points inside a sphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      // Math.cbrt ensures even distribution inside the volume instead of clustering at the center
      const r = Math.cbrt(Math.random()) * radius; 

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, []);

  // Slowly rotate the sphere on every frame
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.10;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      {/* Material for the tiny white dots */}
      <pointsMaterial
        size={0.05}
        color="blue"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

// --- 2. The Main Layout Component ---
export default function VoiceAssistantUI() {
  return (
    <div className="relative flex flex-col items-center justify-center gap-5 w-full min-h-screen bg-black text-blue-500 font-sans overflow-hidden">
      
      {/* Top Right Settings Icon */}
      <button className="absolute top-6 right-6 p-2 text-[#737373] hover:text-white transition-colors cursor-pointer">
        <Settings size={22} strokeWidth={1.5} />
      </button>

      {/* Center 3D Canvas Container */}
      <div className="w-1/2 h-100 z-10 border">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
          <ParticleSphere />
        </Canvas>
      </div>

      {/* Animated Text Label */}
      <div className="mt-2 mb-10 z-10">
        <p className="text-[#4040ba] text-lg md:text-xl font-medium tracking-wide">
          Say something...
        </p>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex items-center space-x-6 z-10">
        <button 
          className="flex items-center justify-center w-14 h-14 bg-[#262626] rounded-full hover:bg-[#333333] transition-colors cursor-pointer"
          aria-label="Cancel"
        >
          <X size={24} className="text-[#b3b3b3]" strokeWidth={1.5} />
        </button>
        
        <button 
          className="flex items-center justify-center w-14 h-14 bg-[#262626] rounded-full hover:bg-[#333333] transition-colors cursor-pointer"
          aria-label="Microphone"
        >
          <Mic size={24} className="text-[#b3b3b3]" strokeWidth={1.5} />
        </button>
      </div>
      
    </div>
  );
}