import { COLORS } from "@/public/styles/colors";
import { styled } from "styled-components";
import { IconRoundTriangle, IconX } from "./icons";

type selectTypes = {
  placeholder: string;
  value: string | null;
  isFocus: boolean;
  onClick: () => void;
};

type SelectDivType = {
  isFocus: boolean;
};

// 밑줄형
const SelectUnderlineDiv = styled.div<SelectDivType>`
  position: relative;
  width: 100%;

  padding: 2px 0;

  color: ${COLORS.secondaryColor};

  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  border: none;
  border-bottom: 2px solid
    ${(props) => (props.isFocus ? COLORS.mainColor : COLORS.greyColor)};
  outline: none;

  transition: border 0.3s ease;

  cursor: pointer;

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

const SelectUnderlinePlaceholder = styled.p`
  color: ${COLORS.greyColor};
`;

const SelectUnderlineTriangleContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%) rotate(-180deg);
`;

export const SelectUnderline = ({
  placeholder,
  value,
  isFocus,
  onClick,
}: selectTypes) => {
  return (
    <SelectUnderlineDiv isFocus={isFocus} onClick={onClick}>
      {value ? (
        <p>{value}</p>
      ) : (
        <SelectUnderlinePlaceholder>{placeholder}</SelectUnderlinePlaceholder>
      )}
      <SelectUnderlineTriangleContainer>
        <IconRoundTriangle
          color={COLORS.greyColor}
          width={undefined}
          height={10}
        />
      </SelectUnderlineTriangleContainer>
    </SelectUnderlineDiv>
  );
};

// 곡률형
const SelectRoundDiv = styled.div<SelectDivType>`
  position: relative;
  width: 100%;

  padding: 16px 12px;

  color: ${COLORS.secondaryColor};

  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  box-sizing: border-box;

  border: none;
  outline: none;
  border-radius: 8px;
  box-shadow: 0 0 0 1px
    ${(props) => (props.isFocus ? COLORS.mainColor : COLORS.greyColor)} inset;

  caret-color: ${COLORS.mainColor};

  transition: box-shadow 0.3s ease;

  cursor: pointer;

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

const SelectRoundPlaceholder = styled.p`
  color: ${COLORS.greyColor};
`;

const SelectRoundTriangleContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translate(0, -50%) rotate(-180deg);
`;

export const SelectRound = ({
  placeholder,
  value,
  isFocus,
  onClick,
}: selectTypes) => {
  return (
    <SelectRoundDiv isFocus={isFocus} onClick={onClick}>
      {value ? (
        <p>{value}</p>
      ) : (
        <SelectRoundPlaceholder>{placeholder}</SelectRoundPlaceholder>
      )}
      <SelectRoundTriangleContainer>
        <IconRoundTriangle
          color={COLORS.greyColor}
          width={undefined}
          height={10}
        />
      </SelectRoundTriangleContainer>
    </SelectRoundDiv>
  );
};

// 하단 섹션
interface SelectBottomSectionTypes {
  title: string;
  onClose: () => void;
  options: string[];
  onBackgroundClick: () => void;
  onClick: CallableFunction;
  isVisible: boolean;
}

const BottomSectionBackground = styled.div<{ isVisible: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);

  left: 0;
  top: 0;

  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  transition: visibility 0.3s, opacity 0.3s ease-in-out;

  z-index: 2;

  overflow: hidden;
`;

const BottomSection = styled.div<{ isVisible: boolean }>`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background: ${COLORS.primaryColor};
  border-radius: 16px 16px 0px 0px;
  transition: transform 0.3s ease-in-out;
  transform: translateY(${(props) => (props.isVisible ? "0%" : "100%")});
  z-index: 3;
`;

const BottomSectionContainer = styled.div`
  padding: 16px 24px 16px 24px;
`;

const BottomSectionTitleContainer = styled.div`
  position: relative;
  padding: 20px 0;
`;

const BottomSectionTitle = styled.p`
  color: ${COLORS.secondaryColor};
  text-align: center;

  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const BottomSectionCloseContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  right: 0;
`;

const BottomSectionOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;

  max-height: 65dvh;
  overflow-y: scroll;
`;

const BottomSectionOption = styled.p`
  color: ${COLORS.secondaryColor};

  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  cursor: pointer;
`;

export const SelectBottomSection = ({
  title,
  onClose,
  options,
  onBackgroundClick,
  onClick,
  isVisible,
}: SelectBottomSectionTypes) => {
  return (
    <BottomSectionBackground onClick={onBackgroundClick} isVisible={isVisible}>
      <BottomSection isVisible={isVisible}>
        <BottomSectionContainer>
          <BottomSectionTitleContainer>
            <BottomSectionTitle>{title}</BottomSectionTitle>
            <BottomSectionCloseContainer onClick={onClose}>
              <IconX
                color={COLORS.secondaryColor}
                width={undefined}
                height={16}
              />
            </BottomSectionCloseContainer>
          </BottomSectionTitleContainer>

          <BottomSectionOptionsContainer>
            {options.map((text: string, index: number) => (
              <BottomSectionOption
                key={index}
                onClick={() => {
                  onClick(text);
                }}
              >
                {text}
              </BottomSectionOption>
            ))}
          </BottomSectionOptionsContainer>
        </BottomSectionContainer>
      </BottomSection>
    </BottomSectionBackground>
  );
};
