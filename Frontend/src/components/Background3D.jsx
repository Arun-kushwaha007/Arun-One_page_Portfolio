import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const Stars = (props) => {
  const ref = useRef();
  // Reduced particle count for performance
  const [sphere] = useState(() => random.inSphere(new Float32Array(3000), { radius: 1.5 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 15;
    ref.current.rotation.y -= delta / 20;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#00f3ff"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const FloatingShape = ({ position, color, speed, type = 'icosahedron' }) => {
  const mesh = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Simplified rotation math
    mesh.current.rotation.x = t * 0.2;
    mesh.current.rotation.y = t * 0.3;
    mesh.current.position.y = position[1] + Math.sin(t * speed) * 0.2;
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} position={position}>
        {type === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
        {type === 'torus' && <torusGeometry args={[0.7, 0.2, 16, 32]} />} 
        {/* Reduced segments for torus */}
        <meshStandardMaterial color={color} wireframe transparent opacity={0.2} />
      </mesh>
    </Float>
  );
};

const Background3D = () => {
  return (
    <div className="fixed inset-0 z-[-10] bg-black">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}> 
        {/* Cap DPR for performance */}
        <ambientLight intensity={0.5} />
        <Stars />
        
        <FloatingShape position={[-4, 2, -5]} color="#bc13fe" speed={1} type="torus" />
        <FloatingShape position={[4, -2, -5]} color="#00f3ff" speed={0.8} type="icosahedron" />
        <FloatingShape position={[0, 3, -8]} color="#0aff0a" speed={0.5} type="icosahedron" />
      </Canvas>
    </div>
  );
};

export default Background3D;
