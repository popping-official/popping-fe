import { COLORS } from "@/public/styles/colors";
import { KRWLocaleString } from "@/public/utils/function";
import { CartOption, CartType } from "@/public/utils/types";
import styled from "styled-components";
import { Spacer } from "../layout";
import { IconMinus, IconPlus } from "../icons";
import { useEffect, useState } from "react";
import axiosInstance from "@/public/network/axios";
import BottomModal from "./bottomModal";
import { useRouter } from "next/navigation";

interface HorizontalCardProps {
  isPayment: boolean;
  onCheckboxChange: (selected: boolean) => void;
  data: CartType;
  setCartLen?: () => void;
  brand: string;
}

const HorizontalCard: React.FC<HorizontalCardProps> = ({ brand, setCartLen, isPayment, data, onCheckboxChange }) => {
  const router = useRouter();

  const [realPrice, setRealPrice] = useState<number>(data.product.price);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [deleteComplete, setDeleteComplete] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [option, setOption] = useState<CartOption>(data.option);

  useEffect(() => {
    setRealPrice(data.product.price * option.amount);
  }, [option.amount, data.product.price]);

  // handleCheckboxChange 함수 수정
  const handleCheckboxChange = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onCheckboxChange(newChecked);
  };

  const DeleteClick = () => {
    DeleteCart();
  };

  useEffect(() => {
    if (deleteComplete) {
      setIsVisible(!isVisible);
      setIsChecked(false);
      if (setCartLen) {
        setCartLen();
      }
    }
  }, [deleteComplete]);

  const DeleteCart = async () => {
    try {
      const response = await axiosInstance.delete('/api/popup/cart/data', {
        data: { id: data.id }
      });
      if (response.status === 202) {
        setDeleteComplete(true);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert("로그인 후 이용가능합니다.");
        router.push(`/member/signin?redirect=${encodeURIComponent(window.location.href)}`);
      }
    }
  };

  const handleOptionChange = (updatedOption: CartOption) => {
    setOption(updatedOption);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const GoToProductDetail = (brand: string, product: number) => {
    router.push(`/online-popup/${brand}/product/${product}`);
  };

  if (!isVisible) return null;

  return (
    <Container>
      {!isPayment && (
        <CheckboxLabel>
          <CheckboxButton
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </CheckboxLabel>
      )}
      <div style={{ cursor: 'pointer' }} onClick={() => GoToProductDetail(brand, data.product.id)}>
        <Thumbnail src={data.product.thumbnail} />
      </div>
      <Info>
        <Header>
          <Title onClick={() => GoToProductDetail(brand, data.product.id)}>
            {data.product.name}
          </Title>
          {!isPayment && <DeleteBtn onClick={DeleteClick}>삭제</DeleteBtn>}
        </Header>
        <Spacer />
        <Option>
          <span>{option.color}({option.size}) / {option.amount}개</span>
          {!isPayment && <OptionChangeBtn onClick={toggleModal}>변경</OptionChangeBtn>}
        </Option>
        <Price>{KRWLocaleString(realPrice)} KRW</Price>
      </Info>
      {!isPayment && (
        <BottomModal
          toggleModal={toggleModal}
          isVisible={isModalVisible}
          data={data}
          onOptionChange={handleOptionChange}
        />
      )}
    </Container>
  );
};


const CheckboxLabel = styled.label`
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  user-select: none;
`;

const CheckboxButton = styled.input.attrs({ type: 'checkbox' })`
  cursor: pointer;
  appearance: none; 
  border: none;
  margin: 0;
  width: 16px;
  height: 16px; 
  background-color: ${COLORS.primaryColor};
  border: 1px solid ${COLORS.greyColor};
  border-radius: 3px;
  z-index: 1;

  &:checked {
    border-color: transparent;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNyIgdmlld0JveD0iMCAwIDEwIDciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTMuMzMzMzMgN0wwIDRMMS4xMTExMSAzTDMuMzMzMzMgNUw4Ljg4ODg5IDBMMTAgMUwzLjMzMzMzIDdaIiBmaWxsPSIjRkE4RDBFIi8+PC9zdmc+');    
    background-size:  10px 7px;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: ${COLORS.lightGreyColor};
    border: 1px solid ${COLORS.greyColor};
  }
`;

const Container = styled.div`
  width: 100%;
  height: 84px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const Thumbnail = styled.img`
  width: 84px;
  border-radius: 8px;
  object-fit: cover;
`;

const Info = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 4px;
  gap: 24px;
`;

const Title = styled.div`
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  word-break: break-all;

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const DeleteBtn = styled.div`
  flex: 0 0 auto;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: ${COLORS.greyColor};
`;

const Option = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  & > span {
    font-size: 13px;
    font-weight: 500;
  }
`;

const OptionChangeBtn = styled.div`
  flex: 0 0 auto;
  cursor: pointer;
  font-size: 12px;
  font-weight: 400;
  color: ${COLORS.greyColor};
`;


const Price = styled.span`
  margin-top: auto;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export default HorizontalCard;