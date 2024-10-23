import React from 'react'; // React import 추가
import { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { COLORS } from "@/public/styles/colors";
import { IconHeart } from "../icons";
import { useRouter } from "next/navigation";
import { PopupStoreDataType } from "@/public/utils/types";
import { Follow } from "@/public/utils/function";
import Image from "next/image"; // Next.js의 Image 컴포넌트 import

interface StoreCardProps {
  store: PopupStoreDataType;
  isPopper: boolean;
}

// 컴포넌트에 displayName 추가
const StoreCard: React.FC<StoreCardProps> = React.memo(({ store, isPopper }: StoreCardProps) => {
  const router = useRouter();
  const [saved, setSaved] = useState<boolean>(store.isSaved);
  const [popupData, setPopupData] = useState<PopupStoreDataType>(store);
  const [imageSrc, setImageSrc] = useState<string>("/images/image-placeholder.svg");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(`data:image/webp;base64,${store.image}`);
            observer.unobserve(entry.target); // 이미 로드된 경우 관찰 중지
          }
        });
      },
      { threshold: 0.1 }
    );

    const imgElement = document.getElementById(`store-image-${store.id}`);
    if (imgElement) {
      observer.observe(imgElement);
    }

    return () => {
      if (imgElement) {
        observer.unobserve(imgElement);
      }
    };
  }, [store.image]);

  const onClickHandler = (popupId: string) => {
    router.push(`/popup-map/${popupId}`);
  };

  const handleBookmarkClick = async (id: string) => {
    setSaved(!saved);
    setPopupData({
      ...popupData,
      saveCount: saved ? popupData.saveCount - 1 : popupData.saveCount + 1,
    });
    Follow("Popup", id, router);
  };

  return (
    <StoreCardContainer onClick={() => onClickHandler(store.id)}>
      <StoreThumbnail>
        <StoreThumbnailImage id={`store-image-${store.id}`} src={imageSrc || "/images/gray.png"} loading='lazy' />
        {!isPopper && (
          <StoreBookmark
            onClick={(event) => {
              event.stopPropagation(); // 부모 요소로의 이벤트 전파를 막음
              handleBookmarkClick(store.id);
            }}
          >
            <IconHeart
              color={saved ? COLORS.mainColor : COLORS.greyColor}
              width={undefined}
              height={18}
            />
          </StoreBookmark>
        )}
      </StoreThumbnail>
      <div className={"store-name"}>{store.title}</div>
      {/* <div className={"store-desc"}>{store.location.address}</div> */}
    </StoreCardContainer>
  );
});

// displayName 추가
StoreCard.displayName = "StoreCard";

// 스타일 컴포넌트 정의
const StoreCardContainer = styled.div`
  cursor: pointer;

  flex: 0 0 calc(50% - 12px);
  @media (min-width: 768px) {
    flex: 0 0 calc(33.333% - 12px); 
  };
  
  .store-name {
    font-size: 16px;
    font-weight: 600;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;

    line-height: normal;

  }
`;

const StoreThumbnail = styled.div`
  position: relative;
  margin-bottom: 8px;

  .icon {
    position: absolute;
    bottom: 12px;
    right: 12px;
    cursor: pointer;
  }
`;

const StoreThumbnailImage = styled.img`
  width: 100%; 
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
`

const StoreBookmark = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
`;


export default StoreCard;
