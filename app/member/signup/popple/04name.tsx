import { ButtonLarge } from "@/app/components/buttons";
import { InputUnderline } from "@/app/components/inputs";
import {
  MemberBottomButtonContainer,
  MemberSignupForm,
  MemberTitle,
} from "@/app/components/member/components";
import { RegexpHangul, RegexpInputHangul } from "@/public/utils/regexp";
import { COLORS } from "@/public/styles/colors";
import { useEffect, useState } from "react";
import { styled } from "styled-components";

type StepType = {
  onNext: CallableFunction;
};

const StepName = ({ onNext }: StepType) => {
  const [valueName, setValueName] = useState<string>("");
  const [isNameFocused, setIsNameFocused] = useState<boolean | null>(null);
  const [isValidName, setIsValidName] = useState<boolean>(false);
  const [statusName, setStatusName] = useState<boolean | null>(null);
  const [bottomTextName, setbottomTextName] = useState<string>("");

  useEffect(() => {
    if (isNameFocused === false) {
      if (RegexpHangul.test(valueName)) {
        setStatusName(null);
        setbottomTextName("");
      } else {
        setStatusName(false);
        setbottomTextName("한글 이외는 입력할 수 없어요.");
      }
    } else {
      setStatusName(null);
      setbottomTextName("");
    }
  }, [isNameFocused]);

  return (
    <Container>
      <MemberTitle>이름을 입력해주세요</MemberTitle>

      <MemberSignupForm>
        <InputUnderline
          value={valueName}
          placeholder="이름"
          type="text"
          maxLength={12}
          status={statusName}
          bottomText={bottomTextName}
          bottomTextClickable={false}
          bottomTextOnClick={() => {}}
          onChange={(text: string) => {
            setValueName(text.replace(RegexpInputHangul, ""));
            setIsValidName(RegexpHangul.test(text) && text.length > 1);
          }}
          onFocus={() => {
            setIsNameFocused(true);
          }}
          onBlur={() => {
            setIsNameFocused(false);
          }}
          disabled={false}
        />
      </MemberSignupForm>

      <MemberBottomButtonContainer>
        <ButtonLarge
          text="다음"
          buttonColor={isValidName ? COLORS.mainColor : COLORS.greyColor}
          textColor={COLORS.primaryColor}
          onClick={() => {
            if (isValidName === true) {
              onNext(valueName);
            }
          }}
        />
      </MemberBottomButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
`;

export default StepName;
