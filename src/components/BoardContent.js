import { useState, useCallback, useEffect } from "react";
import * as PIXI from "pixi.js";
import styled from "styled-components";
import PropTypes from "prop-types";

import Message from "./Message";
import NameInput from "./NameInput";
import Button from "./common/Button";

import createBackground from "../pixi/createBackground";

import {
  IS_WAITING,
  IS_READY,
} from "../constants/gameStatus";

import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  MOCKUP_BACKGROUND_SCALE,
  MOCKUP_BACKGROUND_VARIANT,
} from "../constants/figures";

import { MOCKUP_BACKGROUND_SOURCE } from "../constants/sources";

import { READY } from "../constants/buttonNames";

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  position: absolute;
  width: 1100px;
  height: 300px;
`;

export default function BoardContent({ canvasContainer }) {
  const [gameStatus, setGameStatus] = useState(IS_WAITING);
  const [storkName, setStorkName] = useState("");

  const setup = useCallback(() => {
    const app = new PIXI.Application({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      antialias: true,
      backgroundAlpha: 0,
    });

    const background = createBackground(
      MOCKUP_BACKGROUND_SOURCE,
      SCREEN_WIDTH,
      SCREEN_HEIGHT,
      MOCKUP_BACKGROUND_SCALE,
    );

    app.ticker.add(() => {
      background.tilePosition.x -= MOCKUP_BACKGROUND_VARIANT;
    });

    app.stage.addChild(background);

    canvasContainer.current.appendChild(app.view);
  }, [canvasContainer]);

  useEffect(() => {
    setup();
  }, [setup]);

  const handleKeyPress = (key) => {
    if (key !== "Enter") {
      return;
    }

    handleButtonClick();
  };

  const handleButtonClick = () => {
    if (storkName === "") {
      return;
    }

    localStorage.setItem("storkName", storkName);

    setGameStatus(IS_READY);
  };

  return (
    <ContentContainer>
      <Message gameStatus={gameStatus} />
      {gameStatus === IS_WAITING && (
        <>
          <NameInput
            onType={setStorkName}
            onKeyPress={handleKeyPress}
          />
          <Button
            buttonName={READY}
            onClick={handleButtonClick}
          />
        </>
      )}
    </ContentContainer>
  );
}

BoardContent.propTypes = {
  canvasContainer: PropTypes.shape({
    current: PropTypes.element,
  }),
};
