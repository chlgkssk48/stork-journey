import { createGlobalStyle } from "styled-components";

import GameBoard from "./components/GameBoard";

import createBackgroundCondition from "./utils/createBackgroundCondition";

import { MOCKUP_BACKGROUND_SOURCE } from "./constants/sources";

import {
  MOCKUP_BACKGROUND_SCALE,
  MOCKUP_BACKGROUND_VARIANT,
} from "./constants/figures";

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
      <GameBoard
        backgroundCondition={createBackgroundCondition(
          MOCKUP_BACKGROUND_SOURCE,
          MOCKUP_BACKGROUND_SCALE,
          MOCKUP_BACKGROUND_VARIANT,
        )}
      />
    </>
  );
}
