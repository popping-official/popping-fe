import { COLORS } from "@/public/styles/colors";
import { styled } from "styled-components";

type ProfileImageTypes = {
  image: string | null;
  width: number;
  height: number;
};

const ProfileImageContainer = styled.div<ProfileImageTypes>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 50%;

  border: 1px solid ${COLORS.lightGreyColor};

  background: ${(props) =>
    props.image ? `url(${props.image})` : COLORS.greyColor};
  background-position: center;
  background-size: cover;
`;

export const ProfileImage = ({ image, width, height }: ProfileImageTypes) => {
  return <ProfileImageContainer image={image} width={width} height={height} />;
};
