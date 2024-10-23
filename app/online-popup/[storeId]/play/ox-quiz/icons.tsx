import { styled } from "styled-components";

type SVGTypes = {
  width: number | undefined;
  height: number | undefined;
};

const SVG = styled.svg`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
`;

export const IconOXGameO = ({ width, height }: SVGTypes) => {
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
    >
      <circle cx="50" cy="50" r="44" stroke="#27B1FF" stroke-width="12" />
    </SVG>
  );
};

export const IconOXGameX = ({ width, height }: SVGTypes) => {
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
    >
      <rect
        x="10.7144"
        width="126.269"
        height="15.1523"
        transform="rotate(45 10.7144 0)"
        fill="#F43529"
      />
      <rect
        x="100"
        y="10.7148"
        width="126.269"
        height="15.1523"
        transform="rotate(135 100 10.7148)"
        fill="#F43529"
      />
    </SVG>
  );
};
