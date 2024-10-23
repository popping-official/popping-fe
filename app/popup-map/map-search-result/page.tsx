"use client";
import styled from "styled-components";
import { DefaultLayout } from "@/app/components/layout";
import { useRouter, useSearchParams } from "next/navigation";
import { COLORS } from "@/public/styles/colors";
import { IconChevronLeft } from "@/app/components/icons";
import axiosInstance from "@/public/network/axios";
import React, { useEffect, useState } from "react";
import { PopupStoreDataType, PopupStoreSimpleData, user } from "@/public/utils/types";
import StoreCardList from "@/app/components/popup-map/StoreCardList";
import { useSelector } from "react-redux";
import { Loading } from "@/app/components/loading";
import StoreCard from "@/app/components/popup-map/StoreCard";
import Home from "@/app/components/home";
import Back from "@/app/components/back";

const MapSearchResultPage: React.FC = () => {
  const userData: user = useSelector((state: any) => state.poppingUser.user);
  const router = useRouter();
  const params = useSearchParams();

  const [storeList, setStoreList] = useState<PopupStoreDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const searchParam = params.get('search');
  const locationParam = params.get('location');

  const popupStoreAPI = async () => {

    if (locationParam) {
      var district = locationParam.split(" ")[1];
      var APIurl = `/api/maps/off-popups?district=${district}&search=${searchParam}`;
    } else {
      var APIurl = `/api/maps/off-popups?search=${searchParam}`;
    }


    await axiosInstance
      .get(APIurl)
      .then((response: any) => {
        setStoreList(response.data.popupStores);
        setIsLoading(false)
      })
      .catch((error: any) => {
        console.error("There was an error making the GET request!", error);
      });
  };

  useEffect(() => {
    popupStoreAPI();
  }, [router])

  return (
    <DefaultLayout top={0} bottom={0} left={0} right={0}>
      {isLoading ? (
        <Loading />
      ) : (
        <Container>
          <ResultHeader>

            <Back url={`/popup-map`} />

            {locationParam ? (
              <p>
                {locationParam}의 &quot;{searchParam}&quot; 검색 결과
              </p>
            ) : (
              <p>
                &quot;{searchParam}&quot; 검색 결과
              </p>
            )}

            <Home />

          </ResultHeader>

          <StoreCardListContainer>

            {storeList.map((store: PopupStoreDataType, index: number) => (
              <StoreCard key={`result-${index}`} store={store} isPopper={false} />
            ))}
          </StoreCardListContainer>
        </Container>
      )}
    </DefaultLayout>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: calc(100% - 40px);
  height: 100dvh;
  
  padding: 0 20px;
  background-color: ${COLORS.whiteColor};
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-bottom: 42px;
  padding-top: 16px;

  width: 100%;

  & > p {
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;


const StoreCardListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  overflow-y: auto;
  
  gap: 20px 16px;

  align-items: flex-start;
  padding-bottom: 80px;
`;



export default MapSearchResultPage;
