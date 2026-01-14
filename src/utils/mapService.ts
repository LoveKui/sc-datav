/*
 * @Descripttion: 
 * @Author: duk
 * @Date: 2026-01-14 17:34:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2026-01-14 17:34:32
 */
/*
 * @Descripttion: 地图服务工具
 * @Author: duk
 * @Date: 2025-07-19 15:30:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-09-03 16:20:47
 */
import * as map3dduk from '@loveduk/map3d';
import * as Cesium from 'cesium';

// 地图实例
let mapInstance: map3dduk.Map | null = null;
// 地图是否准备就绪
let isMapReady = false;
// 等待地图准备就绪的回调队列
const readyCallbacks: Array<(map: map3dduk.Map) => void> = [];

/**
 * 设置地图实例
 * @param map 地图实例
 */
export const setMapInstance = (map: map3dduk.Map) => {
  mapInstance = map;
  isMapReady = true;

  // 执行所有等待的回调
  while (readyCallbacks.length > 0) {
    const callback = readyCallbacks.shift();
    if (callback) callback(map);
  }
};

/**
 * 获取地图实例
 * @returns 地图实例
 */
export const getMapInstance = (): map3dduk.Map | null => {
  return mapInstance;
};

/**
 * 检查地图是否准备就绪
 * @returns 地图是否准备就绪
 */
export const checkMapReady = (): boolean => {
  return isMapReady && mapInstance !== null;
};

/**
 * 当地图准备就绪时执行回调
 * @param callback 回调函数
 */
export const whenMapReady = (callback: (map: map3dduk.Map) => void) => {
  if (isMapReady && mapInstance) {
    callback(mapInstance);
  } else {
    readyCallbacks.push(callback);
  }
};

/**
 * 添加图层到地图
 * @param layer 图层
 */
export const addLayer = (layer: any) => {
  whenMapReady((map) => {
    map.addLayer(layer);
  });
};

/**
 * 根据ID移除图层
 * @param layerId 图层ID
 */
export const removeLayer = (layerId: string) => {
  whenMapReady((map) => {
    map.removeLayer(map.getLayerById(layerId), true);
  });
};

/**
 * 飞行到指定点
 * @param point 经纬度点
 */
export const flyToPoint = (point: map3dduk.LngLatPoint) => {
  whenMapReady((map) => {
    map.flyToPoint(point);
  });
};

/**
 * 创建图形图层
 * @param options 图层选项
 * @returns 图形图层
 */
export const createGraphicLayer = (options: GraphicLayer.Options) => {
  const layerId = options.id || `graphic-layer-${Date.now()}`;
  const graphicLayer = new map3dduk.layer.GraphicLayer({
    id: layerId,
    layerType: 'entity',
    ...options
  });

  whenMapReady((map) => {
    map.addLayer(graphicLayer);
  });

  return graphicLayer;
};

/**
 * 创建广告牌实体
 * @param position 位置
 * @param options 选项
 * @returns 广告牌实体
 */
export const createBillboard = (position: map3dduk.LngLatPoint, options: any = {}) => {
  return new map3dduk.graphic.BillboardEntity({
    position,
    show: true,
    style: {
      image: '/image/map2.png',
      height: 15,
      width: 20,
      scale: 3,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      ...options.style
    },
    attr: options.attr || {}
  });
};

/**
 * 显示基本信息点位
 * @param baseInfoList 基本信息列表
 * @param layerId 图层ID
 */
export const showBaseInfoPoints = (baseInfoList: APIDATACATALOG.BaseInfo[], layerId: string = 'baseinfo-layer') => {
  whenMapReady((map) => {
    // 先移除已有图层
    //   map?.removeLayerById(layerId);

    // 创建新图层
    const graphicLayer = new map3dduk.layer.GraphicLayer({
      id: layerId,
      layerType: 'entity',
    });

    // 添加点位
    baseInfoList.forEach((info) => {
      if (info?.options) {
        try {
          const { lng, lat, alt = 0 } = JSON.parse(info.options);
          const image = createBillboard(
            new map3dduk.LngLatPoint(lng, lat, alt + 50),
            {
              style: {
                label: {
                  text: info?.name,
                  color: 'yellow',
                  scale: 1,
                  hasPixelOffset: true,
                  pixelOffsetX: 10,
                  pixelOffsetY: -40,
                  heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                }
              },
              attr: { ...info }
            }
          );
          graphicLayer.addGraphic([image]);
        } catch (error) {
          console.error('解析点位信息失败:', error);
        }
      }
    });

    // 添加图层到地图
    map.addLayer(graphicLayer);

    // 添加点击事件
    graphicLayer.on(map3dduk.EventType.click, (e) => {
      if (e.graphic) {
        console.log('点击了点位:', e.graphic.attr);
        // 这里可以触发自定义事件或回调
      }
    });
  });
};



const addGraphicToLayer = (geojson: any, style: Record<string, string | number>, layer: map3dduk.layer.GraphicLayer, dataItem: any) => {

  const k = dataItem;

  const { features } = geojson;
  // 处理GeoJSON特性
  features.forEach((g, featureIndex) => {
    const { geometry, properties } = g;
    const { type } = geometry;

    // 处理几何集合类型
    if (type === "GeometryCollection") {
      // GeometryCollection包含多个几何体
      const { geometries } = geometry;
      geometries.forEach((geom, geomIndex) => {

        console.log(`${k.id}_${featureIndex}_${geomIndex}`, "多个个")


        const entityImage = processGeometry(geom,style, k, `${k.id}_${featureIndex}_${geomIndex}`, properties);


        if (entityImage) {
          layer?.addGraphic(entityImage);

        }
      });
    } else {

      console.log(`${k.id}_${featureIndex}`, "单个")
      // 处理单一几何体
      const entityImage = processGeometry(geometry,style, k, `${k.id}_${featureIndex}`, properties);

      if (entityImage) {
        layer?.addGraphic(entityImage);

      }
    }
  });

  // 处理几何体类型，返回创建的实体
  function processGeometry(geometry,style,dataItem, uniqueId, properties = {}) {
    const { type, coordinates } = geometry;

    // 根据几何类型分发到对应的处理函数
    switch (type) {
      case "Polygon":
        return createPolygon(coordinates[0],style, dataItem, uniqueId, properties);
      case "MultiPolygon":
        return processMultiGeometry(coordinates,style, createPolygon, dataItem, uniqueId, properties, "poly");
      case "Point":
        return createPoint(coordinates,style, dataItem, uniqueId, properties);
      case "MultiPoint":
        return processMultiGeometry(coordinates,style, createPoint, dataItem, uniqueId, properties, "point");
      case "Polyline":
      case "LineString":
        return createPolyline(coordinates,style, dataItem, uniqueId, properties);
      case "MultiLineString":
        return processMultiGeometry(coordinates,style, createPolyline, dataItem, uniqueId, properties, "line");
      default:
        console.warn(`不支持的几何类型: ${type}`);
        return null;
    }
  }

  // 处理多几何体集合
  function processMultiGeometry(coordinates,style, createFunc, dataItem, uniqueId, properties, suffix) {
    let lastEntity = null;
    coordinates.forEach((coords, index) => {
      const entity = createFunc(coords, style,dataItem, `${uniqueId}_${suffix}${index}`, properties);
      if (entity) lastEntity = entity;
    });
    return lastEntity;
  }

  // 创建多边形
  function createPolygon(coordinates,style, dataItem, uniqueId, properties) {
    const lnglatPoints = coordinates.map(coord =>
      new map3dduk.LngLatPoint(coord[0], coord[1], 0)
    );

    const entity = new map3dduk.graphic.PolygonEntity({
      positions: lnglatPoints,
      show: !!dataItem.show,
      attr: { ...dataItem, ...properties },
      id: "map" + uniqueId,
      style: {
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        outline: true,
        outlineStyle: {
          width: style.outlineWidth || 2,
          // outlineWidth: 10,
          color: style.outlineColor || Cesium.Color.RED,
        },
        fill: true,
        isClose: true,
        opacity: 0.1,
        color: Cesium.Color.YELLOW,

        // label: {
        //   text: properties?.name||dataItem?.name||dataItem?.title,
        //   color: "yellow",
        //   scale: 1,
        //   hasPixelOffset: true,
        //   pixelOffsetX: 10,
        //   pixelOffsetY: -40,
        //   heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        // },

      },
    });

    return entity;
  }

  // 创建点
  function createPoint(coordinates,style, dataItem, uniqueId, properties) {
    const entity = new map3dduk.graphic.BillboardEntity({
      position: new map3dduk.LngLatPoint(coordinates[0], coordinates[1], 0),
      show: !!dataItem.show,
      attr: { ...dataItem, ...properties },
      id: "map" + uniqueId,
      style: {
        image: '/image/map.png',
        height: 10,
        width: 15,
        scale: 3,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        label: {
          text: properties?.name || dataItem?.name,
          color: 'yellow',
          scale: 1,
          hasPixelOffset: true,
          pixelOffsetX: 10,
          pixelOffsetY: -40,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      },
    });

    return entity;
  }

  // 创建线
  function createPolyline(coordinates,style, dataItem, uniqueId, properties) {
    const lnglatPoints = coordinates.map(coord =>
      new map3dduk.LngLatPoint(coord[0], coord[1], 0)
    );

    const entity = new map3dduk.graphic.PolylineEntity({
      positions: lnglatPoints,
      show: !!dataItem.show,
      attr: { ...dataItem, ...properties },
      id: "map" + uniqueId,
      style: {
          width: style.outlineWidth || 2,
          // outlineWidth: 10,
          color: style.outlineColor || Cesium.Color.RED,
      },
    });

    return entity;
  }
}

export default {
  setMapInstance,
  getMapInstance,
  checkMapReady,
  whenMapReady,
  addLayer,
  removeLayer,
  flyToPoint,
  createGraphicLayer,
  createBillboard,
  showBaseInfoPoints,
  addGraphicToLayer
};