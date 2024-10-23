import { COLORS } from "@/public/styles/colors";
import styled from "styled-components";

type TabsTypes = {
  values: string[];
  selected: string;
  onSelect: CallableFunction;
};

const TapsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;

  margin-bottom: 24px;
`;

const Tap = styled.div<{ isSelect: boolean }>`
  flex: 1;
  border-radius: 8px;

  background: ${(props) =>
    props.isSelect ? COLORS.mainColor : COLORS.primaryColor};

  box-shadow: 0 0 0 1px
    ${(props) => (props.isSelect ? "transparent" : COLORS.greyColor)} inset;

  cursor: pointer;

  p {
    padding: 12px 0%;

    color: ${(props) =>
      props.isSelect ? COLORS.primaryColor : COLORS.secondaryColor};
    text-align: center;

    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

export const Taps = ({ values, selected, onSelect }: TabsTypes) => {
  return (
    <TapsContainer>
      {values.map((value, index) => (
        <Tap
          key={index}
          isSelect={value === selected}
          onClick={() => {
            onSelect(index);
          }}
        >
          <p>{value}</p>
        </Tap>
      ))}
    </TapsContainer>
  );
};
