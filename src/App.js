import styled, { createGlobalStyle } from "styled-components";

import GameBoard from "./components/GameBoard";

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
  }

  body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
`;

const StyledParagraph = styled.p`
  text-align: center;
`;

export default function App() {
  const isMobile = navigator.userAgentData.mobile;

  if (isMobile) {
    return (<StyledParagraph>모바일 환경은 지원하지 않습니다.</StyledParagraph>);
  }

  return (
    <>
      <GlobalStyle />
      <GameBoard />
    </>
  );
}
