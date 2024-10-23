"use client";
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import { COLORS } from "@/public/styles/colors";
import { DefaultLayout } from "@/app/components/layout";
import Back from "@/app/components/back";
import { useRouter } from "next/navigation";
import { ButtonLarge } from "@/app/components/buttons";
import { MobileMinWidth } from "@/public/styles/size";
import { MemberBottomButtonContainer } from "@/app/components/member/components";

const TimeMatchingPage: React.FC<{ params: { storeId: string } }> = ({
  params,
}) => {
  const router = useRouter();
  const hasAlerted = useRef<boolean>(false);
  const { storeId } = params;

  const [time, setTime] = useState<number>(0);
  const [goal, setGoal] = useState<number>(10.45);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isFinish, setIsFinish] = useState<boolean>(false);
  const redirectPath = `/online-popup/${storeId}/store-opening`;

  useEffect(() => {
    const rawStorageValue = localStorage.getItem(
      `${storeId.toUpperCase()}_Stamp_step3`
    );

    if (rawStorageValue !== null) {
      const parsedValue = JSON.parse(rawStorageValue);
      if (parsedValue.status && !hasAlerted.current) {
        alert("이미 해당 게임에 참여하셨습니다.");
        hasAlerted.current = true;
        router.push(redirectPath);
      }
    }
  }, [router]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => parseFloat((prevTime + 0.01).toFixed(2)));
      }, 10);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);

    const value = JSON.stringify({ status: true, view: false });
    localStorage.setItem(`${storeId.toUpperCase()}_Stamp_step3`, value);

    if (time === goal) {
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
    setIsFinish(true);
  };

  return (
    <DefaultLayout
      top={0}
      right={16}
      bottom={32}
      left={16}
      backgroundColor={COLORS.secondaryColor}
    >
      <BackContainer>
        <Back url={redirectPath} color={COLORS.primaryColor} />
      </BackContainer>
      <Container>
        <PlayContainer>
          <PlayHeaderContainer>
            <PlayTitleText>타이밍을 잡아라!</PlayTitleText>
            {!isFinish && (
              <PlayDescText>{goal}초의 타이밍을 잡아보세요!</PlayDescText>
            )}
          </PlayHeaderContainer>
          {!isFinish && (
            <>
              <PlayBodyContainer>
                <TimeText>{time.toFixed(2).padStart(5, "0")}</TimeText>
              </PlayBodyContainer>
              <PlayButtonContainer>
                <div>
                  <div
                    onClick={() => {
                      if (isRunning) {
                        handleStop();
                      } else {
                        handleStart();
                      }
                    }}
                  />
                </div>
              </PlayButtonContainer>
            </>
          )}
          {isFinish && (
            <>
              <MiddleFinishText>
                {isSuccess ? (
                  <>
                    축하드립니다!
                    <br />
                    정확히 {String(time).padStart(5, "0")}초에 멈췄어요 :)
                    <br />
                  </>
                ) : (
                  <>
                    {String(time).padStart(5, "0")}초로
                    <br />
                    아쉽게도 못 잡았어요...
                  </>
                )}
              </MiddleFinishText>
              <MemberBottomButtonContainer>
                <ButtonLarge
                  text="나가기"
                  buttonColor={COLORS.mainColor}
                  textColor={COLORS.primaryColor}
                  onClick={() => {
                    router.push(redirectPath);
                  }}
                />
              </MemberBottomButtonContainer>
            </>
          )}
        </PlayContainer>
      </Container>
    </DefaultLayout>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const BackContainer = styled.div`
  position: absolute;
  top: 16px;
  left: 20px;
`;

const PlayContainer = styled.div`
  margin-top: 72px;
`;

const PlayHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const PlayTitleText = styled.p`
  color: ${COLORS.primaryColor};
  text-align: center;

  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const PlayDescText = styled.p`
  color: ${COLORS.primaryColor};
  text-align: center;

  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const PlayBodyContainer = styled.div`
  position: relative;

  width: ${MobileMinWidth - 40}px;
  height: ${MobileMinWidth - 40}px;

  margin-top: 80px;

  border-radius: 100%;

  box-shadow: 0 0 0 8px ${COLORS.mainColor} inset;
`;

const TimeText = styled.p`
  position: absolute;

  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);

  color: ${COLORS.primaryColor};
  text-align: center;

  font-size: 72px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const PlayButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 84px;

  div {
    position: relative;

    width: 80px;
    height: 80px;
    border-radius: 100%;

    background: rgba(244, 53, 41, 0.7);

    z-index: 0;

    cursor: pointer;

    div {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      z-index: 3;

      width: 66px;
      height: 66px;

      background: ${COLORS.statusNegativeColor};

      cursor: pointer;
    }
  }
`;

const MiddleFinishText = styled.p`
  position: absolute;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: calc(100% - 40px);

  color: ${COLORS.primaryColor};
  text-align: center;

  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export default TimeMatchingPage;
