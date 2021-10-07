import styled from "styled-components";
import PropTypes from "prop-types";

const StyledInput = styled.input`
  position: relative;
  width: 300px;
  height: 45px;
  border-radius: 10px;
  box-shadow: 5px 5px 5px #bfbfbf;
  outline: none;
  font-size: 20px;
  text-align: center;

  &:focus {
    border: 2px solid #8cb0cf;
    box-shadow: 8px 8px 8px #bfbfbf;
  }

  &::placeholder {
    font-size: 14px;
  }
`;

export default function NameInput({ onType, onKeyPress }) {
  const handleNameInput = ({ target }) => onType(target.value);
  const handleKeyPress = (key) => onKeyPress(key);

  return (
    <StyledInput
      type="text"
      placeholder="황새의 이름을 입력해 주세요!"
      onChange={handleNameInput}
      onKeyPress={(event) => handleKeyPress(event.key)}
    />
  );
}

NameInput.propTypes = {
  onType: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
};
