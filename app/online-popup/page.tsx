'use client'

import styled from "styled-components";
import { DefaultLayout } from "../components/layout";
import BrandComponent from "../components/brandComponent";
import axiosInstance from "@/public/network/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandType, FilterType } from "@/public/utils/types";
import { Loading } from "../components/loading";
import { IconCheck, IconRoundTriangle, IconTrash, IconX } from "../components/icons";
import { COLORS } from "@/public/styles/colors";
import Link from "next/link";
import BottomUpModal from "../components/BottomUpModal";
import dayjs from 'dayjs';
import { activeFilterData, filterData } from "@/public/utils/function";



const OnlinePopupPage: React.FC = () => {
  const router = useRouter();
  const [originalData, setOriginalData] = useState<BrandType[]>([]);
  const [brandsData, setBrandsData] = useState<BrandType[]>([]);
  const [selectFilter, setSelectFilter] = useState<number>(0);
  const [selectActionFilter, setSelectActionFilter] = useState<number>(1);

  const [modalShow, setModalShow] = useState<boolean>(false);
  const [actionModalShow, setActionModalShow] = useState<boolean>(false);

  const parseDate = (dateString: string) => dayjs(dateString, 'YY.MM.DD');

  useEffect(() => {
    BrandsDataGet();
  }, [router]);

  useEffect(() => {
    if (originalData && originalData.length > 0) {
      FilterClick();
    }
  }, [selectFilter, selectActionFilter]);

  useEffect(() => {
    FilterClick();
  }, [originalData])


  const BrandsDataGet = async () => {
    try {
      const response = await axiosInstance.get(`/api/popup/brand/data`);
      if (response.status === 200) {
        setBrandsData(response.data);
        setOriginalData(response.data);
        setSelectActionFilter(1);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        alert("로그인 후 이용가능합니다.");
        router.push(`/member/signin?redirect=${encodeURIComponent(window.location.href)}`);
      }
    }
  };

  const FilterClick = () => {
    if (!originalData) return;

    let filteredData = [...originalData];
    const now = dayjs();

    // 상태에 따른 필터링
    switch (selectActionFilter) {
      case 1: // 진행중
        filteredData = filteredData.filter((brand) =>
          now.isAfter(parseDate(brand.contractStart)) && now.isBefore(parseDate(brand.contractEnd))
        );
        break;
      case 2: // 진행예정
        filteredData = filteredData.filter((brand) =>
          now.isBefore(parseDate(brand.contractStart))
        );
        break;
      case 0: // 전체
      default:
        break;
    }

    // 정렬 기준에 따른 정렬
    switch (selectFilter) {
      case 0: // 최신순
        filteredData = filteredData.sort((a, b) => b.id - a.id);
        break;
      case 1: // 인기순
        filteredData = filteredData.sort((a, b) => b.saved - a.saved);
        break;
      case 2: // 팔로우순
        filteredData = filteredData.sort((a, b) => Number(b.isSaved) - Number(a.isSaved));
        break;
      default:
        break;
    }

    setBrandsData(filteredData);
  };


  const toggleModal = () => {
    setModalShow(!modalShow);
  };

  const toggleActionModal = () => {
    setActionModalShow(!actionModalShow);
  };

  const toggleReset = () => {
    setModalShow(false);
    setActionModalShow(false);
    setSelectFilter(0);
    setSelectActionFilter(1);
  }

  const handleFilterSelect = (filterValue: number) => {
    setSelectFilter(filterValue);
    toggleModal();
  };

  const handleActionFilterSelect = (filterValue: number) => {
    setSelectActionFilter(filterValue);
    toggleActionModal();
  };


  if (!originalData || originalData.length === 0) return <Loading />;

  return (
    <DefaultLayout top={0} right={20} bottom={0} left={20}>
      <Container>
        <Top>
          <Link href={'/'} style={{ position: 'absolute', top: 16 }}>
            <IconX color={COLORS.secondaryColor} width={undefined} height={16} />
          </Link>
          <PageTitle>온라인 팝업스토어</PageTitle>
        </Top>

        <Content>
          <Filters>
            <Filter onClick={toggleActionModal}>
              <span>{activeFilterData.find(filter => filter.value === selectActionFilter)?.label}</span>
              <SelectUnderlineTriangleContainer>
                <IconRoundTriangle color={COLORS.secondaryColor} width={8} height={undefined} />
              </SelectUnderlineTriangleContainer>
            </Filter>
            <Filter onClick={toggleModal}>
              <span>{filterData.find(filter => filter.value === selectFilter)?.label}</span>
              <SelectUnderlineTriangleContainer>
                <IconRoundTriangle color={COLORS.secondaryColor} width={8} height={undefined} />
              </SelectUnderlineTriangleContainer>
            </Filter>
            {(selectActionFilter !== 1 || selectFilter !== 0) &&
              <Filter onClick={toggleReset}>
                <IconTrash color={COLORS.secondaryColor} width={12} height={undefined} />
              </Filter>
            }
          </Filters>
          {brandsData.length === 0 ? (
            <NoData>온라인 팝업스토어가 없습니다.</NoData>
          ) : brandsData.map((brand: BrandType) => (
            <BrandComponent key={`brand-${brand.id}`} data={brand} />
          ))}

        </Content>
      </Container>

      <BottomUpModal
        title={"옵션"}
        toggleModal={toggleActionModal}
        isVisible={actionModalShow}
        heightRate={30}
      >
        <Options>
          {activeFilterData.map((filter: FilterType) => (
            <Option key={filter.value} onClick={() => handleActionFilterSelect(filter.value)}>
              <span>{filter.label}</span>
              {filter.value === selectActionFilter &&
                <IconCheck color={COLORS.secondaryColor} height={12} width={undefined} />
              }
            </Option>
          ))}
        </Options>
      </BottomUpModal>
      <BottomUpModal
        title={"정렬"}
        toggleModal={toggleModal}
        isVisible={modalShow}
        heightRate={25}
      >
        <Options>
          {filterData.map((filter: FilterType) => (
            <Option key={filter.value} onClick={() => handleFilterSelect(filter.value)}>
              <span>{filter.label}</span>
              {filter.value === selectFilter &&
                <IconCheck color={COLORS.secondaryColor} height={12} width={undefined} />
              }
            </Option>
          ))}

        </Options>
      </BottomUpModal>
    </DefaultLayout>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 24px;
`;

const Top = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  background-color: ${COLORS.primaryColor};
`;

const PageTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translate(-50%, 0);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 68px;
  gap: 24px;
  justify-content: center;
  padding-bottom: 80px;
`;

const Filters = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`

const NoData = styled.span`
  position: absolute;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 0);
  text-align: center;
  color: ${COLORS.greyColor};

  font-size: 18px;
  font-weight: 500;
  line-height: normal;
`

const Filter = styled.div`
  cursor: pointer;
  min-width: 55px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: space-between;

  & > span {
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
  }
`;

const SelectUnderlineTriangleContainer = styled.div`
  display: flex;
  align-items: center;
  transform: rotate(-180deg);
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
`;

const Option = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  font-size: 20px;
  font-weight: 500;
  line-height: normal;
  align-items: center;
  justify-content: space-between;
`;

export default OnlinePopupPage;
