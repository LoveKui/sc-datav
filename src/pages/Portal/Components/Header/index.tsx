/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2026-01-13 23:17:50
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2026-01-14 00:00:16
 */
import React from "react";
interface Props {}
import styles from "./index.module.less";
import { Space } from "antd";
import TimeDisplay from "@/components/TimeDisplay";
import styled from "styled-components";
import logo from "@/assets/images/logo512.png";

const Index: React.FC<Props> = () => {
  const LogoImg = styled.img`
    width: 35px;
    height: 35px;
  `;

  return (
    <div className={styles.headerWapper}>
      <div className={styles.title}>杨浦五角场</div>

      <Space>
        <LogoImg src={logo} />
        <div>杨浦公安</div>
        <TimeDisplay />
      </Space>
    </div>
  );
};

export default Index;
