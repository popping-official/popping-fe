import { COLORS } from "@/public/styles/colors";
import { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { TopNavigation } from "../navigation/topnavigation";
import { LogoLettersMain } from "../components/logo";
import axiosInstance from "@/public/network/axios";
import { useRouter } from "next/navigation";
import { MainSortedData, SubwayMapItem } from "@/public/utils/types";
import PopupCard from "../components/main/popupCardComponents";

import DummyBanner1 from "@/public/images/dummy/dummy_banner1.jpg";
import DummyBanner2 from "@/public/images/dummy/dummy_banner2.jpg";
import DummyBanner3 from "@/public/images/dummy/dummy_banner3.jpg";

import { BottomBox, DefaultLayout } from "../components/layout";
import CustomJoyride from "../components/tour/CustomJoyride";
import { CallBackProps, STATUS, Step } from "react-joyride";
import { TourContainer } from "../components/tour/TourStyle";

const subway: SubwayMapItem[] = [
  {
    name: "성수역",
    coor: [127.055983543396, 37.54457732085582],
    image: "/images/subway/성수.svg",
  },
  {
    name: "강남역",
    coor: [127.02761650085449, 37.49796319921411],
    image: "/images/subway/강남.svg",
  },
  {
    name: "잠실역",
    coor: [127.10013270378113, 37.5132661890097],
    image: "/images/subway/잠실.svg",
  },
  {
    name: "용산역",
    coor: [126.96480184793472, 37.52988484762269],
    image: "/images/subway/용산.svg",
  },
  {
    name: "여의도역",
    coor: [126.92406177520752, 37.52163980072133],
    image: "/images/subway/여의도.svg",
  },
  {
    name: "홍대입구역",
    coor: [126.925950050354, 37.55811021038101],
    image: "/images/subway/홍대입구.svg",
  },
  {
    name: "압구정역",
    coor: [127.02849626541138, 37.52633678124275],
    image: "/images/subway/압구정.svg",
  },
  {
    name: "삼성역",
    coor: [127.06318259239197, 37.50887477317293],
    image: "/images/subway/삼성.svg",
  },
];

const HomePage: React.FC = () => {
  const router = useRouter();
  const parentDiv = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const hotPlaceRef = useRef<HTMLDivElement>(null);
  const famousPopupRef = useRef<HTMLDivElement>(null);
  const newPopupRef = useRef<HTMLDivElement>(null);

  const [parentWidth, setParentWidth] = useState<number>(0);
  const [sortPopularity, setSortPopularity] = useState<MainSortedData[]>([]);
  const [sortDate, setSortDate] = useState<MainSortedData[]>([]);

  const joyrideStatusKey = `joyride_status_home`;
  const [joyrideRun, setJoyrideRun] = useState<boolean>(false);
  const [steps, setSteps] = useState<Step[]>([]);

  const updateParentWidth = () => {
    if (parentDiv.current) {
      setParentWidth((parentDiv.current.offsetWidth / 4) * 3);
    }
  };

  const handlePlaceClick = async (coor: number[]) => {
    try {
      const response = await axiosInstance.get(
        `/api/maps/surround-popup?geoX=${coor[0]}&geoY=${coor[1]}&sorted=distance&meter=1000`
      );

      if (response.status === 200) {
        sessionStorage.setItem(
          "popupStores",
          JSON.stringify(response.data.popupStores)
        );
        sessionStorage.setItem("subwayCoor", JSON.stringify(coor));
        router.push("/popup-map?hotPlace=true");
      }
    } catch { }
  };

  const popupCardListAPI = async () => {
    try {
      const response = await axiosInstance.get(`/api/maps/main-popups`);

      if (response.status === 200) {
        setSortPopularity(response.data.sortPopularity);
        setSortDate(response.data.sortDate);
      }
    } catch { }
  };

  useEffect(() => {
    popupCardListAPI();
  }, []);

  useEffect(() => {
    updateParentWidth();
    window.addEventListener("resize", updateParentWidth);
    return () => {
      window.removeEventListener("resize", updateParentWidth);
    };
  }, [parentDiv]);

  useEffect(() => {
    const key = localStorage.getItem(joyrideStatusKey);
    if (key === "finished" || key === "skipped") {
      setJoyrideRun(false);
    } else {
      setJoyrideRun(true);
    }
  }, [router]);

  useEffect(() => {
    if (
      iconRef.current &&
      bannerRef.current &&
      hotPlaceRef.current &&
      famousPopupRef.current &&
      newPopupRef.current
    ) {
      setSteps([
        {
          target: "body",
          content: (
            <TourContainer>
              <h3>안녕하세요! 🍿</h3>
              <p>
                여러분들의 팝핑 여정에 도움을 드릴 <strong>팝콘</strong>입니다!
              </p>
              <p>
                제 가이드는 언제든지 <strong>마이페이지</strong>에서 다시 설정할
                수 있어요!
              </p>
            </TourContainer>
          ),
          title: "안녕하세요 !",
          placement: "center",
        },
        {
          target: iconRef.current,
          content: (
            <TourContainer>
              <h3>저희 팝핑의 로고입니다.</h3>
              <p>
                어디서든, 보이면 <strong>눌러주세요!</strong>
              </p>
              <p>다시 돌아올 수 있을거랍니다!</p>
            </TourContainer>
          ),
          title: "메인",
          placement: "bottom",
        },
        {
          target: bannerRef.current,
          content: (
            <TourContainer>
              <p>상단 배너를 통해</p>
              <p>
                현재 진행중인 <strong>이벤트</strong>, <strong>공지사항</strong>{" "}
                등
              </p>
              <p>다양한 정보를 한눈에 확인해보세요.</p>
            </TourContainer>
          ),
          title: "메인",
          placement: "bottom",
        },
        {
          target: hotPlaceRef.current,
          content: (
            <TourContainer>
              <p>
                현재 팝업으로 가장 🔥<strong>핫한</strong>🔥 지역에서 진행하는{" "}
              </p>
              <p>팝업들을 한눈에 확인해보세요!</p>
            </TourContainer>
          ),
          title: "메인",
          placement: "bottom",
        },
        {
          target: famousPopupRef.current,
          content: (
            <TourContainer>
              <p>어디를 가야할지 모르시겠다구요? 🤨</p>
              <p>
                그럴때는 <strong>인기 팝업스토어</strong>를 참고해보세요!
              </p>
            </TourContainer>
          ),
          title: "메인",
          placement: "bottom",
        },
        {
          target: newPopupRef.current,
          content: (
            <TourContainer>
              <p>누구보다 빠르게 나는 남들과는 다르게! </p>
              <p>
                <strong>새로운 팝업</strong> 소식을 빠르게 확인해보세요.
              </p>
            </TourContainer>
          ),
          title: "메인",
          placement: "bottom",
        },
      ]);
    }
  }, [
    iconRef,
    bannerRef,
    hotPlaceRef,
    famousPopupRef,
    newPopupRef,
  ]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setJoyrideRun(false);
      localStorage.setItem(joyrideStatusKey, status);
    }
  };

  return (
    <DefaultLayout top={0} right={0} bottom={0} left={0}>
      <CustomJoyride
        steps={steps}
        runStatus={joyrideRun}
        callback={handleJoyrideCallback}
      />
      <TopNavigation>
        <TopNavLogoContainer ref={iconRef}>
          <LogoLettersMain width={undefined} height={24} />
        </TopNavLogoContainer>
      </TopNavigation>

      <Container ref={parentDiv}>
        {/* 배너 */}
        <SwiperContainer ref={bannerRef}>
          <Swiper
            direction="horizontal"
            slidesPerView={1}
            spaceBetween={0}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            modules={[Autoplay]}
          >
            <SwiperSlide>
              <SlideBannerContainer
                height={parentWidth}
                image={DummyBanner2.src}
                onClick={() => {
                  router.push(`/online-popup/POPPING/store-opening`);
                }}
              />
            </SwiperSlide>
            <SwiperSlide>
              <SlideBannerContainer
                height={parentWidth}
                image={DummyBanner1.src}
              />
            </SwiperSlide>
            <SwiperSlide>
              <SlideBannerContainer
                height={parentWidth}
                image={DummyBanner3.src}
              />
            </SwiperSlide>
          </Swiper>
        </SwiperContainer>

        <Sections>
          <div ref={hotPlaceRef} style={{ zIndex: 5, fontSize: 18, fontWeight: 600 }}>HOT PLACE</div>
          <Section>
            <ContentsContainer>
              {subway.map((data: SubwayMapItem, index: number) => (
                <Place
                  key={"hp-{index}"}
                  image={data.image}
                  onClick={() => handlePlaceClick(data.coor)}
                />
              ))}
              {/* <Place image={DummyPlace4.src} onClick={() => handlePlaceClick('value')}/> */}
            </ContentsContainer>
          </Section>

          <PopupCard
            title="인기 팝업스토어"
            storeData={sortPopularity}
            ref={famousPopupRef}
          />
          <PopupCard
            title="새로운 팝업스토어"
            storeData={sortDate}
            ref={newPopupRef}
          />
        </Sections>
      </Container>
      <BottomBox />
    </DefaultLayout>
  );
};

const TopNavLogoContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: auto;
  height: 24px;

  z-index: 5;

  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  background: ${COLORS.primaryColor};
`;

const SwiperContainer = styled.div`
  width: 100%;
  
  z-index: 5;
`;

const SlideBannerContainer = styled.div<{ height: number; image: string }>`
  width: 100%;
  height: ${(props) => props.height}px;
  background: ${(props) =>
    props.image ? `url(${props.image})` : COLORS.greyColor};
  background-position: center;
  background-size: cover;

  z-index: 5;
  cursor: grab;
`;

const Sections = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  gap: 36px;

  margin: 36px 0 0 20px;

  span {
    color: ${COLORS.secondaryColor};
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

const Place = styled.div<{ image: string | null }>`
  flex: 0 0 auto;

  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: ${(props) =>
    props.image ? `url(${props.image})` : COLORS.greyColor};
  background-position: center;
  background-size: cover;

  cursor: pointer;
`;

export default HomePage;
