import { use, useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  RepeatWrapping,
  SRGBColorSpace,
  type Mesh,
} from "three";
import loadTexture from "./helpers/loadTexture";

import guangquan01 from "@/assets/guangquan01.png";
import huiguang from "@/assets/huiguang.png";

export interface CityBarProps {
  position?: ThreeElements["group"]["position"];
  value?: number;
  children?: React.ReactNode | ((barHeight: number) => React.ReactNode);
}
const textures = Promise.all([
  loadTexture(guangquan01),
  loadTexture(huiguang, (tex) => {
    tex.colorSpace = SRGBColorSpace;
    tex.wrapS = tex.wrapT = RepeatWrapping;
  }),
]);

export default function CityBar(props: CityBarProps) {
  const {
    position,
    value = Math.floor(Math.random() * 1000) + 100,
    children,
  } = props;
  const factor = 0.7;
  const height = 4.0 * factor;
  const max = 1000;
  let dirMap = { x: 1.0, y: 2.0, z: 3.0 };

  const uColor1 = 0xfbdf88;
  const uColor2 = 0xea580c;
  const dir = "y";

  const quanRef = useRef<Mesh>(null!);
  const [texture1, texture2] = use(textures);

  const barHeight = useMemo(() => {
    return height * (value / max);
  }, []);

  useFrame(() => {
    quanRef.current.rotation.z += 0.05;
  });

  return (
    <group position={position}>
      <mesh
        renderOrder={5}
        position={[0, 0, barHeight / 2]}
        raycast={() => null}>
        <mesh renderOrder={10} rotation-x={Math.PI / 2} raycast={() => null}>
          <planeGeometry args={[0.35, barHeight]} />
          <meshBasicMaterial
            transparent
            color={uColor2}
            map={texture2}
            opacity={0.4}
            depthWrite={false}
            side={DoubleSide}
            blending={AdditiveBlending}
          />
        </mesh>
        <mesh
          renderOrder={10}
          rotation-x={Math.PI / 2}
          rotation-y={(Math.PI / 180) * 60}
          raycast={() => null}>
          <planeGeometry args={[0.35, barHeight]} />
          <meshBasicMaterial
            transparent
            color={uColor2}
            map={texture2}
            opacity={0.4}
            depthWrite={false}
            side={DoubleSide}
            blending={AdditiveBlending}
          />
        </mesh>
        <mesh
          renderOrder={10}
          rotation-x={Math.PI / 2}
          rotation-y={(Math.PI / 180) * 120}
          raycast={() => null}>
          <planeGeometry args={[0.35, barHeight]} />
          <meshBasicMaterial
            transparent
            color={uColor2}
            map={texture2}
            opacity={0.4}
            depthWrite={false}
            side={DoubleSide}
            blending={AdditiveBlending}
          />
        </mesh>
        <boxGeometry
          args={[0.1 * factor, 0.1 * factor, barHeight]}
          translate={[0, 0, barHeight / 2]}
        />
        <meshBasicMaterial
          transparent
          color="#ffffff"
          opacity={1}
          depthTest={false}
          fog={false}
          onBeforeCompile={(shader) => {
            shader.uniforms = {
              ...shader.uniforms,
              uColor1: { value: new Color(uColor1) },
              uColor2: { value: new Color(uColor2) },
              uDir: { value: dirMap[dir] },
              uSize: { value: barHeight },
            };

            shader.vertexShader = shader.vertexShader.replace(
              "void main() {",
              `
                attribute float alpha;
                varying vec3 vPosition;
                varying float vAlpha;
                void main() {
                  vAlpha = alpha;
                  vPosition = position;
              `
            );
            shader.fragmentShader = shader.fragmentShader.replace(
              "void main() {",
              `
                varying vec3 vPosition;
                varying float vAlpha;
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                uniform float uDir;
                uniform float uSize;

                void main() {
              `
            );
            shader.fragmentShader = shader.fragmentShader.replace(
              "#include <opaque_fragment>",
              /* glsl */ `
              #ifdef OPAQUE
              diffuseColor.a = 1.0;
              #endif

              // https://github.com/mrdoob/three.js/pull/22425
              #ifdef USE_TRANSMISSION
              diffuseColor.a *= transmissionAlpha + 0.1;
              #endif
              // vec3 gradient = mix(uColor1, uColor2, vPosition.x / 15.0);
              vec3 gradient = vec3(0.0,0.0,0.0);
              if(uDir==1.0){
                gradient = mix(uColor1, uColor2, vPosition.x/ uSize);
              }else if(uDir==2.0){
                gradient = mix(uColor1, uColor2, vPosition.z/ uSize);
              }else if(uDir==3.0){
                gradient = mix(uColor1, uColor2, vPosition.y/ uSize);
              }
              outgoingLight = outgoingLight * gradient;

              gl_FragColor = vec4( outgoingLight, diffuseColor.a  );
              `
            );
          }}
        />
      </mesh>
      <mesh renderOrder={6} ref={quanRef} raycast={() => null}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial
          transparent
          color={0xffffff}
          map={texture1}
          alphaMap={texture1}
          opacity={1}
          depthTest={false}
          fog={false}
          blending={AdditiveBlending}
        />
      </mesh>
      {typeof children === "function" ? children?.(barHeight) : children}
    </group>
  );
}

// export default function CityBar({
//   position,
//   value = Math.floor(Math.random() * 1000) + 100,
// }: {
//   position?: [number, number, number];
//   value?: number;
// }) {
//   const barSize = 0.3;
//   const maxHeight = 3;

//   const scale = maxHeight / 1000;
//   const height = value * scale;

//   const colors = [
//     "#ff6b6b",
//     "#4ecdc4",
//     "#45b7d1",
//     "#96ceb4",
//     "#feca57",
//     "#ff9ff3",
//     "#54a0ff",
//   ];
//   const colorIndex = Math.floor((value / 1000) * colors.length) % colors.length;
//   const color = colors[colorIndex];

//   return (
//     <group position={position}>
//       <group rotation={[Math.PI / 2, 0, 0]}>
//         <mesh position={[0, height / 2, 0]}>
//           <cylinderGeometry args={[barSize / 2, barSize / 2, height, 16]} />
//           <meshStandardMaterial
//             transparent
//             opacity={0.8}
//             color={color}
//             metalness={0.3}
//             roughness={0.4}
//           />
//         </mesh>
//       </group>
//     </group>
//   );
// }
