import { use, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Color,
  Mesh,
  NormalBlending,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";
import loadTexture from "./helpers/loadTexture";

import rotationBorder1 from "@/assets/rotationBorder1.png";
import rotationBorder2 from "@/assets/rotationBorder2.png";
import gaoguang1 from "@/assets/gaoguang1.png";
import gridBlack from "@/assets/gridBlack.png";
import grid from "@/assets/grid.png";

const textures = Promise.all([
  loadTexture(gaoguang1, (tex) => {
    tex.colorSpace = SRGBColorSpace;
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(1, 1);
  }),
  loadTexture(grid, (tex) => {
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(80, 80);
  }),
  loadTexture(gridBlack, (tex) => {
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(80, 80);
  }),
  loadTexture(rotationBorder1),
  loadTexture(rotationBorder2),
]);

export default function Bottom() {
  const meshRef0 = useRef({
    uTime: {
      value: 0.0,
    },
    uSpeed: {
      value: 10.0,
    },
    uWidth: {
      value: 20.0,
    },
    uColor: {
      value: new Color(0xea580c),
    },
    uDir: {
      value: 2.0, // 1.0-xy,2.0-xz
    },
  });
  const meshRef1 = useRef<Mesh>(null!);
  const meshRef2 = useRef<Mesh>(null!);

  const [
    gaoGuang1Tex,
    gridTex,
    gridBlackTex,
    rotationBorder1Tex,
    rotationBorder2Tex,
  ] = use(textures);

  //   const [gridTex, gridBlackTex] = useTexture([grid, gridBlack], (tex) =>
  //     tex.forEach((el) => {
  //       el.wrapS = el.wrapT = RepeatWrapping;
  //       el.repeat.set(80, 80);
  //     })
  //   );

  //   const [rotationBorder1Tex, rotationBorder2Tex] = useTexture([
  //     rotationBorder1,
  //     rotationBorder2,
  //   ]);

  useFrame((_state, delta) => {
    meshRef0.current.uTime.value += delta;
    if (meshRef0.current.uTime.value > 100 / 10) {
      meshRef0.current.uTime.value = 0.0;
    }
    meshRef1.current.rotation.z += 0.001;
    meshRef2.current.rotation.z += -0.004;
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <mesh>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial
          transparent
          blending={NormalBlending}
          map={gaoGuang1Tex}
          color="#fbdf88"
        />
      </mesh>
      <mesh ref={meshRef1} position={[0, 0, 0.01]}>
        <planeGeometry args={[16, 16]} />
        <meshBasicMaterial
          transparent
          map={rotationBorder1Tex}
          color="#fbdf88"
          opacity={0.2}
          depthWrite={false}
          blending={NormalBlending}
        />
      </mesh>
      <mesh ref={meshRef2} position={[0, 0, 0.01]}>
        <planeGeometry args={[15, 15]} />
        <meshBasicMaterial
          transparent
          map={rotationBorder2Tex}
          color="#fbdf88"
          opacity={0.4}
          depthWrite={false}
          blending={NormalBlending}
        />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial
          transparent
          map={gridTex}
          alphaMap={gridBlackTex}
          color="#fbdf88"
          opacity={0.1}
          depthWrite={false}
          blending={NormalBlending}
        />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial
          transparent
          map={gridTex}
          alphaMap={gridBlackTex}
          color="#ea580c"
          opacity={0.5}
          depthWrite={false}
          blending={NormalBlending}
          onBeforeCompile={(shader) => {
            shader.uniforms = {
              ...shader.uniforms,
              ...meshRef0.current,
            };
            shader.vertexShader = shader.vertexShader.replace(
              "void main() {",
              /* glsl */ `
            varying vec3 vPosition;
            void main(){
              vPosition = position;
          `
            );
            shader.fragmentShader = shader.fragmentShader.replace(
              "void main() {",
              /* glsl */ `
            uniform float uTime;
            uniform float uSpeed;
            uniform float uWidth;
            uniform vec3 uColor;
            uniform float uDir;
            varying vec3 vPosition;
            
            void main(){
          `
            );
            shader.fragmentShader = shader.fragmentShader.replace(
              "#include <opaque_fragment>",
              /* glsl */ `
            #ifdef OPAQUE
            diffuseColor.a = 1.0;
            #endif
            
            #ifdef USE_TRANSMISSION
            diffuseColor.a *= material.transmissionAlpha;
            #endif
            
            float r = uTime * uSpeed;
            //光环宽度
            float w = 0.0; 
            if(w>uWidth){
              w = uWidth;
            }else{
              w = uTime * 5.0;
            }
            //几何中心点
            vec2 center = vec2(0.0, 0.0); 
            // 距离圆心的距离

            float rDistance = distance(vPosition.xz, center);
            if(uDir==2.0){
              rDistance = distance(vPosition.xy, center);
            }
            if(rDistance > r && rDistance < r + 2.0 * w) {
              float per = 0.0;
              if(rDistance < r + w) {
                per = (rDistance - r) / w;
                outgoingLight = mix(outgoingLight, uColor, per);
                // 获取0->透明度的插值
                float alphaV = mix(0.0,diffuseColor.a,per);
                gl_FragColor = vec4(outgoingLight,  alphaV);
              } else {
                per = (rDistance - r - w) / w;
                outgoingLight = mix(uColor, outgoingLight, per);
                // 获取0->透明度的插值
                float alphaV = mix(diffuseColor.a,0.0,per);
                gl_FragColor = vec4(outgoingLight,  alphaV);
              }
            } else {
              gl_FragColor = vec4(outgoingLight, 0.0);
            }
          `
            );
          }}
        />
      </mesh>
    </group>
  );
}
