import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, TorusKnot } from '@react-three/drei';

const AICore = () => {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.2;
      meshRef.current.rotation.y = t * 0.4;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <group>
        {/* Core Sphere */}
        <Sphere args={[1, 64, 64]} scale={1.2}>
          <MeshDistortMaterial
            color="#00f3ff"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            emissive="#00f3ff"
            emissiveIntensity={0.5}
          />
        </Sphere>
        
        {/* Outer Ring */}
        <TorusKnot args={[1.8, 0.1, 128, 16]} ref={meshRef}>
          <meshStandardMaterial 
            color="#bc13fe" 
            wireframe 
            transparent 
            opacity={0.3} 
            emissive="#bc13fe"
            emissiveIntensity={2}
          />
        </TorusKnot>
      </group>
    </Float>
  );
};

const Hero3DObject = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#bc13fe" intensity={1} />
        <AICore />
      </Canvas>
    </div>
  );
};

export default Hero3DObject;
