"use client";

import { ButtonLarge } from "@/app/components/buttons";
import { InputRound } from "@/app/components/inputs";
import { DefaultLayout } from "@/app/components/layout";
import {
  MemberAccountForm,
  MemberChevronLeft,
  MemberLogoAndTitle,
} from "@/app/components/member/components";
import { RegexpPassword } from "@/public/utils/regexp";

import { COLORS } from "@/public/styles/colors";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/public/network/axios";

const ResetPasswordPage: React.FC = () => {
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

  const router = useRouter();
  const searchParams = useSearchParams();

  const updatePasswordApi = async () => {
    try {
      const uuid = searchParams.get("uuid");
      const response = await axiosInstance.patch(
        "/api/user/retrieve/password",
        {
          uuid: uuid,
          newPassword: valuePassword,
        }
      );
      if (response.status === 200) {
        if (response.data.isSuccess) {
          alert(
            "비밀번호가 정상적으로 변경되었습니다.\n변경된 비밀번호로 로그인을 해주세요."
          );
        } else {
          alert("비밀번호 재설정 권한이 없습니다.");
        }
        router.push("/member/signin");
      }
    } catch (error) {
      alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
    }
  };

  return (
    <DefaultLayout
      top={16}
      right={20}
      bottom={32}
      left={20}
    >
      <Container>
        <div
          onClick={() => {
            router.push("/member/forgot-password");
          }}
        >
          <MemberChevronLeft />
        </div>
        <MemberLogoAndTitle>비밀번호 재설정</MemberLogoAndTitle>

        <MemberAccountForm>
          <InputRound
            value={valuePassword}
            placeholder="비밀번호"
            type="password"
            maxLength={undefined}
            status={statusPassword}
            bottomText={bottomTextPassword}
            bottomTextClickable={false}
            bottomTextOnClick={() => { }}
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

          <InputRound
            value={valuePasswordConfirm}
            placeholder="비밀번호 확인"
            type="password"
            maxLength={undefined}
            status={statusPasswordConfirm}
            bottomText={bottomTextPasswordConfirm}
            bottomTextClickable={false}
            bottomTextOnClick={() => { }}
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
        </MemberAccountForm>

        <ButtonLarge
          text="변경"
          buttonColor={
            isValidPassword && isSame ? COLORS.mainColor : COLORS.greyColor
          }
          textColor={COLORS.primaryColor}
          onClick={() => {
            if (isValidPassword && isSame) {
              updatePasswordApi();
            }
          }}
        />
      </Container>
    </DefaultLayout>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
`;

export default ResetPasswordPage;
