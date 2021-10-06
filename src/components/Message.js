import styled from "styled-components";
import PropTypes from "prop-types";

import { IS_WAITING } from "../constants/gameStatus";

const StyledParagraph = styled.p`
  position: relative;
  margin: 20px 0px 0px 0px;
  font-size: 20px;
  text-align: center;
  line-height: 40px;
`;

export default function Message({ gameStatus }) {
  return (
    <>
      {gameStatus === IS_WAITING ? (
        <StyledParagraph>
          황새가 중심을 잃지 않고 최대한 오래 걸어갈 수 있도록 도와주세요!
          <br />
          황새의 이름을 입력한 후 준비 버튼을 누르면 황새가 등장합니다.
        </StyledParagraph>
      ) : (
        <StyledParagraph>
          스페이스바를 누르면 황새가 걷기 시작합니다.
          < br />
          왼쪽, 오른쪽 방향키를 이용해 황새의 중심을 잡아주세요.
        </StyledParagraph>
      )}
    </>
  );
}

Message.propTypes = {
  gameStatus: PropTypes.string.isRequired,
};
