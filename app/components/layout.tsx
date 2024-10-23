import { COLORS } from "@/public/styles/colors";
import { MobileMaxWidth, MobileMinWidth } from "@/public/styles/size";
import { styled } from "styled-components";

type LayoutTypes = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  backgroundColor?: string;
  children: React.ReactNode;
};

type ContainerTypes = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const Layout = styled.div<{ backgroundColor?: string }>`
  position: relative;

  min-width: ${MobileMinWidth}px;
  max-width: ${MobileMaxWidth}px;
  width: 100%;
  min-height: 100dvh;

  background-color: ${(props) => props.backgroundColor ?? COLORS.primaryColor};

  border: 0;

  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (min-width: ${MobileMaxWidth + 1}px) {
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1), 2px 0 5px rgba(0, 0, 0, 0.1);
  }
`;

const Container = styled.div<ContainerTypes>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  height: calc(
    100% - (${(props) => props.top}px + ${(props) => props.bottom}px)
  );

  padding: ${(props) => props.top}px ${(props) => props.right}px
    ${(props) => props.bottom}px ${(props) => props.left}px;

  overflow-x: auto;
`;

const SpacerContainer = styled.div`
  flex-grow: 1;
`;

export const DefaultLayout = ({
  top,
  right,
  bottom,
  left,
  backgroundColor,
  children,
}: LayoutTypes) => {
  return (
    <Layout backgroundColor={backgroundColor}>
      <Container top={top} right={right} bottom={bottom} left={left}>
        <>{children}</>
      </Container>
    </Layout>
  );
};

export const Spacer = () => {
  return <SpacerContainer />;
};

const BottomPaddingBox = styled.div`
  display: block;
  width: 100%;
  height: 80px;

  background: transparent;
`;

export const BottomBox = () => {
  return <BottomPaddingBox />;
};
