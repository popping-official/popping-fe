"use client";

import { DefaultLayout } from "./components/layout";
import HomePage from "./home/home";
import MyPage from "./mypage/mypage";
import LikesPage from "./likes/likes";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { BottomNavigationPopper } from "./navigation/bottomnavigation/popper";
import { BottomNavigationPopple } from "./navigation/bottomnavigation/popple";

const MainPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLogin, isPopper } = useSelector(
    (state: any) => state.poppingUser.user
  );

  // Popple
  const getPageIndexPopple = (param: string | null) => {
    switch (param) {
      case null:
        return 2;
      case "likes":
        return 3;
      case "mypage":
        return 4;
    }
  };

  const btmnavOnClickPopple = (index: number) => {
    switch (index) {
      case 0:
        router.push("/online-popup");
        break;
      case 1:
        router.push("/popup-map");
        break;
      case 2:
        router.replace("/");
        break;
      case 3:
        if (isLogin) {
          router.replace("/?page=likes");
        } else {
          alert("로그인 후 이용가능합니다.");
          router.replace("/member/signin");
        }
        break;
      case 4:
        if (isLogin) {
          router.replace("/?page=mypage");
        } else {
          alert("로그인 후 이용가능합니다.");
          router.replace("/member/signin");
        }
        break;
    }
  };

  // Popper
  const getPageIndexPopper = (param: string | null) => {
    switch (param) {
      case null:
        return 0;
      case "mypage":
        return 3;
    }
  };

  const btmnavOnClickPopper = (index: number) => {
    switch (index) {
      case 0:
        router.replace("/");
        break;
      case 1:
        router.push("/popup-map");
        break;
      case 2:
        router.push("/online-popup");
        break;
      case 3:
        if (isLogin) {
          router.replace("/?page=mypage");
        } else {
          alert("로그인 후 이용가능합니다.");
          router.replace("/member/signin");
        }
        break;
    }
  };

  return (
    <>
      {searchParams.get("page") === null && <HomePage />}
      {searchParams.get("page") === "likes" && <LikesPage />}
      {searchParams.get("page") === "mypage" && <MyPage />}
      {isLogin && isPopper ? (
        <BottomNavigationPopper
          onClick={(index: number) => {
            btmnavOnClickPopper(index);
          }}
          currentIndex={getPageIndexPopper(searchParams.get("page")) ?? -1}
        />
      ) : (
        <BottomNavigationPopple
          onClick={(index: number) => {
            btmnavOnClickPopple(index);
          }}
          currentIndex={getPageIndexPopple(searchParams.get("page")) ?? -1}
        />
      )}
    </>
  );
};

export default MainPage;
