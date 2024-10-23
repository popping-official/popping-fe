"use client";

import { ButtonLarge } from "@/app/components/buttons";
import { IconChevronLeft } from "@/app/components/icons";
import { BottomBox, DefaultLayout } from "@/app/components/layout";
import { Loading } from "@/app/components/loading";
import { TopNavigation } from "@/app/navigation/topnavigation";
import axiosInstance from "@/public/network/axios";
import { COLORS } from "@/public/styles/colors";
import { UserAddress } from "@/public/utils/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { styled } from "styled-components";

const AdressListPage: React.FC = () => {
  const router = useRouter();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [addAble, setAddAble] = useState<boolean>(false);
  const [addressData, setAddressData] = useState<UserAddress[]>();

  useEffect(() => {
    AddressDataGet();
    const searchParams = new URLSearchParams(window.location.search);
    const encodedRedirectPath = searchParams.get("redirect");
    if (encodedRedirectPath) {
      const decodedPath = decodeURIComponent(encodedRedirectPath); // 인코딩된 URL을 디코딩
      setRedirectPath(decodedPath);
    }
  }, []);

  const AddressDataGet = async () => {
    try {
      const response = await axiosInstance.get(`/api/user/address`);

      if (response.status === 200) {
        const data = response.data;
        const sortedData = data.sort((a: UserAddress, b: UserAddress) => {
          return b.default ? 1 : -1;
        });
        setAddressData(sortedData);
        setAddAble(data.length < 5);
      }
    } catch (error: any) {}
  };

  const AddressDelete = async (id: number, deleteAble: boolean) => {
    if (deleteAble) {
      alert("기본배송지는 삭제할 수 없습니다.");
    } else {
      try {
        const response = await axiosInstance.delete(
          `/api/user/address?id=${id}`
        );

        if (response.status === 202) {
          alert("배송지가 삭제되었습니다.");
          const updatedAddressData = addressData?.filter(
            (address) => address.id !== id
          );
          setAddressData(updatedAddressData);
          setAddAble(true);
        }
      } catch (error: any) {}
    }
  };

  const AddressDefaultUpdate = async (id: number, updateAble: boolean) => {
    if (updateAble) {
      alert("이미 기본배송지로 설정되어 있습니다.");
    } else {
      try {
        const response = await axiosInstance.patch(
          `/api/user/address?id=${id}`
        );

        if (response.status === 202) {
          alert("기본배송지가 변경 되었습니다.");
          const updatedAddressData = addressData?.map((address) =>
            address.id === id
              ? { ...address, default: true }
              : { ...address, default: false }
          );
          const sortedData = updatedAddressData?.sort((a, b) =>
            b.default ? 1 : -1
          );
          setAddressData(sortedData);
        }
      } catch (error: any) {}
    }
  };

  const GoToEdit = (id: number) => {
    router.push(
      `/address/edit/?id=${id}&redirect=${encodeURIComponent(
        window.location.href
      )}`
    );
  };

  if (!addressData) return <Loading />;

  const AddressAdd = (addAble: boolean) => {
    if (addAble) {
      router.push(
        `/address/add?redirect=${encodeURIComponent(window.location.href)}`
      );
    } else {
      alert(
        `배송지를 추가할 수 있는 최대치입니다.\n현재 : ${addressData.length}개`
      );
    }
  };

  return (
    <DefaultLayout top={0} right={20} bottom={0} left={20}>
      <TopNavigation>
        <TopNavCenterContainer>
          <TopNavTitle>배송지 관리</TopNavTitle>
        </TopNavCenterContainer>
        <TopNavLeftContainer
          onClick={() => {
            if (redirectPath) {
              window.location.href = redirectPath;
            } else {
              router.push("/?page=mypage");
            }
          }}
        >
          <IconChevronLeft
            color={COLORS.secondaryColor}
            width={undefined}
            height={16}
          />
        </TopNavLeftContainer>
      </TopNavigation>
      <Container>
        {addAble ? (
          <ButtonLarge
            text="배송지 추가"
            buttonColor={COLORS.primaryColor}
            borderWidth={1}
            borderColor={COLORS.mainColor}
            textColor={COLORS.mainColor}
            onClick={() => {
              AddressAdd(addAble);
            }}
          />
        ) : (
          <ButtonLarge
            text="배송지 추가"
            buttonColor={COLORS.greyColor}
            borderWidth={1}
            borderColor={COLORS.greyColor}
            textColor={COLORS.primaryColor}
            onClick={() => {
              AddressAdd(addAble);
            }}
          />
        )}
        <AddressesContainer>
          <AddressCount>배송지 ({addressData?.length}/5)</AddressCount>
          {addressData.map((data: UserAddress, index: number) => (
            <AddressBox key={`address-${index}`}>
              {data.default && (
                <BadgeContainer>
                  <DefaultBadge>
                    <p>기본</p>
                  </DefaultBadge>
                </BadgeContainer>
              )}
              <AddressNickname>
                {data.addressName}({data.name})
              </AddressNickname>
              <AddressText>{data.phoneNumber}</AddressText>
              <AddressText>
                ({data.postNumber}) {data.address}, {data.detailAddress}
              </AddressText>
              <OptionsContainer>
                {!data.default && (
                  <SetDefaultText
                    onClick={() => AddressDefaultUpdate(data.id, data.default)}
                  >
                    기본 배송지 선택
                  </SetDefaultText>
                )}
                <OptionText onClick={() => GoToEdit(data.id)}>수정</OptionText>
                <OptionText
                  onClick={() => AddressDelete(data.id, data.default)}
                >
                  삭제
                </OptionText>
              </OptionsContainer>
            </AddressBox>
          ))}
        </AddressesContainer>
      </Container>
      <BottomBox />
    </DefaultLayout>
  );
};

const TopNavCenterContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: auto;
`;

const TopNavTitle = styled.p`
  color: ${COLORS.secondaryColor};
  text-align: center;

  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const TopNavLeftContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);

  width: auto;
  height: 20px;

  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  width: 100%;
  height: 100%;

  background: ${COLORS.primaryColor};
`;

const AddressesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const AddressCount = styled.p`
  font-size: 16px;
  line-height: normal;

  font-weight: 600;
  color: ${COLORS.secondaryColor};
`;

const AddressBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const DefaultBadge = styled.div`
  border-radius: 4px;
  background: ${COLORS.mainColor};

  p {
    padding: 4px 12px;

    color: ${COLORS.whiteColor};

    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

const AddressNickname = styled.p`
  color: ${COLORS.secondaryColor};

  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  margin-bottom: 4px;
`;

const AddressText = styled.p`
  color: ${COLORS.secondaryColor};

  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

const SetDefaultText = styled.p`
  color: ${COLORS.mainColor};

  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  cursor: pointer;
`;

const OptionText = styled.p`
  color: ${COLORS.greyColor};

  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  cursor: pointer;
`;

export default AdressListPage;
