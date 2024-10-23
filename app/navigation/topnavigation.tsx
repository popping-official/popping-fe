import { COLORS } from "@/public/styles/colors";
import styled from "styled-components";

type TopNavTypes = {
  children: React.ReactNode;
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0px;

  position: relative;

  width: 100%;
  height: 60px;

  background: ${COLORS.primaryColor};

  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;

export const TopNavigation = ({ children }: TopNavTypes) => {
  return <Container>{children}</Container>;
};
