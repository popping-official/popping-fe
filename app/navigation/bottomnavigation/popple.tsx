import { COLORS } from "@/public/styles/colors";
import { styled } from "styled-components";
import {
  IconCenter,
  IconHome,
  IconLikes,
  IconMap,
  IconMypage,
  IconOnlinePopupStore,
} from "../icons";
import { MobileMaxWidth, MobileMinWidth } from "@/public/styles/size";

type BottomNavTypes = {
  onClick: CallableFunction;
  currentIndex: number;
};

export const BottomNavigationPopple = ({
  onClick,
  currentIndex,
}: BottomNavTypes) => {
  return (
    <Container>
      {/* 온라인 팝업 */}
      <Menu
        onClick={() => {
          onClick(0);
        }}
      >
        <MenuContainer>
          <IconOnlinePopupStore
            color={
              currentIndex === 0 ? COLORS.secondaryColor : COLORS.greyColor
            }
          />
          <p>스토어</p>
        </MenuContainer>
      </Menu>
      {/* 팝업 지도 */}
      <Menu
        onClick={() => {
          onClick(1);
        }}
      >
        <MenuContainer>
          <IconMap
            color={
              currentIndex === 1 ? COLORS.secondaryColor : COLORS.greyColor
            }
          />
          <p>팝업 지도</p>
        </MenuContainer>
      </Menu>
      {/* 중앙 */}
      <Menu>
        <MenuCenterContainer
          onClick={() => {
            onClick(2);
          }}
        >
          <IconCenter />
        </MenuCenterContainer>
      </Menu>
      {/* 관심 */}
      <Menu
        onClick={() => {
          onClick(3);
        }}
      >
        <MenuContainer>
          <IconLikes
            color={
              currentIndex === 3 ? COLORS.secondaryColor : COLORS.greyColor
            }
          />
          <p>관심</p>
        </MenuContainer>
      </Menu>
      {/* 마이페이지 */}
      <Menu
        onClick={() => {
          onClick(4);
        }}
      >
        <MenuContainer>
          <IconMypage
            color={
              currentIndex === 4 ? COLORS.secondaryColor : COLORS.greyColor
            }
          />
          <p>MY</p>
        </MenuContainer>
      </Menu>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;

  transform: translate(-50%, 0);

  display: flex;
  flex-direction: row;
  gap: 0px;

  border-radius: 20px 20px 0px 0px;

  /* 아래, 위, 왼, 오 */
  box-shadow: 0 0 0 0 ${COLORS.greyColor} inset,
    0 1px 0 0 ${COLORS.greyColor} inset, 1px 0 0 0 ${COLORS.greyColor} inset,
    -1px 0 0 0 ${COLORS.greyColor} inset;

  min-width: ${MobileMinWidth}px;
  max-width: ${MobileMaxWidth}px;
  width: 100%;
  height: 58px;

  background: ${COLORS.primaryColor};

  z-index: 6;

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

const Menu = styled.div`
  position: relative;
  flex: 1;
  height: 100%;

  cursor: pointer;
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  gap: 4px;

  svg {
    width: auto;
    height: 21px;
  }

  p {
    color: ${COLORS.secondaryColor};
    text-align: center;

    font-size: 8px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

const MenuCenterContainer = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translate(-50%, 0);
`;
