"use client";

import { BottomBox, DefaultLayout } from "@/app/components/layout";
import {
  MEMBER_PADDING_BOTTOM,
  MEMBER_PADDING_HORIZONTAL,
  MEMBER_PADDING_TOP,
  MemberChevronLeft,
  MemberProgressBar,
} from "@/app/components/member/components";
import { useEffect, useRef, useState } from "react";
import StepEmail from "./01email";
import StepEmailPasscode from "./02emailpasscode";
import StepPassword from "./03password";
import StepBrand from "./04brand";
import StepPhone from "./06phone";
import StepBusinessInfo from "./05businessinfo";
import StepDone from "./08done";
import axiosInstance from "@/public/network/axios";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/loading";

const SignUpUserPage: React.FC = () => {
  const steps = [
    "Email",
    "Email Passcode",
    "Password",
    "Brand",
    "Business Info",
    "Phone",
    "Done",
  ] as const;

  type Step = (typeof steps)[number];

  type BusinessInfo = {
    businessNumber: string;
    startDate: string;
    participantName: string;
  };

  type bodyTypes = {
    email: string | undefined;
    password: string | undefined;
    nickname: string | undefined;
    businessInfo: BusinessInfo | undefined;
    phoneNumber: string | undefined;
    isPopper: boolean;
    authCode: string;
    step: Step;
  };

  const [formData, setFormData] = useState<bodyTypes>({
    email: undefined,
    password: undefined,
    nickname: undefined,
    businessInfo: undefined,
    phoneNumber: undefined,
    isPopper: true,
    authCode: "",
    step: "Email",
  });

  useEffect(() => {
    setFormData({
      email: undefined,
      password: undefined,
      nickname: undefined,
      businessInfo: undefined,
      phoneNumber: undefined,
      isPopper: true,
      authCode: "",
      step: "Email",
    });
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const hasCalledApi = useRef<boolean>(false);

  const currentStepIndex = steps.indexOf(formData.step);

  const setStep = (step: Step) => {
    setFormData((prev) => ({
      ...prev,
      step,
    }));
  };

  useEffect(() => {
    if (formData.phoneNumber !== undefined) {
      if (hasCalledApi.current) return;
      popperSignupApi();
      hasCalledApi.current = true;
    }
  }, [formData]);

  const popperSignupApi = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/api/user/signup`, formData);
      if (response.status === 201) {
        setStep("Done");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      alert("회원가입 도중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const renderStep = () => {
    switch (formData.step) {
      case "Email":
        return (
          <StepEmail
            onNext={(email: string, authCode: string) => {
              setFormData((prev) => ({
                ...prev,
                email,
                authCode,
              }));
              setStep("Email Passcode");
            }}
          />
        );
      case "Email Passcode":
        return (
          <StepEmailPasscode
            authCode={formData.authCode ?? ""}
            email={formData.email ?? ""}
            onNext={() => {
              setStep("Password");
            }}
          />
        );
      case "Password":
        return (
          <StepPassword
            onNext={(password: string) => {
              setFormData((prev) => ({
                ...prev,
                password,
              }));
              setStep("Brand");
            }}
          />
        );
      case "Brand":
        return (
          <StepBrand
            onNext={(nickname: string) => {
              setFormData((prev) => ({
                ...prev,
                nickname,
              }));
              setStep("Business Info");
            }}
          />
        );
      case "Business Info":
        return (
          <StepBusinessInfo
            onNext={(businessInfo: BusinessInfo) => {
              setFormData((prev) => ({
                ...prev,
                businessInfo,
              }));
              setStep("Phone");
            }}
          />
        );
      case "Phone":
        return (
          <StepPhone
            onNext={(phoneNumber: string) => {
              setFormData((prev) => ({
                ...prev,
                phoneNumber,
              }));
            }}
          />
        );
      case "Done":
        return (
          <StepDone
            onNext={() => {
              router.push("/member/signin");
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DefaultLayout
      top={MEMBER_PADDING_TOP}
      right={MEMBER_PADDING_HORIZONTAL}
      bottom={MEMBER_PADDING_BOTTOM}
      left={MEMBER_PADDING_HORIZONTAL}
    >
      {isLoading && <Loading />}
      <MemberProgressBar
        value={currentStepIndex * (100 / (steps.length - 1))}
      />
      {formData.step !== "Done" && (
        <div
          onClick={() => {
            if (currentStepIndex > 0) {
              setStep(steps[currentStepIndex - 1]);
            } else {
              router.push("/member/signin");
            }
          }}
        >
          <MemberChevronLeft />
        </div>
      )}
      {renderStep()}
      <BottomBox />
    </DefaultLayout>
  );
};

export default SignUpUserPage;
