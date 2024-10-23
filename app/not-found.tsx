"use client";

import { styled } from "styled-components";
import { DefaultLayout } from "./components/layout";
import { COLORS } from "@/public/styles/colors";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const Page404 = () => {
  const router = useRouter();

  const parentDiv = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState<number>(0);

  const [count, setCount] = useState<number>(3);

  const updateParentWidth = () => {
    if (parentDiv.current) {
      setParentWidth((parentDiv.current.offsetWidth / 4) * 3);
    }
  };

  useEffect(() => {
    updateParentWidth();
    window.addEventListener("resize", updateParentWidth);
    return () => {
      window.removeEventListener("resize", updateParentWidth);
    };
  }, [parentDiv]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((count) => count - 1);
    }, 1000);

    if (count <= 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (count <= 0) {
      router.replace("/");
    }
  }, [count]);

  return (
    <DefaultLayout top={0} right={0} bottom={0} left={0}>
      <Container ref={parentDiv}>
        <svg
          width={parentWidth * 0.65}
          viewBox="0 0 253 67"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M102.081 30.24V24.336H88.905V18.936L100.245 0.899999H108.273V18.936H112.125V24.336H108.273V30.24H102.081ZM95.169 18.936H102.081V7.632L95.169 18.936ZM125.498 0.107999C131.906 0.107999 136.73 5.256 136.73 15.552C136.73 25.812 131.906 30.96 125.498 30.96C119.09 30.96 114.266 25.812 114.266 15.552C114.266 5.256 119.09 0.107999 125.498 0.107999ZM125.498 5.832C122.618 5.832 120.458 8.856 120.458 15.552C120.458 22.212 122.618 25.236 125.498 25.236C128.378 25.236 130.538 22.212 130.538 15.552C130.538 8.856 128.378 5.832 125.498 5.832ZM152.214 30.24V24.336H139.038V18.936L150.378 0.899999H158.406V18.936H162.258V24.336H158.406V30.24H152.214ZM145.302 18.936H152.214V7.632L145.302 18.936ZM0.0880939 66.24V36.9H5.56009L20.2121 54.54V36.54H26.7641V65.88H21.2921L6.64009 48.24V66.24H0.0880939ZM46.4837 66.96C37.3757 66.96 30.6437 60.444 30.6437 51.552C30.6437 42.66 37.3757 36.144 46.4837 36.144C55.5917 36.144 62.3237 42.66 62.3237 51.552C62.3237 60.444 55.5917 66.96 46.4837 66.96ZM46.4837 61.056C51.8117 61.056 55.7717 57.06 55.7717 51.552C55.7717 46.008 51.8117 42.048 46.4837 42.048C41.1557 42.048 37.1957 46.008 37.1957 51.552C37.1957 57.06 41.1557 61.056 46.4837 61.056ZM88.8571 36.9V42.696H79.3171V66.24H72.7651V42.696H63.2251V36.9H88.8571ZM102.463 66.24V36.9H123.991V42.66H109.015V49.32H122.335V55.008H109.015V66.24H102.463ZM142.144 66.96C133.036 66.96 126.304 60.444 126.304 51.552C126.304 42.66 133.036 36.144 142.144 36.144C151.252 36.144 157.984 42.66 157.984 51.552C157.984 60.444 151.252 66.96 142.144 66.96ZM142.144 61.056C147.472 61.056 151.432 57.06 151.432 51.552C151.432 46.008 147.472 42.048 142.144 42.048C136.816 42.048 132.856 46.008 132.856 51.552C132.856 57.06 136.816 61.056 142.144 61.056ZM161.517 53.244V36.9H168.069V53.244C168.069 57.924 170.661 61.056 174.945 61.056C179.229 61.056 181.821 57.924 181.821 53.244V36.9H188.373V53.244C188.373 61.56 183.009 66.96 174.945 66.96C166.881 66.96 161.517 61.56 161.517 53.244ZM193.201 66.24V36.9H198.673L213.325 54.54V36.54H219.877V65.88H214.405L199.753 48.24V66.24H193.201ZM225.053 66.24V36.9H236.429C246.149 36.9 252.161 42.912 252.161 51.588C252.161 60.264 246.149 66.24 236.429 66.24H225.053ZM231.605 60.444H236.537C242.153 60.444 245.609 57.24 245.609 51.588C245.609 45.936 242.153 42.696 236.537 42.696H231.605V60.444Z"
            fill={COLORS.mainColor}
          />
        </svg>

        <Text>
          페이지를 찾을 수 없습니다.
          <br />
          {count}초 뒤에 메인 페이지로 이동합니다.
        </Text>
      </Container>
    </DefaultLayout>
  );
};

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  gap: 16px;

  width: 100%;
  height: 100%;
`;

const Text = styled.p`
  color: ${COLORS.secondaryColor};
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export default Page404;
