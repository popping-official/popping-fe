import axiosInstance from "@/public/network/axios";
import {
  CartOption,
  CartType,
  OptionType,
  SizeType,
} from "@/public/utils/types";
import styled, { keyframes } from "styled-components";
import { COLORS } from "@/public/styles/colors";
import { useState, useEffect, useCallback, useRef } from "react";
import { IconMinus, IconPlus, IconX } from "@/app/components/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface BottomModalProps {
  toggleModal: () => void;
  isVisible: boolean;
  data: CartType;
  onOptionChange: (updatedOption: CartOption) => void;
}

const slideIn = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const BottomModal: React.FC<BottomModalProps> = ({
  isVisible,
  toggleModal,
  data,
  onOptionChange,
}) => {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<CartOption>(
    data.option
  );
  const [isChange, setIsChange] = useState<boolean>(false);
  const wasVisible = useRef(isVisible);

  const handleOptionChange = (
    optionName: keyof CartOption,
    selectedOption: CartOption[keyof CartOption]
  ) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [optionName]: selectedOption,
    }));
    setIsChange(true);
  };

  const AmountToggle = (increment: boolean) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      amount: increment ? prevOptions.amount + 1 : prevOptions.amount - 1,
    }));
    setIsChange(true);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const number =
        value === "" ? 0 : Math.min(Math.max(parseInt(value, 10), 1), 99);
      setSelectedOptions((prevOptions) => ({
        ...prevOptions,
        amount: number,
      }));
      setIsChange(true);
    }
  };

  const CartUpdateApi = useCallback(
    async (option: CartOption) => {
      try {
        const response = await axiosInstance.patch(`/api/popup/cart/data`, {
          option: option,
          id: data.id,
        });

        if (response.status === 202) {
          setTimeout(() => { }, 2000);
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          alert("로그인 후 이용가능합니다.");
          router.push(
            `/member/signin?redirect=${encodeURIComponent(
              window.location.href
            )}`
          );
        } else {
        }
      }
    },
    [data.id, router]
  );

  useEffect(() => {
    if (wasVisible.current && !isVisible && isChange) {
      CartUpdateApi(selectedOptions);
      onOptionChange(selectedOptions);
    }
    wasVisible.current = isVisible;
  }, [isVisible, selectedOptions, CartUpdateApi, onOptionChange, isChange]);

  return (
    <Container>
      <ModalOverlay isVisible={isVisible} onClick={toggleModal} />
      <OptionModal isVisible={isVisible}>
        <ModalHeader>
          <Title>변경</Title>
          <ModalClose onClick={toggleModal}>
            <IconX
              color={COLORS.secondaryColor}
              width={undefined}
              height={16}
            />
          </ModalClose>
        </ModalHeader>
        <ModalContent>
          <ProductOptionContainer>
            {data.product.option.map(
              (optionData: OptionType, index: number) => (
                <ProductOption key={index}>
                  <ProductOptionTitle>
                    <span>{optionData.name.toUpperCase()}</span>
                    {optionData.name.toLowerCase() === "size" && (
                      <SizeGuide
                        href={`/online-popup/POPPING/product/${data.product.id}#sizeGuide`}
                      >
                        사이즈 가이드 ⓘ
                      </SizeGuide>
                    )}
                  </ProductOptionTitle>
                  <ProductRadioContent>
                    {optionData.option.map(
                      (option: SizeType, optionIndex: number) => (
                        <RadioLabel
                          key={optionIndex}
                          isChecked={
                            selectedOptions[
                            optionData.name as keyof CartOption
                            ] === option.name
                          }
                        >
                          <RadioButton
                            type="radio"
                            name={optionData.name}
                            value={option.name}
                            checked={
                              selectedOptions[
                              optionData.name as keyof CartOption
                              ] === option.name
                            }
                            onChange={() =>
                              handleOptionChange(
                                optionData.name as keyof CartOption,
                                option.name
                              )
                            }
                          />
                          <span>{option.name}</span>
                        </RadioLabel>
                      )
                    )}
                  </ProductRadioContent>
                </ProductOption>
              )
            )}
            <ProductOptionContent>
              <ProductOptionTitle>AMOUNT</ProductOptionTitle>
              <AmountContainer>
                <AmountIcon
                  onClick={() => AmountToggle(false)}
                  disabled={selectedOptions.amount <= 1}
                >
                  <IconMinus
                    color={COLORS.secondaryColor}
                    width={10}
                    height={10}
                  />
                </AmountIcon>
                <AmountInput
                  type="text"
                  value={selectedOptions.amount}
                  onChange={handleAmountChange}
                  maxLength={2}
                />
                <AmountIcon
                  onClick={() => AmountToggle(true)}
                  disabled={selectedOptions.amount >= 99}
                >
                  <IconPlus
                    color={COLORS.secondaryColor}
                    width={10}
                    height={10}
                  />
                </AmountIcon>
              </AmountContainer>
            </ProductOptionContent>
          </ProductOptionContainer>
        </ModalContent>
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
  z-index: 1;
  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  animation: ${(props) => (props.isVisible ? fadeIn : fadeOut)} 0.3s ease-in-out;
  transition: visibility 0.3s, opacity 0.3s ease-in-out;
`;

const OptionModal = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background-color: white;
  border-radius: 16px 16px 0 0;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(${(props) => (props.isVisible ? "0%" : "100%")});
  animation: ${(props) => (props.isVisible ? slideIn : slideOut)} 0.3s
    ease-in-out;
  z-index: 2;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 20px;
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
  padding: 20px 0;
  display: flex;
  flex-direction: column;
`;

const ProductOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
`;

const ProductOption = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ProductOptionTitle = styled.p`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  gap: 8px;
  padding-left: 20px;
`;

const ProductRadioContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: nowrap;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SizeGuide = styled.a`
  font-size: 10px;

  font-weight: 500;
  color: ${COLORS.greyColor};
  height: 12px;
`;

const ProductOptionContent = styled.div`
  width: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
  padding-right: 20px;
`;

const RadioButton = styled.input.attrs({ type: "radio" })`
  display: none;
`;

const RadioLabel = styled.label<{ isChecked: boolean }>`
  flex: 0 0 auto;
  cursor: pointer;
  text-align: center;
  border-radius: 16px;
  border: 1px solid
    ${(props) => (props.isChecked ? COLORS.mainColor : COLORS.greyColor)};
  padding: 8px 20px;
  box-sizing: border-box;

  &:first-child {
    margin-left: 20px;
  }

  & > span {
    font-size: 14px;
    font-weight: 500;
  }
`;

const AmountContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const AmountIcon = styled.button`
  cursor: pointer;
  width: 40px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${COLORS.greyColor};
  border-radius: 16px;
  box-sizing: border-box;

  &:first-child {
    margin-left: 20px;
  }

  &:enabled {
    border: none;
    background-color: ${COLORS.mainColor};
    line {
      stroke: ${COLORS.primaryColor};
    }
  }

  &:disabled {
    cursor: none;
    background-color: ${COLORS.primaryColor};
  }
`;

const AmountInput = styled.input`
  flex: 1;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  height: 34px;
  border: 1px solid ${COLORS.greyColor};
  border-radius: 16px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${COLORS.mainColor};
  }
`;

export default BottomModal;
