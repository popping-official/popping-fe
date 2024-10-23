import styled from "styled-components";
import { COLORS } from "@/public/styles/colors";
import { useState, useEffect, useCallback, useRef } from "react";
import { IconX } from "@/app/components/icons";
import { useRouter } from "next/navigation";
import { fadeIn, fadeOut, slideIn, slideOut } from "@/public/utils/keyframe";

interface BottomModalProps {
  toggleModal: () => void;
  isVisible: boolean;
  children: React.ReactNode;
  title: string;
  heightRate: number;
}

const BottomUpModal: React.FC<BottomModalProps> = ({
  title,
  isVisible,
  toggleModal,
  children,
  heightRate,
}) => {
  const wasVisible = useRef(isVisible);

  useEffect(() => {
    wasVisible.current = isVisible;
  }, [isVisible]);

  return (
    <Container>
      <ModalOverlay isVisible={isVisible} onClick={toggleModal} />
      <OptionModal isVisible={isVisible} heightRate={heightRate}>
        <ModalHeader>
          <Title>{title}</Title>
          <ModalClose onClick={toggleModal}>
            <IconX
              color={COLORS.secondaryColor}
              width={undefined}
              height={16}
            />
          </ModalClose>
        </ModalHeader>
        <ModalContent>{children}</ModalContent>
      </OptionModal>
    </Container>
  );
};

const Container = styled.div``;

const ModalOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3;
  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  animation: ${(props) => (props.isVisible ? fadeIn : fadeOut)} 0.3s ease-in-out;
  transition: visibility 0.3s, opacity 0.3s ease-in-out;
`;

const OptionModal = styled.div<{ isVisible: boolean; heightRate: number }>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${(props) => props.heightRate}dvh;
  background-color: white;
  border-radius: 16px 16px 0 0;
  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(${(props) => (props.isVisible ? "0%" : "100%")});
  animation: ${(props) => (props.isVisible ? slideIn : slideOut)} 0.3s
    ease-in-out;
  z-index: 4;
  overflow-y: auto;
  padding-bottom: 80px;
`;

const ModalHeader = styled.div`
  width: 100%;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translate(-50%);

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.primaryColor};
  margin-top: 20px;
  padding-bottom: 20px;
`;

const Title = styled.h3`
  font-size: 22px;

  font-weight: 600;
`;

const ModalClose = styled.div`
  position: absolute;
  right: 20px;
`;

const ModalContent = styled.div`
  margin-top: 24px;
  padding: 0 20px;
  padding-top: 40px;
  display: flex;
  flex-direction: column;
`;

export default BottomUpModal;
