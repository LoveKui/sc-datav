import styled from "styled-components";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Content from "./content";
import Lights from "./lights";

import Scene from "./scene";

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

const CanvasWrapper = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

export default function Index() {
  return (
    <Wrapper>
      <CanvasWrapper>
        <Canvas
          flat
          shadows
          camera={{ position: [0, 10, 20], fov: 50 }}
          dpr={[1, 2]}>
          <color attach="background" args={["#fff5e8"]} />
          <Lights />

          <Scene />

          <ContactShadows
            opacity={0.2}
            scale={20}
            blur={0.01}
            far={10}
            resolution={256}
            color="#000000"
            position={[0, -0.01, 0]}
          />

          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            zoomSpeed={0.3}
            minDistance={10}
            maxDistance={20}
            maxPolarAngle={1.5}
          />
        </Canvas>
      </CanvasWrapper>
      <Content />
    </Wrapper>
  );
}
