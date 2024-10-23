import { COLORS } from "@/public/styles/colors";
import { IconCart } from "../icons";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import axiosInstance from "@/public/network/axios";
import { useEffect, useState } from "react";

const CartButton: React.FC = () => {
  const router = useRouter();

  const [count, isCount] = useState<number>(0);

  useEffect(() => {
    CartBadgeGetAPI();
  }, [router])

  const ClickHandler = () => {
    router.push("/online-popup/cart")
  }

  const CartBadgeGetAPI = async () => {
    try {
      const response = await axiosInstance.get(`/api/popup/cart/count`)

      if (response.status === 200) {
        isCount(response.data.count)
      }
    }
    catch (error: any) {
      if (error.response.status === 401) {

      }
    }
  }


  return (
    <Container onClick={ClickHandler}>
      <IconCart
        color={COLORS.secondaryColor}
        width={undefined}
        height={16} />
      {(count > 0) &&
        <Badge>{count}</Badge>
      }
    </Container>
  )
}

const Container = styled.div`
  width: 44px;
  height: 44px;

  bottom: 32px;
  right: 20px;
  
  border: 1px solid ${COLORS.greyColor};
  background-color: white;
  border-radius: 50%;

  position: fixed;
  display: flex;

  align-items: center;
  justify-content: center;
  
  z-index: 100;
`

const Badge = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 16px;
  height: 16px;
  background-color: ${COLORS.mainColor};
  color: ${COLORS.primaryColor};

  font-size: 12px;
  font-weight: 500;

  border-radius: 50%;
  position: absolute;

  top: 4px;
  right: 7px;
`

export default CartButton;