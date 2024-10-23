import { ButtonLarge } from "@/app/components/buttons";
import { COLORS } from "@/public/styles/colors";
import Image from "next/image";
import { styled } from "styled-components";
import LogoDone from "@/public/images/logo_done.png";
import { MemberBottomButtonContainer } from "@/app/components/member/components";

type StepType = {
  onNext: CallableFunction;
};

const StepDone = ({ onNext }: StepType) => {
  return (
    <Container>
      <MiddleContainer>
        <Image src={LogoDone} alt={"완료 로고"} width={100} height={100} />
        <p>
          회원가입이 성공적으로
          <br />
          완료되었어요!
        </p>
      </MiddleContainer>

      <MemberBottomButtonContainer>
        <ButtonLarge
          text="로그인"
          buttonColor={COLORS.mainColor}
          textColor={COLORS.primaryColor}
          onClick={() => {
            onNext();
          }}
        />
      </MemberBottomButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
`;

const MiddleContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  img {
    width: 100px;
    height: 100px;
  }

  p {
    color: ${COLORS.secondaryColor};
    text-align: center;

    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

export default StepDone;
