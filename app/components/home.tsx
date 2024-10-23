import { COLORS } from "@/public/styles/colors"
import { IconChevronLeft, IconHomes } from "./icons"
import styled from "styled-components"
import { useRouter } from "next/navigation";

interface HomeProps {
  color?: string;
}

const Home: React.FC<HomeProps> = ({ color }) => {
  const router = useRouter();
  const targetColor = color || COLORS.secondaryColor;

  const handleClick = () => {
    router.push(`/`);
  };

  return (
    <BackContainer onClick={handleClick}>

      <IconHomes
        color={targetColor}
        width={undefined}
        height={16} />

    </BackContainer>
  )
}

const BackContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 1;
`

export default Home