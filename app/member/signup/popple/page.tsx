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
import StepName from "./04name";
import StepPhone from "./05phone";
import StepProfile from "./07profile";
import StepDone from "./08done";
import axiosInstance from "@/public/network/axios";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/loading";

const SignUpUserPage: React.FC = () => {
  const steps = [
    "Email",
    "Email Passcode",
    "Password",
    "Name",
    "Phone",
    "Profile",
    "Done",
  ] as const;

  type Step = (typeof steps)[number];

  type bodyTypes = {
    email: string | undefined;
    password: string | undefined;
    name: string | undefined;
    nickname: string | undefined;
    isMale: boolean | null;
    phoneNumber: string | undefined;
    isPopper: boolean;
    authCode: string;
    step: Step;
  };

  const router = useRouter();
  const hasCalledApi = useRef<boolean>(false);

  const [formData, setFormData] = useState<bodyTypes>({
    email: undefined,
    password: undefined,
    name: undefined,
    nickname: undefined,
    isMale: null,
    phoneNumber: undefined,
    isPopper: false,
    authCode: "",
    step: "Email",
  });

  useEffect(() => {
    setFormData({
      email: undefined,
      password: undefined,
      name: undefined,
      nickname: undefined,
      isMale: null,
      phoneNumber: undefined,
      isPopper: false,
      authCode: "",
      step: "Email",
    });
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setStep = (step: Step) => {
    setFormData((prev) => ({
      ...prev,
      step,
    }));
  };

  const currentStepIndex = steps.indexOf(formData.step);

  useEffect(() => {
    if (formData.nickname !== undefined && formData.isMale !== undefined) {
      if (hasCalledApi.current) return;
      poppleSignupApi();
      hasCalledApi.current = true;
    }
  }, [formData]);

  const poppleSignupApi = async () => {
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
              setStep("Name");
            }}
          />
        );
      case "Name":
        return (
          <StepName
            onNext={(name: string) => {
              setFormData((prev) => ({
                ...prev,
                name,
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
              setStep("Profile");
            }}
          />
        );
      case "Profile":
        return (
          <StepProfile
            onNext={(result: { nickname: string; isMale: boolean | null }) => {
              setFormData((prev) => ({
                ...prev,
                nickname: result.nickname,
                isMale: result.isMale,
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
          <MemberChevronLeft />{" "}
        </div>
      )}
      {renderStep()}
      <BottomBox />
    </DefaultLayout>
  );
};

export default SignUpUserPage;
