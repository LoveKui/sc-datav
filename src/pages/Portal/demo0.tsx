import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, Stars } from "@react-three/drei";
import styled from "styled-components";
import { folder, Leva, useControls } from "leva";
import { AmbientLight, PointLight } from "./lights";
import Content from "./content";
import SCMap from "./scMap";
import { useEffect, useLayoutEffect, useRef } from "react";
import "@loveduk/map3d/dist/css/bundle.css";

import CesiumMap, { type MapRef } from "@/components/CesiumMap";
import { Button } from "antd";

import * as map3dduk from "@loveduk/map3d";

import * as Cesium from "cesium";
import { initData } from "./const";

let drawlayer = {} as map3dduk.layer.GraphicLayer;
const primitiveDrawlayer = {} as map3dduk.layer.GraphicLayer;
let templayer = {} as map3dduk.layer.GraphicLayer;

let tdtLayer = null;
const cacheManager = {};

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

  const mapRef = useRef<MapRef>(null);
  const mapCache = useRef<map3dduk.Map>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapCache.current = mapRef.current.getMap();

      const map = mapCache.current;

      const layer = new map3dduk.layer.GraphicLayer({
        id: "sss",
        layerType: "entity",
        isClose: true,
        eventParent: false,
        isContinued: false,
        isAutoEditing: false,
        contextmenuItems: [
          {
            icon: "fa-edit",
            text: "删除",
            show: true,
            callback: (e) => {
              if (e.graphic) {
                e.graphic.destroy(true);
              }
            },
          },
          {
            icon: "fa-edit",
            text: "编辑",
            show: true,
            callback: (e: MapEntityClick) => {
              if (e.graphic) {
                (e.graphic as map3dduk.graphic.LabelEntity).startEditing();
              }
            },
          },
          {
            icon: "fa-edit",
            text: "结束编辑",
            show: (e: MapEntityClick) => {
              console.log("show", e);
              return false;
            },
            callback: (e) => {
              if (e.graphic) {
                (e.graphic as map3dduk.graphic.LabelEntity).stopEditing();
              }
            },
          },
          {
            icon: "fa-edit",
            text: "GeoJson",
            show: () => {
              return true;
            },
            callback: (e) => {
              if (e.graphic) {
                console.log(
                  (e.graphic as map3dduk.graphic.LabelEntity).toGeoJSON()
                );
              }
            },
          },
        ],
        contextOptions: {
          offsetX: 0,
          offsetY: 0,
        },
      });

      map.addLayer(layer);
      drawlayer = layer;

      templayer = new map3dduk.layer.GraphicLayer({
        id: "temp",
        layerType: "entity",
        contextmenuItems: [
          {
            icon: "fa-edit",
            text: "删除",
            show: true,
            callback: (e) => {
              if (e.graphic) {
                e.graphic.destroy(true);
              }
            },
          },
          {
            icon: "fa-edit",
            text: "编辑",
            show: true,
            callback: (e: MapEntityClick) => {
              if (e.graphic) {
                (e.graphic as map3dduk.graphic.LabelEntity).startEditing();
              }
            },
          },
          {
            icon: "fa-edit",
            text: "结束编辑",
            show: (e: MapEntityClick) => {
              console.log("show", e);
              return false;
            },
            callback: (e) => {
              if (e.graphic) {
                (e.graphic as map3dduk.graphic.LabelEntity).stopEditing();
              }
            },
          },
          {
            icon: "fa-edit",
            text: "GeoJson",
            show: () => {
              return true;
            },
            callback: (e) => {
              if (e.graphic) {
                console.log(
                  (e.graphic as map3dduk.graphic.LabelEntity).toGeoJSON()
                );
              }
            },
          },
        ],
        contextOptions: {
          offsetX: 0,
          offsetY: 0,
        },
        highlight: {
          type: map3dduk.EventType.mouseMove,
          hightLightStyle: {
            height: 150,
            width: 150,
          },
        },
        // popupOptions,
      });


      map.addLayer(templayer);

      initData.forEach((k, index) => {
        if (k.type === "polygon") {
          const polygon = new map3dduk.graphic.PolygonEntity({
            id: k.id,
            positions: k.coordinates,

            popupOptions: {
              html: `<div class="waper">
                      <div class="title">${k.style.label?.text}</div>
                      <div class="content">
                        <div class="content-left"><img src="${
                          k.properties?.type === "live"
                            ? `images/people-${index + 1}.jpg`
                            : "images/glass.png"
                        }"/></div>
                          <div class="content-right">
                          <ul>
                          ${getContent(k)}
                          </ul>
                        </div>
                      </div>

              </div>`,
              template: "<div>{{content}}</div>",
              closeButton: true,
              className: "popup-people",
              width: 500,
              minHeight: 270,
              offsetX: 250,
              offsetY: 30,
            },
            style: {
              ...k.style,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              perPositionHeight: false,
              opacity: 0.3,
              highlight: {
                type: map3dduk.EventType.click,
                hightLightStyle: {
                  opacity: 0.8,
                },
              },

              label: {
                ...k.style.label,
                background: true,
                backgroundColor: "#454646",
                backgroundOpacity: 0.5,
                addHeight: 10,
                color: "white",
                heightReference: Cesium.HeightReference.NONE,
              },
            },
          });

          templayer.addGraphic(polygon);
        } else if (k.type === "polyline") {
          const polyline = new map3dduk.graphic.PolylineEntity({
            id: k.id,
            positions: k.coordinates,

            style: {
              ...k.style,
              width: 8,
              isClose: true,
              label: {},
              color: "yellow",
              // materialType: map3dduk.MaterialType.Other,
              // material: map3dduk.MaterialUtil.createMaterialProperty(
              //   map3dduk.MaterialType.Spriteline,
              //   {
              //     color: Cesium.Color.GREEN,
              //     // duration: 20000,
              //     duration: 1000,
              //     image: "images/line-arrow-dovetail.png",
              //   }
              // ),
            },
          });
          templayer.addGraphic(polyline);
        } else if (k.type === "billboard") {
          const [x, y, z] = k.coordinates;
          const point = new map3dduk.graphic.BillboardEntity({
            id: k.id,
            position: [x, y, 22.5],
            popupOptions: {
              html: `<div class="waper">
              <div class="title">${k.style.label?.text}</div>
              <div class="content"> 
                <div class="content-left">
                <video src='http://data.mars3d.cn/file/video/lukou.mp4' controls autoplay style="width: 230px;" ></video>
                
                </div>
                  
              </div>
           
      </div>`,
              template: "<div>{{content}}</div>",
              closeButton: true,
              className: "popup-camera",
              width: 400,
              minHeight: 250,
              offsetX: 150,
              offsetY: 30,
            },

            style: {
              ...k.style,
              label: {},

              image: k.style.image,
              width: 30,
              height: 30,
              highlight: {
                type: map3dduk.EventType.click,
                hightLightStyle: {
                  height: 50,
                  width: 50,
                },
              },
            },
          });

          templayer.addGraphic(point);
          // point.bindHighlight({
          //   type: map3dduk.EventType.mouseMove,
          //   hightLightStyle: {
          //     height: 150,
          //     width: 150,
          //   },
          // })
        }else if (k.type === "point") {
          const [x, y, z] = k.coordinates;
          const point = new map3dduk.graphic.BillboardEntity({
            id: k.id,
            position: k.coordinates,
            popupOptions: {
              html: `<div class="waper">
              <div class="title">${k.style.label?.text}</div>
              <div class="content"> 
                <div class="content-left">
                <video src='http://data.mars3d.cn/file/video/lukou.mp4' controls autoplay style="width: 230px;" ></video>
                
                </div>
                  
              </div>
           
      </div>`,
              template: "<div>{{content}}</div>",
              closeButton: true,
              className: "popup-camera",
              width: 400,
              minHeight: 250,
              offsetX: 150,
              offsetY: 30,
            },

            style: {
              ...k.style,
              

             
              highlight: {
                type: map3dduk.EventType.click,
                hightLightStyle: {
                  height: 50,
                  width: 50,
                },
              },
            },
          });

          templayer.addGraphic(point);
          // point.bindHighlight({
          //   type: map3dduk.EventType.mouseMove,
          //   hightLightStyle: {
          //     height: 150,
          //     width: 150,
          //   },
          // })
        }
      });
    }
  }, []);

  const handlerClick = () => {
    if (drawlayer) {
      (drawlayer as map3dduk.layer.GraphicLayer).startDraw({
        type: "billboard",
        style: {
          image: "images/police.png",
          height: 25,
          width: 20,
          scale: 1,
          label: {
            text: "3434343",
            scale: 1,
            color: "yellow",

            hasPixelOffset: true,
            pixelOffsetX: 10,
            pixelOffsetY: -40,
          },
        },
        success: (e: Graphic) => {
          console.log("我是绘制的", e);
          if (e) {
            (e as map3dduk.graphic.BillboardEntity)?.setStyle({
              label: {
                scale: 2,
              },
            });
          }
        },
      });
    }
  };

  const drawModelClick = () => {
    if (drawlayer) {
      (drawlayer as map3dduk.layer.GraphicLayer).startDraw({
        type: "model",
        style: {
          uri: "/data/shebei1.glb",
          scale: 5,
          label: {
            text: "3434343",
            scale: 1,
            color: "yellow",
            hasPixelOffset: true,
            pixelOffsetX: 10,
            pixelOffsetY: -40,
          },
        } as Partial<ModelEntityStyleOptionslGraphics>,

        success: (e: unknown) => {
          console.log("我是绘制的", e);
        },
      });
    }
  };

  const exportgeoJson = () => {
    console.log(drawlayer.toJSON());
    const b = drawlayer.toJSON();

    // 将 JSON 数据转换为字符串
    const jsonString = JSON.stringify(b);

    // 创建 Blob 对象
    const blob = new Blob([jsonString], { type: "application/json" });

    // 创建一个链接元素
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `config.json`; // 文件名

    // 触发下载
    link.click();

    // 释放 URL 对象
    URL.revokeObjectURL(link.href);
  };

  const removeLayer = () => {
    mapCache.current?.removeLayer(drawlayer, true);
    mapCache.current?.removeLayer(tdtLayer as map3dduk.layer.TdtLayer, true);

    drawlayer = null;
  };

  const removeAlllClick = () => {
    if (drawlayer) {
      drawlayer.removeAllGraphic();
    }
  };

  const drawEndClick = () => {
    if (drawlayer) {
      drawlayer.endEdit();
    }
  };

  const drawPolylinelClick = () => {
    if (drawlayer) {
      (drawlayer as map3dduk.layer.GraphicLayer).startDraw({
        type: "polyline",
        style: {
          color: "red",
          materialType: map3dduk.MaterialType.Color,
          clampToGround: true,
          // material: map3dduk.MaterialUtil.createMaterialProperty(
          //   map3dduk.MaterialType.Spriteline,
          //   {
          //     color: Cesium.Color.GREEN,
          //     // duration: 20000,
          //     duration: 1000,
          //     image: "/images/color1.png",
          //   }
          // ),

          label: {
            text: "3434343",
            scale: 1,
            color: "yellow",
            hasPixelOffset: true,
            pixelOffsetX: 10,
            pixelOffsetY: -40,
          },
        } as Partial<PolylineEntityStyleOptions>,

        success: (e: unknown) => {
          console.log("我是绘制的", e);
        },
      });
    }
  };

  const drawPolygonClick = () => {
    if (drawlayer) {
      (drawlayer as map3dduk.layer.GraphicLayer).startDraw({
        type: "polygon",

        style: {
          isClose: true,
          color: "red",
          materialType: map3dduk.MaterialType.Color,
          clampToGround: true,
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString("white"),
          outlineWidth: 2,
          classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
          outlineStyle: {
            clampToGround: true,
          },
        } as Partial<PolygonEntityStyleOptions>,

        success: (e: unknown) => {
          console.log("我是绘制的", e);
        },
      });
    }
  };

  const drawPointClick = () => {
    if (drawlayer) {
      (drawlayer as map3dduk.layer.GraphicLayer).startDraw({
        type: "point",
        style: {
          pixelSize: 15,
          outline: true,

          label: {
            text: "我是一个点",
            scale: 1,
            color: "yellow",
            hasPixelOffset: true,
            pixelOffsetX: 10,
            pixelOffsetY: -40,
          },
        } as Partial<PointEntityStyleOptions>,

        success: (e: unknown) => {
          console.log("我是绘制的", e);
        },
      });
    }
  };

  return (
    <div>
      <LevaBox>
        <Leva collapsed />
      </LevaBox>

      <div
        style={{
          position: "absolute",
          zIndex: 9999999,
          top: 0,
        }}
      >
        {/* */}
        {/* <Button onClick={drawPrimitiveLabelClick}>绘制图元文字</Button>
        <Button onClick={drawPrimitiveBillionClick}>绘制图元图标</Button> */}
        <Button onClick={drawPointClick}>绘制点</Button>
        <Button onClick={drawPolylinelClick}>绘制线</Button>

        <Button onClick={handlerClick}>绘制图标点</Button>
        {/* <Button onClick={drawModelClick}>绘制模型</Button>
        <Button onClick={drawPolygonClick}>绘制面</Button> */}
        <Button onClick={removeAlllClick}>清除</Button>

        <Button onClick={drawEndClick}>结束标会</Button>

        {/* <Button onClick={exportImageClick}>导出图片</Button> */}

        <Button onClick={exportgeoJson}>导出GEOJSON</Button>
        <Button onClick={removeLayer}>移除图层</Button>
        {/* <Button onClick={cacheSizeHandler}>计算缓存大小</Button>
        <Button onClick={swipeHandler}>卷帘分析</Button> */}
      </div>

      <Wrapper>
        <CanvasWrapper>
          <CesiumMap ref={mapRef} />
        </CanvasWrapper>

        <Content />
      </Wrapper>
    </div>
  );
}
