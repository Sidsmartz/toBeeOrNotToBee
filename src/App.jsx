import { Suspense, useRef } from 'react';
import './App.css';
import './index.css';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import { Ground } from './Ground';
import { Market } from './Market';

function App() {
  const orbitRef = useRef();
  const cameraRef = useRef();

  return (
    <Suspense fallback={null}>
      <Canvas shadows>
        <OrbitControls ref={orbitRef} target={[0, 0.35, 0]} maxPolarAngle={1.45} />
        <PerspectiveCamera ref={cameraRef} makeDefault fov={80} position={[3, 2, 5]} />
        <color args={[0, 0, 0]} attach={'background'} />
        <spotLight
          color={[1, 0.25, 0.7]}
          intensity={250}
          angle={0.8}
          penumbra={0.5}
          position={[5, 5, 0]}
          castShadow
          shadow-bias={-0.0001}
        />
        <spotLight
          color={[0.14, 0.5, 1]}
          intensity={200}
          angle={0.7}
          penumbra={0.5}
          position={[-5, 5, 0]}
          castShadow
          shadow-bias={-0.0001}
        />
        <ambientLight intensity={1} position={[5, 10, 10]} castShadow />
        
        <Market />
        <Ground />
      </Canvas>
    </Suspense>
  );
}

export default App;
