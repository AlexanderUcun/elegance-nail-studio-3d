import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function AmbientParticles() {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.04
  })
  return (
    <group ref={ref}>
      <Sparkles count={50} scale={9} size={2.5} speed={0.35} opacity={0.45} color="#b8924a" />
      <Sparkles count={30} scale={6} size={1.5} speed={0.5}  opacity={0.25} color="#d4849a" />
    </group>
  )
}

interface SceneCanvasProps {
  children: React.ReactNode
}

export const SceneCanvas = ({ children }: SceneCanvasProps) => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1,
      pointerEvents: 'none',
    }}
  >
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      shadows="soft"
    >
      <Suspense fallback={null}>
        {/* Neutral studio HDRI – gives clean reflections on chrome/glass */}
        <Environment preset="studio" />

        {/* Soft key light from top-left */}
        <directionalLight
          position={[4, 8, 5]}
          intensity={2.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={20}
          color="#fff8f0"
        />
        {/* Warm fill */}
        <pointLight position={[-3, 2, 4]} intensity={1.8} color="#f0e8d8" />
        {/* Cool rim from behind */}
        <pointLight position={[0, -4, -3]} intensity={1.2} color="#d8eaf5" />
        {/* Rose accent */}
        <pointLight position={[5, -1, 3]} intensity={1.4} color="#f0d0dc" />

        <ambientLight intensity={1.2} color="#fff5f0" />

        {/* Soft drop shadow on ground plane */}
        <ContactShadows
          position={[0, -4.5, 0]}
          opacity={0.18}
          scale={12}
          blur={3}
          far={8}
          color="#b8924a"
        />

        <AmbientParticles />
        {children}
      </Suspense>
    </Canvas>
  </div>
)
