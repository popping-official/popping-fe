import { ButtonLarge } from "@/app/components/buttons";
import { InputUnderline } from "@/app/components/inputs";
import {
  MemberBottomButtonContainer,
  MemberSignupForm,
  MemberTitle,
} from "@/app/components/member/components";
import { RegexpInputNumber, RegexpPhone } from "@/public/utils/regexp";
import { COLORS } from "@/public/styles/colors";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { duplicateCheckApi } from "@/public/utils/function";

type StepType = {
  onNext: CallableFunction;
};

const StepPhone = ({ onNext }: StepType) => {
  const [valuePhone, setValuePhone] = useState<string>("");
  const [isPhoneFocused, setIsPhoneFocused] = useState<boolean | null>(null);
  const [isValidPhone, setIsValidPhone] = useState<boolean>(false);
  const [statusPhone, setStatusPhone] = useState<boolean | null>(null);
  const [bottomTextPhone, setbottomTextPhone] = useState<string>("");

  // 번호 입력시 실행되는 onBlur 핸들러
  const handleBrandNameValidation = async () => {
    if (RegexpPhone.test(valuePhone)) {
      // 정규식이 유효할 경우 중복 api를 호출.
      const isExist = await duplicateCheckApi(valuePhone, "phone");
      setStatusPhone(!isExist);
      setIsValidPhone(!isExist);
      if (isExist) {
        setbottomTextPhone("이미 이용중인 유저가 있는 전화번호 입니다.");
      }
    } else {
      setStatusPhone(false);
      setIsValidPhone(false);
      setbottomTextPhone("전화번호 서식에 맞지 않습니다.");
    }
  };

  useEffect(() => {
    if (isPhoneFocused === false) {
      handleBrandNameValidation();
    } else {
      setStatusPhone(null);
      setbottomTextPhone("");
    }
  }, [isPhoneFocused]);

  return (
    <Container>
      <MemberTitle>전화번호를 입력해주세요</MemberTitle>

      <MemberSignupForm>
        <InputUnderline
          value={valuePhone}
          placeholder="전화번호(숫자만 입력)"
          type="text"
          maxLength={undefined}
          status={statusPhone}
          bottomText={bottomTextPhone}
          bottomTextClickable={false}
          bottomTextOnClick={() => {}}
          onChange={(text: string) => {
            setValuePhone(text.replace(RegexpInputNumber, ""));
            setIsValidPhone(RegexpPhone.test(text));
          }}
          onFocus={() => {
            setIsPhoneFocused(true);
          }}
          onBlur={() => {
            setIsPhoneFocused(false);
          }}
          disabled={false}
        />
      </MemberSignupForm>

      <MemberBottomButtonContainer>
        <ButtonLarge
          text="다음"
          buttonColor={isValidPhone ? COLORS.mainColor : COLORS.greyColor}
          textColor={COLORS.primaryColor}
          onClick={() => {
            if (isValidPhone === true) {
              onNext(valuePhone);
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

export default StepPhone;
