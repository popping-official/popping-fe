import { ButtonLarge } from "@/app/components/buttons";
import { InputUnderline } from "@/app/components/inputs";
import {
  MemberBottomButtonContainer,
  MemberSignupForm,
  MemberTitle,
} from "@/app/components/member/components";
import { RegexpPassword } from "@/public/utils/regexp";
import { COLORS } from "@/public/styles/colors";
import { useEffect, useState } from "react";
import { styled } from "styled-components";

type StepType = {
  onNext: CallableFunction;
};

const StepPassword = ({ onNext }: StepType) => {
  // 비밀번호
  const [valuePassword, setValuePassword] = useState<string>("");
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean | null>(
    null
  );
  const [statusPassword, setStatusPassword] = useState<boolean | null>(null);
  const [bottomTextPassword, setbottomTextPassword] = useState<string>("");

  // 비밀번호 확인
  const [valuePasswordConfirm, setValuePasswordConfirm] = useState<string>("");
  const [isPasswordConfirmFocused, setIsPasswordConfirmFocused] = useState<
    boolean | null
  >(null);
  const [statusPasswordConfirm, setStatusPasswordConfirm] = useState<
    boolean | null
  >(null);
  const [bottomTextPasswordConfirm, setbottomTextPasswordConfirm] =
    useState<string>("");

  // 비밀번호 검증
  const [isValidPassword, setIsValidPassword] = useState<boolean>(false);
  const [isSame, setIsSame] = useState<boolean>(false);

  useEffect(() => {
    if (isPasswordFocused === false) {
      if (RegexpPassword.test(valuePassword)) {
        setStatusPassword(null);
        setbottomTextPassword("");
      } else {
        setStatusPassword(false);
        setbottomTextPassword(
          "비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함하여 최소 8자로 구성해야 합니다."
        );
      }
    } else {
      setStatusPassword(null);
      setbottomTextPassword("");
    }
  }, [isPasswordFocused]);

  useEffect(() => {
    if (isPasswordFocused === false && valuePasswordConfirm != "") {
      if (valuePassword === valuePasswordConfirm) {
        setStatusPasswordConfirm(null);
        setbottomTextPasswordConfirm("");
      } else {
        setStatusPasswordConfirm(false);
        setbottomTextPasswordConfirm("비밀번호가 일치하지 않습니다.");
      }
    } else {
      setStatusPasswordConfirm(null);
      setbottomTextPasswordConfirm("");
    }
  }, [isPasswordConfirmFocused]);

  return (
    <Container>
      <MemberTitle>비밀번호를 입력해주세요</MemberTitle>

      <MemberSignupForm>
        <InputUnderline
          value={valuePassword}
          placeholder="비밀번호"
          type="password"
          maxLength={undefined}
          status={statusPassword}
          bottomText={bottomTextPassword}
          bottomTextClickable={false}
          bottomTextOnClick={() => {}}
          onChange={(text: string) => {
            setValuePassword(text);
            setIsValidPassword(RegexpPassword.test(text));
          }}
          onFocus={() => {
            setIsPasswordFocused(true);
          }}
          onBlur={() => {
            setIsPasswordFocused(false);
          }}
          disabled={false}
        />

        <InputUnderline
          value={valuePasswordConfirm}
          placeholder="비밀번호 확인"
          type="password"
          maxLength={undefined}
          status={statusPasswordConfirm}
          bottomText={bottomTextPasswordConfirm}
          bottomTextClickable={false}
          bottomTextOnClick={() => {}}
          onChange={(text: string) => {
            setValuePasswordConfirm(text);
            setIsSame(valuePassword === text);
          }}
          onFocus={() => {
            setIsPasswordConfirmFocused(true);
          }}
          onBlur={() => {
            setIsPasswordConfirmFocused(false);
          }}
          disabled={false}
        />
      </MemberSignupForm>

      <MemberBottomButtonContainer>
        <ButtonLarge
          text="다음"
          buttonColor={
            isValidPassword && isSame ? COLORS.mainColor : COLORS.greyColor
          }
          textColor={COLORS.primaryColor}
          onClick={() => {
            if (isValidPassword && isSame) {
              onNext(valuePassword);
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

export default StepPassword;
