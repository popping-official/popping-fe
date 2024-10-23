"use client";

import { ButtonLarge } from "@/app/components/buttons";
import { InputRound } from "@/app/components/inputs";
import { DefaultLayout } from "@/app/components/layout";
import {
  MemberAccountForm,
  MemberChevronLeft,
  MemberLogoAndTitle,
} from "@/app/components/member/components";
import {
  RegexpHangul,
  RegexpInputHangul,
  RegexpInputNumber,
  RegexpNickname,
  RegexpPhone,
} from "@/public/utils/regexp";
import { Taps } from "@/app/components/tabs";
import { COLORS } from "@/public/styles/colors";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useRouter } from "next/navigation";
import axiosInstance from "@/public/network/axios";

const ForgotAccountPage: React.FC = () => {
  const tabValues: string[] = ["팝플", "팝핑"];
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [valueName, setValueName] = useState<string>("");
  const [valuePhone, setValuePhone] = useState<string>("");
  const [valueBN, setValueBN] = useState<string>("");

  const [isValidName, setIsValidName] = useState<boolean>(false);
  const [isValidBrand, setIsValidBrand] = useState<boolean>(false);
  const [isValidPhone, setIsValidPhone] = useState<boolean>(false);
  const [isValidBN, setIsValidBN] = useState<boolean>(false);

  useEffect(() => {
    setValueName("");
    setValuePhone("");
    setValueBN("");
  }, [selectedIndex]);

  const router = useRouter();

  const findEmailApi = async () => {
    let bodyData;

    if (selectedIndex === 0) {
      bodyData = {
        name: valueName,
        phoneNumber: valuePhone,
        isPopper: false,
      };
    } else {
      bodyData = {
        name: valueName,
        phoneNumber: valuePhone,
        businessNumber: valueBN,
        isPopper: true,
      };
    }
    try {
      const response = await axiosInstance.post(
        `/api/user/retrieve/email`,
        bodyData
      );
      if (response.status === 200) {
        if (response.data.isExist) {
          alert(
            `해당 조건에 해당하는 계정을 찾았습니다.\n${response.data.email}`
          );
        } else {
          alert("조건에 해당하는 계정이 존재하지 않습니다.");
        }
      }
    } catch (error) {
      alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
    }
  };

  return (
    <DefaultLayout
      top={16}
      right={20}
      bottom={32}
      left={20}
    >
      <Container>
        <div
          onClick={() => {
            router.push("/member/signin");
          }}
        >
          <MemberChevronLeft />
        </div>
        <MemberLogoAndTitle>계정 찾기</MemberLogoAndTitle>
        <Taps
          values={tabValues}
          selected={tabValues[selectedIndex]}
          onSelect={(index: number) => {
            setSelectedIndex(index);
          }}
        />

        {selectedIndex === 0 && (
          <MemberAccountForm>
            <InputRound
              value={valueName}
              placeholder="이름"
              type="text"
              maxLength={12}
              status={null}
              bottomText={""}
              bottomTextClickable={false}
              bottomTextOnClick={() => { }}
              onChange={(text: string) => {
                // setValueName(text.replace(RegexpInputHangul, "")); // 오류 있음 수정 요망
                setValueName(text); // 오류 있음 수정 요망
                setIsValidName(RegexpHangul.test(text) && text.length > 1);
              }}
              onFocus={() => { }}
              onBlur={() => { }}
              disabled={false}
            />

            <InputRound
              value={valuePhone}
              placeholder="전화번호"
              type="text"
              maxLength={11}
              status={null}
              bottomText={""}
              bottomTextClickable={false}
              bottomTextOnClick={() => { }}
              onChange={(text: string) => {
                setValuePhone(text.replace(RegexpInputNumber, ""));
                setIsValidPhone(RegexpPhone.test(text));
              }}
              onFocus={() => { }}
              onBlur={() => { }}
              disabled={false}
            />
          </MemberAccountForm>
        )}

        {selectedIndex === 1 && (
          <MemberAccountForm>
            <InputRound
              value={valueName}
              placeholder="브랜드명"
              type="text"
              maxLength={25}
              status={null}
              bottomText={""}
              bottomTextClickable={false}
              bottomTextOnClick={() => { }}
              onChange={(text: string) => {
                setValueName(text);
                setIsValidBrand(RegexpNickname.test(text) && text.length > 1);
              }}
              onFocus={() => { }}
              onBlur={() => { }}
              disabled={false}
            />

            <InputRound
              value={valueBN}
              placeholder="사업자등록번호"
              type="text"
              maxLength={10}
              status={null}
              bottomText={""}
              bottomTextClickable={false}
              bottomTextOnClick={() => { }}
              onChange={(text: string) => {
                setValueBN(text.replace(RegexpInputNumber, ""));
                setIsValidBN(text.length === 10);
              }}
              onFocus={() => { }}
              onBlur={() => { }}
              disabled={false}
            />

            <InputRound
              value={valuePhone}
              placeholder="전화번호"
              type="text"
              maxLength={11}
              status={null}
              bottomText={""}
              bottomTextClickable={false}
              bottomTextOnClick={() => { }}
              onChange={(text: string) => {
                setValuePhone(text.replace(RegexpInputNumber, ""));
                setIsValidPhone(RegexpPhone.test(text));
              }}
              onFocus={() => { }}
              onBlur={() => { }}
              disabled={false}
            />
          </MemberAccountForm>
        )}

        <ButtonLarge
          text={"확인"}
          buttonColor={
            selectedIndex === 0
              ? isValidName && isValidPhone
                ? COLORS.mainColor
                : COLORS.greyColor
              : selectedIndex === 1
                ? isValidBrand && isValidPhone && isValidBN
                  ? COLORS.mainColor
                  : COLORS.greyColor
                : COLORS.greyColor
          }
          textColor={COLORS.primaryColor}
          onClick={findEmailApi}
        />
      </Container>
    </DefaultLayout>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
`;

export default ForgotAccountPage;
