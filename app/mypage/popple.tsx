import { COLORS, gradeColors } from "@/public/styles/colors";
import { styled } from "styled-components";
import { IconChevronRight, IconGear } from "../components/icons";
import DummyStore from "@/public/images/dummy/dummy_store.jpg";
import { Spacer } from "../components/layout";
import { TopNavigation } from "../navigation/topnavigation";
import { LogoLettersMain } from "../components/logo";
import { ProfileImage } from "../components/main/componenets";
import { ButtonSmall } from "../components/buttons";
import { useRouter } from "next/navigation";
import { myPagePoppleTypes } from "@/public/utils/types";
import { useEffect, useRef, useState } from "react";

import CustomJoyride from "@/app/components/tour/CustomJoyride";
import { CallBackProps, STATUS, Step } from "react-joyride";
import { TourContainer } from "@/app/components/tour/TourStyle";

type MyPagePoppleProps = {
  nickname: string;
  profileImage: string;
  myPageData: myPagePoppleTypes;
  signOutApi: () => void;
  accountChangeApi: () => void;
};

export const MyPagePopple: React.FC<MyPagePoppleProps> = ({
  nickname,
  profileImage,
  signOutApi,
  myPageData,
  accountChangeApi,
}) => {
  const router = useRouter();

  const handleMoveBenefit = () => {
    router.push("/benefit");
  };

  const isGradeKey = (key: string): key is keyof typeof gradeColors => {
    return key in gradeColors;
  };

  // CustomJoyride 관련
  const [joyrideRun, setJoyrideRun] = useState<boolean>(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const joyrideStatusKey = `joyride_status_mypage_popple`;

  const profileRef = useRef<HTMLDivElement>(null);
  const gradeBoxRef = useRef<HTMLDivElement>(null);
  const followPointBoxRef = useRef<HTMLDivElement>(null);
  const recentPopupRef = useRef<HTMLDivElement>(null);
  const changeAccountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      profileRef.current &&
      gradeBoxRef.current &&
      followPointBoxRef.current &&
      recentPopupRef.current &&
      changeAccountRef.current
    ) {
      setSteps([
        {
          target: "body",
          content: (
            <TourContainer>
              <p>회원가입을 완료하신것을 축하드립니다!</p>
              <p>
                <strong>마이페이지</strong>에는 다양한 기능이 있습니다
              </p>
            </TourContainer>
          ),
          title: "마이페이지",
          placement: "center",
        },
        {
          target: profileRef.current,
          content: (
            <TourContainer>
              <p>
                <strong>프로필 설정</strong>을 통해 팝플님의 프로필을 수정 할 수
                있습니다.
              </p>
              <br />
              <p>
                추가로 <strong>소셜 회원가입</strong>을 이용해주신 팝플님의
              </p>
              <p>닉네임, 이름 정보는 난수로 지급되니 꼭 변경해주세요!</p>
              <br />
            </TourContainer>
          ),
          title: "마이페이지",
          placement: "bottom",
        },
        {
          target: gradeBoxRef.current,
          content: (
            <TourContainer>
              <p>
                해당 영역을 통해 팝플님의 <strong>등급</strong> 정보를
              </p>
              <p>모니터링 하실 수 있습니다.</p>
            </TourContainer>
          ),
          title: "마이페이지",
          placement: "bottom",
        },
        {
          target: followPointBoxRef.current,
          content: (
            <TourContainer>
              <p>
                해당 영역을 통해 팝플님이 <strong>팔로잉</strong> 하고있는
                브랜드와
              </p>
              <p>
                <strong>콘포인트 내역</strong>을 확인 하실 수 있습니다.
              </p>
            </TourContainer>
          ),
          title: "마이페이지",
          placement: "bottom",
        },
        {
          target: recentPopupRef.current,
          content: (
            <TourContainer>
              <p>방금 보신 팝업을 잊으셨다구요? 🫨 걱정 마세요!</p>
              <p>저희 팝핑이 전부 기억해 드립니다.</p>
            </TourContainer>
          ),
          title: "마이페이지",
          placement: "bottom",
        },
        {
          target: changeAccountRef.current,
          content: (
            <TourContainer>
              <p>
                <strong>팝퍼</strong> 기능을 체험 해보고 싶으시다면
              </p>
              <p>
                해당 버튼을 통해 <strong>팝퍼</strong>로 계정을 전환해보세요!
              </p>
              <p>
                언제든지 다시 <strong>팝플</strong>로 돌아오실 수 있습니다. 🍿
              </p>
            </TourContainer>
          ),
          title: "마이페이지",
          placement: "bottom",
        },
      ]);
    }
  }, [
    profileRef.current,
    gradeBoxRef.current,
    followPointBoxRef.current,
    recentPopupRef.current,
    changeAccountRef.current,
  ]);

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

  const handleResetJoyride = () => {
    const userConfirmed = window.confirm(
      "'팝핑 길라잡이 다시보기'를 재표시 하시겠습니까?"
    );

    if (userConfirmed) {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.includes("joyride")) {
          localStorage.removeItem(key);
        }
      });
      window.location.reload();
    }
  };

  return (
    <>
      <CustomJoyride
        steps={steps}
        runStatus={joyrideRun}
        callback={handleJoyrideCallback}
      />
      <TopNavigation>
        <TopNavLogoContainer>
          <LogoLettersMain width={undefined} height={24} />
        </TopNavLogoContainer>
        <TopNavRightContainer>
          {/* <IconGear color={COLORS.secondaryColor} width={20} height={20} /> */}
        </TopNavRightContainer>
      </TopNavigation>
      <Container>
        <MyInfo>
          <MyProfile>
            <MyProfileContainer>
              <ProfileContainer ref={profileRef}>
                <ProfileImage image={profileImage} width={60} height={60} />
                <ProfileNickname>{nickname}님</ProfileNickname>
                <Spacer />
                <ButtonSmall
                  text={"프로필 설정"}
                  buttonColor={COLORS.mainColor}
                  textColor={COLORS.whiteColor}
                  onClick={() => {
                    router.push("/setting-profile");
                  }}
                />
              </ProfileContainer>
              <GradeContainer ref={gradeBoxRef}>
                <CurrentGradeContainer>
                  <p>현재 등급</p>
                  <GradeText
                    color={
                      myPageData.gradeInfo.grade === "WHITE POP"
                        ? COLORS.secondaryColor
                        : isGradeKey(myPageData.gradeInfo.grade)
                        ? gradeColors[myPageData.gradeInfo.grade]
                        : gradeColors["WHITE POP"]
                    }
                    onClick={handleMoveBenefit}
                  >
                    {myPageData.gradeInfo.grade}
                  </GradeText>
                  <div
                    onClick={() => {
                      router.push("/grade");
                    }}
                  >
                    <IconNext
                      color={COLORS.greyColor}
                      width={undefined}
                      height={10}
                    />
                  </div>
                  <Spacer />
                  <p>
                    {myPageData.gradeInfo.earnRate}% 적립 ·{" "}
                    {myPageData.gradeInfo.discountRate}% 할인
                  </p>
                </CurrentGradeContainer>
                <PointsProgress
                  color={
                    isGradeKey(myPageData.gradeInfo.grade)
                      ? gradeColors[myPageData.gradeInfo.grade]
                      : gradeColors["WHITE POP"]
                  }
                  value={myPageData.gradeInfo.gradeRatio}
                  max="100"
                />
                {myPageData.gradeInfo.grade === "GOLD POP" ? (
                  <NextGradeContainer>
                    <NextGradeDesc>
                      회원님은 현재 최고등급 입니다.
                    </NextGradeDesc>
                  </NextGradeContainer>
                ) : (
                  <NextGradeContainer>
                    <NextGradeDesc>
                      누적 금액{" "}
                      {myPageData.gradeInfo.nextGradeInfo.nextMinOrderAmount}원
                      이상 달성시
                    </NextGradeDesc>
                    <NextGradeText
                      color={
                        isGradeKey(myPageData.gradeInfo.nextGradeInfo.nextGrade)
                          ? gradeColors[
                              myPageData.gradeInfo.nextGradeInfo.nextGrade
                            ]
                          : gradeColors["WHITE POP"]
                      }
                    >
                      {myPageData.gradeInfo.nextGradeInfo.nextGrade}
                    </NextGradeText>
                  </NextGradeContainer>
                )}
              </GradeContainer>
            </MyProfileContainer>
          </MyProfile>

          <MyActivities ref={followPointBoxRef}>
            <MyActivitiesContainer>
              <Activity
                onClick={() => {
                  router.push("/?page=likes");
                }}
              >
                <p>{myPageData.followingNum}</p>
                <p>{"팔로잉"}</p>
              </Activity>
              <Activity onClick={handleMoveBenefit}>
                <p>{myPageData.point}</p>
                <p>{"콘 포인트"}</p>
              </Activity>
            </MyActivitiesContainer>
          </MyActivities>
        </MyInfo>

        <Section ref={recentPopupRef}>
          <p>최근 본 팝업스토어</p>
          <ContentsContainer>
            <StoreContainer>
              <StoreImage image={DummyStore.src} />
              <StoreDesc>
                <p>팝핑스토어</p>
              </StoreDesc>
            </StoreContainer>
          </ContentsContainer>
        </Section>

        <MenuContainer>
          {/* <p>주문 내역</p>
          <p>취소/환불 내역</p>
          <p>리뷰 관리</p>
          <p>공지사항</p>
          <p>고객센터</p>
          <p>1:1 문의 내역</p> */}
          <div onClick={signOutApi}>
            <p>로그아웃</p>
          </div>
          <div onClick={handleResetJoyride}>
            <p>팝핑 길라잡이 다시보기</p>
          </div>
          <div
            className="main-color-text"
            onClick={accountChangeApi}
            ref={changeAccountRef}
          >
            <p>팝퍼로 계정 전환</p>
          </div>
        </MenuContainer>
      </Container>
    </>
  );
};

const TopNavLogoContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: auto;
  height: 24px;

  cursor: pointer;
`;

const TopNavRightContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);

  width: auto;
  height: 20px;

  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  width: 100%;
  height: 100%;

  background: ${COLORS.primaryColor};

  padding-bottom: 80px;
`;

const MyInfo = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;

  justify-content: center;
`;

const MyProfile = styled.div`
  border-radius: 8px;
  box-shadow: 0 0 0 1px ${COLORS.greyColor} inset;
  background: ${COLORS.primaryColor};
`;

const MyProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;

  align-items: center;
`;

const ProfileNickname = styled.p`
  color: ${COLORS.secondaryColor};

  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const GradeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CurrentGradeContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;

  align-items: center;

  p {
    color: ${COLORS.secondaryColor};
    text-align: center;

    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const GradeText = styled.span`
  color: ${(props) => props.color};

  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  cursor: pointer;
`;

const IconNext = styled(IconChevronRight)`
  cursor: pointer;
`;

const PointsProgress = styled.progress`
  width: 100%;
  height: 28px;
  appearance: none;

  &::-webkit-progress-bar {
    height: 100%;
    border-radius: 4px;
    background-color: ${COLORS.lightGreyColor};
    border: 1px solid ${COLORS.lightGreyColor};

    overflow: hidden;
  }

  &::-webkit-progress-value {
    height: 100%;
    border-radius: 4px;

    background-color: ${(props) => props.color};
    transition: width 0.3s ease;
  }
`;

const NextGradeContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0px;

  align-items: center;
`;

const NextGradeText = styled.span`
  color: ${(props) => props.color};

  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const NextGradeDesc = styled.p`
  color: ${COLORS.secondaryColor};

  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  padding-right: 4px;
`;

const MyActivities = styled.div`
  border-radius: 8px;
  box-shadow: 0 0 0 1px ${COLORS.greyColor} inset;
  background: ${COLORS.primaryColor};
`;

const MyActivitiesContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0px;

  padding: 12px 0;
`;

const Activity = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 4px;

  p:first-child {
    color: ${COLORS.secondaryColor};
    text-align: center;

    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  p:last-child {
    color: ${COLORS.secondaryColor};
    text-align: center;

    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  cursor: pointer;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  p:first-child {
    color: ${COLORS.secondaryColor};

    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

const ContentsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;

  flex-wrap: nowrap;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;

  div:last-child {
    margin-right: 16px;
  }
`;

const StoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StoreImage = styled.div<{ image: string | null }>`
  flex: 0 0 auto;

  width: 82px;
  height: 82px;
  border-radius: 8px;
  background: ${(props) =>
    props.image ? `url(${props.image})` : COLORS.greyColor};
  background-position: center;
  background-size: cover;

  cursor: pointer;
`;

const StoreDesc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;

  p:first-child {
    color: ${COLORS.secondaryColor};

    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  margin-bottom: 80px;

  p {
    color: ${COLORS.secondaryColor};

    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    cursor: pointer;
  }

  .main-color-text p {
    color: ${COLORS.mainColor};
  }
`;
