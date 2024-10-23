import { COLORS } from "@/public/styles/colors"
import styled from "styled-components"

interface PopupHeaderProps {
  main?: string;
  sub?: string;
  section?: string
}

const PopupHeader: React.FC<PopupHeaderProps> = ({ main, sub, section }) => {
  return (
    <Container>
      {main &&
        <MainTitle>
          {main}
        </MainTitle>
      }
      {sub &&
        <SubTitle>
          {sub}
        </SubTitle>
      }
      {section &&
        <SectionTitle>
          {section}
        </SectionTitle>
      }
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  `

const MainTitle = styled.h2`
  margin-top: 20px;
  font-size: 36px;
  font-weight: 700;
`

const SubTitle = styled.h3`
  margin-top: 12px;
  font-size: 16px;
  font-weight: 500;
`

const SectionTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
`


export default PopupHeader