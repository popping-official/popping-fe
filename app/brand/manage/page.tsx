"use client";
import styled from "styled-components";
import { COLORS } from "@/public/styles/colors";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/public/network/axios";
import { DefaultLayout } from "@/app/components/layout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Loading } from "@/app/components/loading";
import { ButtonLarge } from "@/app/components/buttons";
import { brandManageTypes } from "@/public/utils/types";
import { Tooltip } from "react-tooltip";

import CustomJoyride from "@/app/components/tour/CustomJoyride";
import { CallBackProps, STATUS, Step } from "react-joyride";
import { TourContainer } from "@/app/components/tour/TourStyle";

const OnlinePopUpOpenningPage: React.FC = () => {
  const router = useRouter();
  const hasAlerted = useRef<boolean>(false);

  const { isLogin, isPopper, nickname } = useSelector(
    (state: any) => state.poppingUser.user
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExist, setIsExist] = useState<boolean>(false);

  const [logoBlobUrl, setLogoBlobUrl] = useState<string>(
    "/images/brand/logo.png"
  );
  const [valueLogo, setValueLogo] = useState<string>("");

  const [thumbnailBlobUrl, setThumbnailBlobUrl] = useState<string>(
    "/images/brand/thumbnail.png"
  );
  const [valueThumbnail, setValueThumbnail] = useState<string>("");

  const [valueDescription, setValueDescription] = useState<string>("");

  const [brandData, setBrandData] = useState<brandManageTypes>({
    id: 0,
    logo: "",
    thumbnail: "",
    description: "",
  });

  // CustomJoyride 관련
  const [joyrideRun, setJoyrideRun] = useState<boolean>(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const joyrideStatusKey = `joyride_status_brand_manage`;

  const logoRef = useRef<HTMLDivElement>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const brandNameRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      logoRef.current &&
      thumbnailRef.current &&
      brandNameRef.current &&
      descriptionRef.current
    ) {
      setSteps([
        {
          target: "body",
          content: (
            <TourContainer>
              <p>
                <strong>브랜드 관리</strong>페이지에 오신것을 환영합니다.
              </p>
              <p>
                팝퍼님의 <strong>브랜드</strong>정보를 입력해주세요!
              </p>
            </TourContainer>
          ),
          title: "브랜드 관리",
          placement: "center",
        },
        {
          target: logoRef.current,
          content: (
            <TourContainer>
              <p>
                해당 영역을 클릭해서 <strong>로고</strong> 이미지를
                선택해주세요.
              </p>
            </TourContainer>
          ),
          title: "브랜드 관리",
          placement: "bottom",
        },
        {
          target: thumbnailRef.current,
          content: (
            <TourContainer>
              <p>
                해당 영역을 클릭해서 <strong>썸네일</strong> 이미지를
                선택해주세요.
              </p>
            </TourContainer>
          ),
          title: "브랜드 관리",
          placement: "bottom",
        },
        {
          target: brandNameRef.current,
          content: (
            <TourContainer>
              <p>
                <strong>브랜드 네임은</strong> 팝퍼님의 닉네임으로 자동으로
                설정됩니다.
              </p>
              <p>변경을 원하실 경우</p>
              <p>
                <strong>프로필 설정</strong>을 통해 변경해주세요.
              </p>
            </TourContainer>
          ),
          title: "브랜드 관리",
          placement: "bottom",
        },
        {
          target: descriptionRef.current,
          content: (
            <TourContainer>
              <p>
                브랜드 소개, 슬로건 등 간단한 <strong>브랜드 설명</strong>을
                입력해주세요.
              </p>
            </TourContainer>
          ),
          title: "브랜드 관리",
          placement: "bottom",
        },
      ]);
    }
  }, [
    logoRef.current,
    thumbnailRef.current,
    brandNameRef.current,
    descriptionRef.current,
  ]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setJoyrideRun(false);
      localStorage.setItem(joyrideStatusKey, status);
    }
  };

  useEffect(() => {
    if (!isLogin || !isPopper) {
      alert("해당 페이지에 접근권한이 없습니다.");
    }
    getBrandApi();

    const key = localStorage.getItem(joyrideStatusKey);
    if (key === "finished" || key === "skipped") {
      setJoyrideRun(false);
    } else {
      setJoyrideRun(true);
    }
  }, [router]);

  // api
  const getBrandApi = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/popup/brand`);
      if (response.status === 200) {
        setIsExist(response.data.isExist);
        // if (!response.data.isExist && !hasAlerted.current) {
        //   alert("등록된 브랜드 정보가 없습니다. 브랜드 정보를 등록해주세요.\n(브랜드네임은 팝퍼의 닉네임이 사용됩니다.)");
        //   hasAlerted.current = true;
        // }
        if (response.data.isExist) {
          const logo = response.data.brandData.logo;
          const thumbnail = response.data.brandData.thumbnail;
          const description = response.data.brandData.description;

          setValueLogo(logo);
          setLogoBlobUrl(logo);
          setValueThumbnail(thumbnail);
          setThumbnailBlobUrl(thumbnail);
          setValueDescription(description);
          setBrandData(response.data.brandData);
        }
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.response.code === 401) {
        alert("해당 페이지에 접근권한이 없습니다.");
        router.push("/");
      } else {
        alert("일시적인 오류가 발생했습니다.");
        router.push("/");
      }
    }
  };

  // api
  const registerBrandApi = async () => {
    if (valueLogo !== "" && valueThumbnail !== "" && valueDescription !== "") {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post(`/api/popup/brand`, {
          logo: valueLogo,
          thumbnail: valueThumbnail,
          description: valueDescription,
        });
        if (response.status === 201) {
          alert("브랜드 정보가 성공적으로 등록되었습니다.");
          setIsLoading(true);
          window.location.reload();
        }
      } catch (error: any) {
        if (error.response.code === 400) {
          alert("올바른 정보를 입력해주세요.");
          setIsLoading(false);
        } else {
          alert("일시적인 오류가 발생했습니다.");
          setIsLoading(false);
        }
      }
    }
  };

  const modifyBrandApi = async () => {
    if (brandData.id !== 0) {
      setIsLoading(true);
      try {
        const response = await axiosInstance.patch(`/api/popup/brand`, {
          brandId: brandData.id,
          logo: valueLogo,
          thumbnail: valueThumbnail,
          description: valueDescription,
        });
        if (response.status === 200) {
          alert("브랜드 정보가 성공적으로 수정되었습니다.");
          setIsLoading(true);
          window.location.reload();
        }
      } catch (error: any) {
        if (error.response.code === 400) {
          alert("올바른 정보를 입력해주세요.");
          setIsLoading(false);
        } else {
          alert("일시적인 오류가 발생했습니다.");
          setIsLoading(false);
        }
      }
    }
  };

  const handleClickRegisterBrand = () => {
    registerBrandApi();
  };

  const handleClickModifyBrand = () => {
    modifyBrandApi();
  };

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setValueDescription(event.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    if (e.target.id === "logoImage") {
      setLogoBlobUrl(blobUrl);
    } else {
      setThumbnailBlobUrl(blobUrl);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        if (e.target.id === "logoImage") {
          setValueLogo(reader.result);
        } else {
          setValueThumbnail(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <DefaultLayout top={16} right={20} bottom={32} left={20}>
      <CustomJoyride
        steps={steps}
        runStatus={joyrideRun}
        callback={handleJoyrideCallback}
      />
      {isLoading && <Loading />}
      <PointerBox
        onClick={() => {
          const el = document.getElementById("thumbnailImage");
          if (el) {
            el?.click();
          }
        }}
      >
        <OpeningImage src={thumbnailBlobUrl} />
        <input
          id="thumbnailImage"
          type="file"
          name="thumbnail"
          key={Date.now()}
          accept="image/jpeg, image/png"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <Overlay />
        <HiddenOverlay ref={thumbnailRef} />
      </PointerBox>
      <OpenningPageContainer>
        <OpenningPageContentsContainer>
          <BrandInfo>
            <PointerBox
              onClick={() => {
                const el = document.getElementById("logoImage");
                if (el) {
                  el?.click();
                }
              }}
            >
              <div ref={logoRef}>
                <BrandIcon src={logoBlobUrl} alt="Brand Icon" />
              </div>
              <input
                id="logoImage"
                type="file"
                name="logo"
                key={Date.now()}
                accept="image/jpeg, image/png"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </PointerBox>
            <BrandName
              data-tooltip-id="tooltip"
              data-tooltip-content="브랜드네임은 프로필 설정에서 변경할 수 있습니다."
              ref={brandNameRef}
            >
              {nickname}
            </BrandName>
            <TooltipCustom id="tooltip" place="bottom" />
            <BrandDesc ref={descriptionRef}>
              <BrandDescriptionTextArea
                placeholder="브랜드 소개를 입력해주세요."
                value={valueDescription}
                onChange={handleChangeDescription}
              />
            </BrandDesc>
          </BrandInfo>
          {isExist ? (
            <ButtonLarge
              text="브랜드 정보 수정"
              buttonColor={
                valueLogo === brandData.logo &&
                  valueThumbnail === brandData.thumbnail &&
                  valueDescription === brandData.description
                  ? COLORS.greyColor
                  : COLORS.mainColor
              }
              textColor={COLORS.primaryColor}
              onClick={handleClickModifyBrand}
            />
          ) : (
            <ButtonLarge
              text="브랜드 등록"
              buttonColor={
                valueLogo !== "" &&
                  valueThumbnail !== "" &&
                  valueDescription !== ""
                  ? COLORS.mainColor
                  : COLORS.greyColor
              }
              textColor={COLORS.primaryColor}
              onClick={handleClickRegisterBrand}
            />
          )}
        </OpenningPageContentsContainer>
      </OpenningPageContainer>
    </DefaultLayout>
  );
};

const TopNavRightContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);

  width: auto;
  height: 20px;

  cursor: pointer;
`;

const OpeningImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;
  object-fit: cover;
  z-index: 0;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(25, 25, 25, 0.8) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  z-index: 1;
`;

const HiddenOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 50%;
  background: transparent;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const OpenningPageContainer = styled.div`
  width: calc(100% - 40px);

  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translate(-50%, 0);

  z-index: 2;
`;

const OpenningPageContentsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  align-items: flex-end;
  justify-content: flex-end;
  gap: 40px;
`;

const BrandInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  gap: 8px;
  color: ${COLORS.greyColor};
`;

const BrandIcon = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;

  object-fit: cover;
`;

const BrandName = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: ${COLORS.primaryColor};
  text-align: left; // Align the text to the left
`;

const TooltipCustom = styled(Tooltip)`
  left: 0 !important; // Ensure the tooltip aligns to the left side
`;

const BrandDesc = styled.p`
  margin-top: 16px;
  font-size: 16px;
  font-weight: 550;
  line-height: 160%;
`;

const Button = styled(Link)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 16px 0px;
  width: 100%;
  background-color: ${COLORS.mainColor};
  color: ${COLORS.primaryColor};
  font-size: 16px;
  font-weight: 500;
  z-index: 2;
`;

const PointerBox = styled.div`
  cursor: pointer;
`;

const BrandDescriptionTextArea = styled.textarea`
  padding: 8px;
  width: 96%;

  resize: none;
  border: 1px solid ${COLORS.greyColor};
  border-radius: 4px;

  background-color: transparent;
  color: ${COLORS.primaryColor};

  font-size: 16px;
  font-weight: 400;
  line-height: 160%;

  &::placeholder {
    color: ${COLORS.primaryColor};
    font-weight: 400;
  }

  outline: none;
  &:focus {
    border: 1px solid ${COLORS.mainColor};
    border-radius: 4px;
  }
`;

export default OnlinePopUpOpenningPage;
