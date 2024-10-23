"use client";

import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { COLORS } from "@/public/styles/colors";
import { ButtonLarge } from "@/app/components/buttons";
import { InputRound } from "@/app/components/inputs";
import { DefaultLayout } from "@/app/components/layout";
import {
  MemberChevronLeft,
  MemberLogoAndTitle,
  MemberAccountForm,
} from "@/app/components/member/components";
import { Loading } from "@/app/components/loading";
import Image from "next/image";
import LogoKakao from "@/public/images/social/logo_kakao.png";
import LogoGoogle from "@/public/images/social/logo_google.png";
import axiosInstance from "@/public/network/axios";
import { useDispatch, useSelector } from "react-redux";
import { initUser, setUser } from "@/app/redux/reducers/poppingUser";
import { user } from "@/public/utils/types";
import { useRouter } from "next/navigation";
import { removeCookie } from "@/public/network/cookie";

const SignInPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const kakaoClientId = process.env.NEXT_PUBLIC_SOCIAL_AUTH_KAKAO_CLIENT_ID;
  const googleClientId = process.env.NEXT_PUBLIC_SOCIAL_AUTH_GOOGLE_CLIENT_ID;
  const [domain, setDomain] = useState<string>("");
  const [valueEmail, setValueEmail] = useState<string>("");
  const [valuePassword, setValuePassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userData: user = useSelector((state: any) => state.poppingUser.user);

  const searchParams = new URLSearchParams(window.location.search);
  const encodedRedirectPath = searchParams.get("redirect");

  let redirectPath = null;
  if (encodedRedirectPath) {
    redirectPath = decodeURIComponent(encodedRedirectPath); // 인코딩된 URL을 디코딩
  }

  useEffect(() => {
    if (userData.isLogin) {
      router.push("/");
    } else {
      if (typeof window !== "undefined") {
        setDomain(window.location.origin);
      }
    }
  }, [router]);

  const cleanUserData = () => {
    dispatch(initUser());
    removeCookie("csrftoken");
    removeCookie("sessionid");
  };

  const handleClickLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/api/user/signin", {
        email: valueEmail,
        password: valuePassword,
      });

      if (response.status === 200) {
        const userData: user = response.data.user;
        dispatch(setUser(userData));
        setIsLoading(false);
        if (redirectPath) {
          router.refresh();
          window.location.href = redirectPath;
        } else {
          window.location.href = "/";
        }
        /*
          django와 react 간의 로그인 세션 정보를 동기화 시키려면 최초 로그인 후 새로고침을 한번 해줘야합니다.
          그러나 router의 push는 새로고치는게 아닌 url상의 이동만 지원하다보니
          최초 로그인 후 메인페이지로 이동시에는 window.location.href를 사용하여 이동하도록 구현하겠습니다.
        */
      }
    } catch (error) {
      alert("이메일 혹은 비밀번호가 일치하지 않습니다.");
      cleanUserData();
      setIsLoading(false);
    }
  };

  const Back = () => {
    if (redirectPath) {
      router.refresh();
      window.location.href = redirectPath;
    } else {
      window.location.href = "/";
    }
  };

  const handleClickSocialLogin = (provider: string) => {
    let socialUrl = "";
    if (provider === "kakao") {
      socialUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${domain}/member/social?provider=kakao&response_type=code`;
    } else if (provider === "google") {
      socialUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${domain}/member/social?provider=google&response_type=code&scope=email`;
    }
    router.push(socialUrl);
  };

  return (
    <DefaultLayout top={16} right={20} bottom={32} left={20}>
      {isLoading && <Loading />}
      <Container>
        <div onClick={Back}>
          <MemberChevronLeft />
        </div>
        <MemberLogoAndTitle>로그인</MemberLogoAndTitle>
        <MemberAccountForm>
          <InputRound
            value={valueEmail}
            placeholder="이메일"
            type="email"
            maxLength={undefined}
            status={null}
            bottomText={"계정을 잊으셨나요?"}
            bottomTextClickable={true}
            bottomTextOnClick={() => {
              router.push("/member/forgot-account");
            }}
            onChange={(text: string) => {
              setValueEmail(text);
            }}
            onFocus={() => { }}
            onBlur={() => { }}
            disabled={false}
          />

          <InputRound
            value={valuePassword}
            placeholder="비밀번호"
            type="password"
            maxLength={undefined}
            status={null}
            bottomText={"비밀번호를 잊으셨나요?"}
            bottomTextClickable={true}
            bottomTextOnClick={() => {
              router.push("/member/forgot-password");
            }}
            onChange={(text: string) => {
              setValuePassword(text);
            }}
            onFocus={() => { }}
            onBlur={() => { }}
            disabled={false}
          />
        </MemberAccountForm>

        <ButtonLarge
          text="로그인"
          buttonColor={
            valueEmail !== "" && valuePassword !== ""
              ? COLORS.mainColor
              : COLORS.greyColor
          }
          textColor={COLORS.primaryColor}
          onClick={handleClickLogin}
        />

        <SignupContainer
          onClick={() => {
            router.push("/member/signup");
          }}
        >
          <SignUpTextNormal>계정이 아직 없으신가요?</SignUpTextNormal>
          <SignUpTextHighlight>회원가입</SignUpTextHighlight>
        </SignupContainer>

        <SocialSignInContainer>
          <SocialSignInButton
            background={COLORS.kakaoColor}
            borderColor="transparent"
            onClick={() => handleClickSocialLogin("kakao")}
          >
            <Image src={LogoKakao} alt={"카카오 로그인"} />
          </SocialSignInButton>
          <SocialSignInButton
            background={COLORS.whiteColor}
            borderColor="#747775"
            onClick={() => handleClickSocialLogin("google")}
          >
            <Image src={LogoGoogle} alt={"구글 로그인"} />
          </SocialSignInButton>
        </SocialSignInContainer>
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

const SignupContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;

  justify-content: center;

  width: 100%;
  margin: 12px 0;
`;

const SignUpTextNormal = styled.span`
  color: ${COLORS.greyColor};
  text-align: center;

  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  cursor: pointer;
`;

const SignUpTextHighlight = styled.span`
  color: ${COLORS.mainColor};
  text-align: center;

  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  cursor: pointer;
`;

const SocialSignInContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  gap: 16px;

  margin-top: 28px;
`;

const SocialSignInButton = styled.div<{
  background: string;
  borderColor: string;
}>`
  position: relative;

  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${(props) => props.background};
  box-shadow: 0 0 0 1px ${(props) => props.borderColor} inset;

  cursor: pointer;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: auto;
    height: 20px;
  }
`;

export default SignInPage;
