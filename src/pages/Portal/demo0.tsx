import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, Stars } from "@react-three/drei";
import styled from "styled-components";
import { folder, Leva, useControls } from "leva";
import { AmbientLight, PointLight } from "./lights";
import Content from "./content";
import SCMap from "./scMap";
import { useEffect, useLayoutEffect, useRef } from "react";
import "@loveduk/map3d/dist/css/bundle.css";

import CesiumMap from "@/components/CesiumMap";


const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #26282a;
`;

const CanvasWrapper = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

const LevaBox = styled.div`
  .leva-c-kWgxhW-bCBHqk-fill-false {
    right: 80px;
  }
`;


export default function SichuanMap() {
  // const controls = useControls({
  //   网格: folder({
  //     infiniteGrid: { label: "显示网格", value: true },
  //     cellColor: { label: "单元格颜色", value: "#6f6f6f" },
  //     sectionColor: { label: "分区颜色", value: "#7fe5a8" },
  //   }),
  //   GBackground: { label: "背景颜色", value: "#26282a" },
  // });

  return (
    <div>
      <LevaBox>
        <Leva collapsed />
      </LevaBox>

      <Wrapper>
        <CanvasWrapper>
          <CesiumMap />
        </CanvasWrapper>

        <Content />
      </Wrapper>
    </div>
  );
}
