import styled from "styled-components";
import { ProfileImage } from "./main/componenets";
import { COLORS } from "@/public/styles/colors";
import { IconChevronLeft, IconChevronRight, IconReview, IconX } from "./icons";
import { MouseEvent, useEffect, useState } from "react";
import VideoPlayerModal from "./VideoPlayer";

const ReviewData = {
  id: 1,
  image: [
    '/images/popping-phone.png',
    '/images/popping-cup.png',
    '/images/popping-tshirt.png',
    '/images/popping-banner.png',
    '/images/popping-orange.png',
  ],
  context: `여기는 딱 세줄까지만 적고 이러쿵저러쿵어쩌구저쩌구
            식당이 친절하고 사장님이 맛있어요 블라블라블라블라 Lineheight주의
            여기까지만 보이면 딱 깔끔하고 좋을듯`
}

const Review: React.FC = () => {

  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const [showImage, setShowImage] = useState<number>(0);

  useEffect(() => {
    if (imageModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [imageModalOpen])


  const modalToggle = (index: number) => {
    setImageModalOpen(!imageModalOpen)
    setShowImage(index)
  }


  return (
    <Container>
      <ReviewContainer>

        <UserProfile>
          <ProfileImage image={'/images/dummy/dummy_profile.jpg'} width={34} height={34} />
          <ReviewProp>
            <UserInfo>
              <Name>이정민</Name>
              <Grade $color={COLORS.GradeYellowPop}>YELLOW POP</Grade>
              <ReviewDate>2024.9.1</ReviewDate>
            </UserInfo>

            <ReviewState>
              <IconReview color={COLORS.mainColor} width={undefined} height={14} />
              <span>4.7</span>
            </ReviewState>
          </ReviewProp>
        </UserProfile>

        <Content>
          <ReviewImageContainer>
            {ReviewData.image.map((src: string, index: number) => (
              <div style={{ cursor: 'point' }} onClick={() => modalToggle(index)} key={`${ReviewData.id}-image-${index}`}>
                <ReviewImage src={src} />
              </div>
            ))}
          </ReviewImageContainer>
          <ReviewContext>
            {ReviewData.context}
          </ReviewContext>
        </Content>


      </ReviewContainer>
      <Delete onClick={() => alert('1')}>
        삭제
      </Delete>

      {imageModalOpen && (
        <Modal>
          <ModalOverlay />
          <ModalClose onClick={() => modalToggle(0)}>
            <IconX color={COLORS.secondaryColor} height={13} width={undefined} />
          </ModalClose>
          <ImageCount>{showImage + 1} / {ReviewData.image.length}</ImageCount>
          <ModalContainer>
            <ImageContainer>
              <ModalImage src={ReviewData.image[showImage]} />
              <ImageTriggerContainer>
                {
                  showImage !== 0 ?
                    <ImagePriv onClick={() => setShowImage(showImage - 1)}>
                      <IconChevronLeft color={COLORS.secondaryColor} height={20} width={undefined} />
                    </ImagePriv> :
                    <ImagePriv>
                      <IconChevronLeft color={COLORS.greyColor} height={20} width={undefined} />
                    </ImagePriv>

                }
                {
                  showImage !== ReviewData.image.length - 1 ?
                    <ImagePriv onClick={() => setShowImage(showImage + 1)}>
                      <IconChevronRight color={COLORS.secondaryColor} height={20} width={undefined} />
                    </ImagePriv>
                    :
                    <ImagePriv>
                      <IconChevronRight color={COLORS.greyColor} height={20} width={undefined} />
                    </ImagePriv>
                }
              </ImageTriggerContainer>
            </ImageContainer>
            <span>
              {ReviewData.context}
            </span>
          </ModalContainer>
        </Modal>
      )}
    </Container>
  )
}

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100dvh;

  z-index: 101;
`
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;

  gap: 20px;
  
  position: absolute;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 100%;
  z-index: 101;

  & > span {
    padding: 0 20px;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    color: ${COLORS.primaryColor};
  }
`

const ImagePriv = styled.div`

`

const ModalOverlay = styled.div`
  position: absolute;

  width: 100%;
  height: 100dvh;
  top: 0;
  left: 0;

  /* background: linear-gradient(
    to top,
    rgba(25, 25, 25, 1) 0%,
    rgba(0, 0, 0, 0.7) 100%
  ); */

  background-color: rgba(0, 0, 0, .9);
  z-index: 101;
`

const ModalClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  
  cursor: pointer;

  position: absolute;
  left: 20px;
  top: 16px;
  background-color: transparent;
  border: none;
  z-index: 101;

  padding: 5px;
  border-radius: 50%;

  background-color: ${COLORS.primaryColor};
`

const ImageCount = styled.span`
  position: absolute;
  left: 50%;
  top: 21px;
  transform: translate(-50%, 0);
  z-index: 101;

  font-size: 14px;
  font-weight: 400;
  color: ${COLORS.primaryColor};
`

const ImageContainer = styled.div`
  position: relative;
`

const ModalImage = styled.img`
  width: 100%;
  object-fit: cover;
`

const ImageTriggerContainer = styled.div`
  width: calc(100% - 40px);


  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  position: absolute;


  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 102;
`

const Container = styled.div`
  width: 100%;

  position: relative;
`

const ReviewContainer = styled.div`  
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
`

const UserProfile = styled.div`
  display: flex;
  gap: 12px;
`

const Delete = styled.span`
  position: absolute;
  top: 0;
  right: 0;

  cursor: pointer;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  color: ${COLORS.greyColor};
`

const ReviewProp = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: space-between;
  margin: 1px 0;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
`

const Name = styled.span`
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`

const Grade = styled.span<{ $color: string }>`
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  color: ${(props) => (props.$color)};
`

const ReviewDate = styled.span`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  color: ${COLORS.greyColor};
`

const ReviewState = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;

  align-items: center;

  & > span {
    color: ${COLORS.mainColor};
    font-size: 12px;
    font-weight: 500;
  }  
`

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ReviewImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: nowrap;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`

const ReviewImage = styled.img`
  cursor: pointer;
  width: 75px;
  height: 75px;

  border-radius: 8px;
  object-fit: cover;
`


const ReviewContext = styled.p`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`



export default Review;