import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls as DreiOrbitControls,
  PerspectiveCamera,
  MeshReflectorMaterial,
  Environment,
} from "@react-three/drei";
import { B2BMela } from "./B2BMela";
import { TextMesh } from "./TextMesh";
import { Hero } from "./Hero";
import { useSpring, animated } from "@react-spring/three";
import { Revival } from "./Revival";
import { Ground } from "./Ground";

function Controls({ rotationSpeed, isMarketClicked, isRevivalClicked }) {
  const { camera, gl } = useThree();
  const target = isMarketClicked
    ? [15, 0, -20]
    : isRevivalClicked
    ? [-20, 0, 10]
    : [0, 0.35, 0];
  return (
    <DreiOrbitControls
      args={[camera, gl.domElement]}
      enablePan={false}
      enableZoom={false}
      enableRotate={true}
      target={target}
      maxPolarAngle={1.45}
      minAzimuthAngle={-Math.PI / 6} // -30 degrees
      maxAzimuthAngle={Math.PI / 6} // 30 degrees
      enableDamping
      autoRotate={!isMarketClicked && !isRevivalClicked}
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
  const revivalRef = useRef();

  const [isMarketClicked, setIsMarketClicked] = useState(false);
  const [isRevivalClicked, setIsRevivalClicked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [isMarketHovered, setIsMarketHovered] = useState(false);
  const [isRevivalHovered, setIsRevivalHovered] = useState(false);

  const [rotationSpeed] = useState(0);
  const [backgroundColor] = useState("#ffd21b");

  const [{ cameraPos, lookAtPos }, setCamera] = useSpring(() => ({
    // Default camera position and lookAt
    cameraPos: [5, 0, 20], // Edit this to change the default camera position
    lookAtPos: [0, 0.35, 0], // Edit this to change the default lookAt position
    config: { mass: 1, tension: 170, friction: 26 },
    onStart: () => setAnimating(true),
    onRest: () => setAnimating(false),
  }));

  const { scale: marketScale } = useSpring({
    scale: isMarketHovered && !isMarketClicked ? 2.5 : 2,
    config: { tension: 300, friction: 10 },
  });

  const { scale: revivalScale } = useSpring({
    scale: isRevivalHovered && !isRevivalClicked ? 7 : 5,
    config: { tension: 300, friction: 10 },
  });

  const handleMarketClick = () => {
    setIsRevivalClicked(false);
    if (isMarketClicked) {
      setIsMarketClicked(false);
      setCamera({
        cameraPos: [5, 3, 20], // Edit this to change the default camera position
        lookAtPos: [0, 0, 0], // Edit this to change the default lookAt position
      });
    } else {
      setIsMarketClicked(true);
      setCamera({
        cameraPos: [8, 3, -8], // Edit this to change the camera position when market is clicked
        lookAtPos: [15, 0, -20], // Edit this to change the lookAt position when market is clicked
      });
    }
  };

  const handleRevivalClick = () => {
    setIsMarketClicked(false);
    if (isRevivalClicked) {
      setIsRevivalClicked(false);
      setCamera({
        cameraPos: [5, 3, 20], // Edit this to change the default camera position
        lookAtPos: [0, 0, 0], // Edit this to change the default lookAt position
      });
    } else {
      setIsRevivalClicked(true);
      setCamera({
        cameraPos: [-8, 3, 10], // Edit this to change the camera position when revival is clicked
        lookAtPos: [-20, 0, 10], // Edit this to change the lookAt position when revival is clicked
      });
    }
  };

  const handleBackClick = () => {
    setIsMarketClicked(false);
    setIsRevivalClicked(false);
    setCamera({
      cameraPos: [5, 3, 20], // Edit this to change the default camera position
      lookAtPos: [0, 0, 0], // Edit this to change the default lookAt position
    });
  };

  return (
    <>
      <Suspense fallback={null}>
        <Canvas shadows>
          <Environment files="public/hdri/B2B.hdr" background />
          <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            fov={80}
            position={[5, 0, 20]} // Edit this to change the default camera position
          />

          <Controls
            rotationSpeed={rotationSpeed}
            isMarketClicked={isMarketClicked}
            isRevivalClicked={isRevivalClicked}
          />

          <CameraAnimator
            cameraRef={cameraRef}
            cameraPos={cameraPos}
            lookAtPos={lookAtPos}
            animating={animating}
          />

          <color args={[backgroundColor]} attach="background" />

          <mesh position={[0, -7, 0]} scale={[15, 1, 15]}>
            <Ground />
          </mesh>

          <mesh position={[0, -5, 5]} scale={0.75}>
            <Hero />
          </mesh>

          <animated.mesh
            ref={marketRef}
            position={[25, -6, -20]}
            rotation={[0, -20, 0]}
            scale={marketScale}
            onPointerOver={() => setIsMarketHovered(true)}
            onPointerOut={() => setIsMarketHovered(false)}
            onClick={handleMarketClick}
          >
            <B2BMela />
          </animated.mesh>

          <animated.mesh
            ref={revivalRef}
            position={[-20, -3, 10]}
            scale={revivalScale}
            rotation={[0, 20, 0]}
            onPointerOver={() => setIsRevivalHovered(true)}
            onPointerOut={() => setIsRevivalHovered(false)}
            onClick={handleRevivalClick}
          >
            <Revival />
          </animated.mesh>
        </Canvas>
      </Suspense>
      {(isMarketClicked || isRevivalClicked) && (
        <button
          onClick={handleBackClick}
          style={{ position: "absolute", top: 20, left: 20 }}
        >
          Back
        </button>
      )}
    </>
  );
}

export default App;
