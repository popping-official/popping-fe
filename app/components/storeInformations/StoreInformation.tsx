import styled from "styled-components";
import { COLORS } from "@/public/styles/colors";
import { useRouter } from "next/router";
import { IconHeart } from "../icons";
import {
  GeoDataType,
  LocationDataType,
  PopupStoreDataType,
  user,
} from "@/public/utils/types";
import { SetStateAction } from "react";
import { useSelector } from "react-redux";
import userSlice from "@/app/redux/reducers/poppingUser";

//TODO : 재희님과 협의 후 Props 정의
interface StoreInformationProps {
  store: PopupStoreDataType;
}

//TODO : Props 변동해야할 필요 있음.
const StoreInformation: React.FC<{
  store: PopupStoreDataType;
  setCheckPopupList: React.Dispatch<SetStateAction<boolean>>;
  setSelectedStore: React.Dispatch<SetStateAction<PopupStoreDataType | undefined>>;
}> = ({ store, setCheckPopupList, setSelectedStore }) => {
  const userData: user = useSelector((state: any) => state.poppingUser.user);
  const onClickHandler = () => {
    setSelectedStore(store);
    setCheckPopupList(false);
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

    <PopupStore
      key={store.id}
      onClick={onClickHandler}
    // href={`product/${item.id}`}
    >
      <PopupStoreThumbnail>
        <PopupStoreThumbnailImage
          src={`data:image/jpeg;base64,${store.image}`}
        />
        <PopupstoreBookmark onClick={(event) => {
          event.stopPropagation();
          // handleBookmarkClick(item.id);
        }} >
          {/*접속한 user가 popper일 경우 스토어 찜 버튼 렌더링하지 않음. */}
          {userData.isPopper || (
            <div className={"heart-icon"}>
              <IconHeart
                width={16}
                height={16}
                color={COLORS.mainColor}
              //색 처리 해야됨.
              />
            </div>
          )}
        </PopupstoreBookmark>
      </PopupStoreThumbnail>

      <PopupstoreTitle>
        {store.title}
      </PopupstoreTitle>
      <PopupstoreEvent>
        {store.description}
      </PopupstoreEvent>
      <PopupstoreDate>
        ~ {formatDate(store.date.end)} 까지
      </PopupstoreDate>
    </PopupStore>

  );
};

const PopupStore = styled.div`
  cursor: pointer;
  position: relative;

  flex: 0 0 calc(50% - 12px);
  margin-bottom: 20px;
  

  @media (min-width: 768px) {
    flex: 0 0 calc(33.333% - 12px); 
  };

`;

const PopupStoreThumbnail = styled.div`
  position: relative;
  margin-bottom: 8px;
`;

const PopupStoreThumbnailImage = styled.img`
  width: 100%; 
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
`;

const PopupstoreBookmark = styled.div`
  position: absolute;
  bottom: 13px;
  right: 12px;
`;

const PopupstoreTitle = styled.h3`
  word-break: break-all;
  white-space: normal;

  font-size: 16px;
  font-weight: 600;
  margin-bottom: 26px;
`;

const PopupstoreEvent = styled.span`
  position: absolute; /* 하단 고정을 위한 절대 위치 */
  bottom: 0;
  width: 100%;
  
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;


  /* 줄이 넘어가면 '...'으로 표시되도록 설정합니다. */
  white-space: nowrap; /* 텍스트가 한 줄로 유지되도록 합니다. */
  overflow: hidden; /* 넘치는 텍스트를 숨깁니다. */
  text-overflow: ellipsis; /* 넘치는 텍스트를 '...'으로 표시합니다. */

`;

const PopupstoreDate = styled.span`
  position: absolute; /* 하단 고정을 위한 절대 위치 */
  margin-top: 7px;
  width: 100%;
  
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export default StoreInformation;
