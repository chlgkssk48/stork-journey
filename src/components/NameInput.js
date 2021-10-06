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
    border: 2px solid #729fe8;
    box-shadow: 8px 8px 8px #bfbfbf;
  }

  &::placeholder {
    font-size: 14px;
  }
`;

export default function NameInput({ onType }) {
  const handleInputName = ({ target }) => onType(target.value);

  return (
    <StyledInput
      type="text"
      placeholder="황새의 이름을 입력해 주세요!"
      onChange={handleInputName}
    />
  );
}

NameInput.propTypes = {
  onType: PropTypes.func.isRequired,
};
