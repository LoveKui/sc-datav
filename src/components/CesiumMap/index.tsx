/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2026-01-14 16:20:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2026-01-15 16:24:54
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
export  interface MapRef {
  getMap: () => map3dduk.Map | null;
}
const Index = forwardRef<MapRef, Props>((props, ref) => {
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
      // map.addControl(new map3dduk.control.SwitchMode());
      //   map.addControl(new map3dduk.control.EagleEyeMap());

      // map.viewer.scene.globe.depthTestAgainstTerrain = false;

      handlerRef.current = new Cesium.ScreenSpaceEventHandler(
        map.viewer.canvas
      );
      mapCache.current = map;


      const tilesetLayer = new map3dduk.layer.TilesetLayer({
        //url:"http://hongtu.shenzhuo.vip:54953/mapdata/3dtiles/nxgerui/map/3dt/tileset.json",
        // url: "http://hongtu.shenzhuo.vip:54953/mapdata/3dtiles/mdj3DTEILS/tileset.json",
        // url:"http://111.229.72.197/mapdata/3dtiles/%E4%B8%9C%E5%8C%97%E6%A8%A1%E5%9E%8B/tileset.json",

        url:"http://111.229.72.197/mapdata/3dtiles/terra_b3dms/tileset.json",
        position: {
          alt: 0,
          // alt: -2,
        },
        maximumScreenSpaceError:1

      });

      map.addLayer(tilesetLayer);
      tilesetLayer.show = true;

      tilesetLayer.on(map3dduk.EventType.load, () => {
        tilesetLayer.flyTo();
      });

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
