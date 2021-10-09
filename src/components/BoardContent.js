import { useState, useCallback, useEffect } from "react";
import * as PIXI from "pixi.js";
import styled from "styled-components";
import PropTypes from "prop-types";

import Message from "./Message";
import NameInput from "./NameInput";
import Button from "./common/Button";

import createBackground from "../pixi/createBackground";

import {
  createStork,
  animateStork,
} from "../pixi/stork";

import {
  IS_WAITING,
  IS_READY,
  IS_PLAYING,
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
  position: absolute;
`;

const PreparationContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  position: absolute;
  width: 1100px;
  height: 300px;
`;

const DistanceContent = styled.p`
  padding-left: 40px;
  font-size: 40px;
`;

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

export default function BoardContent({ canvasContainer }) {
  const [gameStatus, setGameStatus] = useState(IS_WAITING);
  const [storkName, setStorkName] = useState("");
  const [distance, setDistance] = useState(0);

  const setup = useCallback(() => {
    app.stage.addChild(background);

    canvasContainer.current.appendChild(app.view);
  }, [canvasContainer]);

  const handleButtonClick = useCallback(() => {
    if (storkName === "") {
      return;
    }

    const stork = createStork();

    stork.position.x = app.screen.width * 0.37;
    stork.position.y = app.screen.height * 0.48;

    app.stage.addChild(stork);

    localStorage.setItem("storkName", storkName);

    setGameStatus(IS_READY);
  }, [storkName]);

  const handleKeyUp = useCallback(({ key }) => {
    if (key === "Enter" && gameStatus === IS_WAITING) {
      handleButtonClick();

      return;
    }

    if (key === " " && gameStatus === IS_READY) {
      setGameStatus(IS_PLAYING);
    }
  }, [handleButtonClick, gameStatus]);

  useEffect(() => {
    setup();
  }, [setup]);

  useEffect(() => {
    if (gameStatus === IS_READY) {
      document.body.addEventListener("keyup", handleKeyUp);

      return () => document.body.removeEventListener("keyup", handleKeyUp);
    }

    if (gameStatus === IS_PLAYING) {
      animateStork();

      app.ticker.add(() => {
        background.tilePosition.x -= MOCKUP_BACKGROUND_VARIANT;

        if (Math.abs(background.tilePosition.x) % 300 === 0) {
          setDistance((distance) => distance + 1);
        }
      });
    }
  }, [gameStatus, handleKeyUp]);

  return (
    <ContentContainer>
      {gameStatus === IS_PLAYING ? (
        <DistanceContent>{distance} m</DistanceContent>
      ) : (
        <PreparationContent>
          <Message gameStatus={gameStatus} />
          {gameStatus === IS_WAITING && (
            <>
              <NameInput
                onType={setStorkName}
                onKeyUp={handleKeyUp}
              />
              <Button
                buttonName={READY}
                onClick={handleButtonClick}
              />
            </>
          )}
        </PreparationContent>
      )}
    </ContentContainer>
  );
}

BoardContent.propTypes = {
  canvasContainer: PropTypes.shape({
    current: PropTypes.object,
  }),
};
