"use client";

import { COLORS } from "@/public/styles/colors";
import { styled } from "styled-components";

interface InputTypes {
  value: string;
  placeholder: string;
  type: string;
  maxLength: number | undefined;
  status: boolean | null;
  bottomText: string;
  bottomTextClickable: boolean;
  bottomTextOnClick: () => void;
  onChange: CallableFunction;
  onFocus: () => void;
  onBlur: () => void;
  disabled: boolean;
}

interface InputStatusTypes {
  color: string;
  clickable: boolean;
}

// 밑줄형
const InputUnderlineContainer = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
`;

const InputUnderlineInput = styled.input`
  width: 100%;

  padding: 2px 0;

  color: ${COLORS.secondaryColor};

  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  border: none;
  border-bottom: 2px solid ${COLORS.greyColor};
  outline: none;

  caret-color: ${COLORS.mainColor};

  transition: border 0.3s ease;

  &:focus {
    border-bottom: 2px solid ${COLORS.mainColor};
  }

  &::placeholder {
    color: ${COLORS.greyColor};
  }
`;

const InputUnderlineStatus = styled.span<InputStatusTypes>`
  color: ${(props) => props.color};

  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  cursor: ${(props) => (props.clickable ? "pointer" : "text")};
`;

export const InputUnderline = ({
  value,
  placeholder,
  type,
  maxLength,
  status,
  bottomText,
  bottomTextClickable,
  bottomTextOnClick,
  onChange,
  onFocus,
  onBlur,
  disabled,
}: InputTypes) => {
  return (
    <InputUnderlineContainer>
      <InputUnderlineInput
        value={value}
        placeholder={placeholder}
        required
        type={type}
        maxLength={maxLength}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
      />
      {bottomText != "" ? (
        <InputUnderlineStatus
          color={
            status != null
              ? status == true
                ? COLORS.mainColor
                : COLORS.statusNegativeColor
              : COLORS.greyColor
          }
          clickable={bottomTextClickable}
          onClick={bottomTextOnClick}
        >
          {bottomText}
        </InputUnderlineStatus>
      ) : null}
    </InputUnderlineContainer>
  );
};

// 곡률형
const InputRoundContainer = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

const InputRoundInput = styled.input`
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
  box-shadow: 0 0 0 1px ${COLORS.greyColor} inset;

  caret-color: ${COLORS.mainColor};

  transition: border 0.3s ease;

  &:focus {
    box-shadow: 0 0 0 1px ${COLORS.mainColor} inset;
  }

  &::placeholder {
    color: ${COLORS.greyColor};
  }

  &:disabled {
    background: ${COLORS.lightGreyColor};
  }
`;

const InputRoundStatus = styled.span<InputStatusTypes>`
  color: ${(props) => props.color};

  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  cursor: ${(props) => (props.clickable ? "pointer" : "text")};
`;

export const InputRound = ({
  value,
  placeholder,
  type,
  maxLength,
  status,
  bottomText,
  bottomTextClickable,
  bottomTextOnClick,
  onChange,
  onFocus,
  onBlur,
  disabled,
}: InputTypes) => {
  return (
    <InputRoundContainer>
      <InputRoundInput
        value={value}
        placeholder={placeholder}
        required
        type={type}
        maxLength={maxLength}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
      />
      {bottomText != "" ? (
        <InputRoundStatus
          color={
            status != null
              ? status == true
                ? COLORS.mainColor
                : COLORS.statusNegativeColor
              : COLORS.greyColor
          }
          clickable={bottomTextClickable}
          onClick={bottomTextOnClick}
        >
          {bottomText}
        </InputRoundStatus>
      ) : null}
    </InputRoundContainer>
  );
};
