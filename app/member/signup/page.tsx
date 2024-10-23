"use client";

import { ButtonLarge } from "@/app/components/buttons";
import { BottomBox, DefaultLayout } from "@/app/components/layout";
import {
  MEMBER_PADDING_BOTTOM,
  MEMBER_PADDING_HORIZONTAL,
  MEMBER_PADDING_TOP,
  MemberBottomButtonContainer,
  MemberChevronLeft,
  MemberTitle,
} from "@/app/components/member/components";
import { COLORS } from "@/public/styles/colors";
import { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { useRouter } from "next/navigation";

import CustomJoyride from "@/app/components/tour/CustomJoyride";
import { CallBackProps, STATUS, Step } from "react-joyride";
import { TourContainer } from "@/app/components/tour/TourStyle";

const SignUpPage: React.FC = () => {
  const [isPopper, setIsPopper] = useState<boolean | null>(null);
  const router = useRouter();
  const hasAlerted = useRef<boolean>(false);

  // CustomJoyride 관련
  const [joyrideRun, setJoyrideRun] = useState<boolean>(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const joyrideStatusKey = `joyride_status_signup`;

  const poppleRef = useRef<HTMLDivElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (poppleRef.current && popperRef.current) {
      setSteps([
        {
          target: "body",
          content: (
            <TourContainer>
              <p>팝핑 회원가입을 하려 오셨군요!</p>
              <p>팝핑의 회원은 두 종류로 구분됩니다.</p>
              <p>
                바로 <strong>팝플</strong>과 <strong>팝퍼</strong>로
                구분되는데요.
              </p>
            </TourContainer>
          ),
          title: "회원가입",
          placement: "center",
        },
        {
          target: poppleRef.current,
          content: (
            <TourContainer>
              <p>
                <strong>팝플</strong>은 팝업스토어를 이용하고 참여하고자 하는
              </p>
              <p>사람들이 가입해주시면 됩니다.</p>
            </TourContainer>
          ),
          title: "회원가입",
          placement: "bottom",
        },
        {
          target: popperRef.current,
          content: (
            <TourContainer>
              <p>
                <strong>팝퍼</strong>는 팝업스토어를 직접 운영하고
              </p>
              <p>관리를 하기 위한 사람들이 가입해주시면 됩니다.</p>
            </TourContainer>
          ),
          title: "회원가입",
          placement: "bottom",
        },
        {
          target: popperRef.current,
          content: (
            <TourContainer>
              <p>
                또한 <strong>팝퍼</strong>에 가입하기 위해서는
              </p>
              <p>
                <strong>사업자 자격으로 등록</strong>되어 있어야 하니 명심
                해주세요!
              </p>
            </TourContainer>
          ),
          title: "회원가입",
          placement: "bottom",
        },
        {
          target: "body",
          content: (
            <TourContainer>
              <p>
                마지막으로 <strong>사이드임팩트 라운드 1</strong> 진행중에는
              </p>
              <p>
                <strong>팝플</strong>로 가입해도 팝퍼 기능을 체험 해보실 수
                있습니다.
              </p>
              <br />
              <p>이제 회원가입 진행 후 팝핑을 이용 해주세요! 🍿</p>
            </TourContainer>
          ),
          title: "회원가입",
          placement: "center",
        },
      ]);
    }
  }, [poppleRef.current, popperRef.current]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setJoyrideRun(false);
      localStorage.setItem(joyrideStatusKey, status);
    }
  };

  useEffect(() => {
    const key = localStorage.getItem(joyrideStatusKey);
    if (key === "finished" || key === "skipped") {
      setJoyrideRun(false);
    } else {
      setJoyrideRun(true);
    }
  }, [router]);

  return (
    <DefaultLayout
      top={MEMBER_PADDING_TOP}
      right={MEMBER_PADDING_HORIZONTAL}
      bottom={MEMBER_PADDING_BOTTOM}
      left={MEMBER_PADDING_HORIZONTAL}
    >
      <CustomJoyride
        steps={steps}
        runStatus={joyrideRun}
        callback={handleJoyrideCallback}
      />
      <Container>
        <div
          onClick={() => {
            router.push("/");
          }}
        >
          <MemberChevronLeft />
        </div>
        <MemberTitle>
          팝핑에 오신 것을 환영해요
          <br />
          이용하실 목적이 어떻게 되시나요?
        </MemberTitle>
        <RadioBoxContainer>
          <RadioBox
            ref={poppleRef}
            isSelect={isPopper === false}
            onClick={() => {
              setIsPopper(false);
            }}
          >
            <p>팝플</p>
            <p>팝업스토어를 이용하려고 가입해요</p>
          </RadioBox>
          <RadioBox
            ref={popperRef}
            isSelect={isPopper === true}
            // onClick={() => {
            //   setIsPopper(true);
            // }}
          >
            <p>팝퍼</p>
            <p>팝업스토어를 운영하고 관리하려고 가입해요</p>
          </RadioBox>
        </RadioBoxContainer>
        <BottomBox />

        <MemberBottomButtonContainer>
          <ButtonLarge
            text="다음"
            buttonColor={
              isPopper !== null ? COLORS.mainColor : COLORS.greyColor
            }
            textColor={COLORS.primaryColor}
            onClick={() => {
              if (isPopper != null) {
                if (isPopper) {
                  router.push("/member/signup/popper");
                } else {
                  router.push("/member/signup/popple");
                }
              }
            }}
          />
        </MemberBottomButtonContainer>
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

const RadioBoxContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 20px;

  // 임시 css
  div:first-child {
    cursor: pointer;
  }

  // 임시 css
  div:nth-of-type(2) {
    opacity: 0.5;
  }
`;

const RadioBox = styled.div<{ isSelect: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;

  width: 100%;
  padding: 28px 0;

  text-align: center;

  color: ${COLORS.secondaryColor};

  font-style: normal;
  font-weight: 600;
  line-height: normal;

  border-radius: 8px;
  box-shadow: 0 0 0 ${(props) => (props.isSelect ? "2px" : "1px")}
    ${(props) => (props.isSelect ? COLORS.mainColor : COLORS.greyColor)} inset;
  transition: box-shadow 0.3s ease;

  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;

  /* cursor: pointer; */

  p:first-child {
    font-size: 24px;
  }

  p:last-child {
    font-size: 14px;
  }
`;

export default SignUpPage;
