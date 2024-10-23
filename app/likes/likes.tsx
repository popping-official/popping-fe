"use client";

import { styled } from "styled-components";
import { DefaultLayout } from "../components/layout";
import { COLORS } from "@/public/styles/colors";
import Image from "next/image";
import { TopNavigation } from "../navigation/topnavigation";
import { Taps } from "../components/tabs";
import { useEffect, useState } from "react";
import Goods from "./goods";
import Stores from "./stores";
import Following from "./follwing";
import axiosInstance from "@/public/network/axios";
import {
  BrandType,
  PopupStoreDataType,
  ProductType,
} from "@/public/utils/types";
import { useRouter } from "next/navigation";
import { Loading } from "../components/loading";

const LikesPage: React.FC = () => {
  const router = useRouter();
  const tabValues: string[] = ["상품", "팝업스토어", "브랜드"];

  const [sessionAbleCheck, setSessionAbleCheck] = useState<boolean>(false);
  const [brands, setBrands] = useState<BrandType[]>();
  const [products, setProducts] = useState<ProductType[]>();
  const [popups, setPopups] = useState<PopupStoreDataType[]>();

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    const storedBrand = sessionStorage.getItem("brands");
    const storedProduct = sessionStorage.getItem("products");
    const storedPopup = sessionStorage.getItem("popups");
    const followCheck = sessionStorage.getItem("followToggle") === "true";
    if (storedBrand && storedProduct && storedPopup && !followCheck) {
      setBrands(JSON.parse(storedBrand));
      setProducts(JSON.parse(storedProduct));
      setPopups(JSON.parse(storedPopup));
      setSessionAbleCheck(true);
    } else {
      UserLikeDataGet();
    }
  }, []);

  const UserLikeDataGet = async () => {
    if (sessionAbleCheck) {
      return;
    }

    try {
      const response = await axiosInstance.get(`/api/popup/follow/list`);
      if (response.status === 200) {
        const { brands, products, popups } = response.data;
        setBrands(brands);
        setProducts(products);
        setPopups(popups);

        sessionStorage.setItem("brands", JSON.stringify(brands));
        sessionStorage.setItem("products", JSON.stringify(products));
        sessionStorage.setItem("popups", JSON.stringify(popups));
        sessionStorage.setItem("followToggle", "false");
        setSessionAbleCheck(true);
      }
    } catch (e: any) {
      if (e.response && e.response.status === 401) {
        alert("로그인 후 이용가능합니다.");
        router.push(
          `/member/signin?redirect=${encodeURIComponent(
            window.location.pathname
          )}`
        );
      }
    }
  };

  if (!products || !brands || !popups) return <Loading />;

  return (
    <DefaultLayout top={0} right={20} bottom={0} left={20}>
      <TopNavigation>
        <TopNavCenterContainer>
          <TopNavTitle>관심</TopNavTitle>
        </TopNavCenterContainer>
      </TopNavigation>
      <Container>
        <Taps
          values={tabValues}
          selected={tabValues[selectedIndex]}
          onSelect={(index: number) => {
            setSelectedIndex(index);
          }}
        />
        {selectedIndex === 0 && <Goods values={products} />}

        {selectedIndex === 1 && <Stores values={popups} />}
        {selectedIndex === 2 && <Following values={brands} />}
      </Container>
    </DefaultLayout>
  );
};

const TopNavCenterContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: auto;

  cursor: pointer;
`;

const TopNavTitle = styled.p`
  color: ${COLORS.secondaryColor};
  text-align: center;

  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  width: 100%;
  height: 100%;

  background: ${COLORS.primaryColor};

  padding-bottom: 80px;
`;

export default LikesPage;
