import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder, Html } from '@react-three/drei';
import * as THREE from 'three';

interface WorkerBot3DProps {
  id: string;
  position: [number, number, number];
  target: [number, number, number];
  label: string;
  onArrive: (id: string) => void;
  speed?: number;
}

export default function WorkerBot3D({ id, position, target, label, onArrive, speed = 0.08 }: WorkerBot3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hasArrived = useRef(false);
  
  const targetPos = new THREE.Vector3(...target);
  // Keep the worker's base grounded around Y=1.5 so it doesn't sink into the floor
  targetPos.y = 1.6; 

  useFrame((state, delta) => {
    if (!groupRef.current || hasArrived.current) return;
    
    const objPos = groupRef.current.position;
    
    // Ignore Y distance for arrival check since Y bounces during walk cycle
    const distSq = Math.pow(objPos.x - targetPos.x, 2) + Math.pow(objPos.z - targetPos.z, 2);
    
    if (distSq > 0.5) {
      // Move towards target smoothly
      objPos.lerp(targetPos, speed * delta * 15);
      
      // Look at target
      groupRef.current.lookAt(targetPos.x, objPos.y, targetPos.z);
      
      // Waddling animation based on time
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.15;
      groupRef.current.position.y = 1.6 + Math.abs(Math.sin(state.clock.elapsedTime * 16)) * 0.3;
    } else {
      hasArrived.current = true;
      groupRef.current.rotation.z = 0;
      groupRef.current.position.y = 1.6;
      onArrive(id);
    }
  });

  return (
    <group ref={groupRef} position={[position[0], 1.6, position[2]]}>
      {/* Body */}
      <Cylinder args={[0.4, 0.4, 1.4]} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color="#1a1a1a" />
      </Cylinder>
      {/* Head */}
      <Sphere args={[0.35]} position={[0, 1.0, 0]} castShadow>
        <meshStandardMaterial color="#f5d0b5" />
      </Sphere>
      {/* Data File Payload (Looks like a glowing Lumon file box) */}
      <Box args={[0.8, 0.5, 0.6]} position={[0, 0.1, 0.5]} castShadow>
        <meshStandardMaterial color="#ffffff" emissive="#33ff00" emissiveIntensity={0.2} roughness={0.2} />
      </Box>

      {/* HTML Label floating above the worker */}
      <Html position={[0, 1.8, 0]} center>
        <div 
          className="px-1.5 py-0.5 rounded text-[8px] tracking-[0.1em] font-bold"
          style={{
            backgroundColor: 'var(--color-lumon-black)',
            color: 'var(--color-lumon-green)',
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'nowrap',
            boxShadow: '0 0 8px rgba(51,255,0,0.5)'
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}
