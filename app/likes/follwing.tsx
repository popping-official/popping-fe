import { COLORS } from "@/public/styles/colors";
import { styled } from "styled-components";
import { IconHeart } from "../components/icons";
import { Spacer } from "../components/layout";
import { BrandType } from "@/public/utils/types";
import Link from "next/link";

type followingTypes = {
  image: string;
  isLiked: boolean;
  brand: string;
};

type followingType = {
  values: BrandType[];
};

const Following: React.FC<followingType> = ({ values }) => {
  if (values.length == 0)
    return (
      <Container>
        <div>
          <span>브랜드 팔로잉이 없습니다.</span>
          <span>
            현재 진행중인 팝업스토어로{" "}
            <Link href={`/online-popup`}>이동하기</Link>
          </span>
        </div>
      </Container>
    );
  return (
    <Grid>
      {values.map((value: BrandType, index: number) => {
        return (
          <Store key={index}>
            <StoreImage image={value.thumbnail}>
              <BrandText>{value.name}</BrandText>

              <IsLiked>
                <IconHeart
                  color={value.isSaved ? COLORS.mainColor : COLORS.greyColor}
                  width={undefined}
                  height={16}
                />
              </IsLiked>
            </StoreImage>
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
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Store = styled.div`
  cursor: pointer;
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
  position: absolute;
  left: 12px;
  bottom: 12px;

  color: ${COLORS.secondaryColor};

  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const IsLiked = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;
`;

export default Following;
