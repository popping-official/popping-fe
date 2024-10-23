'use client';
import styled from "styled-components";
import { IconHeart } from "./icons";
import { COLORS } from "@/public/styles/colors";
import { BrandType } from "@/public/utils/types";
import { Loading } from "./loading";
import { useRouter } from "next/navigation";
import { Follow, FormatFollowers } from "@/public/utils/function";
import { useState } from "react";
import dayjs from 'dayjs';

interface BrandProps {
  data: BrandType;
}

function ContractFormatDate(isoDateTime: string) {
  const date = new Date(isoDateTime);
  const year = date.getFullYear().toString().slice(-2); // YY 형식
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // MM 형식
  const day = ("0" + date.getDate()).slice(-2); // DD 형식

  return `${year}.${month}.${day}`;
}

const BrandComponent: React.FC<BrandProps> = ({ data }) => {
  const router = useRouter();

  const [isFollowed, setIsFollowed] = useState<boolean>(data.isSaved);
  const [brandData, setBrandData] = useState<BrandType>(data);

  if (!data) return <Loading />;

  const now = dayjs();
  const contractStart = dayjs(data.contractStart);
  const contractEnd = dayjs(data.contractEnd);

  const isAble = now.isAfter(contractStart) && now.isBefore(contractEnd);

  const StoreClickHandler = (brandName: string, isAble: boolean) => {
    if (isAble) {
      router.push(`online-popup/${brandName}/store-opening`);
    } else {
      alert('종료된 팝업스토어입니다.');
    }
  };

  const storeFollowHandler = () => {
    if (data) {
      const updatedSaved = isFollowed
        ? brandData.saved - 1
        : brandData.saved + 1;
      Follow("Brands", data.id, router);
      setBrandData({
        ...brandData,
        saved: updatedSaved,
      });
      setIsFollowed(!isFollowed);
    }
  };

  return (
    <Store onClick={() => StoreClickHandler(data.name, isAble)} $isAble={isAble}>
      <Top>
        <BrandText>{data.name} STORE</BrandText>
        <IsLiked
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            storeFollowHandler();
          }}>
          <IconHeart
            color={isFollowed ? COLORS.mainColor : COLORS.greyColor}
            width={undefined}
            height={15}
          />
          <span>{FormatFollowers(brandData.saved)}</span>
        </IsLiked>
      </Top>
      <StoreImage image={data.thumbnail}>
        <Layout>
          <SubInfo>
            <BrandStateBadge
              style={{
                color: isAble ? COLORS.primaryColor : COLORS.secondaryColor,
                backgroundColor: isAble ? COLORS.mainColor : COLORS.lightGreyColor,
              }}>
              {isAble ? '진행중' : now.isBefore(contractStart) ? '종료' : '진행 예정'}
            </BrandStateBadge>
            <BrandDate>
              {ContractFormatDate(data.contractStart)} ~ {ContractFormatDate(data.contractEnd)}
            </BrandDate>
          </SubInfo>
        </Layout>
      </StoreImage>
    </Store>
  );
};

const Layout = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  background: linear-gradient(to right top, rgba(22, 22, 22, 0.4), rgba(22, 22, 22, 0));
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SubInfo = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const Store = styled.div<{ $isAble: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  cursor: pointer;
  opacity: ${(props) => (props.$isAble ? 1 : 0.5)};
`;

const Top = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StoreImage = styled.div<{ image: string | null }>`
  position: relative;
  width: 100%;
  height: 128px;
  background: ${(props) =>
    props.image ? `url(${props.image})` : COLORS.secondaryColor};
  border-radius: 8px;
  background-position: center;
  background-size: cover;
`;

const BrandText = styled.span`
  color: ${COLORS.secondaryColor};
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const BrandStateBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  font-style: normal;
  line-height: normal;
`;

const BrandDate = styled.p`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  color: ${COLORS.primaryColor};
`;

const IsLiked = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  line-height: normal;

  & > span {
    font-weight: 500;
  }
`;

export default BrandComponent;
