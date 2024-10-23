"use client";
import styled, { css, keyframes } from "styled-components";
import { COLORS } from "@/public/styles/colors";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import axiosInstance from "@/public/network/axios";
import { DefaultLayout } from "@/app/components/layout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandType } from "@/public/utils/types";
import Back from "@/app/components/back";
import { CallBackProps, STATUS, Step } from 'react-joyride';
import { Loading } from "@/app/components/loading";
import CustomJoyride from "@/app/components/tour/CustomJoyride";
import { TourContainer } from "@/app/components/tour/TourStyle";
import { IconFollow, IconStamp } from "@/app/components/icons";
import { Follow, FormatFollowers } from "@/public/utils/function";
import Image from "next/image";

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

interface StampState {
  step1: StampStep;
  step2: StampStep;
  step3: StampStep;
  step4: StampStep;
  step5: StampStep;
}

interface StampStep {
  status: boolean;
  url: string;
  name: string;
}


const OnlinePopUpOpenningPage: React.FC<{ params: { storeId: string } }> = ({
  params,
}) => {
  const router = useRouter();
  const { storeId } = params;

  const joyrideStatusKey = `joyride_status_${storeId}_openning`;
  const joyride2StatusKey = `joyride2_status_${storeId}_openning`;


  // const brandRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  const [openingData, setOpeningData] = useState<BrandType>();

  const [joyrideRun, setJoyrideRun] = useState<boolean>(false);
  const [joyrideRun2, setJoyrideRun2] = useState<boolean>(false);

  const [steps, setSteps] = useState<Step[]>([]);
  const [steps2, setSteps2] = useState<Step[]>([]);

  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isAnimatingComp, setIsAnimatingComp] = useState<boolean>(false);
  const [parentWidth, setParentWidth] = useState<number>(0);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);

  const [stampState, setStampState] = useState<StampState>({
    step1: { status: false, url: '', name: '입장확인' },
    step2: { status: false, url: '', name: '소개' },
    step3: { status: false, url: 'play/timing-challenge', name: '타이밍을 잡아라!' },
    step4: { status: false, url: 'play/ox-quiz', name: 'OX 퀴즈' },
    step5: { status: false, url: 'https://www.instagram.com/popping.app?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', name: '인스타그램 방문' },
  });
  const [stampModalName, setStampModalName] = useState<string>();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [infoModal, setInfoModal] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(5);


  const updateParentWidth = () => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      if (width > 0) {
        setParentWidth((width / 4) * 3);
      }
    }
  };

  useLayoutEffect(() => {
    if (containerRef.current) {
      updateParentWidth();
      window.addEventListener("resize", updateParentWidth);
    }

    return () => {
      window.removeEventListener("resize", updateParentWidth);
    };
  }, [containerRef.current]);


  useEffect(() => {
    BrandDataGetAPI();
    const storedStatus = localStorage.getItem(joyrideStatusKey);
    const check = localStorage.getItem('POPPING_Stamp_step1');
    if (check) {
      setIsAnimatingComp(true)
    }
    if (storedStatus === "finished" || storedStatus === "skipped") {
      setJoyrideRun(false);
    } else {
      setJoyrideRun(true);
    }
  }, [router]);

  useEffect(() => {
    if (!joyrideRun) {
      // Chained timeout operations
      const timer = setTimeout(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setIsAnimatingComp(true);
        }, 1000);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [joyrideRun]);

  useEffect(() => {
    if (isAnimatingComp) {
      const storedStatus = localStorage.getItem(joyride2StatusKey);
      if (storedStatus === "finished" || storedStatus === "skipped") {
        setJoyrideRun2(false);
        localStorageCheck();
      } else {
        setJoyrideRun2(true);
      }
    }
  }, [isAnimatingComp])

  useEffect(() => {
    if (!joyrideRun2 && isAnimatingComp) {
      // Chained timeout operations
      localStorageCheck();
    }
  }, [joyrideRun2]);

  const localStorageCheck = () => {
    if (!localStorage.getItem(`${storeId.toUpperCase()}_Stamp_step1`)) {
      showStampModal(stampState.step1.name);
      setStampState((prevState) => ({
        ...prevState,
        step1: {
          ...prevState.step1,
          status: true,
        },
      }));
      const value = JSON.stringify({ status: true, view: true });
      localStorage.setItem(`${storeId.toUpperCase()}_Stamp_step1`, value);
    } else {
      setStampState((prevState) => ({
        ...prevState,
        step1: {
          ...prevState.step1,
          status: true,
        },
      }));
    }
    const LocalStep2 = localStorage.getItem(`${storeId.toUpperCase()}_Stamp_step2`)
    const LocalStep3 = localStorage.getItem(`${storeId.toUpperCase()}_Stamp_step3`)
    const LocalStep4 = localStorage.getItem(`${storeId.toUpperCase()}_Stamp_step4`)
    const LocalStep5 = localStorage.getItem(`${storeId.toUpperCase()}_Stamp_step5`)

    let parsedValue = LocalStep2 ? JSON.parse(LocalStep2) : {};
    if (parsedValue.status) {
      if (!parsedValue.view) {
        showStampModal(stampState.step2.name);
      }
      setStampState((prevState) => ({
        ...prevState,
        step2: {
          ...prevState.step2,
          status: true,
        },
      }));
      const value = JSON.stringify({ status: true, view: true });
      localStorage.setItem(`${storeId.toUpperCase()}_Stamp_step2`, value);
    }

    parsedValue = LocalStep3 ? JSON.parse(LocalStep3) : {};
    if (parsedValue.status) {
      if (!parsedValue.view) {
        showStampModal(stampState.step3.name);
      }
      setStampState((prevState) => ({
        ...prevState,
        step3: {
          ...prevState.step3,
          status: true,
        },
      }));
      const value = JSON.stringify({ status: true, view: true });
      localStorage.setItem(`${storeId.toUpperCase()}_Stamp_step3`, value);
    }

    parsedValue = LocalStep4 ? JSON.parse(LocalStep4) : {};
    if (parsedValue.status) {
      if (!parsedValue.view) {
        showStampModal(stampState.step4.name);
      }
      setStampState((prevState) => ({
        ...prevState,
        step4: {
          ...prevState.step4,
          status: true,
        },
      }));
      const value = JSON.stringify({ status: true, view: true });
      localStorage.setItem(`${storeId.toUpperCase()}_Stamp_step4`, value);
    }

    parsedValue = LocalStep5 ? JSON.parse(LocalStep5) : {};
    if (parsedValue.status) {
      if (!parsedValue.view) {
        showStampModal(stampState.step5.name);
      }
      setStampState((prevState) => ({
        ...prevState,
        step5: {
          ...prevState.step5,
          status: true,
        },
      }));
      const value = JSON.stringify({ status: true, view: true });
      localStorage.setItem(`${storeId.toUpperCase()}_Stamp_step5`, value);
    }
  }

  const storeFollowHandler = () => {
    if (openingData) {
      const updatedSaved = isFollowed
        ? openingData.saved - 1
        : openingData.saved + 1;
      Follow("Brands", openingData.id, router);
      setOpeningData({
        ...openingData,
        saved: updatedSaved,
      });
      setIsFollowed(!isFollowed);
    }
  };

  const brandRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setSteps([
        {
          target: 'body',
          content: (
            <TourContainer>
              <h3>안녕하세요!</h3>
              <p><strong>{storeId.toUpperCase()} STORE</strong> 팝업스토어에 오신걸</p>
              <p>🎉 환영합니다! 🎉</p>
            </TourContainer>
          ),
          title: '온라인 팝업스토어',
          placement: 'center',
        },
        {
          target: node,
          content: (
            <TourContainer>
              <h3>지금 입장한 <strong>팝업스토어의 설명 부분</strong>이에요.</h3>
              <p>브랜드의 로고, 팝업스토어 이름, 설명 등 정보들을 얻을 수 있답니다!</p>
            </TourContainer>
          ),
          title: `${storeId.toUpperCase()} STORE`,
          placement: 'top',
        },
        {
          target: 'body',
          content: (
            <TourContainer>
              <h3>그렇다면, 팝업스토어로 한번 들어가 볼까요 ?</h3>
              <p>이동에 <strong>2초</strong>정도 소요됩니다! </p>
              <p>🏃🏃🏃</p>

            </TourContainer>
          ),
          title: `${storeId.toUpperCase()} STORE`,
          placement: 'center',
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (stampRef.current && enterRef.current && captionRef.current) {
      setSteps2([
        {
          target: 'body',
          content: (
            <TourContainer>
              <h3>안녕하세요, 또 뵙네요!</h3>
              <p>이 페이지는 팝업스토어를 더욱 재미있게 즐기기 위한 </p>
              <p><strong>스탬프 투어</strong>입니다.</p>
            </TourContainer>
          ),
          title: `${storeId.toUpperCase()} STORE`,
          placement: 'center',
        },
        {
          target: stampRef.current,
          content: (
            <TourContainer>
              <h3>여러분들이 팝업스토어에서 모아야할 스탬프들이에요!</h3>
            </TourContainer>
          ),
          title: '팝업스토어 스탬프',
          placement: 'top',
        },
        {
          target: enterRef.current,
          content: (
            <TourContainer>
              <h3><strong>참가해보세요!</strong></h3>
            </TourContainer>
          ),
          title: `${storeId.toUpperCase()} STORE`,
          placement: 'top',
        },
        {
          target: captionRef.current,
          content: (
            <TourContainer>
              <h3>유의사항도 꼭 확인해주세요!</h3>
              <p>스탬프 투어에 큰 <strong>힌트</strong>가 들어있을 수도 있어요 !</p>
            </TourContainer>
          ),
          title: `${storeId.toUpperCase()} STORE`,
          placement: 'top',
        },
        {
          target: 'body',
          content: (
            <TourContainer>
              <h3>일단 스탬프 하나는 저 팝콘이 찍어드릴게요!</h3>
              <p><strong>얍!</strong></p>
              💪💪💪 🍿
            </TourContainer>
          ),
          title: `${storeId.toUpperCase()} STORE`,
          placement: 'center',
        },
      ]);
    }
  }, [stampRef.current, enterRef.current, captionRef.current]);



  const showStampModal = (name: string) => {
    setShowModal(true);
    setStampModalName(name);
    setTimeout(() => {
      const stampElement = document.getElementById('stamp-image');
      if (stampElement) {
        stampElement.classList.add('stamp-animation');
      }
    }, 100);
  };


  const BrandDataGetAPI = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/popup/brand/store/main/${storeId}`
      );
      if (response.status === 200) {
        setOpeningData(response.data.brand);
        setIsFollowed(response.data.brand.isSaved);
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        alert("없음");
      }
    }
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setJoyrideRun(false);
      localStorage.setItem(joyrideStatusKey, status);
    }
  };

  const handleJoyride2Callback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setJoyrideRun2(false);
      localStorage.setItem(joyride2StatusKey, status);
    }
  };

  const EnterOnClick = (url: string, index: number) => {
    if (index === 4) {
      window.open(url, '_blank')
      const value = JSON.stringify({ status: true, view: false });
      localStorage.setItem(`${storeId.toUpperCase()}_Stamp_step5`, value);
      localStorageCheck();
    }

    if (index === 1) {
      setInfoModal(true);
    }
  }


  useEffect(() => {
    if (infoModal && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [infoModal, countdown]);


  if (!openingData) return <Loading />;
  return (
    <DefaultLayout top={0} left={0} right={0} bottom={0} >
      {isAnimatingComp ?
        <>
          <Container className={isAnimatingComp ? "fade-in" : ""} >
            <CustomJoyride steps={steps2} runStatus={joyrideRun2} callback={handleJoyride2Callback} />
            <div style={{ position: "absolute", top: 16, left: 20 }}>
              <Back url={"/online-popup"} color={undefined} />
            </div>
            <StoreThumbnailContainer
              src={openingData.thumbnail}
              height={parentWidth}
            />
            <StoreMainPageContainer>
              <StoreInfoContainer>
                <StoreInfoHeader>
                  <StoreName>{storeId.toUpperCase()} STORE</StoreName>
                  <StoreDesc>{openingData.description}</StoreDesc>
                </StoreInfoHeader>

                <StoreSave onClick={() => storeFollowHandler()}>
                  {isFollowed ? (
                    <IconFollow
                      color={COLORS.mainColor}
                      width={undefined}
                      height={30}
                    />
                  ) : (
                    <IconFollow
                      color={COLORS.greyColor}
                      width={undefined}
                      height={30}
                    />
                  )}
                  <span>{FormatFollowers(openingData.saved)}</span>
                </StoreSave>
              </StoreInfoContainer>

              <StoreStampContainer>
                <Title>입장 스탬프</Title>
                <Stamps ref={stampRef}>
                  {Object.entries(stampState).map(([key, value], index) => (
                    <Stamp key={key} status={value.status}>
                      {!value.status && index === 1 && (
                        <EnterDiv onClick={() => EnterOnClick(value.url, index)} ref={enterRef}>
                          참가하기
                        </EnterDiv>)}
                      {!value.status && index === 2 && (
                        <EnterButton href={value.url}>
                          참가하기
                        </EnterButton>)}
                      {!value.status && index === 4 && (
                        <EnterDiv onClick={() => EnterOnClick(value.url, index)}>
                          참가하기
                        </EnterDiv>)}
                      {!value.status && index !== 1 && index !== 2 && index !== 4 && (<EnterButton href={value.url} >
                        참가하기
                      </EnterButton>)}
                      <div style={{ opacity: value.status ? 1 : .5 }}>
                        <IconStamp color={COLORS.mainColor} width={84} height={84} />
                      </div>
                      <StampTitle>{index + 1}. {value.name}</StampTitle>
                    </Stamp>
                  ))}
                </Stamps>
              </StoreStampContainer>

              <StoreStampContainer>
                <Title ref={captionRef}>유의사항 안내</Title>
                <Caption>
                  * OX 퀴즈 Tip! <br /><br />
                  [2. 소개] 부분을 잘 읽어주세요 ! <br />(매인 색상의 글씨를 주목하세요!)<br /><br />
                  유의사항이 없어요 ! 재미있게 즐겨주세요 !
                </Caption>
                <div style={{ height: 100 }}></div>
              </StoreStampContainer>
              {Object.values(stampState).every(step => step.status === true) ? (
                // 모든 step들의 status가 true일 때 표시할 내용
                <BottomButton
                  status={true}
                  onClick={() => router.push('store-main')}>입장하기</BottomButton>
              ) : (
                <BottomButton status={false}>입장하기</BottomButton>
              )}
            </StoreMainPageContainer>
          </Container>
        </>
        :
        <ContentContainer className={isAnimating ? "fade-out" : ""} ref={containerRef}>
          <OpeningImage src={openingData.thumbnail} />
          <div style={{ position: 'absolute', left: 20, top: 16, zIndex: 2 }}>
            <Back url={'/online-popup'} />
          </div>
          <Overlay />
          <CustomJoyride steps={steps} runStatus={joyrideRun} callback={handleJoyrideCallback} />
          <OpeningPageContainer>
            <OpeningPageContentsContainer>
              <BrandInfo ref={brandRef}>
                <BrandIcon src={openingData.logo} alt="Brand Icon" />
                <BrandName>{storeId.toUpperCase()}</BrandName>
                <BrandDesc>{openingData.description}</BrandDesc>
              </BrandInfo>
            </OpeningPageContentsContainer>
          </OpeningPageContainer>
        </ContentContainer>
      }

      {showModal && (
        <StampModal>
          <StampImage>
            <IconStamp color={COLORS.mainColor} width={150} height={150} />
          </StampImage>
          <StampDescription>{stampModalName} 스탬프 획득!</StampDescription>
          <ConfirmButton onClick={() => setShowModal(false)}>확인</ConfirmButton>
        </StampModal>
      )}

      {infoModal && (
        <StampModal>
          <InfoModalContainer>
            <InfoModalContent>
              <StoreName>{storeId.toUpperCase()}</StoreName>
              <StoreDesc>
                안녕하세요 😊 <br />
                <span>팝업은 현재 진행중! 내 손에서 펼쳐지는 팝업스토어</span> 팝핑입니다.
                <br /><br />
                저희 팝핑은 팝업스토어처럼 팝팝 튀는 매력의 <span>5명팀인 Developop</span>입니다.
                <br /><br />
                해당 서비스에선 총 두 분류의 유저로 나뉘어져서 각 유저별로 각기 다른 기능들을 체험해보실 수 있습니다.
                <br /><br />
                - POPPLE 🙋🏻‍♂️🙋🏻‍♀️ <span>(POPUP + PEOPLE)</span>
                <br />
                <br />
                일반 유저입니다. 체험가능한 주요한 기능으로는 팝업지도(오프라인 팝업스토어, 주변 맛집&카페 정보), 온라인 팝업스토어입니다.
                <br /><br />
                - POPPER 🏭 <span>(POPUP + -ER)</span>
                <br />
                <br />
                브랜드 유저입니다. 체험가능한 주요한 기능으로는 팝업지도(오프라인 팝업스토어, 주변 맛집&카페 정보), 주변 상권정보, 온라인 팝업스토어 관리 입니다.
                <br /><br />
              </StoreDesc>
            </InfoModalContent>
            <InfoModalBottom>
              <InfoCloseButton
                onClick={() => {
                  setInfoModal(false);
                  const value = JSON.stringify({ status: true, view: false });
                  localStorage.setItem(`${storeId.toUpperCase()}_Stamp_step2`, value);
                  localStorageCheck();
                }}>
                확인
              </InfoCloseButton>
            </InfoModalBottom>
          </InfoModalContainer>
        </StampModal>
      )}
    </DefaultLayout>
  );
}

const ContentContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100dvh;
  transition: opacity 1s ease-in-out;
  &.fade-out {
    animation: ${fadeOut} 1s forwards;
  }

`;

const OpeningImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
  z-index: 0;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(25, 25, 25, 0.8) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  z-index: 1;
`;

const OpeningPageContainer = styled.div`
  width: calc(100% - 40px);
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 2;
`;

const OpeningPageContentsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 40px;
`;

const BrandInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 8px;
  color: ${COLORS.greyColor};
`;

const BrandIcon = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
`;

const BrandName = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: ${COLORS.primaryColor};
`;

const BrandDesc = styled.p`
  margin-top: 16px;
  font-size: 16px;
  font-weight: 550;
  line-height: 160%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  width: 100%;
  background-color: ${COLORS.primaryColor};
  &.fade-in {
    animation: ${fadeIn} 1s forwards;
  }
`;

const StoreThumbnailContainer = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StoreMainPageContainer = styled.div`
  height: 100%;
  width: calc(100% - 40px);
  padding: 0 20px;
`;

const StoreInfoContainer = styled.div`
  display: flex;
  flex-direction: row;

  justify-content: space-between;

  gap: 8px;
  padding-top: 20px;
`;

const StoreInfoHeader = styled.div`
  display: flex;
  flex-direction: column;

  gap: 8px;
`;

const StoreName = styled.h2`
  font-size: 32px;
  font-weight: 600;
`;

const StoreSave = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 4px;
  font-size: 12px;
  font-weight: 500;

  & > span {
    font-weight: 600;
  }
`;

const StoreDesc = styled.p`
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  line-height: 120%;

  word-break: keep-all;

  & span {
    font-weight: 600;
    color: ${COLORS.mainColor};
  }
`;

const Title = styled.span`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`

const StoreStampContainer = styled.div`
  gap: 12px;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
`;

const Stamps = styled.div`
  width: 100%;

  display: flex;
  flex-direction: row;

  flex-grow: 1;
  flex-wrap: wrap;

  gap: 40px 0;

  align-items: center;
  justify-content: center;
  background-color: ${COLORS.lightGreyColor};
  padding: 20px 0;

  border-radius: 16px;

`

const Stamp = styled.div<{ status: boolean }>`
  width: 32%;
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
  gap: 8px;

  position: relative;
  ${(props) => (!props.status &&
    `
      & > img {
        opacity: .5;
      }
    `
  )}
`
const EnterButton = styled(Link)`
  cursor: pointer;
  position: absolute; /* 변경: absolute 위치 조정 */
  top: -34px; /* 조정: 이미지 위에 8px 위에 위치하도록 함 */
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;

  color: ${COLORS.primaryColor};
  background-color: ${COLORS.mainColor};
  padding: 4px 12px;

  font-size: 12px;
  font-style: normal;
  font-weight: 600;

  z-index: 2;
  word-break: keep-all;

  &:after {
    content: "";
    position: absolute;
    border-top: 6px solid ${COLORS.mainColor};
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 0px solid transparent;
    bottom: -6px; /* 조정: 꼬리 부분이 본체에 붙도록 함 */
    left: 50%; /* 조정: 꼬리 부분이 중앙에 위치하도록 함 */
    transform: translateX(-50%); /* 조정: 꼬리 부분이 정확히 중앙에 위치하도록 함 */
  }
`;

const EnterDiv = styled.div`
  cursor: pointer;
  position: absolute; /* 변경: absolute 위치 조정 */
  top: -34px; /* 조정: 이미지 위에 8px 위에 위치하도록 함 */
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;

  color: ${COLORS.primaryColor};
  background-color: ${COLORS.mainColor};
  padding: 4px 12px;

  font-size: 12px;
  font-style: normal;
  font-weight: 600;

  z-index: 2;
  word-break: keep-all;

  &:after {
    content: "";
    position: absolute;
    border-top: 6px solid ${COLORS.mainColor};
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 0px solid transparent;
    bottom: -6px; /* 조정: 꼬리 부분이 본체에 붙도록 함 */
    left: 50%; /* 조정: 꼬리 부분이 중앙에 위치하도록 함 */
    transform: translateX(-50%); /* 조정: 꼬리 부분이 정확히 중앙에 위치하도록 함 */
  }
`;

const StampTitle = styled.p`
  margin: 0;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
`

const Caption = styled.span`
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`

const BottomButton = styled.div<{ status: boolean }>`
  width: calc(100% - 40px);

  display: flex;
  align-items: center;
  justify-content: center;

  position: fixed;

  bottom: 32px;
  left: 50%;
  transform: translate(-50%, 100%); /* 시작 위치를 아래로 설정 */
  z-index: 4;

  background-color: ${(props) => props.status ? COLORS.mainColor : COLORS.greyColor};
  padding: 16px 0;
  border-radius: 8px;

  font-size: 16px;
  font-weight: 600;
  color: ${COLORS.primaryColor};

  /* 애니메이션 추가 */
  animation: slide-up 0.5s ease-out forwards;
  @keyframes slide-up {
    from {
      transform: translate(-50%, 100%); /* 아래에서 시작 */
    }
    to {
      transform: translate(-50%, 0); /* 원래 위치로 이동 */
    }
  }
`;

const stampAnimation = keyframes`
  0% {
    transform: scale(2);
    opacity: 0;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const StampModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 20px;

  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const ModalContainer = styled.div`
  width: 300px;
  height: 100%;
  max-height: 500px;

  border-radius: 16px;

  padding: 0 20px;

  background-color: ${COLORS.primaryColor};
`

const StampImage = styled.div`
  animation: ${stampAnimation} 0.5s ease-in-out;
`;

const StampDescription = styled.span`
  font-size: 14px;
  font-weight: 600;

  color: ${COLORS.primaryColor};

`

const ConfirmButton = styled.button`
  cursor: pointer;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  background-color: ${COLORS.mainColor};
  color:  ${COLORS.primaryColor};
  border: none;
  border-radius: 8px;
`;

const CloseButton = styled.button`
  cursor: pointer;
  border: none;

  padding: 12px 32px;

  border-radius: 8px;

  background-color: ${COLORS.mainColor};
  color: ${COLORS.primaryColor};

  font-size: 14px;
  font-style: normal;
  font-weight: 600;
`
const InfoModalContainer = styled(ModalContainer)`
  padding: 20px;
  max-width: 400px;
  text-align: center;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const InfoModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`

const InfoModalBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const InfoCloseButton = styled(CloseButton)`
  margin-top: 20px;
  width: 100%;
`;



export default OnlinePopUpOpenningPage;