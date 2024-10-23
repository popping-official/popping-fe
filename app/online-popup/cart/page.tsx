"use client";

import Back from "@/app/components/back";
import { DefaultLayout } from "@/app/components/layout";
import StoreDecisionButton from "@/app/components/online-popup/decisionButton";
import PopupHeader from "@/app/components/online-popup/header";
import HorizontalCard from "@/app/components/online-popup/horizontalCard";
import axiosInstance from "@/public/network/axios";
import { COLORS } from "@/public/styles/colors";
import { MobileMaxWidth, MobileMinWidth } from "@/public/styles/size";
import { KRWLocaleString } from "@/public/utils/function";
import { CartType } from "@/public/utils/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

const MyCartPage: React.FC = () => {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [brandName, setBrandName] = useState<string>();
  const [cartData, setCartData] = useState<CartType[]>();
  const [cartLen, setCartLen] = useState<number>(0);

  const [totalPrice, setTotalPrice] = useState<number>(0);

  const handleCheckboxChange = (item: CartType, selected: boolean) => {
    setSelectedItems((prevSelectedItems) => {
      if (selected) {
        if (!prevSelectedItems.includes(item.id)) {
          setTotalPrice(totalPrice + item.option.amount * item.product.price);
          return [...prevSelectedItems, item.id];
        }

        return prevSelectedItems;
      } else {
        setTotalPrice(totalPrice - item.option.amount * item.product.price);
        return prevSelectedItems.filter((id) => id !== item.id);
      }
    });
  };

  const Payment = () => {
    CreateOrder();
  };

  useEffect(() => {
    CartDataGetAPI();
  }, []);

  const CartDataGetAPI = async () => {
    try {
      const response = await axiosInstance.get(`/api/popup/cart/data`);

      if (response.status === 200) {
        setBrandName('POPPING');
        setCartData(response.data.cart);
        setCartLen(response.data.cart.length);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert("로그인 후 이용가능합니다.");
        router.push(
          `/member/signin?redirect=${encodeURIComponent(window.location.href)}`
        );
      }
    }
  };

  const decreaseCartLen = () => {
    setCartLen((prevLen) => prevLen - 1);
  };

  if (!cartData || !brandName) return null;

  const CreateOrder = async () => {
    try {
      const response = await axiosInstance.post(`/api/popup/order`, {
        totalPrice: totalPrice,
        order: selectedItems,
      });

      if (response.status === 201) {
        router.push(`payment?oid=${response.data.oid}`);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        alert("로그인 후 이용가능합니다.");
        router.push(
          `/member/signin?redirect=${encodeURIComponent(window.location.href)}`
        );
      }
    }
  };

  return (
    <DefaultLayout top={16} right={20} bottom={0} left={20}>
      <Container>
        <PopupHeader main={"장바구니"} sub={`${brandName} STORE`} />
        <Content>
          {cartLen === 0 && (
            <EmptyCart>
              <span>장바구니가 비어있어요!</span>
            </EmptyCart>
          )}
          {cartLen !== 0 &&
            cartData.map((data: CartType, index: number) => (
              <HorizontalCard
                setCartLen={decreaseCartLen}
                isPayment={false}
                key={index}
                data={data}
                brand={brandName}
                onCheckboxChange={(selected) =>
                  handleCheckboxChange(data, selected)
                }
              />
            ))}
          {cartLen == 0 && (
            <DisabledBottomButton>주문하기</DisabledBottomButton>
          )}
        </Content>

        <BottomButtonContainer isVisible={selectedItems.length > 0}>
          <StoreDecisionButton
            isVisible={true}
            onClick={Payment}
            sort={undefined}
            title={`${KRWLocaleString(totalPrice)}원 주문하기`}
          />
        </BottomButtonContainer>
      </Container>
    </DefaultLayout>
  );
};

const BottomButtonContainer = styled.div<{ isVisible: boolean }>`
  width: 100%;
  min-width: ${MobileMinWidth}px;
  max-width: ${MobileMaxWidth}px;

  display: flex;
  flex-direction: row;

  gap: 20px;
  padding: 0 20px;

  position: fixed;

  left: 50%;
  bottom: 32px;
  transform: translate(-50%, 0);

  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  pointer-events: ${({ isVisible }) => (isVisible ? "auto" : "none")};
  transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
`;
const Container = styled.div`
  height: calc(100dvh - 36px);
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.primaryColor};

  gap: 40px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  gap: 20px;
`;

const EmptyCart = styled.div`
  position: absolute;

  top: 50%;
  left: 50%;

  transform: translate(-50%, 0);

  & > span {
    font-size: 16px;
    font-weight: 500;
    color: ${COLORS.greyColor};
  }
`;

const DisabledBottomButton = styled.div`
  width: calc(100% - 40px);

  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;

  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 100%); /* 시작 위치를 아래로 설정 */
  z-index: 1;

  background-color: ${COLORS.greyColor};
  padding: 16px 0;
  border-radius: 8px;

  font-size: 16px;
  font-weight: 600;
  color: ${COLORS.primaryColor};

  /* 애니메이션 추가 */
  animation: slide-up 0.5s ease-out forwards;
  @keyframes slide-up {
    from {
      transform: translate(-50%, 100%); /* 아래에서 시작 */
    }
    to {
      transform: translate(-50%, 0); /* 원래 위치로 이동 */
    }
  }
`;

export default MyCartPage;
