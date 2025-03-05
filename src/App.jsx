import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, MeshReflectorMaterial } from '@react-three/drei';
import { Market } from './Market';
import { TextMesh } from './TextMesh';

function App() {
  const orbitRef = useRef();
  const cameraRef = useRef();

  // Adjustable state variables for camera movement
  const [backgroundColor, setBackgroundColor] = useState('#ffff00');
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [radius, setRadius] = useState(15); // Distance from center
  const [cameraHeight, setCameraHeight] = useState(5); // Height of the camera
  const [rotationSpeed, setRotationSpeed] = useState(0.5); // Auto-rotation speed

  return (
    <>
      <Suspense fallback={null}>
        <Canvas shadows>
          <OrbitControls
            enablePan={false}
            ref={orbitRef}
            target={[0, 0.35, 0]}
            maxPolarAngle={1.45}
            enableDamping
            autoRotate={!isUserInteracting} // Enable auto-rotation only when idle
            autoRotateSpeed={rotationSpeed} // Control rotation speed
            onStart={() => setIsUserInteracting(true)} // Disable auto-rotate on interaction
            onEnd={() => setIsUserInteracting(false)} // Enable auto-rotate after interaction ends
          />
          <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            fov={80}
            position={[radius, cameraHeight, radius]} // Dynamic positioning based on state
          />
          <color args={[backgroundColor]} attach={'background'} />

          <ambientLight intensity={10} position={[0, 20, 0]} castShadow />
          <spotLight intensity={1000} color={"purple"} position={[2, 22, 0]} castShadow />
          <spotLight intensity={1000} color={"purple"} position={[0, 14, 0]} castShadow />

          <mesh position={[0, 14, 0]}>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>

          <mesh castShadow receiveShadow rotation-x={-Math.PI * 0.5}>
            <planeGeometry args={[1000, 1000]} />
            <MeshReflectorMaterial
              dithering={false}
              color={[0, 0.015, 0.015]}
              roughness={0.1}
              blur={[5000, 1000]}
              mixBlur={100}
              mixStrength={80}
              mixContrast={0.8}
              resolution={512}
              mirror={0}
              depthScale={0.01}
              minDepthThreshold={0.9}
              maxDepthThreshold={1}
              depthToBlurRatioBias={0.25}
              debug={0}
              reflectorOffset={0.2}
            />
          </mesh>

          <TextMesh />
          <mesh position={[0, 0, -40]} scale={[2,2,2]}>
            <Market />
          </mesh>
        </Canvas>
      </Suspense>

      {/* UI Controls for adjusting camera behavior */}
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'black' }}>
        <label>
          Radius: 
          <input
            type="range"
            min="5"
            max="50"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Camera Height: 
          <input
            type="range"
            min="1"
            max="20"
            value={cameraHeight}
            onChange={(e) => setCameraHeight(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Rotation Speed: 
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={rotationSpeed}
            onChange={(e) => setRotationSpeed(Number(e.target.value))}
          />
        </label>
      </div>
    </>
  );
}

export default App;
