"use client";

import { ButtonLarge } from "@/app/components/buttons";
import { InputRound } from "@/app/components/inputs";
import { DefaultLayout } from "@/app/components/layout";
import {
  MemberAccountForm,
  MemberChevronLeft,
  MemberLogoAndTitle,
} from "@/app/components/member/components";
import {
  RegexpEmail,
  RegexpInputAlphabetAndNumber,
  RegexpInputNumber,
  RegexpPhone,
} from "@/public/utils/regexp";
import { Loading } from "@/app/components/loading";

import { COLORS } from "@/public/styles/colors";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useRouter } from "next/navigation";
import axiosInstance from "@/public/network/axios";

const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [valueEmail, setValueEmail] = useState<string>("");
  const [valuePhone, setValuePhone] = useState<string>("");
  const [valuePasscode, setValuePasscode] = useState<string>("");

  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [isValidPhone, setIsValidPhone] = useState<boolean>(false);
  const [isValidPasscode, setIsValidPasscode] = useState<boolean>(false);

  const [isSent, setIsSent] = useState<boolean>(false);
  const [isResendable, setIsResendable] = useState<boolean>(false);

  const resendableTime: number = 300;
  const [count, setCount] = useState<number>(resendableTime);

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

  const router = useRouter();

  const authEmailSendApi = async () => {
    if (isValidEmail && isValidPhone) {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/user/retrieve/auth", {
          email: valueEmail,
          phoneNumber: valuePhone,
        });
        if (response.status === 200) {
          if (response.data.isSend) {
            alert("인증메일이 전송되었습니다.");
            setIsSent(true);
            setCount(resendableTime);
            setIsResendable(false);
          } else {
            alert("조건에 해당하는 계정이 존재하지 않습니다.");
          }
          setIsLoading(false);
        }
      } catch (error) {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        setIsLoading(false);
      }
    }
  };

  const resetEmailSendApi = async () => {
    if (isValidEmail && isValidPhone && isValidPasscode) {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post(
          "/api/user/retrieve/password",
          {
            email: valueEmail,
            phoneNumber: valuePhone,
            authCode: valuePasscode,
          }
        );
        if (response.status === 200) {
          if (response.data.isSend) {
            alert("비밀번호 재설정 이메일이 전송되었습니다.");
            router.push("/member/signin");
          } else {
            alert("인증번호가 일치하지 않습니다.");
          }
          setIsLoading(false);
        }
      } catch (error) {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        setIsLoading(false);
      }
    }
  };

  return (
    <DefaultLayout
      top={16}
      right={20}
      bottom={32}
      left={20}
    >
      {isLoading && <Loading />}
      <Container>
        <div
          onClick={() => {
            router.push("/member/signin");
          }}
        >
          <MemberChevronLeft />
        </div>
        <MemberLogoAndTitle>비밀번호 찾기</MemberLogoAndTitle>

        <MemberAccountForm>
          <InputRound
            value={valueEmail}
            placeholder="이메일"
            type="email"
            maxLength={undefined}
            status={null}
            bottomText={""}
            bottomTextClickable={false}
            bottomTextOnClick={() => { }}
            onChange={(text: string) => {
              setValueEmail(text);
              setIsValidEmail(RegexpEmail.test(text));
            }}
            onFocus={() => { }}
            onBlur={() => { }}
            disabled={false}
          />

          <InputRound
            value={valuePhone}
            placeholder="전화번호"
            type="text"
            maxLength={undefined}
            status={null}
            bottomText={""}
            bottomTextClickable={false}
            bottomTextOnClick={() => { }}
            onChange={(text: string) => {
              setValuePhone(text.replace(RegexpInputNumber, ""));
              setIsValidPhone(RegexpPhone.test(text));
            }}
            onFocus={() => { }}
            onBlur={() => { }}
            disabled={false}
          />

          {isSent && (
            <InputRound
              value={valuePasscode}
              placeholder="인증번호"
              type="text"
              maxLength={8}
              status={null}
              bottomText={
                isResendable
                  ? "인증번호 재전송"
                  : `${String(Math.floor(count / 60)).padStart(
                    2,
                    "0"
                  )}:${String(Math.floor(count % 60)).padStart(
                    2,
                    "0"
                  )} 후에 재전송 가능`
              }
              bottomTextClickable={isResendable}
              bottomTextOnClick={() => {
                if (isResendable) {
                  authEmailSendApi();
                }
              }}
              onChange={(text: string) => {
                setValuePasscode(
                  text.replace(RegexpInputAlphabetAndNumber, "")
                );
                // setIsValidPasscode(valuePasscode.length === 8); // 이상하게 7글자여야 true가 되어서 잠시 주석걸게요
                setIsValidPasscode(valuePasscode !== "");
              }}
              onFocus={() => { }}
              onBlur={() => { }}
              disabled={false}
            />
          )}
        </MemberAccountForm>

        {isSent ? (
          <ButtonLarge
            text={"확인"}
            buttonColor={
              isValidEmail && isValidPhone && isValidPasscode
                ? COLORS.mainColor
                : COLORS.greyColor
            }
            textColor={COLORS.primaryColor}
            onClick={resetEmailSendApi}
          />
        ) : (
          <ButtonLarge
            text={"인증번호 전송"}
            buttonColor={
              isValidEmail && isValidPhone ? COLORS.mainColor : COLORS.greyColor
            }
            textColor={COLORS.primaryColor}
            onClick={authEmailSendApi}
          />
        )}
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

export default ForgotPasswordPage;
