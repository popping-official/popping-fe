import { ButtonLarge } from "@/app/components/buttons";
import { InputUnderline } from "@/app/components/inputs";
import {
  MemberBottomButtonContainer,
  MemberSignupForm,
  MemberTitle,
} from "@/app/components/member/components";
import { RegexpNickname } from "@/public/utils/regexp";
import { COLORS } from "@/public/styles/colors";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { duplicateCheckApi } from "@/public/utils/function";

type StepType = {
  onNext: CallableFunction;
};

const StepBrand = ({ onNext }: StepType) => {
  const [valueBrand, setValueBrand] = useState<string>("");
  const [isBrandFocused, setIsBrandFocused] = useState<boolean | null>(null);
  const [isValidBrand, setIsValidBrand] = useState<boolean>(false);
  const [statusBrand, setStatusBrand] = useState<boolean | null>(null);
  const [bottomTextBrand, setbottomTextBrand] = useState<string>("");

  // 브랜드 네임 입력시 실행되는 onBlur 핸들러
  const handleBrandNameValidation = async () => {
    if (RegexpNickname.test(valueBrand)) {
      // 정규식이 유효할 경우 중복 api를 호출.
      const isExist = await duplicateCheckApi(valueBrand, "nickname");
      setStatusBrand(!isExist);
      setIsValidBrand(!isExist);
      if (isExist) {
        setbottomTextBrand("이미 사용중인 브랜드 이름 입니다.");
      } else {
        setbottomTextBrand("사용가능한 브랜드 이름 입니다.");
      }
    } else {
      setStatusBrand(false);
      setIsValidBrand(false);
      setbottomTextBrand("입력할 수 없는 문자가 포함되어 있습니다.");
    }
  };

  useEffect(() => {
    if (isBrandFocused === false) {
      handleBrandNameValidation();
    } else {
      setStatusBrand(null);
      setbottomTextBrand("");
    }
  }, [isBrandFocused]);

  return (
    <Container>
      <MemberTitle>브랜드 이름을 입력해주세요</MemberTitle>

      <MemberSignupForm>
        <InputUnderline
          value={valueBrand}
          placeholder="브랜드명(최대 25자)"
          type="text"
          maxLength={25}
          status={statusBrand}
          bottomText={bottomTextBrand}
          bottomTextClickable={false}
          bottomTextOnClick={() => {}}
          onChange={(text: string) => {
            setValueBrand(text);
            setIsValidBrand(RegexpNickname.test(text) && text.length > 1);
          }}
          onFocus={() => {
            setIsBrandFocused(true);
          }}
          onBlur={() => {
            setIsBrandFocused(false);
          }}
          disabled={false}
        />
      </MemberSignupForm>

      <MemberBottomButtonContainer>
        <ButtonLarge
          text="다음"
          buttonColor={isValidBrand ? COLORS.mainColor : COLORS.greyColor}
          textColor={COLORS.primaryColor}
          onClick={() => {
            if (isValidBrand === true) {
              onNext(valueBrand);
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

export default StepBrand;
