import { COLORS } from '@/public/styles/colors';
import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import { IconX } from './icons';

type VideoPlayerProps = {
  urls: { label: string, value: string }[];
  onClose: () => void;
  isVisible: boolean;
};

const VideoPlayerModal: React.FC<VideoPlayerProps> = ({ urls, onClose, isVisible }) => {
  const [videoUrl, setVideoUrl] = useState<string>(urls[0].value);

  if (!isVisible) return null;

  const urlChange = (url: string) => {
    setVideoUrl(url)
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>
          <IconX color={COLORS.primaryColor} height={16} width={undefined} />
        </CloseButton>
        <ReactPlayer
          url={videoUrl}
          className='react-player'
          width='100%'
          height='100%'
          controls
        />
        <UrlChoiceContainer>
          {urls.map((item, index) => (
            <UrlChoiceButton
              key={`button-${index}`}
              onClick={() => urlChange(item.value)}
              active={videoUrl === item.value}>{item.label}</UrlChoiceButton>
          ))}
        </UrlChoiceContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: relative; 
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3; 
`;

const ModalContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 30%;
  margin: 0 20px;
  z-index: 4; 

  justify-content: center;
  gap: 8px;
  overflow: hidden;
`;

const CloseButton = styled.span`
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  align-self: flex-end;
  margin-right: 8px;
`;

const UrlChoiceContainer = styled.div`
  display: flex;
  flex-direction: row;

  gap: 8px;

`

const UrlChoiceButton = styled.button<{ active: boolean }>`
  background-color: ${(props) => (props.active ? COLORS.mainColor : COLORS.greyColor)};
  color: ${COLORS.primaryColor};
  border: none;
  border-radius: 4px;

  font-size: 12px;
  font-weight: 600;
  line-height: normal;

  padding: 3px 11px;
`

export default VideoPlayerModal;
