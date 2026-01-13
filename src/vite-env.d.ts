/*
 * @Descripttion: 
 * @Author: duk
 * @Date: 2026-01-13 10:59:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2026-01-13 10:59:33
 */
/// <reference types="vite/client" />

declare global {
    module "*.css";
}

declare module 'uuid'
interface Window {
    viewer: unknown;
    Cesium: unknown;
    map: unknown;
    CESIUM_BASE_URL: string;
}
