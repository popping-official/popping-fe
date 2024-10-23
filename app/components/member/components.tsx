import { COLORS } from "@/public/styles/colors";
import { styled } from "styled-components";
import { IconChevronLeft } from "../icons";
import React from "react";
import { LogoLettersMain } from "../logo";
import { useRouter } from "next/navigation";

// Title
type ChildrenType = {
  children: React.ReactNode;
};

const TitleContainer = styled.div`
  margin-bottom: 52px;
`;

const Title = styled.p`
  color: ${COLORS.secondaryColor};

  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const MemberTitle = ({ children }: ChildrenType) => {
  return (
    <TitleContainer>
      <Title>{children}</Title>
    </TitleContainer>
  );
};

const ChevronLeftContainer = styled.div`
  margin-bottom: 40px;
`;

export const MemberChevronLeft = () => {
  return (
    <ChevronLeftContainer>
      <IconChevronLeft
        color={COLORS.secondaryColor}
        width={undefined}
        height={16}
      />
    </ChevronLeftContainer>
  );
};

// Progress

type ProgressType = {
  value: number;
};

const Progress = styled.progress`
  width: 100%;
  height: 16px;
  appearance: none;
  margin-bottom: 20px;

  &::-webkit-progress-bar {
    height: 100%;

    border-radius: 16px;
    border: 1px solid ${COLORS.mainColor};
    background-color: ${COLORS.primaryColor};
    overflow: hidden;
  }

  &::-webkit-progress-value {
    height: 100%;
    border-radius: 16px;

    background-color: ${COLORS.mainColor};
    transition: width 0.3s ease;
  }
`;

export const MemberProgressBar = ({ value }: ProgressType) => {
  return <Progress value={value} max="100" />;
};

// Form

type FormType = {
  children: React.ReactNode;
};

const SignupForm = styled.div`
  display: flex;
  flex-direction: column;

  gap: 32px;
`;

export const MemberSignupForm = ({ children }: FormType) => {
  return <SignupForm>{children}</SignupForm>;
};

const MemberForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  margin-bottom: 40px;
`;

export const MemberAccountForm = ({ children }: FormType) => {
  return <MemberForm>{children}</MemberForm>;
};

// Logo & Title

const LogoAndTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  margin-bottom: 52px;
`;

export const MemberLogoAndTitle = ({ children }: ChildrenType) => {
  const router = useRouter();

  return (
    <LogoAndTitleContainer>
      <div
        onClick={() => {
          router.push("/");
        }}
      >
        <LogoLettersMain width={undefined} height={36} />
      </div>
      <Title>{children}</Title>
    </LogoAndTitleContainer>
  );
};

// Bottom Button
export const MEMBER_PADDING_TOP: number = 16;
export const MEMBER_PADDING_BOTTOM: number = 32;
export const MEMBER_PADDING_HORIZONTAL: number = 20;

const BottomButtonContainer = styled.div<{
  paddingHorizontal: number;
  paddingBottom: number;
}>`
  position: absolute;

  left: 50%;
  bottom: ${(props) => props.paddingBottom}px;
  transform: translate(-50%, 0);

  width: calc(100% - ${(props) => props.paddingHorizontal * 2}px);

  text-align: center;
`;

export const MemberBottomButtonContainer = ({ children }: ChildrenType) => {
  return (
    <BottomButtonContainer
      paddingHorizontal={MEMBER_PADDING_HORIZONTAL}
      paddingBottom={MEMBER_PADDING_BOTTOM}
    >
      {children}
    </BottomButtonContainer>
  );
};
