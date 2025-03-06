import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControls, PerspectiveCamera, MeshReflectorMaterial } from '@react-three/drei';
import { Market } from './Market';
import { TextMesh } from './TextMesh';
import { useSpring, animated } from '@react-spring/three';

function Controls({ rotationSpeed, isMarketClicked }) {
  const { camera, gl } = useThree();
  const target = isMarketClicked ? [0, 0.5, -40] : [0, 0.35, 0];
  return (
    <DreiOrbitControls
      args={[camera, gl.domElement]}
      enablePan={false}
      target={target}
      maxPolarAngle={1.45}
      enableDamping
      autoRotate={!isMarketClicked}
      autoRotateSpeed={rotationSpeed}
    />
  );
}

function CameraAnimator({ cameraRef, cameraPos, lookAtPos, animating }) {
  useFrame(() => {
    if (animating && cameraRef.current) {
      cameraRef.current.position.set(...cameraPos.get());
      cameraRef.current.lookAt(...lookAtPos.get());
    }
  });
  return null;
}

function App() {
  const cameraRef = useRef();
  const marketRef = useRef();

  const [isMarketClicked, setIsMarketClicked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [isMarketHovered, setIsMarketHovered] = useState(false);

  const [radius, setRadius] = useState(15);
  const [cameraHeight, setCameraHeight] = useState(5);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [backgroundColor] = useState('#ffff00');

  const [{ cameraPos, lookAtPos }, setCamera] = useSpring(() => ({
    cameraPos: [radius, cameraHeight, radius],
    lookAtPos: [0, 0.35, 0],
    config: { mass: 1, tension: 170, friction: 26 },
    onStart: () => setAnimating(true),
    onRest: () => setAnimating(false),
  }));

  const { scale } = useSpring({
    scale: isMarketHovered ? 2.3 : 2,
    config: { tension: 300, friction: 10 },
  });

  const handleMarketClick = () => {
    if (isMarketClicked) {
      setIsMarketClicked(false);
      setCamera({ cameraPos: [radius, cameraHeight, radius], lookAtPos: [0, 0.35, 0] });
    } else {
      setIsMarketClicked(true);
      setCamera({ cameraPos: [0, 5, -30], lookAtPos: [0, 0.5, -40] });
    }
  };

  return (
    <>
      <Suspense fallback={null}>
        <Canvas shadows>
          <PerspectiveCamera ref={cameraRef} makeDefault fov={80} position={[radius, cameraHeight, radius]} />

          <Controls rotationSpeed={rotationSpeed} isMarketClicked={isMarketClicked} />

          <CameraAnimator cameraRef={cameraRef} cameraPos={cameraPos} lookAtPos={lookAtPos} animating={animating} />

          <color args={[backgroundColor]} attach="background" />

          <ambientLight intensity={10} position={[0, 20, 0]}  />
          <spotLight intensity={5000} color="blue" position={[2, 20, 0]} castShadow />
          <spotLight intensity={5000} color="blue" position={[-4, 20, 0]} castShadow />
          <spotLight intensity={5000} color="blue" position={[-5, 10, 0]} castShadow />
          <spotLight intensity={5000} color="blue" position={[4, 10, 0]} castShadow />

          <mesh position={[0, 14, 0]}>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>

          <mesh position={[0,-3,0]} castShadow receiveShadow rotation-x={-Math.PI * 0.5}>
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

           <mesh position={[0,-3,0]} scale={.75,.75,.75}>
            <TextMesh/>
          </mesh>

          <animated.mesh
            ref={marketRef}
            position={[0, -3, -40]}
            scale={scale}
            onPointerOver={() => setIsMarketHovered(true)}
            onPointerOut={() => setIsMarketHovered(false)}
            onClick={handleMarketClick}
          >
            <Market />
          </animated.mesh>

        </Canvas>
      </Suspense>

      <div style={{ position: 'absolute', top: 20, left: 20, color: 'black' }}>
        <label>
          Radius:
          <input type="range" min="5" max="50" value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
        </label>
        <br />
        <label>
          Camera Height:
          <input type="range" min="1" max="20" value={cameraHeight} onChange={(e) => setCameraHeight(Number(e.target.value))} />
        </label>
        <br />
        <label>
          Rotation Speed:
          <input type="range" min="0" max="2" step="0.1" value={rotationSpeed} onChange={(e) => setRotationSpeed(Number(e.target.value))} />
        </label>
      </div>
    </>
  );
}

export default App;
