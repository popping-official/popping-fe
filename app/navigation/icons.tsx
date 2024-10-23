import { styled } from "styled-components";
import Image from "next/image";
import ImageCenter from "@/public/images/popping-orange.png";

type SVGTypes = {
  color: string;
};

const SVG = styled.svg`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
`;

export const IconHome = ({ color }: SVGTypes) => {
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      width={undefined}
      height={21}
      viewBox="0 0 20 21"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.6802 0.77723C10.2852 0.356178 9.61666 0.356178 9.22163 0.777231L0.272699 10.3157C-0.314593 10.9417 0.108921 11.9588 0.950686 11.9987C0.950686 11.9991 0.950684 11.9996 0.950684 12V19C0.950684 20.1046 1.84611 21 2.95068 21H6.95068C7.50297 21 7.95068 20.5523 7.95068 20V15C7.95068 14.4477 8.3984 14 8.95068 14H10.9507C11.503 14 11.9507 14.4477 11.9507 15V20C11.9507 20.5523 12.3984 21 12.9507 21H16.9507C18.0553 21 18.9507 20.1046 18.9507 19V12C18.9507 11.9996 18.9507 11.9991 18.9507 11.9987C19.7928 11.9592 20.2165 10.9418 19.6291 10.3157L10.6802 0.77723Z"
        fill={color}
      />
    </SVG>
  );
};

export const IconMap = ({ color }: SVGTypes) => {
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      width={undefined}
      height={21}
      viewBox="0 0 15 21"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 7.35177C0 3.29196 3.35923 0 7.50201 0C11.6448 0 15 3.29196 15.004 7.35177C15.004 12.0771 7.50201 21.0039 7.50201 21.0039C7.50201 21.0039 0 12.0771 0 7.35177ZM4.82233 7.29782C4.84944 5.86797 6.03634 4.72136 7.50201 4.72136C8.98473 4.72136 10.1822 5.89481 10.1822 7.34783C10.1822 7.36693 10.182 7.38599 10.1815 7.40499C10.1526 8.83101 8.96401 9.9783 7.50193 9.9783C6.02172 9.9783 4.82178 8.80238 4.82178 7.35182C4.82178 7.33378 4.82196 7.31577 4.82233 7.29782Z"
        fill={color}
      />
    </SVG>
  );
};

export const IconLikes = ({ color }: SVGTypes) => {
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      width={undefined}
      height={21}
      viewBox="0 0 21 20"
      fill="none"
    >
      <path
        d="M0.01 6.62898C0.01 6.45898 0.01 6.28898 0.01 6.11898C0.01 6.06898 0.03 6.01898 0.04 5.96898C0.07 5.72898 0.08 5.47898 0.12 5.23898C0.6 2.36898 2.92 0.198979 5.76 0.0189794C7.44 -0.0910206 8.94 0.39898 10.28 1.44898C10.36 1.51898 10.44 1.57898 10.52 1.64898C10.54 1.62898 10.55 1.62898 10.56 1.61898C11.62 0.698979 12.84 0.158979 14.22 0.0289794C15.52 -0.0910206 16.75 0.158979 17.89 0.828979C20.29 2.22898 21.45 5.02898 20.85 7.88898C20.61 9.03898 20.12 10.069 19.5 11.039C18.7 12.279 17.73 13.379 16.71 14.429C14.94 16.259 13.06 17.959 11.2 19.689C10.76 20.099 10.25 20.099 9.81 19.689C9.16 19.079 8.51 18.469 7.86 17.859C6.36 16.459 4.86 15.059 3.48 13.529C2.62 12.579 1.82 11.589 1.18 10.469C0.62 9.48898 0.22 8.44898 0.07 7.31898C0.04 7.08898 0.02 6.85898 0 6.62898H0.01Z"
        fill={color}
      />
    </SVG>
  );
};

export const IconMypage = ({ color }: SVGTypes) => {
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      width={undefined}
      height={21}
      viewBox="0 0 20 21"
      fill="none"
    >
      <path
        d="M10.5 11C13.5376 11 16 8.53757 16 5.5C16 2.46243 13.5376 0 10.5 0C7.46243 0 5 2.46243 5 5.5C5 8.53757 7.46243 11 10.5 11Z"
        fill={color}
      />
      <path
        d="M3.47826 12H16.5217C17.4442 12 18.3289 12.4214 18.9812 13.1716C19.6335 13.9217 20 14.9391 20 16V21H0V16C0 14.9391 0.366459 13.9217 1.01876 13.1716C1.67106 12.4214 2.55577 12 3.47826 12Z"
        fill={color}
      />
    </SVG>
  );
};

const IconCenterContainer = styled.div<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
`;

export const IconCenter = () => {
  return (
    <IconCenterContainer width={62} height={62}>
      <Image src={ImageCenter.src} alt={""} width={62} height={62} />
    </IconCenterContainer>
  );
};

export const IconOnlinePopupStore = ({ color }: SVGTypes) => {
  return (
    <SVG
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={undefined}
      height={21}
      viewBox="0 0 21 21"
      fill="none"
    >
      <path
        d="M20.9,6.5c0-0.1,0-0.2-0.1-0.4l-2.4-4.8C18.3,1,18,0.9,17.7,0.9H3.3C3,0.9,2.7,1,2.6,1.3L0.2,6.1
 C0.1,6.2,0.1,6.3,0.1,6.5v0.8c0,0.9,0.4,1.7,0.9,2.2v5.2v3.5c0,1.1,0.9,2,2,2h15c1.1,0,2-0.9,2-2v-3.5V9.5c0.6-0.6,0.9-1.4,0.9-2.2
 V6.5z M17.9,14.7H3.1c-0.1,0-0.2-0.1-0.2-0.2v-4c0.2,0,0.3,0,0.5,0c1,0,1.8-0.4,2.4-1.1c0.6,0.7,1.4,1.1,2.4,1.1
 c1,0,1.8-0.4,2.4-1.1c0.6,0.7,1.4,1.1,2.4,1.1s1.8-0.4,2.4-1.1c0.6,0.7,1.4,1.1,2.4,1.1c0.2,0,0.3,0,0.5,0v4
 C18.2,14.5,18.1,14.7,17.9,14.7z"
        fill={color}
      />
    </SVG>
  );
};

/*
const BubbleContainer = styled.div`
  position: relative;

  svg {
    z-index: 0;
  }

  p {
    width: 100%;

    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;

    color: ${COLORS.mainColor};
    text-align: center;
    
    font-size: 11px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

export const Bubble = () => {
  return (
    <BubbleContainer>
      <SVG
        xmlns="http://www.w3.org/2000/svg"
        width="auto"
        height="34"
        viewBox="0 0 104 34"
        fill="none"
      >
        <path
          d="M1 4C1 2.34315 2.34315 1 4 1H100C101.657 1 103 2.34315 103 4V23.1587C103 24.6529 101.9 25.9194 100.421 26.129L52.4209 32.9304C52.1417 32.9699 51.8583 32.9699 51.5791 32.9304L3.57912 26.129C2.09965 25.9194 1 24.6529 1 23.1587V4Z"
          fill={COLORS.primaryColor}
          stroke={COLORS.mainColor}
          strokeWidth="2"
        />
      </SVG>
      <p></p>
    </BubbleContainer>
  );
};
*/
