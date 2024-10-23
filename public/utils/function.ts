import { useRouter } from "next/navigation";
import axiosInstance from "../network/axios";
import { Route } from "next";
import { NextRouter, Router } from "next/router";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// email, nickname, phoneNumber 중복 확인 api
export const duplicateCheckApi = async (
  checkData: string,
  option: string
): Promise<boolean> => {
  try {
    const response = await axiosInstance.post(`/api/user/duplicate/${option}`, {
      checkData: checkData,
    });
    if (response.status === 200) {
      return response.data.isExist;
    }
    return true;
  } catch (error) {
    return true;
  }
};
// 회원가입 인증 메일 전송 api
export const callEmailAuthApi = async (email: string): Promise<string> => {
  try {
    const response = await axiosInstance.post(`/api/user/email/auth`, {
      email: email,
    });
    if (response.status === 200) {
      return response.data.authCode;
    }
    return "";
  } catch (error) {
    return "";
  }
};

// 회원가입 인증 메일 전송 api
export const businessRegistrationCheckApi = async (
  businessNumber: string,
  startDate: string,
  participantName: string
): Promise<boolean> => {
  try {
    const response = await axiosInstance.post(
      `/api/user/business-registration`,
      {
        businessNumber: businessNumber,
        startDate: startDate,
        participantName: participantName,
      }
    );
    if (response.status === 200) {
      return response.data.isValid;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export function KRWLocaleString(price: number) {
  return price.toLocaleString("ko-KR");
}

export function FormatFollowers(follow: number) {
  if (follow >= 10000000) {
    return (follow / 10000000).toFixed(1).replace(/\.0$/, "") + "천만";
  } else if (follow >= 1000000) {
    return (follow / 1000000).toFixed(1).replace(/\.0$/, "") + "백만";
  } else if (follow >= 10000) {
    return (follow / 10000).toFixed(1).replace(/\.0$/, "") + "만";
  } else if (follow >= 1000) {
    return (follow / 1000).toFixed(1).replace(/\.0$/, "") + "천";
  } else {
    return follow.toString();
  }
}

export const Follow = async (
  type: string,
  id: number | string,
  router: AppRouterInstance
) => {
  try {
    await axiosInstance.post(`/api/popup/follow/toggle`, {
      type: type,
      id: id,
    });
  } catch (e: any) {
    if (e.response.status === 401) {
      alert("로그인 이후 가능한 기능입니다.");
      router.push(
        `/member/signin?redirect=${encodeURIComponent(window.location.href)}`
      );
    }
  }
  sessionStorage.setItem("followToggle", "true");
};

export function FormatTelHyphen(tel: string) {
  return tel
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
    .replace(/\-{1,2}$/g, "");
}

// 날짜를 YYYY.MM.DD 형식으로 포맷하는 함수
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString();
  const month = String(date.getMonth() + 1);
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

export const MARKER = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="41" viewBox="0 0 28 41" fill="none">
<g clip-path="url(#clip0_821_46)">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0037 0C6.27056 0 0 6.32055 0 14.1154C0 23.188 14.0037 40.3276 14.0037 40.3276C14.0037 40.3276 28.0075 23.188 28.0075 14.1154C28 6.32055 21.7369 0 14.0037 0ZM14.0037 19.1507C11.2435 19.1507 9.0008 16.8977 9.0008 14.1078C9.0008 11.318 11.236 9.06501 14.0037 9.06501C16.7715 9.06501 19.0067 11.318 19.0067 14.1078C19.0067 16.8977 16.7715 19.1507 14.0037 19.1507Z" fill="#FA8D0E"/>
  <path d="M19.9574 10.7912C19.5334 12.1558 19.7684 13.6397 20.5933 14.8065C21.6146 16.2506 20.5966 18.2479 18.8281 18.2709C17.3992 18.2895 16.0605 18.9715 15.206 20.1167C14.148 21.5341 11.9339 21.1837 11.3659 19.5086C10.9071 18.1555 9.84463 17.093 8.49149 16.6341C6.81648 16.0657 6.46567 13.852 7.88341 12.794C9.02829 11.9394 9.71061 10.6003 9.72917 9.1718C9.75182 7.40321 11.7491 6.38564 13.1935 7.40655C14.3603 8.23145 15.8441 8.46644 17.2088 8.04249C18.8979 7.51755 20.483 9.10275 19.9581 10.7919L19.9574 10.7912Z" fill="white"/>
  <path d="M17.0739 9.54188L15.5266 9.95655C14.7946 10.1526 14.5496 11.0677 15.0852 11.6038L16.2179 12.7364C16.7536 13.2721 17.6687 13.0271 17.865 12.295L18.2797 10.7477C18.4757 10.0156 17.806 9.34586 17.0739 9.54188Z" fill="#FA8D0E"/>
</g>
<defs>
  <clipPath id="clip0_821_46">
    <rect width="28" height="40.32" fill="white"/>
  </clipPath>
</defs>
</svg>`;

export const DUMMY_SEOUL_OPTIONS = [
  { value: "서울시 종로구", label: "서울시 종로구" },
  { value: "서울시 중구", label: "서울시 중구" },
  { value: "서울시 용산구", label: "서울시 용산구" },
  { value: "서울시 성동구", label: "서울시 성동구" },
  { value: "서울시 광진구", label: "서울시 광진구" },
  { value: "서울시 동대문구", label: "서울시 동대문구" },
  { value: "서울시 중랑구", label: "서울시 중랑구" },
  { value: "서울시 성북구", label: "서울시 성북구" },
  { value: "서울시 강북구", label: "서울시 강북구" },
  { value: "서울시 도봉구", label: "서울시 도봉구" },
  { value: "서울시 노원구", label: "서울시 노원구" },
  { value: "서울시 은평구", label: "서울시 은평구" },
  { value: "서울시 서대문구", label: "서울시 서대문구" },
  { value: "서울시 마포구", label: "서울시 마포구" },
  { value: "서울시 양천구", label: "서울시 양천구" },
  { value: "서울시 강서구", label: "서울시 강서구" },
  { value: "서울시 구로구", label: "서울시 구로구" },
  { value: "서울시 금천구", label: "서울시 금천구" },
  { value: "서울시 영등포구", label: "서울시 영등포구" },
  { value: "서울시 동작구", label: "서울시 동작구" },
  { value: "서울시 관악구", label: "서울시 관악구" },
  { value: "서울시 서초구", label: "서울시 서초구" },
  { value: "서울시 강남구", label: "서울시 강남구" },
  { value: "서울시 송파구", label: "서울시 송파구" },
  { value: "서울시 강동구", label: "서울시 강동구" },
];

export const filterData = [
  { label: "최신순", value: 0 },
  { label: "인기순", value: 1 },
  { label: "팔로우순", value: 2 },
];

export const activeFilterData = [
  { label: "전체", value: 0 },
  { label: "진행중", value: 1 },
  { label: "진행예정", value: 2 },
];
