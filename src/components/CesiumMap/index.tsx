/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2026-01-14 16:20:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2026-01-14 17:36:32
 */
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useLayoutEffect,
} from "react";

import * as Cesium from "cesium";

import CacheManager from "@loveduk/cache-manager";
import * as map3dduk from "@loveduk/map3d";
import mapService from "@/utils/mapService";

window.CESIUM_BASE_URL = "lib/Cesium/";
interface Props {}
interface Ref {
  getMap: () => map3dduk.Map | null;
}
const Index = forwardRef<Ref, Props>((props, ref) => {
  const mapCache = useRef<map3dduk.Map>(null);
  const handlerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) {
      return;
    }
    if (!mapCache.current) {
      const acache = new CacheManager({
        storeUrls: ["/city/images/", "/mapdata/"],
        expireTime: 15,
      });
      // 中国大致经纬度范围
      const chinaRectangle = Cesium.Rectangle.fromDegrees(
        73.5, // 西经度
        18.0, // 南纬度
        135.0, // 东经度
        53.5 // 北纬度
      );

      const map = new map3dduk.Map("map", {
        terrain: {
          show: false,
          // url: "/terrain",
        },

        control: {
          compass: true,
          cesiumNavigation: {
            enableCompass: true,
            defaultResetView: chinaRectangle,
          },
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

      //   map.addControl(new map3dduk.control.LocationBar());
      map.addControl(new map3dduk.control.SwitchMode());
      //   map.addControl(new map3dduk.control.EagleEyeMap());

      map.viewer.scene.globe.depthTestAgainstTerrain = false;

      handlerRef.current = new Cesium.ScreenSpaceEventHandler(
        map.viewer.canvas
      );
      mapCache.current = map;

      // 设置地图实例到mapService
      mapService.setMapInstance(map);
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      getMap() {
        return mapCache.current;
      },
    }),
    []
  );
  return (
    <div
      id="map"
      style={{ width: "100%", height: "100%" }}
      ref={containerRef}
    ></div>
  );
});
export default Index;
