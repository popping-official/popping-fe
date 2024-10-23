import { COLORS } from "@/public/styles/colors";
import { styled } from "styled-components";
import { IconHeart } from "../components/icons";
import { PopupStoreDataType, PopupStoreSimpleData } from "@/public/utils/types";
import Link from "next/link";

type storesType = {
  values: PopupStoreDataType[];
};

const Stores: React.FC<storesType> = ({ values }) => {
  if (values.length == 0)
    return (
      <Container>
        <div>
          <span>관심 오프라인 팝업이 없습니다.</span>
          <span>
            팝업지도 <Link href={`/popup-map`}>이동하기</Link>
          </span>
        </div>
      </Container>
    );
  return (
    <Grid>
      {values.map((value: PopupStoreSimpleData, index: number) => {
        return (
          <Store key={index} href={`/popup-map/${value.id}`}>
            <StoreImage image={`data:image/webp;base64,${value.image}`}>
              <IsLiked>
                <IconHeart
                  color={value.isSaved ? COLORS.mainColor : COLORS.greyColor}
                  width={undefined}
                  height={16}
                />
              </IsLiked>
            </StoreImage>

            <StoreDesc>
              <p>{value.title}</p>
            </StoreDesc>
          </Store>
        );
      })}
    </Grid>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & > div {
    position: absolute;
    top: 50%;
    display: flex;
    flex-direction: column;
    gap: 8px;

    align-items: center;
  }
  & > div span {
    color: ${COLORS.greyColor};
  }

  & > div span a {
    color: ${COLORS.mainColor};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 한 줄에 3개의 열 */
  column-gap: 20px;
  row-gap: 20px;
`;

const Store = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 8px;

  cursor: pointer;
`;

const StoreImage = styled.div<{ image: string }>`
position: relative;
  width: 100%; /* 그리드 셀의 너비에 맞춤 */
  border-radius: 8px;
  overflow: hidden; /* 내용이 컨테이너를 넘지 않도록 숨김 */
  aspect-ratio: 1 / 1; /* 비율을 1:1로 설정 (정사각형) */

  &::before {
    content: "";
    display: block;
    padding-top: 75%; /* 비율을 4:3으로 설정 */
  }

  background-image: ${(props) =>
    props.image ? `url(${props.image})` : COLORS.secondaryColor};
  background-position: center;
  background-size: cover;
  object-fit: cover; /* 이미지가 컨테이너를 채우도록 조절 */`;

const IsLiked = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
`;

const StoreDesc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  p:first-child {
    color: ${COLORS.secondaryColor};

    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  p:last-child {
    color: ${COLORS.secondaryColor};

    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

export default Stores;
