"use client";

import { IconChevronLeft } from "@/app/components/icons";
import { DefaultLayout, Spacer } from "@/app/components/layout";
import { TopNavigation } from "@/app/navigation/topnavigation";
import { COLORS } from "@/public/styles/colors";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "styled-components";
import { ProfileImage } from "../components/main/componenets";
import { gradeColors } from "@/public/styles/colors";
import { benefitTypes } from "@/public/utils/types";
import axiosInstance from "@/public/network/axios";
import { removeCookie } from "@/public/network/cookie";
import { initUser } from "../redux/reducers/poppingUser";
import { Loading } from "../components/loading";

const BenefitPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const hasAlerted = useRef<boolean>(false);

  const { isLogin, nickname, profileImage } = useSelector(
    (state: any) => state.poppingUser.user
  );
  const [isReady, setIsReady] = useState<boolean>(false);
  const [benefitData, setBenefitData] = useState<benefitTypes>({
    point: "",
    orderAmount: "",
    gradeInfo: {
      grade: "WHITE POP",
      minOrderAmount: "",
      maxOrderAmount: "",
      earnRate: 0,
      discountRate: 0,
      gradeRatio: 0,
      nextGradeInfo: {
        nextGrade: "",
        nextMinOrderAmount: "",
      },
    },
    pointHistory: [],
  });

  const cleanUserData = () => {
    dispatch(initUser());
    removeCookie("csrftoken");
    removeCookie("sessionid");
    sessionStorage.clear();
  };

  useEffect(() => {
    if (!isLogin && !hasAlerted.current) {
      alert("로그인 후 이용가능합니다.");
      hasAlerted.current = true; // alert 호출 후 true로 설정
      router.push(
        `/member/signin?redirect=${encodeURIComponent(
          window.location.pathname
        )}`
      );
    }
    if (isLogin) {
      getbenefitDataApi();
    }
  }, [isLogin, router]);

  // api
  const getbenefitDataApi = async () => {
    try {
      const response = await axiosInstance.get(`/api/user/benefit`);
      if (response.status === 200) {
        setBenefitData(response.data);
        setIsReady(true);
      }
    } catch (error: any) {
      if (error.response.statue === 403) {
        cleanUserData();
        alert("로그인 세션이 만료되었습니다. 재로그인 후 이용해주세요.");
        router.push("/member/signin");
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
      router.push("/");
    }
  };

  const isGradeKey = (key: string): key is keyof typeof gradeColors => {
    return key in gradeColors;
  };

  return (
    <DefaultLayout top={0} right={20} bottom={0} left={20}>
      {isReady ? (
        <>
          <TopNavigation>
            <TopNavCenterContainer>
              <TopNavTitle>혜택</TopNavTitle>
            </TopNavCenterContainer>
            <TopNavLeftContainer
              onClick={() => {
                router.push("/?page=mypage");
              }}
            >
              <IconChevronLeft
                color={COLORS.secondaryColor}
                width={undefined}
                height={16}
              />
            </TopNavLeftContainer>
          </TopNavigation>
          <Container>
            <MyInfo>
              <MyProfile>
                <MyProfileContainer>
                  <ProfileImage image={profileImage} width={60} height={60} />
                  <ProfileNickname>{nickname}님</ProfileNickname>
                  <PointsProgress
                    color={
                      isGradeKey(benefitData.gradeInfo.grade)
                        ? gradeColors[benefitData.gradeInfo.grade]
                        : gradeColors["WHITE POP"]
                    }
                    value={benefitData.gradeInfo.gradeRatio}
                    max="100"
                  />
                  {benefitData.gradeInfo.grade === "GOLD POP" ? (
                    <NextGradeContainer>
                      <NextGradeText color={gradeColors["GOLD POP"]}>
                        GOLD POP
                      </NextGradeText>
                    </NextGradeContainer>
                  ) : (
                    <NextGradeContainer>
                      <NextGradeDesc>
                        누적 금액{" "}
                        {benefitData.gradeInfo.nextGradeInfo.nextMinOrderAmount}
                        원 이상 달성시
                      </NextGradeDesc>
                      <NextGradeText
                        color={
                          isGradeKey(
                            benefitData.gradeInfo.nextGradeInfo.nextGrade
                          )
                            ? gradeColors[
                                benefitData.gradeInfo.nextGradeInfo.nextGrade
                              ]
                            : gradeColors["WHITE POP"]
                        }
                      >
                        {benefitData.gradeInfo.nextGradeInfo.nextGrade}
                      </NextGradeText>
                      <NextGradeInfo
                        onClick={() => {
                          router.push("/grade");
                        }}
                      ></NextGradeInfo>
                    </NextGradeContainer>
                  )}
                </MyProfileContainer>
              </MyProfile>
            </MyInfo>
            <HistoryTitle>콘 기록</HistoryTitle>
            <HistoryTable>
              {/* 데이터 시작 */}
              {benefitData.pointHistory?.map((history, index) => (
                <TableRow key={index}>
                  <TableHeader>
                    <TableDataContainer>
                      <TableNormalText>
                        {history.changeCategory}
                      </TableNormalText>
                    </TableDataContainer>
                  </TableHeader>
                  <TableData>
                    <TableDataContainer>
                      <TableStrongText>{history.changePoint}</TableStrongText>
                      <Spacer />
                      <TableNormalText>{history.changeAt}</TableNormalText>
                    </TableDataContainer>
                  </TableData>
                </TableRow>
              ))}
              {/* 데이터 끝 */}
            </HistoryTable>
          </Container>
        </>
      ) : (
        <Loading />
      )}
    </DefaultLayout>
  );
};

const TopNavCenterContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: auto;

  cursor: pointer;
`;

const TopNavTitle = styled.p`
  color: ${COLORS.secondaryColor};
  text-align: center;

  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const TopNavLeftContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);

  width: auto;
  height: 20px;

  cursor: pointer;
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

const PointsProgress = styled.progress`
  width: 100%;
  height: 28px;
  appearance: none;

  margin-top: 8px;

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
  justify-content: flex-start;
  align-items: center;
  gap: 0px;

  width: 100%;
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

const NextGradeInfo = styled.p`
  margin-left: 4px;

  color: ${COLORS.greyColor};

  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: inherit;

  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  height: 100%;

  background: ${COLORS.primaryColor};
`;

const HistoryTitle = styled.p`
  color: ${COLORS.secondaryColor};

  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  table-layout: fixed;
`;

const TableRow = styled.tr`
  border: none;

  &:not(:last-child) td {
    border-bottom: 1px solid ${COLORS.greyColor};
  }
`;

const TableHeader = styled.td`
  width: 120px;
  text-align: left;
`;

const TableData = styled.td`
  width: auto;
`;

const TableDataContainer = styled.div`
  display: flex;
  flex-direction: row;

  p {
    margin: 16px 0;
  }
`;

const TableNormalText = styled.p`
  color: ${COLORS.secondaryColor};

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const TableStrongText = styled.p`
  color: ${COLORS.secondaryColor};

  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export default BenefitPage;
