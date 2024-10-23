"use client";
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import { COLORS } from "@/public/styles/colors";
import { DefaultLayout } from "@/app/components/layout";
import Back from "@/app/components/back";
import { useRouter } from "next/navigation";
import { ButtonLarge } from "@/app/components/buttons";
import { IconOXGameO, IconOXGameX } from "./icons";
import {
  MemberBottomButtonContainer,
  MemberProgressBar,
} from "@/app/components/member/components";

const tempQuestion = [
  {
    question: "팝핑의 인스타 주소는 @popping.apple 이다.",
    explanation: "팝핑의 인스타 주소는 @popping.app 입니다.",
    answer: false,
  },
  {
    question:
      "팝핑의 슬로건은\n'팝업은 현재 진행중! 내 손에서 펼쳐지는 팝업스토어' 이다.",
    explanation:
      "팝핑의 슬로건은\n'팝업은 현재 진행중! 내 손에서 펼쳐지는 팝업스토어'가 맞습니다.",
    answer: true,
  },
  {
    question:
      "'팝플'은 popup + people의 합성어이며,\n팝업을 이용하려고 가입하는 사용자이다.",
    explanation:
      "'팝플'은 popup + people의 합성어이며,\n팝업을 이용하려고 가입하는 사용자가 맞습니다.",
    answer: true,
  },
  {
    question:
      "'팝퍼'은 popup + -er의 합성어이며,\n오프라인 팝업스토어만 운영하는 관리자이다.",
    explanation:
      "'팝퍼'은 popup + -er의 합성어이며,\n오프라인 및 온라인 팝업스토어를 운영하려는 관리자입니다.",
    answer: false,
  },
  {
    question: "팝핑은 총 5인으로 이루어진\nDevelopop 팀의 사이드 프로젝트이다.",
    explanation:
      "팝핑은 총 5인으로 이루어진\nDevelopop 팀의 사이드 프로젝트가 맞습니다.",
    answer: true,
  },
];

const OXQuizPage: React.FC<{ params: { storeId: string } }> = ({ params }) => {
  const router = useRouter();
  const hasAlerted = useRef<boolean>(false);
  const { storeId } = params;
  const redirectPath = `/online-popup/${storeId}/store-opening`;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string>("");

  const [parentWidth, setParentWidth] = useState<number>(0);
  const [isFinish, setIsFinish] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setParentWidth(containerRef.current.offsetWidth);
    }
  }, [containerRef]);

  useEffect(() => {
    const rawStorageValue = localStorage.getItem(
      `${storeId.toUpperCase()}_Stamp_step4`
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

  const onNext = () => {
    setCurrentQuestionIndex((prevIndex: number) => prevIndex + 1);
    setShowModal(false);
  };

  const onNextResult = () => {
    setShowModal(false);
    setIsFinish(true);
    const value = JSON.stringify({ status: true, view: false });
    localStorage.setItem(`${storeId.toUpperCase()}_Stamp_step4`, value);
  };

  const handleClickAnswer = (answer: boolean) => {
    const isCorrect = tempQuestion[currentQuestionIndex].answer === answer;
    setIsCorrect(isCorrect);
    if (isCorrect) {
      setCorrectCount((prevCount: number) => prevCount + 1);
    }
    setExplanation(tempQuestion[currentQuestionIndex].explanation);
    setShowModal(true);
  };

  const handleLineBreaks = (text: string): JSX.Element[] => {
    return text.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <DefaultLayout
      top={0}
      right={0}
      bottom={0}
      left={0}
      backgroundColor={COLORS.secondaryColor}
    >
      <BackContainer>
        <Back url={"store-opening"} color={undefined} />
      </BackContainer>
      <Container ref={containerRef}>
        <PlayContainer>
          <PlayHeaderContainer>
            <PlayTitleText>OX 퀴즈</PlayTitleText>
            {!isFinish && (
              <PlayQuestionText>
                문제 {currentQuestionIndex + 1}.{" "}
                {handleLineBreaks(tempQuestion[currentQuestionIndex].question)}
              </PlayQuestionText>
            )}
          </PlayHeaderContainer>
          {!isFinish && (
            <PlayButtonContainer>
              <ButtonAnswer
                parentWidth={parentWidth}
                onClick={() => {
                  handleClickAnswer(true);
                }}
              >
                <IconOXGameO
                  width={undefined}
                  height={((parentWidth - 20 * 2 - 20) / 2) * 0.6}
                />
              </ButtonAnswer>

              <ButtonAnswer
                parentWidth={parentWidth}
                onClick={() => {
                  handleClickAnswer(false);
                }}
              >
                <IconOXGameX
                  width={undefined}
                  height={((parentWidth - 20 * 2 - 20) / 2) * 0.6}
                />
              </ButtonAnswer>
            </PlayButtonContainer>
          )}
          {isFinish && (
            <>
              <MiddleFinishText>
                축하드립니다 :)
                <br />
                {5}문제 중 {correctCount}문제 맞추셨어요!
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
      {!isFinish && (
        <ProgressBarContainer>
          <MemberProgressBar
            value={(currentQuestionIndex / tempQuestion.length) * 100}
          />
        </ProgressBarContainer>
      )}

      {showModal && (
        <PlayModal>
          <PlayModalContainer>
            {isCorrect ? (
              <IconOXGameO width={undefined} height={parentWidth * 0.64} />
            ) : (
              <IconOXGameX width={undefined} height={parentWidth * 0.64} />
            )}

            <ExplanationContainer>
              <p>해설</p>
              <p>{handleLineBreaks(explanation)}</p>
            </ExplanationContainer>
            {currentQuestionIndex === 4 ? (
              <NextButtonContainer onClick={onNextResult}>
                <p>결과 확인</p>
              </NextButtonContainer>
            ) : (
              <NextButtonContainer onClick={onNext}>
                <p>다음 문제</p>
              </NextButtonContainer>
            )}
          </PlayModalContainer>
        </PlayModal>
      )}
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
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 72px;
`;

const PlayHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  width: calc(100% - 40px);
`;

const PlayTitleText = styled.p`
  color: ${COLORS.primaryColor};
  text-align: center;

  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const PlayQuestionText = styled.p`
  color: ${COLORS.primaryColor};
  text-align: center;

  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const PlayButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;

  margin-top: 94px;
`;

const ButtonAnswer = styled.div<{ parentWidth: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: ${(props) => (props.parentWidth - 20 * 2 - 20) / 2}px;
  height: ${(props) => (props.parentWidth - 20 * 2 - 20) / 2}px;

  border-radius: 16px;
  background: ${COLORS.primaryColor};

  cursor: pointer;
`;

const ProgressBarContainer = styled.div`
  position: absolute;
  left: 50%;
  bottom: 32px;
  transform: translate(-50%, 0);

  width: calc(100% - 40px);
`;

const PlayModal = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, 0.85);
`;

const PlayModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 40px;
`;

const ExplanationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 12px;

  p:first-child {
    color: ${COLORS.primaryColor};
    text-align: center;

    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  p:last-child {
    color: ${COLORS.primaryColor};
    text-align: center;

    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const NextButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 12px;

  p:first-child {
    color: ${COLORS.primaryColor};
    text-align: center;

    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-decoration: underline;
  }

  cursor: pointer;
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

export default OXQuizPage;
