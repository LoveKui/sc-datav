/*
 * @Descripttion: 
 * @Author: duk
 * @Date: 2026-01-13 10:59:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2026-01-13 23:43:38
 */
/// <reference types="vite/client" />

declare global {
    module "*.css";
}

declare module "*.less" {
    const content: { [className: string]: string };
    export default content;
  }

declare module 'uuid'
interface Window {
    viewer: unknown;
    Cesium: unknown;
    map: unknown;
    CESIUM_BASE_URL: string;
}
