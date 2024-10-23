"use client";
import React, { SetStateAction, useState } from "react";
import styled from "styled-components";
import StoreInformation from "./StoreInformation";
import { user } from "@/public/utils/types";
import { useSelector } from "react-redux";

interface StoreInfoListProps {
  //TODO: storeList 스토어 리스트도 props로 받아야 함
  store: string;
  setStore: React.Dispatch<SetStateAction<string>>;
}
const StoreInfoList: React.FC<StoreInfoListProps> = ({ store, setStore }) => {
  const userData: user = useSelector((state: any) => state.poppingUser.user);

  const eachStoreClickHandler = () => {
    if (store !== "") {
      setStore(store);
    }
  };

  return userData.isPopper ? (
    <Container>
      <ListContainer>
        <ListTheme>내 팝업 스토어</ListTheme>
        <StoreList>
          {/*TODO: 리스트 렌더링 필요 */}
          {/* <StoreInformation
            storeId={"123"}
            currentStoreId={store}
            setCurrentStoreId={setStore}
          /> */}
        </StoreList>
      </ListContainer>

      <ListContainer>
        <ListTheme>기타</ListTheme>
        <StoreList>
          {/*TODO: 리스트 렌더링 필요 */}
          {/* <StoreInformation
            storeId={"123"}
            currentStoreId={store}
            setCurrentStoreId={setStore}
          />
          <StoreInformation
            storeId={"123"}
            currentStoreId={store}
            setCurrentStoreId={setStore}
          />
          <StoreInformation
            storeId={"123"}
            currentStoreId={store}
            setCurrentStoreId={setStore}
          />
          <StoreInformation
            storeId={"123"}
            currentStoreId={store}
            setCurrentStoreId={setStore}
          /> */}
        </StoreList>
      </ListContainer>
    </Container>
  ) : (
    <Container>
      <StoreListContainer>
        {/*TODO: 리스트 렌더링 필요 */}
        {/* <StoreInformation
          storeId={"123"}
          currentStoreId={store}
          setCurrentStoreId={setStore}
        />
        <StoreInformation
          storeId={"567"}
          currentStoreId={store}
          setCurrentStoreId={setStore}
        />
        <StoreInformation
          storeId={"1234"}
          currentStoreId={store}
          setCurrentStoreId={setStore}
        />
        <StoreInformation
          storeId={"4321"}
          currentStoreId={store}
          setCurrentStoreId={setStore}
        /> */}
      </StoreListContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 32px 20px;
  width: 100%;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 28px;
`;

const ListTheme = styled.div`
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const StoreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  width: 100%;
`;

const StoreListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 21px;

  margin-top: 32px;
  width: 100%;
`;

export default StoreInfoList;
