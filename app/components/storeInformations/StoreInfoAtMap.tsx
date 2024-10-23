import styled from "styled-components";
import { COLORS } from "@/public/styles/colors";
import { IconHeart } from "../icons";
import { useSelector } from "react-redux";
import { user } from "@/public/utils/types";
import { ButtonLarge } from "../buttons";
import { IconChevronLeft } from "../icons";
import { SetStateAction } from "react";
import { PopupStoreDataType } from "@/public/utils/types";

interface StoreInfoAtMapProps {
  store: PopupStoreDataType;
  setStore: React.Dispatch<SetStateAction<boolean>>;
  isExpanded: boolean;
}

//TODO : Props 구체화 필요함.
const StoreInfoAtMap: React.FC<StoreInfoAtMapProps> = ({
  setStore,
  store,
  isExpanded,
}) => {
  // const StoreInfoAtMap: React.FC<{store: PopupStoreDataType, setStore: React.Dispatch<SetStateAction<null>>}> = ({ store, setStore }) => {
  const userData: user = useSelector((state: any) => state.poppingUser.user);

  const backButtonClickhandler = () => {
    setStore(true);
  };

  // 날짜를 YYYY.MM.DD 형식으로 포맷하는 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  return (
    <PopupStoreInfoContainer $isExpanded={isExpanded}>
      <PopupStoreImage>
        <div className={"back-button"} onClick={backButtonClickhandler}>
          <IconChevronLeft width={9} height={16} color={COLORS.primaryColor} />
        </div>
        <img src={`data:image/webp;base64,${store.image}`} />
      </PopupStoreImage>
      <PopupStoreDescContainer>
        <div className={"slider-desc-header"}>
          <p className={"slider-store-name"}>{store.title}</p>
          <div className={"slider-store-like"}>
            <IconHeart width={32} height={30} color={COLORS.mainColor} />
            <p>99만</p>
          </div>
        </div>

        <div className={"slider-store-desc"}>
          {store.description.map((item: string, index: number) => (
            <p key={index}>{item}</p>
          ))}
        </div>
        <p className={"slider-store-address"}>
          {store.location.address} {store.location.placeName}
        </p>
        <p className={"slider-store-address"}>
          {formatDate(store.date.start)} ~ {formatDate(store.date.end)}
        </p>
      </PopupStoreDescContainer>
      <ButtonContainer>
        {userData.isPopper ? (
          <>
            <ButtonLarge
              text={"길찾기"}
              buttonColor={COLORS.mainColor}
              textColor={COLORS.primaryColor}
              onClick={() => {
                // 여기로
                // `https://map.kakao.com/link/to/${store.location.placeName},${store.location.geoData.coordinates[1]},${store.location.geoData.coordinates[0]}`
                console.log("router 처리 필요");
              }}
            />
            <ButtonLarge
              text={"통계"}
              buttonColor={COLORS.primaryColor}
              textColor={COLORS.mainColor}
              onClick={() => {
                console.log("router 처리 필요");
              }}
              borderWidth={2}
              borderColor={COLORS.mainColor}
            />
          </>
        ) : (
          <>
            <ButtonLarge
              text={"길찾기"}
              buttonColor={COLORS.mainColor}
              textColor={COLORS.primaryColor}
              onClick={() => {
                // 여기로
                // `https://map.kakao.com/link/to/${store.location.placeName},${store.location.geoData.coordinates[1]},${store.location.geoData.coordinates[0]}`
                console.log("router 처리 필요");
              }}
            />
          </>
        )}
      </ButtonContainer>
    </PopupStoreInfoContainer>
  );
};

const PopupStoreInfoContainer = styled.div<{ $isExpanded: Boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 16px 0px;
  width: 100%;
  height: ${({ $isExpanded }) => ($isExpanded ? "100%" : "92px")};
`;

//TODO : 추후 이미지로 삽입
const PopupStoreImage = styled.div`
  width: 100%;
  height: 215px;
  background-color: ${COLORS.greyColor};

  & .back-button {
    position: relative;
    top: 20px;
    left: 20px;
    cursor: pointer;
  }

  img {
    width: 100%;
    height: 100%;
  }
`;

const PopupStoreDescContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  overflow: hidden;
  /* overflow-y: auto; */
  padding: 16px 20px;
  width: calc(100% - 40px);

  .slider-desc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .slider-store-like {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    margin-left: 30px;

    & > p {
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }

  .slider-store-name {
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  .slider-desc-container {
    display: flex;
    flex-direction: column;
  }

  .slider-store-desc {
    padding-right: 70px;

    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin-bottom: 32px;
  }

  .slider-store-address {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: calc(100% - 40px);
`;

export default StoreInfoAtMap;
