import React from 'react';
import { Box } from '@react-three/drei';

interface MDRBullpen3DProps {
  position: [number, number, number];
  color: string;
}

export default function MDRBullpen3D({ position, color }: MDRBullpen3DProps) {
  return (
    <group position={position}>
      {/* Floor */}
      <Box args={[12, 0.4, 12]} position={[0, -0.2, 0]} receiveShadow>
        <meshStandardMaterial color="#fdfdfc" roughness={0.9} />
      </Box>

      {/* Cross Partitions */}
      {/* Vertical */}
      <Box args={[0.4, 4, 10]} position={[0, 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} opacity={0.6} transparent roughness={0.2} metalness={0.1} />
      </Box>
      {/* Horizontal */}
      <Box args={[10, 4, 0.4]} position={[0, 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} opacity={0.6} transparent roughness={0.2} metalness={0.1} />
      </Box>

      {/* Desks (simple stylized workstations) */}
      {[
        [-2.5, -2.5],
        [2.5, -2.5],
        [-2.5, 2.5],
        [2.5, 2.5],
      ].map(([x, z], i) => (
        <group key={`desk-${i}`} position={[x, 0, z]}>
          <Box args={[2.8, 1.5, 2.8]} position={[0, 0.75, 0]} castShadow receiveShadow>
            <meshStandardMaterial color="#e2e2e0" roughness={0.8} />
          </Box>
          {/* Monitor Screen */}
          <Box args={[1.2, 1, 0.2]} position={[0, 1.8, 0]} rotation={[0, Math.PI / 4 + (i * Math.PI / 2), 0]} castShadow>
            <meshStandardMaterial color="#111" roughness={0.4} />
          </Box>
        </group>
      ))}

      {/* Outer subtle boundary lines (to define the sector bounds clearly) */}
      <Box args={[12, 0.1, 12]} position={[0, 0.05, 0]}>
        <meshBasicMaterial color="#d4d4d2" wireframe />
      </Box>
    </group>
  );
}
