import { COLORS } from "@/public/styles/colors";
import { styled } from "styled-components";

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);

  left: 0;
  top: 0;

  z-index: 10;

  overflow: hidden;
`;

const SpinnerContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);
`;

const Spinner = styled.span`
  width: 48px;
  height: 48px;
  border: 5px dotted ${COLORS.mainColor};
  border-radius: 50%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  animation: rotation 2s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Loading = () => {
  return (
    <Background>
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
    </Background>
  );
};
