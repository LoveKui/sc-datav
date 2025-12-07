import { useMemo } from "react";
import { Billboard, Line, Text, useTexture } from "@react-three/drei";
import {
  Box2,
  DoubleSide,
  RepeatWrapping,
  Shape,
  Vector2,
  Vector3,
} from "three";
import { useMapStyleStore } from "./stores";
import ShapeBox from "./shape";
import type { GeoProjection } from "d3-geo";
import type { CityGeoJSON } from "./map";

import scMapData from "@/assets/sc.json";
import textureMap from "@/assets/sc_map.png";
import scNormalMap from "@/assets/sc_normal_map.png";
import scDisplacementMap from "@/assets/sc_displacement_map.png";

const data = scMapData as CityGeoJSON;

export default function BaseMap({ projection }: { projection: GeoProjection }) {
  const newStyle = useMapStyleStore((s) => s.newStyle);
  const [texture1, texture2, texture3] = useTexture(
    [textureMap, scNormalMap, scDisplacementMap],
    (tex) =>
      tex.forEach((el) => {
        el.wrapS = el.wrapT = RepeatWrapping;
      })
  );

  const { citys, regions, bbox } = useMemo(() => {
    const citys: { name: string; center: Vector3 }[] = [];
    const regions: Vector2[][] = [];
    const bbox = new Box2();

    const toV2 = (coord: number[]) => {
      const [x, y] = projection(coord as [number, number])!;
      const projected = new Vector2(x, -y);
      bbox.expandByPoint(projected);
      return projected;
    };

    data.features.forEach((feature) => {
      const [x, y] = projection(
        feature.properties.centroid ?? feature.properties.center
      )!;
      citys.push({
        name: feature.properties.name,
        center: new Vector3(x, -y),
      });

      feature.geometry.coordinates.forEach((polygonSet) => {
        const rings = polygonSet.reduce<Vector2[]>((pre, coordinates) => {
          return [...pre, ...coordinates.map(toV2)];
        }, []);

        regions.push(rings);
      });
    });

    return {
      citys,
      regions,
      bbox,
    };
  }, [projection]);

  return newStyle ? (
    <group renderOrder={0} position={[0, 0, 0.51]}>
      {regions.map((reg, i) => (
        <group key={`new` + i}>
          <ShapeBox bbox={bbox} args={[new Shape(reg)]}>
            <meshStandardMaterial
              map={texture1}
              normalMap={texture2}
              displacementMap={texture3}
              metalness={0.2}
              roughness={0.5}
              side={DoubleSide}
            />
          </ShapeBox>
        </group>
      ))}
      <group position={[0, 0, 0.6]}>
        {citys.map((item, index) => {
          return (
            <Billboard key={"city_" + index} position={item.center}>
              <Text color="#ffffff" fontSize={0.3} fontWeight={600}>
                {item.name}
              </Text>
            </Billboard>
          );
        })}
      </group>
    </group>
  ) : (
    <group renderOrder={0} position={[0, 0, 0.51]}>
      {regions.map((reg, i) => (
        <group key={i}>
          <ShapeBox bbox={bbox} args={[new Shape(reg)]}>
            <meshStandardMaterial
              map={texture1}
              normalMap={texture2}
              metalness={0.2}
              roughness={0.5}
              side={DoubleSide}
            />
          </ShapeBox>

          <Line
            position={[0, 0, 0.01]}
            points={reg}
            linewidth={1}
            color="#a7a7a7"
          />
        </group>
      ))}
      <group position={[0, 0, 0.2]}>
        {citys.map((item, index) => {
          return (
            <Billboard key={"city_" + index} position={item.center}>
              <Text color="#ffffff" fontSize={0.3} fontWeight={600}>
                {item.name}
              </Text>
            </Billboard>
          );
        })}
      </group>
    </group>
  );
}
