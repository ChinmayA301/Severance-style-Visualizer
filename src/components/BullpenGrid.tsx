import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, Html, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Segment } from '../types';
import MDRBullpen3D from './MDRBullpen3D';
import WorkerBot3D from './WorkerBot3D';
import * as THREE from 'three';

interface DataParticle {
  id: string;
  targetIndex: number;
  startX: number;
  startZ: number;
  label: string;
}

interface BullpenGridProps {
  segments: Segment[];
  onSegmentClick: (id: string) => void;
}

const GRID_COLS = 4;
const SPACING = 18;
const PARTICLE_LABELS = [
  'RES-0042', 'PRF-1189', 'CAS-0331', 'ENR-0774', 'SVC-0218',
  'ADM-0953', 'REQ-0567', 'INT-0821', 'DAT-1402', 'EVL-0095',
  'TRK-0631', 'OUT-0447', 'BEN-1253', 'REF-0889', 'ASM-0166',
];

export default function BullpenGrid({ segments, onSegmentClick }: BullpenGridProps) {
  const [particles, setParticles] = useState<DataParticle[]>([]);
  const [hoveredSegmentId, setHoveredSegmentId] = useState<string | null>(null);
  const particleIdRef = useRef(0);

  // Pre-calculate positions for the 7 segments on a 4-col grid
  const bullpenPositions = useMemo(() => {
    return segments.map((_, i) => {
      const col = i % GRID_COLS;
      const row = Math.floor(i / GRID_COLS);
      
      // Center the grid around [0,0,0] roughly
      const x = col * SPACING - (SPACING * 1.5);
      const z = row * SPACING - (SPACING * 0.5);
      
      return new THREE.Vector3(x, 0, z);
    });
  }, [segments]);

  // Spawn particles periodically
  useEffect(() => {
    const spawn = () => {
      const targetIndex = Math.floor(Math.random() * segments.length);
      const id = `particle-${particleIdRef.current++}`;
      
      // Spawn workers from the far top-left "elevator" zone
      const startX = -40 + Math.random() * 20;
      const startZ = -40;

      const newParticle: DataParticle = {
        id,
        targetIndex,
        startX,
        startZ,
        label: PARTICLE_LABELS[Math.floor(Math.random() * PARTICLE_LABELS.length)],
      };

      setParticles((prev) => [...prev.slice(-14), newParticle]); // keep max 15
    };

    spawn(); // initial
    const interval = setInterval(spawn, 3000); // Slowed down spawning
    return () => clearInterval(interval);
  }, [segments.length]);

  const handleArrive = (id: string) => {
    // Optional: add a slight delay before removing or a green flash
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1000);
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '85vh', backgroundColor: '#e8e8e6' }}>
      <Canvas shadows>
        {/* Strict Isometric Camera */}
        <OrthographicCamera makeDefault position={[100, 100, 100]} zoom={22} near={-200} far={500} />
        
        {/* User can pan/zoom slightly but constrained to maintain isometric feel */}
        <OrbitControls 
          enableRotate={false} 
          enableZoom={true} 
          minZoom={10}
          maxZoom={40}
          enablePan={true}
          target={[0, 0, 0]}
        />

        {/* Lighting to replicate the harsh fluorescent Lumon look */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          castShadow 
          position={[-20, 50, 20]} 
          intensity={1.2} 
          shadow-mapSize={[2048, 2048]} 
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
        />

        <group position={[0, -2, 0]}>
          {/* Main Floor Platform */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="#dcdccf" roughness={1} />
          </mesh>

          {/* Render 3D Bullpens */}
          {segments.map((segment, index) => {
            const pos = bullpenPositions[index];
            return (
              <group key={segment.id} position={pos}>
                <MDRBullpen3D position={[0, 0, 0]} color={segment.color} />
                
                {/* Invisible click target volume (Flat to avoid isometric perspective overlap) */}
                <mesh 
                  rotation={[-Math.PI / 2, 0, 0]}
                  position={[0, 0.1, 0]} 
                  onClick={(e) => { e.stopPropagation(); onSegmentClick(segment.id); }}
                  onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; setHoveredSegmentId(segment.id); }}
                  onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; setHoveredSegmentId(null); }}
                >
                  <planeGeometry args={[14, 14]} />
                  <meshBasicMaterial visible={false} />
                </mesh>

                {/* HTML UI Floating Above Bullpen */}
                <Html position={[0, 6, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
                  <motion.div 
                    className="group cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); onSegmentClick(segment.id); }}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ 
                      opacity: hoveredSegmentId === segment.id ? 1 : 0, 
                      y: hoveredSegmentId === segment.id ? -8 : 10,
                      scale: hoveredSegmentId === segment.id ? 1.02 : 0.95,
                      boxShadow: hoveredSegmentId === segment.id ? '0 20px 40px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.15)',
                      backgroundColor: hoveredSegmentId === segment.id ? '#ffffff' : 'var(--color-lumon-white)'
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    style={{
                      width: '240px',
                      borderTop: `4px solid ${segment.color}`,
                      padding: '16px',
                      fontFamily: 'var(--font-mono)',
                      userSelect: 'none',
                      pointerEvents: hoveredSegmentId === segment.id ? 'auto' : 'none'
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--color-lumon-gray-300)' }}>
                        {String(index + 1).padStart(2, '0')} // MDR
                      </div>
                      <div className="text-[10px] font-bold" style={{ color: segment.color }}>
                        {segment.populationSize.toLocaleString()}
                      </div>
                    </div>
                    
                    <h3 className="text-[12px] uppercase font-bold mb-1 leading-tight" style={{ color: 'var(--color-lumon-black)' }}>
                      {segment.name}
                    </h3>
                    <p className="text-[9px] font-medium opacity-60 leading-tight">
                      {segment.tagline}
                    </p>
                  </motion.div>
                </Html>
              </group>
            );
          })}

          {/* Render Workers */}
          {particles.map((particle) => {
            const targetPos = bullpenPositions[particle.targetIndex];
            if (!targetPos) return null;
            
            return (
              <WorkerBot3D 
                key={particle.id}
                id={particle.id}
                position={[particle.startX, 0, particle.startZ]}
                target={[targetPos.x, 0, targetPos.z]}
                label={particle.label}
                onArrive={handleArrive}
                speed={0.03} // Slowed down waddle
              />
            );
          })}
        </group>
      </Canvas>
    </div>
  );
}
