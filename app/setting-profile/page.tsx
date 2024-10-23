"use client";

import { useEffect, useRef, useState } from "react";
import { BottomBox, DefaultLayout } from "../components/layout";
import { TopNavigation } from "../navigation/topnavigation";
import { styled } from "styled-components";
import { COLORS } from "@/public/styles/colors";
import { IconChevronLeft } from "../components/icons";
import { ButtonLarge, ButtonSmall } from "../components/buttons";
import { InputRound } from "../components/inputs";
import {
  RegexpHangul,
  RegexpInputHangul,
  RegexpNickname,
} from "@/public/utils/regexp";
import { SelectBottomSection, SelectRound } from "../components/select";
import { useRouter } from "next/navigation";

import { ProfileImage } from "../components/main/componenets";
import { useSelector } from "react-redux";
import { duplicateCheckApi } from "@/public/utils/function";
import axiosInstance from "@/public/network/axios";
import { useDispatch } from "react-redux";
import {
  changeNickname,
  changeName,
  changeIsMale,
  changeProfileImage,
} from "../redux/reducers/poppingUser";
import { Loading } from "../components/loading";

const SettingProfilePage: React.FC = () => {
  const { isLogin, isPopper, nickname, name, isMale, profileImage } =
    useSelector((state: any) => state.poppingUser.user);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // 프로필 사진
  const [profileBlobUrl, setProfileBlobUrl] = useState<string>(profileImage);
  const [valueProfileImage, setValueProfileImage] = useState<string>("");
  const [isChangeValueProfileImage, setIsChangeValueProfileImage] =
    useState<boolean>(false);

  // 닉네임 or 브랜드네임
  const [valueNickname, setValueNickname] = useState<string>("");
  const [isNicknameFocused, setIsNicknameFocused] = useState<boolean | null>(
    null
  );
  const [statusNickname, setStatusNickname] = useState<boolean | null>(null);
  const [bottomTextNickname, setbottomTextNickname] = useState<string>("");
  const [isValidNickname, setIsValidNickname] = useState<boolean>(false);
  const [isChangeNickname, setIsChangeNickname] = useState<boolean>(false);

  // 이름
  const [valueName, setValueName] = useState<string>("");
  const [isNameFocused, setIsNameFocused] = useState<boolean | null>(null);
  const [statusName, setStatusName] = useState<boolean | null>(null);
  const [bottomTextName, setbottomTextName] = useState<string>("");
  const [isValidName, setIsValidName] = useState<boolean>(false);
  const [isChangeName, setIsChangeName] = useState<boolean>(false);

  // 성별
  const genders: string[] = ["남성", "여성", "비공개"];
  const isMaleOptions: { [key: string]: boolean | null } = {
    남성: true,
    여성: false,
    비공개: null,
  };
  const [valueGender, setValueGender] = useState<string | null>(null);
  const [isGenderFocused, setIsGenderFocused] = useState<boolean>(false);
  const [showSelectGender, setShowSelectGender] = useState<boolean>(false);
  const [isChangeValueGender, setIsChangeValueGender] =
  useState<boolean>(false);
  
  const hasAlerted = useRef<boolean>(false);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  

  useEffect(() => {
    setValueNickname(nickname);
    setValueName(name);
    setValueGender(isMale ? "남성" : isMale == false ? "여성" : "비공개");
  }, [router]);

  useEffect(() => {
    if (!isLogin && !hasAlerted.current) {
      alert("로그인 후 이용가능합니다.");
      hasAlerted.current = true; // alert 호출 후 true로 설정
      router.push("/member/signin");
    }
  }, [isLogin, router]);

  // api
  const updateUserInfoApi = async () => {
    let requestBody;
    if (isPopper) {
      requestBody = {
        isPopper: true,
        nickname: valueNickname,
        profileImage: valueProfileImage,
      };
    } else {
      requestBody = {
        isPopper: false,
        nickname: valueNickname,
        name: valueName,
        isMale: isMaleOptions[valueGender ? valueGender : "비공개"],
        profileImage: valueProfileImage,
      };
    }
    try {
      setIsLoading(true);
      const response = await axiosInstance.patch("/api/user/", requestBody);
      if (response.status === 200) {
        dispatch(changeNickname(valueNickname));
        if (valueProfileImage !== "") {
          // 이미지가 변경되었을떄만 프로필 사진 변경
          dispatch(changeProfileImage(valueProfileImage));
        }
        if (!isPopper) {
          dispatch(changeName(valueName));
          dispatch(
            changeIsMale(isMaleOptions[valueGender ? valueGender : "비공개"])
          );
        }
        alert("프로필 설정이 적용되었습니다.");
        setIsLoading(false);
        router.push("/?page=mypage");
      }
    } catch (error) {
      alert("오류가 발생했습니다. 다시 시도해주세요.");
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const maxSize = 3 * 1024 * 1024; 
    if (file.size > maxSize) {
      alert("파일이 너무 큽니다. 3MB 이하의 파일을 선택해주세요.");
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    setProfileBlobUrl(blobUrl);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setValueProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // 저장 클릭시 호출되는 핸들러
  const handleSaveButton = () => {
    if (isFormValid) {
      updateUserInfoApi();
    }
  };

  // 닉네임 입력시 실행되는 onBlur 핸들러
  const handleNicknameValidation = async () => {
    if (RegexpNickname.test(valueNickname)) {
      if (valueNickname !== nickname) {
        // 만약 닉네임 변경이 없으면 호출 x
        // 정규식이 유효할 경우 중복 api를 호출.
        const isExist = await duplicateCheckApi(valueNickname, "nickname");
        setStatusNickname(!isExist);
        setIsValidNickname(!isExist);
        if (isExist) {
          setbottomTextNickname("이미 사용중인 닉네임 입니다.");
        } else {
          setbottomTextNickname("사용가능한 닉네임 입니다.");
        }
      }
    } else {
      setStatusNickname(false);
      setIsValidNickname(false);
      setbottomTextNickname("닉네임은 공백없이 한글, 알파벳, 숫자만 가능해요.");
    }
  };

  useEffect(() => {
    if (isNicknameFocused === false) {
      handleNicknameValidation();
    } else {
      setStatusNickname(null);
      setbottomTextNickname("");
    }
  }, [isNicknameFocused]);

  useEffect(() => {
    if (isNameFocused === false) {
      if (RegexpHangul.test(valueName)) {
        setStatusName(null);
        setbottomTextName("");
      } else {
        setStatusName(false);
        setbottomTextName("한글 이외는 입력할 수 없어요.");
      }
    } else {
      setStatusName(null);
      setbottomTextName("");
    }
  }, [isNameFocused]);

  useEffect(() => {
    setIsChangeNickname(nickname !== valueNickname);
    setIsChangeName(name !== valueName);
    setIsChangeValueProfileImage(valueProfileImage !== "");
    setIsChangeValueGender(
      isMaleOptions[valueGender ? valueGender : "비공개"] !== isMale
    );
  }, [
    nickname,
    valueNickname,
    name,
    valueName,
    valueProfileImage,
    valueGender,
    isMale,
    isMaleOptions,
  ]);

  useEffect(() => {
    let isValidForm = false;
    if (isPopper) {
      // 팝퍼 valid
      isValidForm = isChangeNickname
        ? isValidNickname
        : isChangeValueProfileImage;
    } else {
      // 팝플 valid
      if (isChangeNickname || isChangeName) {
        isValidForm =
          isChangeNickname &&
          isValidNickname &&
          (isChangeName ? isValidName : true);
      } else {
        isValidForm = isChangeValueGender || isChangeValueProfileImage;
      }
    }
    setIsFormValid(isValidForm);
  }, [
    isChangeNickname,
    isChangeName,
    isChangeValueGender,
    isChangeValueProfileImage,
    isValidNickname,
    isValidName,
    isPopper,
  ]);

  return (
    <DefaultLayout top={0} right={20} bottom={0} left={20}>
      {isLoading && <Loading/>}
      <TopNavigation>
        <TopNavCenterContainer>
          <TopNavTitle>프로필 설정</TopNavTitle>
        </TopNavCenterContainer>
        <TopNavLeftContainer
          onClick={() => {
            router.push("/?page=mypage");
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
        <ProfileContainer>
          <ProfileImage image={profileBlobUrl} width={100} height={100} />
          <ButtonSmall
            text={"사진 변경"}
            buttonColor={COLORS.mainColor}
            textColor={COLORS.primaryColor}
            onClick={() => {
              const el = document.getElementById("profileImage");
              if (el) {
                el?.click();
              }
            }}
          />
        </ProfileContainer>

        <Form>
          <input
            id="profileImage"
            type="file"
            name="profile"
            key={Date.now()}
            accept="image/jpeg, image/png"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <InputRound
            value={valueNickname}
            placeholder="닉네임"
            type="text"
            maxLength={15}
            status={statusNickname}
            bottomText={bottomTextNickname}
            bottomTextClickable={false}
            bottomTextOnClick={() => {}}
            onChange={(text: string) => {
              setValueNickname(text);
              setIsValidNickname(RegexpNickname.test(text));
            }}
            onFocus={() => {
              setIsNicknameFocused(true);
            }}
            onBlur={() => {
              setIsNicknameFocused(false);
            }}
            disabled={false}
          />

          {!isPopper && (
            <>
              <InputRound
                value={valueName}
                placeholder="이름"
                type="text"
                maxLength={12}
                status={statusName}
                bottomText={bottomTextName}
                bottomTextClickable={false}
                bottomTextOnClick={() => {}}
                onChange={(text: string) => {
                  setValueName(text.replace(RegexpInputHangul, ""));
                  setIsValidName(RegexpHangul.test(text) && text.length > 1);
                }}
                onFocus={() => {
                  setIsNameFocused(true);
                }}
                onBlur={() => {
                  setIsNameFocused(false);
                }}
                disabled={false}
              />

              <SelectRound
                placeholder="성별"
                value={valueGender}
                isFocus={isGenderFocused}
                onClick={() => {
                  setIsGenderFocused(true);
                  setShowSelectGender(true);
                }}
              />
            </>
          )}
        </Form>

        <ButtonLarge
          text={"저장"}
          buttonColor={isFormValid ? COLORS.mainColor : COLORS.greyColor}
          textColor={COLORS.primaryColor}
          onClick={handleSaveButton}
        />

        {showSelectGender && (
          <SelectBottomSection
            isVisible={showSelectGender}
            title={"성별"}
            onBackgroundClick={() => {
              setShowSelectGender(false);
              setIsGenderFocused(false);
            }}
            onClose={() => {
              setShowSelectGender(false);
              setIsGenderFocused(false);
            }}
            options={genders}
            onClick={(gender: string) => {
              setValueGender(gender);
              setIsGenderFocused(false);
            }}
          />
        )}
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
  gap: 24px;

  width: 100%;
  height: 100%;

  background: ${COLORS.primaryColor};
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  margin-bottom: 16px;
`;

export default SettingProfilePage;
