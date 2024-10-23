import { MARKER } from "@/public/utils/function";
import { useEffect, useRef } from "react";
import styled from "styled-components";

const NaverMap = ({ latitude, longitude, location, title }: { latitude: number; longitude: number; location: string; title: string }) => {
  const mapElement = useRef(null);

  useEffect(() => {
    const { naver } = window;

    if (mapElement.current && naver) {
      const mapOptions = {
        center: new naver.maps.LatLng(latitude, longitude),
        zoom: 15,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: false,
        mapTypeControl: false,
        draggable: false,  // 지도 드래그 비활성화
        scrollWheel: false,  // 스크롤 휠 비활성화
        keyboardShortcuts: false, // 키보드 단축키 비활성화
        disableDoubleTapZoom: true, // 더블탭 줌 비활성화
        disableDoubleClickZoom: true, // 더블클릭 줌 비활성화
        disableTwoFingerTapZoom: true, // 두 손가락 탭 줌 비활성화
      };

      const map = new naver.maps.Map(mapElement.current, mapOptions);

      // Custom Icon for Marker
      const markerIcon = {
        content: MARKER,
        anchor: new naver.maps.Point(14, 41),  // Adjust anchor point as necessary
      };

      // Marker 생성
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(latitude, longitude),
        map,
        icon: markerIcon,
      });

      // Title 생성
      const infoWindow = new naver.maps.InfoWindow({
        content: `<div style="text-align: center; padding: 5px; font-size: 12px; font-weight: 700;">${title}</div>`,
        borderWidth: 0,
        disableAnchor: true,
        backgroundColor: 'transparent',
      });

      // InfoWindow 표시
      infoWindow.open(map, marker);

      // 맵 클릭 이벤트 추가
      const handleMapClick = () => {
        const userConfirmed = window.confirm("해당 위치를 네이버 지도에서 검색하시겠습니까?");
        if (userConfirmed) {
          const naverMapUrl = `https://map.naver.com/v5/search/${location}`;
          window.open(naverMapUrl, "_blank");
        }
      };

      // 마커 또는 맵 클릭 시 확인 후 네이버 지도 URL로 이동
      naver.maps.Event.addListener(map, "click", handleMapClick);
      naver.maps.Event.addListener(marker, "click", handleMapClick);
    }
  }, [latitude, longitude, title]);

  return <MapDiv ref={mapElement} />;
};

const MapDiv = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 8px;
`

export default NaverMap;
