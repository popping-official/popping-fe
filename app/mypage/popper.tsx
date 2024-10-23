"use client";

import { COLORS } from "@/public/styles/colors";
import { styled } from "styled-components";
import { IconGear } from "../components/icons";
import { TopNavigation } from "@/app/navigation/topnavigation";
import { LogoLettersMain } from "../components/logo";
import { ProfileImage } from "../components/main/componenets";
import { ButtonSmall } from "../components/buttons";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import CustomJoyride from "@/app/components/tour/CustomJoyride";
import { CallBackProps, STATUS, Step } from "react-joyride";
import { TourContainer } from "@/app/components/tour/TourStyle";

type MyPagePopperProps = {
  nickname: string;
  profileImage: string;
  signOutApi: () => void;
  accountChangeApi: () => void;
};

export const MyPagePopper: React.FC<MyPagePopperProps> = ({
  nickname,
  profileImage,
  signOutApi,
  accountChangeApi,
}) => {
  const router = useRouter();

  const handleClickBrand = () => {
    router.push("/brand/manage");
  };

  // CustomJoyride 관련
  const [joyrideRun, setJoyrideRun] = useState<boolean>(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const joyrideStatusKey = `joyride_status_mypage_popper`;

  const profileRef = useRef<HTMLDivElement>(null);
  const orderReviewBoxRef = useRef<HTMLDivElement>(null);
  const brandManageRef = useRef<HTMLDivElement>(null);
  const changeAccountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      profileRef.current &&
      orderReviewBoxRef.current &&
      brandManageRef.current &&
      changeAccountRef.current
    ) {
      setSteps([
        {
          target: "body",
          content: (
            <TourContainer>
              <p>
                <strong>팝퍼</strong> 기능 체험을 위해 계정을 전환하셨군요!
              </p>
              <p>
                <strong>팝퍼</strong>는 <strong>브랜드</strong>를 개설하고
                스토어를 관리할 수 있습니다.
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
                <strong>프로필 설정</strong>을 통해 <strong>브랜드 네임</strong>
                을 설정하실 수 있습니다.
              </p>
              <p>
                <strong>브랜드 네임</strong>은 동시에 팝퍼 계정의 닉네임으로
                사용됩니다.
              </p>
              <br />
            </TourContainer>
          ),
          title: "마이페이지",
          placement: "bottom",
        },
        {
          target: orderReviewBoxRef.current,
          content: (
            <TourContainer>
              <p>
                해당 영역을 통해 팝플님의 <strong>주문 정보</strong>와{" "}
                <strong>리뷰</strong>를
              </p>
              <p>모니터링 하실 수 있습니다.</p>
              <br />
              <p>해당 기능은 현재 준비중에 있으니 조금만 기다려주세요! ⌛️</p>
            </TourContainer>
          ),
          title: "마이페이지",
          placement: "bottom",
        },
        {
          target: brandManageRef.current,
          content: (
            <TourContainer>
              <p>
                <strong>브랜드 관리</strong>를 통해 팝퍼님의 브랜드를
                꾸며주세요!
              </p>
              <p>
                로고, 썸네일, 브랜드 소개 등 다양할 설정을 하실 수 있습니다.
              </p>
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
                <strong>팝퍼</strong> 기능을 충분히 체험하신 후
              </p>
              <p>
                해당 버튼을 통해 다시 <strong>팝플</strong>로 계정을 전환할 수
                있습니다.
              </p>
            </TourContainer>
          ),
          title: "마이페이지",
          placement: "bottom",
        },
        {
          target: changeAccountRef.current,
          content: (
            <TourContainer>
              <p>🚨 잠깐</p>
              <p>
                <strong>팝플</strong>로 계정 전환시,
              </p>
              <p>
                생성한 <strong>브랜드와 스토어정보</strong>는 모두{" "}
                <strong>삭제</strong>되니
              </p>
              <p>이 부분 명심한 후 계정을 다시 전환해주세요.</p>
            </TourContainer>
          ),
          title: "마이페이지",
          placement: "bottom",
        },
      ]);
    }
  }, [
    profileRef.current,
    orderReviewBoxRef.current,
    brandManageRef.current,
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
            <MyProfileContainer ref={profileRef}>
              <ProfileImage image={profileImage} width={60} height={60} />
              <ProfileNickname>{nickname}</ProfileNickname>
              {/* <ProfileBottomText>
                팔로워 <span>{0}</span>
              </ProfileBottomText> */}
              <ButtonSmall
                text={"프로필 설정"}
                buttonColor={COLORS.mainColor}
                textColor={COLORS.whiteColor}
                onClick={() => {
                  router.push("/setting-profile");
                }}
              />
            </MyProfileContainer>
          </MyProfile>
          <MyActivities>
            <MyActivitiesContainer ref={orderReviewBoxRef}>
              <Activity>
                <p>{0}</p>
                <p>{"주문"}</p>
              </Activity>
              <Activity>
                <p>{0}</p>
                <p>{"리뷰"}</p>
              </Activity>
            </MyActivitiesContainer>
          </MyActivities>
        </MyInfo>

        <MenuContainer>
          {/* <p>스토어 관리</p>
          <p>공지사항</p>
          <p>고객센터</p>
          <p>1:1 문의 내역</p> */}
          <div onClick={handleClickBrand} ref={brandManageRef}>
            <p>브랜드 관리</p>
          </div>
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
            <p>팝플로 계정 전환</p>
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
  align-items: center;
  gap: 8px;

  padding: 16px;
`;

const ProfileNickname = styled.p`
  color: ${COLORS.secondaryColor};

  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const ProfileBottomText = styled.p`
  color: ${COLORS.secondaryColor};

  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  span {
    color: ${COLORS.mainColor};
    font-weight: 600;
  }
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
