import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useMapStyleStore } from "./stores";
import useMoveTo from "@/hooks/useMoveTo";
import AutoFit from "@/components/autoFit";
import Button from "@/components/button";
import Chart1 from "./chart1";
import Chart2 from "./chart2";
import Chart3 from "./chart3";
import Chart4 from "./chart4";
import { Typography } from "antd";

import bg from "@/assets/card_bg.jpg";
import topBg from "@/assets/images/top-bg.png";
import { Space } from "antd";

import logo from "@/assets/images/logo512.png";

import Header from "./Components/Header";
import styles from "./index.module.less";
import type { MenuMode } from "@/types/map";
import { mapDataConfig } from "./const";

const { Title: TitleText } = Typography;

const GridWrapper = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(4, minmax(0, 1fr));
  gap: 20px;
  padding: 20px;
`;

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  pointer-events: auto;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(141, 141, 141, 0.2);
  border-radius: 4px;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url(${bg});
    background-size: 100px;
    opacity: 0.2;
    border-radius: 0px;
    z-index: -1;
    z-index: -1;
  }
`;

const Title = styled.div`
  font-family: "pmzd";
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 36px;
  letter-spacing: 0px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #ffffff;
  padding-left: 120px;
  margin-top: -10px;
`;

const CardTitle = styled.div`
  font-family: "pmzd";
  font-size: 28px;
  padding: 8px 16px;
`;

const BottomBox = styled.div`
  position: absolute;
  pointer-events: auto;
  bottom: 20px;
  left: 50%;
  display: flex;
  gap: 20px;
`;

export default function Content() {
  const radialRef = useRef<HTMLDivElement>(null!);
  const topBox = useMoveTo("toBottom", 0.6, 1);
  const leftBox = useMoveTo("toRight", 0.8, 1.5);
  const leftBox1 = useMoveTo("toRight", 0.8, 1.5);
  const rightBox = useMoveTo("toLeft", 0.8, 1.5);
  const rightBox1 = useMoveTo("toLeft", 0.8, 1.5);
  const bottomBox = useMoveTo("toTop", 0.8, 1.5, "translateX(-50%)");

  const togglePureMode = useMapStyleStore((s) => s.togglePureMode);
  const toggleMapStyle = useMapStyleStore((s) => s.toggleMapStyle);

  const toggleMenuMode = useMapStyleStore((s) => s.toggleMenuMode);

  const topShowRef = useRef<boolean>(false);

  const [menuModeState, setMenuModeState] = useState<MenuMode>("overview");

  useEffect(() => {
    let initial = true;
    bottomBox.restart(initial);

    const unSub2 = useMapStyleStore.subscribe(
      (s) => ({
        menuMode: s.menuMode,
      }),
      (v) => {
        const { menuMode } = v;

        setMenuModeState(menuMode);
      },
      { fireImmediately: true }
    );

    const unSub = useMapStyleStore.subscribe(
      (s) => ({
        pureMode: s.pureMode,
      }),
      (v) => {
        const { pureMode } = v;
        if (!pureMode) {
          if (!topShowRef.current) {
            topBox.restart(initial);
          }
          leftBox.restart(initial);
          leftBox1.restart(initial);
          rightBox.restart(initial);
          rightBox1.restart(initial);
          // radialRef.current.style.setProperty("opacity", "1");

          topShowRef.current = true;
        } else {
          topBox.reverse();
          leftBox.reverse();
          leftBox1.reverse();
          rightBox.reverse();
          rightBox1.reverse();
          // radialRef.current.style.setProperty("opacity", "0");
        }
      },
      { fireImmediately: true }
    );

    initial = false;

    return () => {
      initial = true;
      unSub();
      unSub2();
      topShowRef.current = false;
    };
  }, []);

  return (
    <AutoFit>
      <Header ref={topBox.ref} />
      <GridWrapper>
        <Card ref={leftBox.ref} style={{ gridArea: "1 / 1 / 3 / 2" }}>
          <>
            <CardTitle>{mapDataConfig[menuModeState].title}</CardTitle>
            <div className={styles.infoDiv}>
              {mapDataConfig[menuModeState].info.map((k) => (
                <TitleText style={{ color: "white" }} level={4}>
                  {k}
                </TitleText>
              ))}
            </div>
          </>

          {/* <Chart1 /> */}
        </Card>
        {/* <Card ref={leftBox1.ref} style={{ gridArea: "3 / 1 / 5 / 2" }}>
          <CardTitle>进出口商品品类贸易值</CardTitle>
          <Chart2 />
        </Card>
        <Card ref={rightBox.ref} style={{ gridArea: "1 / 4 / 3 / 5" }}>
          <CardTitle style={{ textAlign: "right" }}>三产季度增加值</CardTitle>
          <Chart3 />
        </Card>
        <Card ref={rightBox1.ref} style={{ gridArea: "3 / 4 / 5 / 5" }}>
          <CardTitle style={{ textAlign: "right" }}>进出口商品信息</CardTitle>
          <Chart4 />
        </Card> */}

        <BottomBox ref={bottomBox.ref}>
          <Button
            style={{ width: 150 }}
            onClick={() => {
              toggleMenuMode("overview");
            }}
          >
            概览
          </Button>
          <Button
            style={{ width: 150 }}
            onClick={() => {
              toggleMenuMode("responsePlan");
            }}
          >
            应急预案
          </Button>
        </BottomBox>
      </GridWrapper>
    </AutoFit>
  );
}
