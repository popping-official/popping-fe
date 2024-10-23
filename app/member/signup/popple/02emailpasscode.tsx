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
import { callEmailAuthApi } from "@/public/utils/function";
import { Loading } from "@/app/components/loading";

type StepType = {
  onNext: CallableFunction;
  authCode: string;
  email: string;
};

const StepEmailPasscode = ({ onNext, authCode, email }: StepType) => {
  const [valuePasscode, setValuePasscode] = useState<string>("");
  const [isValidPasscode, setIsValidPasscode] = useState<boolean>(false);
  const [code, setCode] = useState<string>(authCode);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resendableTime: number = 300;
  const [count, setCount] = useState<number>(resendableTime);
  const [isResendable, setIsResendable] = useState<boolean>(false);

  // 다음 버튼 클릭 핸들러
  const handleClickNext = () => {
    if (valuePasscode == code && isValidPasscode) {
      onNext(valuePasscode);
    } else {
      alert("인증번호가 일치하지 않습니다.");
    }
  };

  // 이메일 재전송 핸들러
  const handleBottomTextClick = async () => {
    // isResendable false 일때만 click 되도록 해놓을게연
    if (isResendable) {
      setIsLoading(true);
      const newAuthCode = await callEmailAuthApi(email);
      setCode(newAuthCode);
      setCount(resendableTime);
      setIsResendable(false);
      setIsLoading(false);
      alert("인증 메일이 재전송 되었습니다.");
    }
  };

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
      {isLoading && <Loading />}
      <MemberTitle>
        해당 이메일에 수신된
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
          bottomTextOnClick={handleBottomTextClick}
          onChange={(text: string) => {
            setValuePasscode(text.replace(RegexpInputAlphabetAndNumber, ""));
            setIsValidPasscode(text.length === 8);
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
          onClick={handleClickNext}
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

export default StepEmailPasscode;
