"use client";

import { ButtonLarge } from "@/app/components/buttons";
import { IconChevronLeft, IconX } from "@/app/components/icons";
import { InputRound } from "@/app/components/inputs";
import { DefaultLayout, Spacer } from "@/app/components/layout";
import { TopNavigation } from "@/app/navigation/topnavigation";
import { COLORS } from "@/public/styles/colors";
import { RegexpInputNumber, RegexpPhone } from "@/public/utils/regexp";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import DaumPostcode from "react-daum-postcode";
import axiosInstance from "@/public/network/axios";
import { UserAddress } from "@/public/utils/types";
import { Loading } from "@/app/components/loading";

const AddressEditPage: React.FC = () => {
  const router = useRouter();

  const [valueNickname, setValueNickname] = useState<string>("");
  const [valueName, setValueName] = useState<string>("");
  const [valuePhone, setValuePhone] = useState<string>("");
  const [isPhoneFocused, setIsPhoneFocused] = useState<boolean | null>(null);
  const [isValidPhone, setIsValidPhone] = useState<boolean>(false);
  const [statusPhone, setStatusPhone] = useState<boolean | null>(null);
  const [bottomTextPhone, setbottomTextPhone] = useState<string>("");

  const [openPostcode, setOpenPostcode] = useState<boolean>(false);

  const [valueZIPCode, setValueZIPCode] = useState<string>("");
  const [valueAddress, setValueAddress] = useState<string>("");
  const [valueAddressDetail, setValueAddressDetail] = useState<string>("");
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [isDefaultAddress, setIsDefaultAddress] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [addressId, setAddressId] = useState<string | null>();
  const [originalData, setOriginalData] = useState<UserAddress>();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const encodedRedirectPath = searchParams.get("redirect");
    const idParam = searchParams.get("id");
    setAddressId(idParam);

    if (encodedRedirectPath) {
      const decodedPath = decodeURIComponent(encodedRedirectPath);

      const urlObject = new URL(decodedPath);
      const decodedSearchParams = new URLSearchParams(urlObject.search);
      const innerRedirect = decodedSearchParams.get("redirect");

      if (innerRedirect) {
        const reEncodedRedirect = encodeURIComponent(innerRedirect);
        const reEncodedPath = `${urlObject.origin}${urlObject.pathname}?redirect=${reEncodedRedirect}`;
        setRedirectPath(reEncodedPath);
      } else {
        setRedirectPath(decodedPath);
      }
    }
  }, []);

  useEffect(() => {
    if (addressId) {
      OriginalDataGET(addressId);
    }
  }, [addressId]);

  useEffect(() => {
    if (isPhoneFocused === false) {
      if (RegexpPhone.test(valuePhone)) {
        setStatusPhone(null);
        setbottomTextPhone("");
      } else {
        setStatusPhone(false);
        setIsValidPhone(false);
        setbottomTextPhone("전화번호 서식에 맞지 않습니다.");
      }
    } else {
      setStatusPhone(null);
      setbottomTextPhone("");
    }
  }, [isPhoneFocused]);

  const handleComplete = (data: any) => {
    setValueZIPCode(data.zonecode);
    setValueAddress(data.address);
  };

  const OriginalDataGET = async (id: string | null) => {
    if (!id) {
      alert("잘못된 접근입니다.");
      if (redirectPath) {
        window.location.href = redirectPath;
      } else {
        router.push("/?page=mypage");
      }
    }
    try {
      const response = await axiosInstance.get(`/api/user/address?id=${id}`);
      if (response.status === 200) {
        const data: UserAddress = response.data;
        setOriginalData(data); // 원본 데이터를 상태에 저장
        setValueAddress(data.address);
        setValueAddressDetail(data.detailAddress);
        setValueName(data.name);
        setValueNickname(data.addressName);
        setValuePhone(data.phoneNumber);
        setValueZIPCode(data.postNumber);
        setIsDefaultAddress(data.default);
        setIsValidPhone(true);
        setIsLoading(false);
      }
    } catch (error: any) {}
  };

  const AddressDataPut = async (id: string | null) => {
    if (
      originalData &&
      (originalData.addressName !== valueNickname ||
        originalData.name !== valueName ||
        originalData.phoneNumber !== valuePhone ||
        originalData.address !== valueAddress ||
        originalData.postNumber !== valueZIPCode ||
        originalData.detailAddress !== valueAddressDetail ||
        originalData.default !== isDefaultAddress)
    ) {
      if (
        valueNickname !== "" &&
        valueName !== "" &&
        isValidPhone &&
        valueAddress !== "" &&
        valueZIPCode !== ""
      )
        try {
          const response = await axiosInstance.put(`/api/user/address`, {
            id: id,
            addressName: valueNickname,
            name: valueName,
            phoneNumber: valuePhone,
            address: valueAddress,
            postNumber: valueZIPCode,
            detailAddress: valueAddressDetail,
            default: isDefaultAddress,
          });
          if (response.status === 202) {
            alert("배송지 정보가 수정 되었습니다.");
            if (redirectPath) {
              window.location.href = redirectPath;
            } else {
              router.push("/?page=mypage");
            }
          }
        } catch (error: any) {
          if (error.response.status === 401) {
          } else if (error.response.status === 400) {
            alert(error.response.data.message);
            if (redirectPath) {
              window.location.href = redirectPath;
            } else {
              router.push("/?page=mypage");
            }
          }
        }
    } else {
      alert("배송지 정보가 수정 되었습니다.");
      if (redirectPath) {
        window.location.href = redirectPath;
      } else {
        router.push("/?page=mypage");
      }
    }
  };
  if (isLoading || !addressId) return <Loading />;

  return (
    <DefaultLayout top={0} right={20} bottom={0} left={20}>
      <TopNavigation>
        <TopNavCenterContainer>
          <TopNavTitle>배송지 수정</TopNavTitle>
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
        <InputsContainer>
          <InputRound
            value={valueNickname}
            placeholder="배송지 별칭"
            type="text"
            maxLength={15}
            status={null}
            bottomText={""}
            bottomTextClickable={false}
            bottomTextOnClick={() => {}}
            onChange={(text: string) => {
              setValueNickname(text);
            }}
            onFocus={() => {}}
            onBlur={() => {}}
            disabled={false}
          />

          <InputRound
            value={valueName}
            placeholder="이름"
            type="text"
            maxLength={12}
            status={null}
            bottomText={""}
            bottomTextClickable={false}
            bottomTextOnClick={() => {}}
            onChange={(text: string) => {
              setValueName(text);
            }}
            onFocus={() => {}}
            onBlur={() => {}}
            disabled={false}
          />

          <InputRound
            value={valuePhone}
            placeholder="전화번호(숫자만 입력)"
            type="text"
            maxLength={11}
            status={statusPhone}
            bottomText={bottomTextPhone}
            bottomTextClickable={false}
            bottomTextOnClick={() => {}}
            onChange={(text: string) => {
              setValuePhone(text.replace(RegexpInputNumber, ""));
              setIsValidPhone(RegexpPhone.test(text));
            }}
            onFocus={() => {
              setIsPhoneFocused(true);
            }}
            onBlur={() => {
              setIsPhoneFocused(false);
            }}
            disabled={false}
          />

          <FindAddressContainer>
            <InputRound
              value={valueZIPCode}
              placeholder="우편번호"
              type="text"
              maxLength={undefined}
              status={null}
              bottomText={""}
              bottomTextClickable={false}
              bottomTextOnClick={() => {}}
              onChange={(text: string) => {}}
              onFocus={() => {}}
              onBlur={() => {}}
              disabled={true}
            />

            <FindAddressButton
              onClick={() => {
                setOpenPostcode(true);
              }}
            >
              <p>주소찾기</p>
            </FindAddressButton>
          </FindAddressContainer>

          <InputRound
            value={valueAddress}
            placeholder="주소"
            type="text"
            maxLength={undefined}
            status={null}
            bottomText={""}
            bottomTextClickable={false}
            bottomTextOnClick={() => {}}
            onChange={(text: string) => {}}
            onFocus={() => {}}
            onBlur={() => {}}
            disabled={true}
          />

          <InputRound
            value={valueAddressDetail}
            placeholder="상세주소"
            type="text"
            maxLength={undefined}
            status={null}
            bottomText={""}
            bottomTextClickable={false}
            bottomTextOnClick={() => {}}
            onChange={(text: string) => {
              setValueAddressDetail(text);
            }}
            onFocus={() => {}}
            onBlur={() => {}}
            disabled={false}
          />

          <CheckboxContainer>
            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={isDefaultAddress}
                onChange={() => setIsDefaultAddress(!isDefaultAddress)}
              />
              기본 배송지로 설정
            </CheckboxLabel>
          </CheckboxContainer>
        </InputsContainer>

        <ButtonLarge
          text={"저장"}
          buttonColor={
            valueNickname !== "" &&
            valueName !== "" &&
            isValidPhone &&
            valueAddress !== "" &&
            valueZIPCode !== ""
              ? COLORS.mainColor
              : COLORS.greyColor
          }
          textColor={COLORS.primaryColor}
          onClick={() => {
            AddressDataPut(addressId);
          }}
        />
      </Container>

      {openPostcode && (
        <DaumPostBackground>
          <DaumPostcodeContainer>
            <DaumPostcodeClose>
              <Spacer />
              <div
                onClick={() => {
                  setOpenPostcode(false);
                }}
              >
                <IconX
                  color={COLORS.whiteColor}
                  width={undefined}
                  height={20}
                />
              </div>
            </DaumPostcodeClose>
            <DaumPostcode
              onComplete={(data) => {
                handleComplete(data);
                setOpenPostcode(false);
              }}
              autoClose={true}
            />
          </DaumPostcodeContainer>
        </DaumPostBackground>
      )}
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
  gap: 40px;

  width: 100%;
  height: 100%;

  background: ${COLORS.primaryColor};
`;

const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  margin-top: 12px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
`;

const CheckboxLabel = styled.label`
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  user-select: none;

  color: ${COLORS.greyColor};

  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckboxInput = styled.input.attrs({ type: "checkbox" })`
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
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNyIgdmlld0JveD0iMCAwIDEwIDciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTMuMzMzMzMgN0wwIDRMMS4xMTExMSAzTDMuMzMzMzMgNUw4Ljg4ODg5IDBMMTAgMUwzLjMzMzMzIDdaIiBmaWxsPSIjRkE4RDBFIi8+PC9zdmc+");
    background-size: 10px 7px;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: ${COLORS.lightGreyColor};
    border: 1px solid ${COLORS.greyColor};
  }
`;

const FindAddressContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

const FindAddressButton = styled.div`
  border-radius: 8px;
  background: ${COLORS.mainColor};

  cursor: pointer;

  p {
    padding: 16px 12px;

    color: ${COLORS.whiteColor};
    text-align: center;

    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const DaumPostBackground = styled.div`
  position: absolute;

  left: 0;
  top: 0;

  z-index: 2;

  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);

  overflow: hidden;
`;

const DaumPostcodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;

  width: 100%;
  height: 100%;

  padding: 0 20px;
  box-sizing: border-box;
`;

const DaumPostcodeClose = styled.div`
  display: flex;
  flex-direction: row;

  width: 100%;
`;

export default AddressEditPage;
