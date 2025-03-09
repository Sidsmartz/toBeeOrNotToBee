import { Suspense, useRef, useState, useEffect } from "react";
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
import { B2BMelaTitle } from "./B2BMelaTitle";
import { B2BMelaDescription } from "./B2BMelaDescription";
import { BrandRevivalTitle } from "./BrandRevivalTitle";
import { ClickHereToRegister } from "./ClickHereToRegister";
import { RevivalDescription } from "./RevivalDescription";

function Controls({ rotationSpeed, isMarketClicked, isRevivalClicked, isMobile }) {
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
      enableZoom={isMobile}
      enableRotate={true}
      target={target}
      maxPolarAngle={1.45}
      minAzimuthAngle={-Math.PI / 6} // -30 degrees
      maxAzimuthAngle={Math.PI / 6} // 30 degrees
      enableDamping
      autoRotate={!isMarketClicked && !isRevivalClicked}
      autoRotateSpeed={rotationSpeed || 0.2} // Slow auto-rotate speed when idle
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

function LoadingScreen() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffd21b',
      zIndex: 10
    }}>
      <h1>Loading...</h1>
    </div>
  );
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        cameraPos: [-10, 0, 10], // Edit this to change the camera position when revival is clicked
        lookAtPos: [-15, 0, 10], // Edit this to change the lookAt position when revival is clicked
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

  const handleLinkClick = () => {
    window.open("http://linktr.ee/mlritcie", "_blank");
  };

  return (
    <>
      {!isLoaded && <LoadingScreen />}
      <Suspense fallback={null}>
        <Canvas shadows onCreated={() => setIsLoaded(true)}>
          <Environment files="/hdri/B2B.hdr" background />
          <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            fov={isMobile ? 150 : 100} // Adjust fov for mobile devices
            position={[5, 0, 20]} // Edit this to change the default camera position
          />

          <Controls
            rotationSpeed={rotationSpeed}
            isMarketClicked={isMarketClicked}
            isRevivalClicked={isRevivalClicked}
            isMobile={isMobile}
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

          <mesh position={[33, 2, -20]} scale={2} rotation={[0, -20, 0]}>
            <B2BMelaTitle />
            <meshBasicMaterial color="black" />
          </mesh>

          <mesh position={[6, -3, -25]} scale={1} rotation={[0, .1, 0]}>
            <B2BMelaDescription />
            <meshBasicMaterial color="black" />
          </mesh>

          <mesh position={[-20, 2.5, 1.5]} scale={1} rotation={[0, 1.33, 0]}>
            <BrandRevivalTitle />
            <meshBasicMaterial color="black" />
          </mesh>

          <mesh position={[1.2, 12, 0]} rotation={[0, .28, 0]} onClick={handleLinkClick}>
            <ClickHereToRegister />
            <meshBasicMaterial color="yellow" />
          </mesh>

          <mesh position={[-20, -4, 18]} scale={.8} rotation={[0, 2, 0]}>
            <RevivalDescription/>
          </mesh>

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

          <mesh position={[0, 13, 0]} rotation={[0,.28,0]} onClick={handleLinkClick}>
          </mesh>
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
