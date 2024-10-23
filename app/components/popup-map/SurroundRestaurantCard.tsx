import styled from "styled-components";
import { PlaceDataType } from "@/public/utils/types";
import { COLORS } from "@/public/styles/colors";
import Image from "next/image";

interface SurroundRestaurantCardProps {
  restaurantData: PlaceDataType;
}

const SurroundRestaurantCard: React.FC<SurroundRestaurantCardProps> = ({
  restaurantData,
}) => {
  const cardClickHandler = () => {
    //card click handler
    const userConfirmed = window.confirm(
      "해당 장소를 네이버 지도로 여시겠습니까?"
    );
    if (userConfirmed) {
      const naverMapUrl = `https://map.naver.com/v5/search/${restaurantData.title} ${restaurantData.loadAddr}`;
      // const naverMapUrl = `https://map.naver.com/v5/search/${restaurantData.geoData.coordinates[1]},${restaurantData.geoData.coordinates[0]}`;
      window.open(naverMapUrl, "_blank");
    }
  };

  return (
    <RestaurantCard onClick={cardClickHandler}>
      <RestaurantImage>
        <Image
          src={`data:image/webp;base64,${restaurantData.image}`}
          alt={restaurantData.title}
          fill
        />
        <Distance>{(restaurantData.distance / 1000).toFixed(1)} km</Distance>
      </RestaurantImage>

      <RestaurantInfo>
        <div className={"restaurant-title"}>{restaurantData.title}</div>
        <RestaurantTags>
          {restaurantData.bestMenu.map(
            (menu, index) =>
              index < 3 && (
                <RestaurantTag key={`${restaurantData.title}-tag-${index}`}>
                  #{menu}
                </RestaurantTag>
              )
          )}
        </RestaurantTags>
      </RestaurantInfo>
    </RestaurantCard>
  );
};

const RestaurantCard = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 calc(50% - 12px);
  @media (min-width: 768px) {
    flex: 0 0 calc(33.333% - 12px); 
  };

  gap: 8px;
`;

const RestaurantImage = styled.div`
  width: 100%; 
  aspect-ratio: 1 / 1;

  position: relative;

  border-radius: 8px;
  overflow: hidden;

  cursor: pointer;
`;

const Distance = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;

  font-size: 12px;
  font-weight: 500;

  padding: 4px 8px;
  background-color: ${COLORS.whiteColor};
  color: ${COLORS.secondaryColor};
  border-radius: 4px;
`;

const RestaurantInfo = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  .restaurant-title {
    width: 100%;

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    font-size: 16px;
    font-weight: 700;
    font-style: normal;
    line-height: normal;
    color: ${COLORS.secondaryColor};

    cursor: pointer;
  }
`;

const RestaurantTags = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  width: 100%;
`;

const RestaurantTag = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
`;

export default SurroundRestaurantCard;
