"use client";

import "swiper/css";
import Back from "@/app/components/back";
import { DefaultLayout } from "@/app/components/layout";
import { COLORS } from "@/public/styles/colors";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Follow, formatDate, FormatFollowers, KRWLocaleString } from "@/public/utils/function";
import {
  IconFollow,
  IconLocation,
  IconAderessPin,
  IconViews,
} from "@/app/components/icons";
import axiosInstance from "@/public/network/axios";
import { OpenTimeData, PopupStoreDataType } from "@/public/utils/types";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/loading";
import dayjs from "dayjs";
import NaverMap from "@/app/components/popup-map/NaverMap";
import { PlaceDataType } from "@/public/utils/types";
import SurroundRestaurantCard from "@/app/components/popup-map/SurroundRestaurantCard";
import DistanceRange from "@/app/components/popup-map/DistanceRange";
import Review from "@/app/components/Review";

const OfflinePopupStoreDetailPage: React.FC<{
  params: { popupId: string };
}> = ({ params }) => {
  const router = useRouter();
  const { popupId } = params;

  const parentDiv = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const [parentWidth, setParentWidth] = useState<number>(0);
  const [popupData, setPopupData] = useState<PopupStoreDataType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>();
  const [restaurantData, setRestaurantDate] = useState<PlaceDataType[]>([]);
  const [distance, setDistance] = useState<number[]>([1000]);

  const updateParentWidth = () => {
    if (parentDiv.current) {
      setParentWidth((parentDiv.current.offsetWidth / 1) * 1);
    }
  };

  useEffect(() => {
    PopupDetailData();
    const viewPopupList = sessionStorage.getItem("popupViewList");

    if (viewPopupList) {
      const parsedViewPopupList = JSON.parse(viewPopupList);

      if (
        Array.isArray(parsedViewPopupList) &&
        parsedViewPopupList.includes(popupId)
      ) {
      } else {
        viewCountAPI(parsedViewPopupList);
      }
    } else {
      viewCountAPI([]);
    }
  }, [router]);

  useEffect(() => {
    if (popupData) {
      SurroundPlaceData();
    }
  }, [popupData, distance]);

  useEffect(() => {
    popupData && SurroundPlaceData();
  }, [distance[0]]);

  useEffect(() => {
    if (restaurantData.length > 0) {
    }
  }, [restaurantData]);

  useEffect(() => {
    updateParentWidth();
    window.addEventListener("resize", updateParentWidth);
    return () => {
      window.removeEventListener("resize", updateParentWidth);
    };
  }, [parentDiv.current]);

  const viewCountAPI = async (parsedViewPopupList: string[]) => {
    try {
      const response = await axiosInstance.get(
        `/api/maps/view-count/${popupId}`
      );

      if (response.status === 200) {
        parsedViewPopupList.push(popupId); // 배열에 popupId 추가
        sessionStorage.setItem(
          "popupViewList",
          JSON.stringify(parsedViewPopupList)
        ); // 배열을 문자열로 변환하여 저장
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        router.push('/error/404');  // Redirect to 404 page
      }
    }
  };

  const PopupDetailData = async () => {
    try {
      const response = await axiosInstance.get(`/api/maps/popup/${popupId}`);

      if (response.status === 200) {
        setPopupData(response.data.popupData);
        setSaved(response.data.popupData.isSaved);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        // Handle unauthorized error
      }
    } finally {
      setLoading(false);
    }
  };


  //주변 맛집
  const SurroundPlaceData = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/maps/surround-place?popupId=${popupId}&meter=${distance[0]}`
      );

      if (response.status === 200) {
        setRestaurantDate(response.data.place);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        // Handle unauthorized error
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (popupData) {
      console.log(popupData.status)
    }
  }, [popupData])

  if (loading) {
    return (
      <DefaultLayout top={0} left={0} right={0} bottom={0}>
        <SkeletonSwiperContainer>
          <SkeletonSlide />
        </SkeletonSwiperContainer>
      </DefaultLayout>
    );
  }



  if (!popupData) return <Loading />;



  const handleBookmarkClick = async (id: string) => {
    setSaved(!saved);
    if (saved) {
      setPopupData({
        ...popupData,
        saveCount: popupData.saveCount - 1,
      });
    } else {
      setPopupData({
        ...popupData,
        saveCount: popupData.saveCount + 1,
      });
    }
    Follow("Popup", id, router);
  };

  const TagClick = (tag: string) => {
    router.push(
      `/popup-map/map-search-result?search=${tag}&redirect=${encodeURIComponent(window.location.href)}`
    )
  }

  return (
    <DefaultLayout top={0} left={0} right={0} bottom={0}>
      <SwiperContainer>
        <div style={{ position: "absolute", zIndex: 2, left: 20, top: 16 }}>
          <Back url={undefined} color={COLORS.primaryColor} />
        </div>
        <Swiper
          modules={[Autoplay]}
          direction="horizontal"
          slidesPerView={1}
          spaceBetween={0}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
        >
          {popupData.image.map((image: string, index: number) => (
            <SwiperSlide key={`popup-image-${index}`}>
              <SlideBannerContainer
                height={parentWidth}
                image={`data:image/webp;base64,${image}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </SwiperContainer>

      <PopupContainer ref={parentDiv}>
        <PopupInfo>
          <PopupHeader>
            <HeaderLeft>
              <PopupTitle>
                <h3>{popupData.title}</h3>
              </PopupTitle>
              <PopupLocation
                onClick={() => {
                  if (locationRef.current) {
                    locationRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {popupData.location.address}
              </PopupLocation>
              <PopupDate>
                <BrandStateBadge
                  style={{
                    color: COLORS.primaryColor,
                    backgroundColor: popupData.status === 1 ? COLORS.mainColor : COLORS.greyColor,
                  }}
                >
                  {popupData.status === 1 ? "진행중" : popupData.status === 2 ? "진행 예정" : "종료"}
                </BrandStateBadge>
                <span>
                  {formatDate(popupData.date.start)} ~{" "}
                  {formatDate(popupData.date.end)}
                </span>
              </PopupDate>
            </HeaderLeft>
            <PopupBookmark
              onClick={(event) => {
                event.stopPropagation(); // 부모 요소로의 이벤트 전파를 막음
                handleBookmarkClick(popupId);
              }}
            >
              <IconFollow
                color={saved ? COLORS.mainColor : COLORS.greyColor}
                width={20}
                height={27}
              />
              <span>{FormatFollowers(popupData.saveCount)}</span>
            </PopupBookmark>
          </PopupHeader>
          <PopupView>
            <IconViews
              color={COLORS.greyColor}
              width={undefined}
              height={12}
            />
            <span>{FormatFollowers(popupData.viewCount)}명이 조회했어요</span>
          </PopupView>

          <PopupTagContainer>
            {/* TODO Tag는 10개까지만 보여주고, ... 누를시에 더보기 */}
            {popupData.tag.map((tagName: string, index: number) => (
              <PopupTag
                key={`tag-${index}`}
                onClick={() => TagClick(tagName)}>
                #{tagName}
              </PopupTag>
            ))}
          </PopupTagContainer>
        </PopupInfo>


        <PopupContent>
          <PopupContentTitle>입장 가능 시간</PopupContentTitle>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,

          }}>
            {popupData.openTime.map((day: OpenTimeData, index: number) => (
              <PopupTime key={`time-${index}`}>
                <span>
                  {day.day}
                </span>
                <span>
                  {day.startTime} ~ {day.endTime}
                </span>
              </PopupTime>
            ))}
          </div>
        </PopupContent>



        <PopupContent>
          <PopupContentTitle>설명</PopupContentTitle>
          <PopupDescription>
            {popupData.description.map((text: string, index: number) =>
              text === "\n" ? (
                <br key={index} />
              ) : (
                <span key={`description-${index}`}>{text}</span>
              )
            )}
          </PopupDescription>
        </PopupContent>

        <PopupContent>
          <PopupContentTitle ref={locationRef}>위치</PopupContentTitle>
          <PopupLocation>
            {popupData.location.address},{popupData.location.placeName}
          </PopupLocation>
          <NaverMap
            latitude={popupData.location.geoData.coordinates[1]}
            longitude={popupData.location.geoData.coordinates[0]}
            location={popupData.location.address}
            title={popupData.title}
          />
        </PopupContent>

        {/* TODO 리뷰리뷰리뷰리뷰리뷰리뷰리  */}
        <PopupContent>
          <PopupContentTitle>리뷰 <span>{KRWLocaleString(1999)}</span></PopupContentTitle>
          <ReviewContainer>
            <Review />
            <Review />
            <Review />
            <ReviewShowAll>리뷰 모두보기</ReviewShowAll>
          </ReviewContainer>
        </PopupContent>

        {/* #TODO  */}

        <PopupContent>
          <PopupContentTitle ref={locationRef}>
            {/* {(distance[0] / 1000).toFixed(1)}km 이내 맛집 & 카페 */}
            주변 가볼만 한 곳
          </PopupContentTitle>
          {/* <TitleArea>
            <RangeContainer>
              <div className={"range-text"}>1km</div>
              <DistanceRange
                distance={distance}
                rangeMin={1000}
                rangeMax={2000}
                step={100}
                onChange={(values: number[]) => setDistance(values)}
              />
              <div className={"range-text"}>2km</div>
            </RangeContainer>
          </TitleArea> */}
          <HorizontalList>
            {restaurantData.length > 0 && (
              <>
                {restaurantData.map(
                  (restaurant, index) =>
                    index < 30 && (
                      //30개 제한 출력
                      <SurroundRestaurantCard
                        key={index}
                        restaurantData={restaurant}
                      />
                    )
                )}
              </>
            )}
          </HorizontalList>
        </PopupContent>




        {/* <PopupContent>
          <PopupContentTitle>추가정보</PopupContentTitle>
          <AdditionalInfoContainer>
            <AdditionalInfo>
              {popupData.homepage &&
                <PopupLink>{popupData.homepage}</PopupLink>
              }
              {popupData.sns &&
                <PopupLink>{popupData.sns}</PopupLink>
              }
            </AdditionalInfo>
            <AdditionalInfo>
              {popupData.homepage &&
                <PopupLink>{popupData.homepage}</PopupLink>
              }
              {popupData.sns &&
                <PopupLink>{popupData.sns}</PopupLink>
              }
            </AdditionalInfo>
          </AdditionalInfoContainer>
        </PopupContent> */}
      </PopupContainer>
    </DefaultLayout>
  );
};

const BrandStateBadge = styled.span`
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  font-style: normal;
  line-height: normal;

  color: ${COLORS.primaryColor};
`;

// Swiper 컨테이너에 대한 스타일링을 추가합니다.
const SwiperContainer = styled.div`
  width: 100%;
  position: relative;
`;

const SlideBannerContainer = styled.div<{ height: number; image: string }>`
  width: 100%;
  padding-top: 100%; /* 1:1 비율 유지 */
  background-image: url(${(props) => props.image});
  background-color: ${COLORS.greyColor};
  background-position: center;
  background-size: cover;
  cursor: grab;
`;

// 스켈레톤 스타일을 추가합니다.
const SkeletonSwiperContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
`;

const SkeletonSlide = styled.div`
  width: 100%;
  padding-top: 100%; /* 1:1 비율 */
  background-color: ${COLORS.greyColor};

  /* 애니메이션 효과 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.2) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.2) 75%);
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

// 나머지 스타일링
const PopupContainer = styled.div`
  width: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  align-items: start;
  position: relative;
  background-color: ${COLORS.primaryColor};
  gap: 32px;
  padding-left: 20px;
  padding-bottom: 80px;
`;

const PopupInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PopupHeader = styled.div`
  width: calc(100% -20px);
  display: flex;
  flex-direction: row;
  gap: 32px;
  margin-top: 24px;
  align-items: flex-start;
  justify-content: space-between;
  padding-right: 20px;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
`;

const PopupLocation = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${COLORS.secondaryColor};
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
`;

const PopupTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 8px;

  & > h3 {
    font-size: 24px;
    font-weight: 600;
    word-break: break-all;
  }
`;

const PopupDate = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  & > span {
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
  }
`;

const PopupBookmark = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;

  & > span {
    font-weight: 600;
  }
`;
const PopupView = styled.div`
  display: flex;
  flex-direction: row;

  gap: 12px;
  align-items: center;

  & > span {
    font-weight: 500;
    font-size: 12px;
    line-height: normal;
    color: ${COLORS.greyColor};
  }
`;

const PopupTagContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;

  flex-wrap: wrap;

  padding-right: 20px;
`;

const PopupTag = styled.div`
  cursor: pointer;

  flex: 0 0 auto;
  text-align: center;
  border-radius: 4px;
  border: 1px solid ${COLORS.mainColor};
  box-sizing: border-box;

  padding: 4px 8px;

  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: ${COLORS.mainColor};

  &:hover {
    background-color: ${COLORS.mainColor};
    color: ${COLORS.primaryColor};
  } 
`;

const PopupContent = styled.div`
  width: calc(100% - 20px);
  display: flex;
  flex-direction: column;



  align-items: flex-start;
  justify-content: center;

  gap: 20px;
  padding-right: 20px;
`;

const PopupContentTitle = styled.p`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;

  gap: 4px;
`;

const ReviewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  gap: 24px;

  align-items: start;
`

const ReviewShowAll = styled.span`
  cursor: pointer;
  margin-top: 8px;

  font-size: 12px;
  font-weight: 500;
  line-height: normal;

  align-self: center;

  color: ${COLORS.mainColor};
`

const PopupTime = styled.div`
  display: flex;
  flex-direction: row;

  gap: 8px;

  &>span {
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
  }
  
`

const PopupDescription = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  & span {
    font-size: 14px;
    line-height: 20px;
  }
`;

const TitleArea = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  .input-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const HorizontalList = styled.div`
  display: flex;
  align-items: center;

  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  gap: 20px 0;

  width: 100%;

`;

const RangeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 280px;

  .range-text {
    font-size: 14px;
    font-weight: 700;
    font-style: normal;
    line-height: normal;
  }
`;
const AdditionalInfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;

  gap: 20px;
`


const AdditionalInfo = styled.div`
  
`


const PopupLink = styled.div`
  width: calc(100% - 20px) ;
  background-color: ${COLORS.lightGreyColor};

  border-radius: 8px;
  padding: 4px 16px;
  
  word-break: break-all;
`

export default OfflinePopupStoreDetailPage;
