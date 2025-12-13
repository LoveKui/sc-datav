import styled from "styled-components";
import Content from "./content";
import Map from "./3Dmap";

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

export default function Index() {
  return (
    <Wrapper>
      <Map />
      <Content />
    </Wrapper>
  );
}
