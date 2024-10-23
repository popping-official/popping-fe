import styled from "styled-components";
import { COLORS } from "@/public/styles/colors";
import { Range, getTrackBackground } from "react-range";

// DistanceRange 컴포넌트는 지도 범위 설정을 위한 컴포넌트입니다.
interface DistanceRangeProps {
  // Range 컴포넌트에서 정해질 value는 number[]여야 합니다. 원소가 1개여도 됩니다.
  distance: number[];
  // 범위의 최소값, 최대값, 그리고 step입니다.
  rangeMin: number;
  rangeMax: number;
  step: number;
  // onChange 핸들러를 정의하여 props로 내려주세요.
  onChange: (values: number[]) => void;
}

const DistanceRange: React.FC<DistanceRangeProps> = ({
  distance,
  rangeMin,
  rangeMax,
  step,
  onChange,
}) => {
  return (
    <>
      <Range
        label="Select your value"
        step={step}
        min={rangeMin}
        max={rangeMax}
        values={distance}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <StyledRange
            {...props}
            min={rangeMin}
            max={rangeMax}
            distance={distance}
          >
            {children}
          </StyledRange>
        )}
        renderThumb={({ props }) => <StyledThumb {...props} key={props.key} />}
      />
    </>
  );
};

const StyledRange = styled.div<{
  distance: number[];
  min: number;
  max: number;
}>`
  position: relative;
  height: 10px;
  width: 200px;
  border-radius: 4px;

  background: ${(props) =>
    // getTrackBackground는 thumb이 지나온 경로의 배경색에 대한 함수입니다.
    getTrackBackground({
      values: props.distance,
      colors: [COLORS.mainColor, COLORS.greyColor],
      min: props.min,
      max: props.max,
    })};
  align-self: center;
  cursor: default !important;
`;

const StyledThumb = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${COLORS.mainColor};
  border-radius: 50%;
`;

export default DistanceRange;
