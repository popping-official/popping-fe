"use client"; // 클라이언트 컴포넌트로 설정

import { DefaultLayout } from '@/app/components/layout';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

const MapComponent = dynamic(() => import('@/app/components/mapComponent'), {
  ssr: false,
});

const MapPage: React.FC = () => {
  return (
    <DefaultLayout top={0} bottom={0} left={0} right={0}>
      <Container>
        <MapComponent />
      </Container>
    </DefaultLayout>
  );

}
const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
`

export default MapPage;