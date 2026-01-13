import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, Stars } from "@react-three/drei";
import styled from "styled-components";
import { folder, Leva, useControls } from "leva";
import { AmbientLight, PointLight } from "./lights";
import Content from "./content";
import SCMap from "./scMap";
import { useEffect, useRef } from "react";
import * as map3dduk from "@loveduk/map3d";
import "@loveduk/map3d/dist/css/bundle.css";
// import {
//   Graphic,
//   MapEntityClick,
//   ModelEntityStyleOptions,
//   ModelEntityStyleOptionslGraphics,
//   PointEntityStyleOptions,
//   PolygonEntityStyleOptions,
//   PolylineEntityStyleOptions,
//   PopupStyleOptions,
// } from "@loveduk/map3d/dist/@types/Duk3dMap";
import * as Cesium from "cesium";

import CacheManager from "@loveduk/cache-manager";

window.CESIUM_BASE_URL = "lib/Cesium/";

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
  const controls = useControls({
    网格: folder({
      infiniteGrid: { label: "显示网格", value: true },
      cellColor: { label: "单元格颜色", value: "#6f6f6f" },
      sectionColor: { label: "分区颜色", value: "#7fe5a8" },
    }),
    GBackground: { label: "背景颜色", value: "#26282a" },
  });
  const mapCache = useRef<map3dduk.Map>(null);
  const handlerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapCache.current) {
      const acache = new CacheManager({
        storeUrls: ["/city/images/", "/mapdata/"],
        expireTime: 15,
      });

      const map = new map3dduk.Map("map", {
        terrain: {
          show: false,
          // url: "/terrain",
        },

        control: {
          compass: false,
        },
        basemaps: [
          {
            type: map3dduk.LayerType.tdt,
            layer: "img_d",
            imageryThemeGL: {
              enabled: false,
              invert: true,
              bgColor: "rgb(60,145,255)",
              filterRGB: [60, 145, 255],
              // filterRGB: [74, 100 ,213],
              type: 1,
            },
          },
          {
            type: map3dduk.LayerType.tdt,
            layer: "img_z",
            imageryThemeGL: {
              enabled: false,
              invert: false,
              // bgColor: "rgb(60,145,255)",

              filterRGB: [60, 145, 255],
              // filterRGB: [74, 100, 213],
              type: 1,
            },
          },
        ],
      });

      map.changeMouseModel(true);

      map.addControl(new map3dduk.control.LocationBar());
      // map.addControl(new map3dduk.control.SwitchMode());
      // map.addControl(new map3dduk.control.EagleEyeMap());

      map.viewer.scene.globe.depthTestAgainstTerrain = false;

      handlerRef.current = new Cesium.ScreenSpaceEventHandler(
        map.viewer.canvas
      );
    }
  }, []);

  return (
    <div>
      <LevaBox>
        <Leva collapsed />
      </LevaBox>

      <Wrapper>
        <CanvasWrapper>
          <div id="map"></div>
          {/* <Canvas camera={{ fov: 70 }} dpr={[1, 2]}>
            <color attach="background" args={[controls.GBackground]} />
            <Grid
              infiniteGrid={controls.infiniteGrid}
              scale={2}
              cellSize={0.3}
              cellThickness={0.6}
              sectionSize={1.5}
              sectionThickness={1.5}
              sectionColor={controls.sectionColor}
              cellColor={controls.cellColor}
              fadeDistance={30}
            />
            <AmbientLight />
            <PointLight />
            <Stars fade count={1000} factor={8} saturation={0} speed={2} />
            <SCMap />
            <OrbitControls
              enablePan
              enableZoom
              enableRotate
              zoomSpeed={0.3}
              minDistance={10}
              maxDistance={20}
              maxPolarAngle={1.5}
            />
          </Canvas> */}
        </CanvasWrapper>

        <Content />
      </Wrapper>
    </div>
  );
}
