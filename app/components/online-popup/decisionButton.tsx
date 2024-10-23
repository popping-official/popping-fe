import { COLORS } from "@/public/styles/colors";
import styled, { keyframes } from "styled-components";
import React, { useEffect, useState } from "react";
import { slideIn, slideOut } from "@/public/utils/keyframe";

interface DataProps {
  title: string;
  onClick: () => void;
  isVisible: boolean;
  sort?: string;
}



const StoreDecisionButton: React.FC<DataProps> = ({ title, onClick, isVisible, sort }) => {
  const [isMounted, setIsMounted] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
    } else {
      const timer = setTimeout(() => setIsMounted(false), 500); // Match the duration of the animation
      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [isVisible]);

  return (
    <Container
      isVisible={isVisible}
      isMounted={isMounted}
      onClick={isVisible ? onClick : undefined} // Handle onClick based on isVisible
      sort={sort}
    >
      <span>{title}</span>
    </Container>
  );
}

const Container = styled.div<{ isVisible: boolean, isMounted: boolean, sort?: string }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ isVisible }) => isVisible ? 'pointer' : 'default'}; // Change cursor based on visibility
  box-sizing: border-box;
  padding: 16px 0;
  border-radius: 8px;
  background-color: ${({ sort }) => sort === 'left' ? COLORS.primaryColor : COLORS.mainColor};

  box-shadow: 0 0 0 2px ${({ sort }) => sort === 'left' ? COLORS.mainColor : 'none'} inset;
  margin-left: ${({ sort }) => sort === 'left' ? '20px' : '0'};
  margin-right: ${({ sort }) => sort === 'right' ? '20px' : '0'};
  margin: ${({ sort }) => !sort && '0 20px'};

  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  transform: translateY(${({ isVisible }) => isVisible ? '0' : '100%'});
  animation: ${({ isVisible }) => isVisible ? slideIn : slideOut} 0.5s ease-out;
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  pointer-events: ${({ isVisible }) => isVisible ? 'auto' : 'none'}; // Disable pointer events if not visible

  & > span {
    color: ${({ sort }) => sort === 'left' ? COLORS.mainColor : COLORS.primaryColor};
    font-size: 16px;
    font-weight: 600;
  }
`;

export default StoreDecisionButton;