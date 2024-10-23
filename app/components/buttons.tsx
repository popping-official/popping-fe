import { COLORS } from "@/public/styles/colors";
import styled from "styled-components";

type ButtonTypes = {
  text: string;
  buttonColor: string;
  borderWidth?: number;
  borderColor?: string;
  textColor: string;
  onClick: () => void;
};

type ButtonStyleTypes = {
  buttonColor: string;
  borderWidth?: number;
  borderColor?: string;
  textColor: string;
};

const SmallButton = styled.div<ButtonStyleTypes>`
  border-radius: 4px;
  background: ${(props) => props.buttonColor};

  box-shadow: 0 0 0 ${(props) => props.borderWidth}px
    ${(props) => props.borderColor} inset;

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

  p {
    padding: 8px 12px;

    color: ${(props) => props.textColor};
    text-align: center;

    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

export const ButtonSmall = ({
  text,
  buttonColor,
  borderWidth,
  borderColor,
  textColor,
  onClick,
}: ButtonTypes) => {
  return (
    <SmallButton
      buttonColor={buttonColor}
      borderWidth={borderWidth}
      borderColor={borderColor}
      textColor={textColor}
      onClick={onClick}
    >
      <p>{text}</p>
    </SmallButton>
  );
};

const LargeButton = styled.div<ButtonStyleTypes>`
  width: 100%;
  border-radius: 8px;
  background: ${(props) => props.buttonColor};

  box-shadow: 0 0 0 ${(props) => props.borderWidth}px
    ${(props) => props.borderColor} inset;

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

  p {
    padding: 16px 0;

    color: ${(props) => props.textColor};
    text-align: center;

    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

export const ButtonLarge = ({
  text,
  buttonColor,
  borderWidth,
  borderColor,
  textColor,
  onClick,
}: ButtonTypes) => {
  return (
    <LargeButton
      buttonColor={buttonColor}
      borderWidth={borderWidth}
      borderColor={borderColor}
      textColor={textColor}
      onClick={onClick}
    >
      <p>{text}</p>
    </LargeButton>
  );
};
