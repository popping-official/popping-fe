"use client";

import Back from "@/app/components/back";
import Home from "@/app/components/home";
import { IconBookmark, IconMinus, IconPlus } from "@/app/components/icons";
import { DefaultLayout } from "@/app/components/layout";
import StoreDecisionButton from "@/app/components/online-popup/decisionButton";
import axiosInstance from "@/public/network/axios";
import { COLORS } from "@/public/styles/colors";
import { MobileMaxWidth, MobileMinWidth } from "@/public/styles/size";
import {
  Follow,
  FormatFollowers,
  KRWLocaleString,
} from "@/public/utils/function";
import { OptionType, ProductType, SizeType } from "@/public/utils/types";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeInOut = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  20% {
    opacity: 1;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const OnlinePopupProductPage: React.FC<{
  params: { storeId: string; product: number };
}> = ({ params }) => {
  const router = useRouter();

  const { storeId, product } = params;

  const [isCarted, setIsCarted] = useState<boolean>();

  const [productData, setProductData] = useState<ProductType>();
  const [saveState, setSaveState] = useState<boolean>();
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const [allOptionsSelected, setAllOptionsSelected] = useState<boolean>(false);
  const [showAnimation, setShowAnimation] = useState<boolean>(true);

  const [amount, setAmount] = useState<number>(1);
  const sizeGuideRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      router.push(`${window.location.hash}`);
    }, 100);
  }, [router]);

  useEffect(() => {
    if (storeId && product) {
      ProductDataGetAPI();
    }
  }, [storeId, product]);

  useEffect(() => {
    const hasSeenAnimation = sessionStorage.getItem("hasSeenAnimation");

    if (hasSeenAnimation === null || hasSeenAnimation === "false") {
      setShowAnimation(true);

      const timer = setTimeout(() => {
        setShowAnimation(false);
        sessionStorage.setItem("hasSeenAnimation", "true");
      }, 4000);

      const hideOnTouch = () => {
        setShowAnimation(false);
        sessionStorage.setItem("hasSeenAnimation", "true");
      };

      window.addEventListener("touchstart", hideOnTouch);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("touchstart", hideOnTouch);
      };
    } else {
      setShowAnimation(false);
    }
  }, [router]);

  const ProductDataGetAPI = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/popup/product/data/${storeId}/${product}`
      );

      if (response.status === 200) {
        setProductData(response.data);
        setSaveState(response.data.isSaved);
        setIsCarted(response.data.isCarted);
      }
    } catch (e: any) {
      if (e.response.sataus === 401) {
        alert("로그인 후 이용가능합니다.");
        router.push(
          `/member/signin?redirect=${encodeURIComponent(window.location.href)}`
        );
      }
    }
  };

  if (!productData) return null;

  const AddCart = async () => {
    try {
      const response = await axiosInstance.post(`/api/popup/cart/data`, {
        id: productData.id,
        amount: amount,
        option: selectedOptions,
      });

      if (response.status === 201) {
        if (
          window.confirm(
            "장바구니에 추가되었습니다.\n장바구니로 이동하시겠습니까?"
          )
        ) {
          router.push("/online-popup/cart");
        }
        setIsCarted(true);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        alert("로그인 후 이용가능합니다.");
        router.push(
          `/member/signin?redirect=${encodeURIComponent(window.location.href)}`
        );
      } else if (error.response.status === 400) {
        if (error.response.data.status === 1) {
          if (
            window.confirm(
              "장바구니에 이미 존재하는 상품입니다.\n장바구니로 이동하시겠습니까?"
            )
          ) {
            router.push("/online-popup/cart");
          }
        } else {
          alert(error.response.data.message);
        }
      }
    }
  };

  const handleBookmarkClick = async (id: number) => {
    setSaveState(!saveState);
    if (saveState) {
      setProductData({
        ...productData,
        saved: productData.saved - 1,
      });
    } else {
      setProductData({
        ...productData,
        saved: productData.saved + 1,
      });
    }
    Follow("Product", id, router);
  };

  const handleOptionChange = (optionName: string, selectedOption: string) => {
    const updatedOptions = {
      ...selectedOptions,
      [optionName]: selectedOption,
    };

    setSelectedOptions(updatedOptions);

    // 모든 옵션이 선택되었는지 확인
    const allSelected = productData.option.every(
      (option) => updatedOptions[option.name]
    );
    setAllOptionsSelected(allSelected);
  };

  // const AmountToggle = (increment: boolean) => {
  //   setAmount(prevAmount => {
  //     const newAmount = increment ? prevAmount + 1 : Math.max(0, prevAmount - 1);
  //     return newAmount;
  //   });
  // };

  const AmountToggle = (increment: boolean) => {
    if (amount >= 0 && increment) {
      setAmount(amount + 1);
    }
    if (amount > 0 && !increment) {
      setAmount(amount - 1);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setAmount(0);
    } else if (/^\d*$/.test(value)) {
      const number = parseInt(value, 10);
      if (number >= 1 && number <= 99) {
        setAmount(number);
      } else if (number > 99) {
        setAmount(99);
      }
    }
  };
  const sizeOptions = productData?.option.find(
    (option) => option.name.toLowerCase() === "size"
  );

  return (
    <DefaultLayout top={16} right={0} bottom={0} left={0}>
      <Top>
        <div style={{ width: 'calc(100% - 40px)', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Back url={undefined} />
          <Home />
        </div>
        <ProductThumbnailImg src={productData.thumbnail} />
      </Top>

      <ProductContainer>
        <ProductInfo>
          <ProductHeader>
            <HeaderLeft>
              <ProductTitle>{productData.name}</ProductTitle>
              <ProductPrice>
                {KRWLocaleString(productData.price * amount)} KRW
                <span>배송비 무료</span>
              </ProductPrice>
            </HeaderLeft>
            <ProductBookmark
              onClick={(event) => {
                event.stopPropagation(); // 부모 요소로의 이벤트 전파를 막음
                handleBookmarkClick(productData.id);
              }}
            >
              <IconBookmark
                color={saveState ? COLORS.mainColor : COLORS.greyColor}
                width={20}
                height={27}
              />
              <span>{FormatFollowers(productData.saved)}</span>
            </ProductBookmark>
          </ProductHeader>

          <ProductOptionContainer>
            {productData.option.map((data: OptionType, index: number) => (
              <ProductOption key={index}>
                <ProductOptionTitle>
                  <span>{data.name.toUpperCase()}</span>
                  {data.name.toLowerCase() === "size" && (
                    <SizeGuide href="#sizeGuide">사이즈 가이드 ⓘ</SizeGuide>
                  )}
                </ProductOptionTitle>
                <ProductRadioContent>
                  {data.option.map((option: SizeType, optionIndex: number) => (
                    <RadioLabel
                      key={optionIndex}
                      isChecked={selectedOptions[data.name] === option.name}
                    >
                      <RadioButton
                        type="radio"
                        name={data.name}
                        value={option.name}
                        checked={selectedOptions[data.name] === option.name}
                        onChange={() =>
                          handleOptionChange(data.name, option.name)
                        }
                      />
                      <span>{option.name}</span>
                    </RadioLabel>
                  ))}
                </ProductRadioContent>
              </ProductOption>
            ))}

            <ProductOptionContent>
              <ProductOptionTitle>AMOUNT</ProductOptionTitle>
              <AmountContainer>
                <AmountIcon
                  onClick={() => AmountToggle(false)}
                  disabled={amount <= 1}
                >
                  <IconMinus
                    color={COLORS.secondaryColor}
                    width={10}
                    height={10}
                  />
                </AmountIcon>

                <AmountInput
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  maxLength={2} // Limit the input length to 2 characters
                />

                <AmountIcon
                  onClick={() => AmountToggle(true)}
                  disabled={amount >= 99}
                >
                  <IconPlus
                    color={COLORS.secondaryColor}
                    width={10}
                    height={10}
                  />
                </AmountIcon>
              </AmountContainer>
            </ProductOptionContent>

            <ProductOptionContent>
              <ProductOptionTitle>DETAILS</ProductOptionTitle>
              <ProductDescription>{productData.description}</ProductDescription>
            </ProductOptionContent>

            {sizeOptions && sizeOptions.option && (
              <>
                <ProductOptionContent ref={sizeGuideRef}>
                  <ProductOptionTitle id="sizeGuide">
                    SIZE GUIDE
                  </ProductOptionTitle>
                  <SizeGuideTable>
                    <thead>
                      <tr>
                        <th></th>
                        {Object.keys(sizeOptions.option[0] || {}).map(
                          (key, index) =>
                            key !== "name" && <th key={index}>{key}</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {sizeOptions.option.map((item, index) => (
                        <tr key={index}>
                          <td style={{ fontWeight: 600 }}>{item.name}</td>
                          {Object.keys(sizeOptions.option[0] || {}).map(
                            (key, keyIndex) =>
                              key !== "name" && (
                                <td key={keyIndex}>{(item as any)[key]}</td>
                              )
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </SizeGuideTable>
                </ProductOptionContent>
              </>
            )}
          </ProductOptionContainer>
        </ProductInfo>
        <BottomButtonContainer isVisible={allOptionsSelected && amount > 0}>
          <StoreDecisionButton
            isVisible={allOptionsSelected && amount > 0}
            onClick={AddCart}
            title={isCarted ? "장바구니에 있어요!" : "장바구니 담기"}
            sort={"left"}
          />
          <StoreDecisionButton
            isVisible={allOptionsSelected && amount > 0}
            onClick={() => alert("구매 로직 구현중.")}
            title="구매하기"
            sort={"right"}
          />
        </BottomButtonContainer>
      </ProductContainer>

      {showAnimation && (
        <AnimationContainer>상품의 옵션을 선택해주세요.</AnimationContainer>
      )}
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

const Top = styled.div`
  display: flex;
  flex-direction: column;

  align-items: flex-start;
  gap: 16px;

  & > div {
    margin-left: 20px;
  }
`;

const ProductContainer = styled.div`
  width: calc(100% - 20px);

  display: flex;
  flex-direction: column;

  align-items: start;
  position: relative;

  background-color: ${COLORS.primaryColor};

  gap: 24px;
  padding-left: 20px;
  padding-bottom: 80px;
`;

const ProductThumbnailImg = styled.img`
  max-width: 100%;
`;

const ProductBookmark = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;

  & > span {
    font-weight: 600;
  }
`;

const ProductInfo = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 24px;
`;

const ProductHeader = styled.div`
  width: calc(100% -20px);
  display: flex;
  flex-direction: row;

  gap: 32px;
  margin-top: 24px;

  align-items: start;
  justify-content: space-between;
  padding-right: 20px;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;

  align-items: flex-start;
  gap: 20px;
`;

const ProductTitle = styled.h3`
  font-size: 24px;
  font-weight: 500;
  word-break: break-all;
`;

const ProductPrice = styled.span`
  display: flex;
  flex-direction: column;

  gap: 4px;
  font-size: 20px;
  font-weight: 700;

  & > span {
    font-size: 16px;
    font-weight: 500;
  }
`;

const ProductOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 36px;
`;

const ProductRadioContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;

  flex-wrap: nowrap;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
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
  font-weight: 600;
  gap: 8px;

  padding-right: 20px;
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

const AmountContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;

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

  & > span {
    font-size: 14px;
    font-weight: 500;
  }
`;

const ProductDescription = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 160%;
  white-space: pre-line; /* 줄 바꿈을 그대로 반영 */
`;

const SizeGuideTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  box-sizing: border-box;

  th,
  td {
    padding: 8px;
    text-align: center;
    border: 1px solid ${COLORS.greyColor};
  }

  th {
    background-color: ${COLORS.primaryColor};
    color: ${COLORS.secondaryColor};
    font-weight: 600;
    font-size: 14px;
  }

  td {
    background-color: white;
    color: ${COLORS.secondaryColor};
    font-size: 14px;
  }

  thead tr {
    background-color: ${COLORS.primaryColor};
  }

  tbody tr:nth-child(odd) {
    background-color: ${COLORS.lightGreyColor};
  }

  tbody tr:nth-child(even) {
    background-color: white;
  }
`;

const StoreBottomButton = styled.div`
  width: calc(100% - 40px);
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  position: fixed;
  z-index: 100;
  bottom: 32px;

  background-color: ${COLORS.mainColor};

  border-radius: 8px;

  & > span {
    color: ${COLORS.primaryColor};
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
  }
`;

const AnimationContainer = styled.div`
  position: fixed;
  top: 10px;
  width: 60%;
  /* left, right는 해당 요소의 위치 시작점을 결정한다. 그런데, 이때, margin의 양 값을 auto로 줌으로써 마진을 주어 해당 요소의 양 끝 위치를 각각 0으로 만들어준다. */
  margin: 0 auto;
  left: 0;
  right: 0;
  /* 다른 것들 */
  display: flex;

  align-items: center;
  justify-content: center;

  background-color: rgb(250, 141, 14, 0.8);
  padding: 16px 24px;
  border-radius: 16px;
  color: ${COLORS.primaryColor};
  font-size: 16px;
  font-weight: 600;
  z-index: 200;
  animation: ${fadeInOut} 4s ease-in-out forwards; /* 애니메이션을 부드럽게 적용 */
`;

export default OnlinePopupProductPage;
