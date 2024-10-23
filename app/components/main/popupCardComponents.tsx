"use client";
import styled from "styled-components";
import { COLORS } from "@/public/styles/colors";
import { MainSortedData } from "@/public/utils/types";
import Link from "next/link";
import React from "react";

interface PopupCardProps {
  title: string;
  storeData: MainSortedData[];
}


// TODO: Props interface 정의 필요
const PopupCard = React.forwardRef<HTMLDivElement, PopupCardProps>(
  ({ title, storeData }, ref) => {
    return (
      <>
        <div ref={ref} style={{ zIndex: 5, fontSize: 18, fontWeight: 600 }}>{title}</div>
        <Section>
          <ContentsContainer>
            {storeData.length > 0 ? (
              storeData.map((item: MainSortedData, index: number) => (
                <Stuff key={index} href={`/popup-map/${item.id}`}>
                  <ProductThumbnail>
                    <ProductThumbnailImage
                      src={`data:image/webp;base64,${item.image}`}
                    />
                  </ProductThumbnail>
                  <ProductTitle>{item.title}</ProductTitle>
                </Stuff>
              ))
            ) : (
              <>
                <SkeletonDiv />
                <SkeletonDiv />
                <SkeletonDiv />

                <SkeletonDiv />
                <SkeletonDiv />
                <SkeletonDiv />

                <SkeletonDiv />
                <SkeletonDiv />
                <SkeletonDiv />
              </>
            )}
          </ContentsContainer>
        </Section>
      </>
    );
  }
);

PopupCard.displayName = "PopupCard";

const Stuff = styled(Link)`
  cursor: pointer;
  position: relative;

  flex: 0 0 calc(50% - 12px);
  margin-bottom: 20px;

  @media (min-width: 768px) {
    flex: 0 0 calc(33.333% - 12px);
  }
`;
const SkeletonDiv = styled.div`
  aspect-ratio: 1 / 1;
  background-color: ${COLORS.greyColor};
  margin-bottom: 20px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;

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


const ProductThumbnail = styled.div`
  position: relative;
  margin-bottom: 8px;
`;

const ProductThumbnailImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
`;

const ProductTitle = styled.h3`
  word-break: break-all;
  white-space: normal;

  font-size: 14px;
  font-weight: 500;

  font-weight: 500;
  margin-bottom: 4px;
`;

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ContentsContainer = styled.div`
  display: grid;
  flex-direction: row;
  gap: 16px;

  flex-wrap: nowrap;
  grid-template-columns: repeat(3, 1fr); /* 한 줄에 3개의 열 */

  margin-right: 20px;
`;

export default PopupCard;
