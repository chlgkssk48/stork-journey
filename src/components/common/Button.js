import styled from "styled-components";
import PropTypes from "prop-types";

const StyledButton = styled.button`
  position: relative;
  height: 50px;
  padding: 0px 30px;
  border: none;
  border-radius: 10px;
  background-color: #000000;
  color: #ffffff;
  font-size: 20px;
  box-shadow: 5px 5px 5px #bfbfbf;

  &:hover {
    background-color: #ebebeb;
    color: #000000;
    box-shadow: 8px 8px 8px #bfbfbf;
  }

  &:active {
    background-color: #d1d1d1;
  }
`;

export default function Button({ buttonName, onClick }) {
  const handleButtonClick = () => onClick();

  return (
    <StyledButton
      type="button"
      onClick={handleButtonClick}
    >
      {buttonName}
    </StyledButton>
  );
}

Button.propTypes = {
  buttonName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
