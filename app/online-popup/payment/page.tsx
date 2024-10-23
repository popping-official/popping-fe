"use client";
import Back from "@/app/components/back";
import BottomUpModal from "@/app/components/BottomUpModal";
import { IconPlus } from "@/app/components/icons";
import { DefaultLayout } from "@/app/components/layout";
import { Loading } from "@/app/components/loading";
import BottomModal from "@/app/components/online-popup/bottomModal";
import StoreDecisionButton from "@/app/components/online-popup/decisionButton";
import PopupHeader from "@/app/components/online-popup/header";
import HorizontalCard from "@/app/components/online-popup/horizontalCard";
import axiosInstance from "@/public/network/axios";
import { COLORS } from "@/public/styles/colors";
import { FormatTelHyphen, KRWLocaleString } from "@/public/utils/function";
import {
  CartType,
  PaymentType,
  UserAddress,
  UserGrade,
} from "@/public/utils/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Payment: React.FC = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [brandName, setBrandName] = useState<string>();
  const [orderData, setOrderData] = useState<PaymentType>();
  const [point, setPoint] = useState<number>();
  const [usePoint, setUsePoint] = useState<number>(0);
  const [addressData, setAddressData] = useState<UserAddress[]>([]);
  const [useAddress, setUseAddress] = useState<UserAddress>();
  const [grade, setGrade] = useState<boolean>(false);
  const [gradeData, setGradeData] = useState<UserGrade[]>();
  const [userGrade, setUserGrade] = useState<UserGrade>();

  const [finalPrice, setFinalPrice] = useState<number>();

  useEffect(() => {
    if (orderData) {
      setFinalPrice(orderData.totalPrice - orderData.totalDiscount - usePoint);
    }
  }, [usePoint, orderData]);

  const CartDataGetAPI = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/popup/order?oid=${searchParam.get("oid")}`
      );
      if (response.status === 200) {
        setBrandName('POPPING');
        setPoint(response.data.point);
        setOrderData(response.data.order);
        setAddressData(response.data.address);
        setGradeData(response.data.grade);
        setUserGrade(response.data.userGrade);
        setFinalPrice(response.data.totalPrice - response.data.totalDiscount);

        const defaultAddress = response.data.address.find(
          (address: UserAddress) => address.default
        );

        if (defaultAddress) {
          const otherAddresses = response.data.address.filter(
            (address: UserAddress) => !address.default
          );
          const sortedAddresses = [defaultAddress, ...otherAddresses];
          setAddressData(sortedAddresses);
          setUseAddress(defaultAddress);
        }
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

  const getMyPageDataApi = async () => {
    try {
      const response = await axiosInstance.get(`/api/user/mypage`);
      if (response.status === 200) {
      }
    } catch (error: any) {
      if (error.response.statue === 403) {
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
      router.push("/");
    }
  };

  const handleCheckboxChange = (index: number, selected: boolean) => {
    setSelectedCards((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (selected) {
        newSelected.add(index);
      } else {
        newSelected.delete(index);
      }
      return newSelected;
    });
  };

  useEffect(() => {
    CartDataGetAPI();
    getMyPageDataApi();
  }, []);

  const findUserGradeData = () => {
    return gradeData?.find((data) => data.grade === userGrade?.grade);
  };

  const userGradeData = findUserGradeData();

  const toggleModal = () => {
    setGrade(!grade);
  };

  const handleUsePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = Number(e.target.value.replace(/[^0-9]/g, ""));
    if (inputValue > point!) {
      inputValue = point!;
    }
    setUsePoint(inputValue);
  };

  if (
    !orderData ||
    !brandName ||
    !point ||
    !addressData ||
    !gradeData ||
    !userGrade ||
    !finalPrice
  )
    return <Loading />;

  return (
    <DefaultLayout top={16} right={20} bottom={0} left={20}>
      <Back url={undefined} color={undefined} />
      <Container>
        <PopupHeader main={"주문"} sub={`${brandName} STORE`} />

        {/* Payment Product Section */}
        <Section>
          <PopupHeader section={`상품`} />
          {orderData.item.map((data: CartType, index: number) => (
            <HorizontalCard
              brand={brandName}
              isPayment={true}
              key={index}
              data={data}
              onCheckboxChange={(selected) =>
                handleCheckboxChange(index, selected)
              }
            />
          ))}
        </Section>
        {/* END, Payment Product Section */}

        {/* CS(Delivery address) User Data Section */}
        <Section>
          <PopupHeader section={`배송지`} />
          {/* user Delivery Address */}
          <Contents>
            <ContentsHeader>
              {addressData.length > 0 &&
                addressData.map((address: UserAddress, index: number) => (
                  <AddressBadge
                    key={`address-${index}`}
                    onClick={() => setUseAddress(address)}
                    isActive={useAddress?.id === address.id}
                  >
                    <span>{address.addressName}</span>
                  </AddressBadge>
                ))}
              <AddressEditButton
                href={`/address/list?redirect=${encodeURIComponent(
                  window.location.href
                )}`}
              >
                주소 {addressData.length > 0 ? "변경" : "추가"}
              </AddressEditButton>
            </ContentsHeader>

            {addressData.length > 0 && useAddress ? (
              <ContentsBody>
                <Name>{useAddress.name}</Name>
                <Tel>{FormatTelHyphen(useAddress.phoneNumber)}</Tel>
                <Address>
                  ({useAddress.postNumber}) {useAddress.address},{" "}
                  {useAddress.detailAddress}
                </Address>
                <DeliveryRequestTextArea placeholder="배송 요청사항을 입력하세요..." />
              </ContentsBody>
            ) : (
              <ContentsBody>
                <AddressMessage>배송지를 추가해주세요</AddressMessage>
              </ContentsBody>
            )}
          </Contents>
        </Section>
        {/* END, CS(Delivery address) User Data Section */}

        <Section>
          <PopupHeader section={`콘`} />
          <Point>
            <PointInput
              placeholder="사용하실 콘을 입력하세요..."
              value={KRWLocaleString(usePoint)} // 포맷팅된 값을 value로 전달
              onChange={(e) => handleUsePointChange(e)} // 유효성 검사 적용된 핸들러로 변경
            />
            <span>보유 | {KRWLocaleString(point)}콘</span>
          </Point>
        </Section>

        <Section>
          <PopupHeader section={`적립`} />
          <OneByOne>
            <Guide onClick={() => setGrade(true)}>
              등급 적립 {userGrade.earnRate}% ⓘ{" "}
            </Guide>
            <ExpectedPoint>
              {KRWLocaleString(
                Math.round(finalPrice * (userGrade.earnRate / 100))
              )}
              콘
            </ExpectedPoint>
          </OneByOne>
        </Section>

        <Section>
          <PopupHeader section={`결제 금액`} />

          <OneByOne>
            <Simple>상품 금액</Simple>
            <Simple>{KRWLocaleString(orderData.totalPrice)}원</Simple>
          </OneByOne>

          <OneByOne>
            <Guide>할인 금액 ⓘ</Guide>
            <Simple>
              {orderData.totalDiscount && orderData.totalDiscount != 0 ? (
                <>{KRWLocaleString(orderData.totalDiscount)}콘</>
              ) : (
                <>-</>
              )}
            </Simple>
          </OneByOne>

          <OneByOne>
            <Simple>사용 콘</Simple>
            <Simple>
              {usePoint && usePoint != 0
                ? `${KRWLocaleString(usePoint)}콘`
                : "-"}
            </Simple>
          </OneByOne>

          <OneByOne>
            <Simple>배송비</Simple>
            <Simple>무료</Simple>
          </OneByOne>

          <FinalOneByOne>
            <Strong>총 결제 금액</Strong>
            <Strong>
              {finalPrice && finalPrice != 0 && KRWLocaleString(finalPrice)}원
            </Strong>
          </FinalOneByOne>
        </Section>

        {finalPrice && useAddress ? (
          <StoreDecisionButton
            isVisible={true}
            onClick={() => alert("현재 결제 기능은 지원하지 않습니다.")}
            sort={"right"}
            title={`${KRWLocaleString(finalPrice)}원 결제하기`}
          />
        ) : (
          <DisabledBottomButton>주문하기</DisabledBottomButton>
        )}
      </Container>

      {grade && (
        <BottomUpModal
          title={"등급 설명"}
          toggleModal={toggleModal}
          isVisible={grade}
          heightRate={50}
        >
          <GradeContainer>
            {gradeData?.map((data: UserGrade, index: number) => (
              <GradeRow
                key={`grade-${index}`}
                style={{
                  backgroundColor:
                    data.grade === userGrade?.grade
                      ? COLORS.lightGreyColor
                      : undefined,
                  order: data.grade === userGrade?.grade ? -1 : undefined,
                  borderRadius: 8,
                }}
              >
                {data.grade === userGrade.grade && <span>나의 등급</span>}

                <Grade>
                  <div>LV.{index + 1}</div>
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      color: data.color,
                    }}
                  >
                    {data.grade}
                  </span>
                </Grade>

                <GradeBenefit>
                  <span>
                    누적 구매금액: {KRWLocaleString(data.maxOrderAmount)}원
                  </span>
                  <span>추가 적립: {data.earnRate}%</span>
                  {data.discountRate != 0 && (
                    <span>추가 할인: {data.discountRate}%</span>
                  )}
                </GradeBenefit>
              </GradeRow>
            ))}
          </GradeContainer>
        </BottomUpModal>
      )}
    </DefaultLayout>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.primaryColor};

  gap: 40px;
  padding-bottom: 80px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;

  gap: 16px;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;

  gap: 12px;

  position: relative;
`;

const ContentsHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;

  align-items: center;
`;

const AddressBadge = styled.button<{ isActive: boolean }>`
  cursor: pointer;

  background-color: ${(props) =>
    props.isActive ? COLORS.mainColor : COLORS.greyColor};
  border: none;
  border-radius: 4px;

  padding: 3px 11px;

  & > span {
    font-size: 12px;
    font-weight: 600;
    color: ${COLORS.primaryColor};
  }
`;

const AddressEditButton = styled(Link)`
  cursor: pointer;
  font-size: 12px;
  font-weight: 400;
  color: ${COLORS.greyColor};
`;

const ContentsBody = styled.div`
  display: flex;
  flex-direction: column;

  gap: 8px;
`;

const Name = styled.p`
  font-size: 16px;
  font-weight: 500;
`;

const Tel = styled.p`
  font-size: 12px;
  font-weight: 500;
`;

const Address = styled.p`
  font-size: 12px;
  font-weight: 500;
`;

const AddressMessage = styled.p`
  padding: 16px 0;
  text-align: center;

  font-size: 14px;
  font-weight: 500;
  color: ${COLORS.greyColor};
`;

const DeliveryRequestTextArea = styled.textarea`
  height: 52px;
  padding: 8px;

  border: none;
  resize: none;
  /* box-shadow: 0 0 2px ${COLORS.greyColor} inset; */
  border: 1px solid ${COLORS.greyColor};
  border-radius: 4px;

  box-sizing: border-box;
  font-size: 10px;

  &::placeholder {
    color: ${COLORS.secondaryColor};
    font-weight: 400;
  }
  outline: none;
  &:focus {
    border: 1px solid ${COLORS.mainColor};
    border-radius: 4px;
  }
`;

const Point = styled.div`
  display: flex;
  flex-direction: column;

  gap: 4px;

  & > span {
    font-size: 12px;
    font-weight: 500;
  }
`;

const PointInput = styled.input`
  font-size: 12px;
  border: none;
  border: 1px solid ${COLORS.greyColor};
  border-radius: 4px;
  padding: 8px;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border: 1px solid ${COLORS.mainColor};
    border-radius: 4px;
  }
`;

const OneByOne = styled.div`
  display: flex;
  flex-direction: row;

  justify-content: space-between;
  align-items: center;
`;

const FinalOneByOne = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: row;

  justify-content: space-between;
  align-items: center;
`;

const Strong = styled.div`
  font-size: 12px;
  font-weight: 600;
`;

const Simple = styled.div`
  font-size: 12px;
  font-weight: 500;
`;

const Guide = styled.div`
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
`;

const ExpectedPoint = styled.span`
  font-size: 12px;
  font-weight: 500;
`;

const DisabledBottomButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${COLORS.greyColor};
  padding: 16px 0;
  border-radius: 8px;

  font-size: 16px;
  font-weight: 600;
  color: ${COLORS.primaryColor};
`;

const GradeContainer = styled.div`
  display: flex;
  flex-direction: column;

  gap: 16px;
`;

const GradeRow = styled.div`
  display: flex;
  flex-direction: column;

  align-items: flex-start;
  gap: 8px;

  padding: 16px 16px;
  &:first-child {
    margin-top: 20px;
  }

  & > span {
    font-size: 12px;
    font-weight: 500;
  }
`;

const Grade = styled.div`
  display: flex;
  flex-direction: row;

  gap: 4px;

  font-size: 18px;
  font-weight: 600;
`;

const GradeBenefit = styled.div`
  display: flex;
  flex-direction: column;

  gap: 4px;

  & span {
    font-size: 14px;
    font-weight: 500;
  }
`;

export default Payment;
