import { ButtonLarge } from "@/app/components/buttons";
import { InputUnderline } from "@/app/components/inputs";
import {
  MemberBottomButtonContainer,
  MemberSignupForm,
  MemberTitle,
} from "@/app/components/member/components";
import { RegexpInputAlphabetAndNumber } from "@/public/utils/regexp";
import { COLORS } from "@/public/styles/colors";
import { useEffect, useState } from "react";
import { styled } from "styled-components";

type StepType = {
  onNext: CallableFunction;
};

const StepPhonePasscode = ({ onNext }: StepType) => {
  const [valuePasscode, setValuePasscode] = useState<string>("");
  const [isValidPasscode, setIsValidPasscode] = useState<boolean>(false);

  const resendableTime: number = 18;
  const [count, setCount] = useState<number>(resendableTime);
  const [isResendable, setIsResendable] = useState<boolean>(false);

  useEffect(() => {
    if (isResendable === false) {
      const timer = setInterval(() => {
        setCount((count) => count - 1);
      }, 1000);

      if (count <= 0) {
        clearInterval(timer);
      }

      return () => clearInterval(timer);
    }
  }, [isResendable]);

  useEffect(() => {
    if (count <= 0) {
      setIsResendable(true);
    }
  }, [count]);

  return (
    <Container>
      <MemberTitle>
        해당 전화번호에 수신된
        <br />
        인증번호를 입력해주세요
      </MemberTitle>

      <MemberSignupForm>
        <InputUnderline
          value={valuePasscode}
          placeholder="인증번호"
          type="text"
          maxLength={8}
          status={null}
          bottomText={
            isResendable
              ? "인증번호 재전송"
              : `${String(Math.floor(count / 60)).padStart(2, "0")}:${String(
                  Math.floor(count % 60)
                ).padStart(2, "0")} 후에 재전송 가능`
          }
          bottomTextClickable={isResendable}
          bottomTextOnClick={() => {
            setCount(resendableTime);
            setIsResendable(false);
          }}
          onChange={(text: string) => {
            setValuePasscode(text.replace(RegexpInputAlphabetAndNumber, ""));
            setIsValidPasscode(valuePasscode.length === 8);
          }}
          onFocus={() => {}}
          onBlur={() => {}}
          disabled={false}
        />
      </MemberSignupForm>

      <MemberBottomButtonContainer>
        <ButtonLarge
          text="다음"
          buttonColor={isValidPasscode ? COLORS.mainColor : COLORS.greyColor}
          textColor={COLORS.primaryColor}
          onClick={() => {
            if (isValidPasscode) {
              onNext(valuePasscode);
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

export default StepPhonePasscode;
