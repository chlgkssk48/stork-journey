import { createGlobalStyle } from "styled-components";

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
  }
`;

export default function App() {
  return (
    <>
      <GlobalStyle />
      <GameBoard />
    </>
  );
}
