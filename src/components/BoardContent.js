import { useState, useCallback, useEffect } from "react";
import * as PIXI from "pixi.js";
import { getDatabase, update, get, push, child, ref } from "firebase/database";
import styled from "styled-components";
import PropTypes from "prop-types";

import Message from "./Message";
import NameInput from "./NameInput";
import Button from "./common/Button";

import createBackground from "../pixi/createBackground";

import firebaseApp from "../config/firebase";

import {
  createStork,
  animateStork,
  controlStork,
  restoreStork,
  setStorkControlStatus,
} from "../pixi/stork";

import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  MOCKUP_BACKGROUND_SCALE,
  MOCKUP_BACKGROUND_VARIANT,
} from "../constants/figures";

import { MOCKUP_BACKGROUND_SOURCE } from "../constants/sources";

import {
  IS_WAITING,
  IS_READY,
  IS_PLAYING,
  IS_OVER,
} from "../constants/gameStatus";

import {
  LEFT,
  RIGHT,
} from "../constants/directions";

import {
  READY,
  TRY_AGAIN,
  QUIT,
} from "../constants/buttonNames";

const ContentContainer = styled.div`
  position: absolute;
  width: ${SCREEN_WIDTH}px;
`;

const PreparationContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 300px;
`;

const RankingBox = styled.ol`
  position: absolute;
  left: 390px;
  top: 25px;
  width: 280px;
  height: 175px;
  padding-left: 15px;
  border: 2px solid #8f8f8f;
  border-radius: 5px;
  list-style-type: none;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 40px;
  top: 40px;
`;

const Distance = styled.p`
  margin-top: 40px;
  padding-left: ${({ gameStatus }) => gameStatus === IS_PLAYING ? "45px" : "50px"};
  font-size: ${({ gameStatus }) => gameStatus === IS_PLAYING ? "40px" : "60px"};
`;

const List = styled.li`
  font-size: 20px;
  line-height: 33px;
`;

const StyledButton = styled(Button)`
  display: inline-block;
  margin: 0px 0px 10px 0px;
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

const writeStorkData = async (name, distance) => {
  const database = getDatabase(firebaseApp, process.env.REACT_APP_REALTIME_DATABASE_URL);

  const storkData = {
    name,
    distance,
  };

  const { key } = await push(child(ref(database), "stork"));

  update(ref(database), {
    [`stork/${key}`]: storkData,
  });
};

const getRankingListSortedByDistance = async () => {
  const database = getDatabase(firebaseApp, process.env.REACT_APP_REALTIME_DATABASE_URL);
  const snapshot = await get(child(ref(database), "stork"));
  const storkDatas = snapshot.val();

  const sortedList = Object.values(storkDatas).sort((a, b) => b.distance - a.distance);

  const topRankingList = sortedList.slice(0, 5);

  return topRankingList;
};

export default function BoardContent({ canvasContainer }) {
  const [gameStatus, setGameStatus] = useState(IS_WAITING);
  const [storkName, setStorkName] = useState(null);
  const [distance, setDistance] = useState(null);
  const [rankingList, setRankingList] = useState(null);

  const update = () => {
    animateStork(setGameStatus);

    background.tilePosition.x -= MOCKUP_BACKGROUND_VARIANT;

    if (Math.abs(background.tilePosition.x) % 300 === 0) {
      setDistance((distance) => distance + 1);
    }
  };

  const setup = useCallback(() => {
    app.stage.addChild(background);

    canvasContainer.current.appendChild(app.view);

    setTimeout(() => {
      app.ticker.add(update);

      app.ticker.stop();
    }, 1000);
  }, [canvasContainer]);

  const handleButtonClick = useCallback(({ name }) => {
    if (name === READY) {
      if (storkName === "") {
        return;
      }

      const stork = createStork();

      stork.position.x = app.screen.width * 0.37;
      stork.position.y = app.screen.height * 0.48;

      app.stage.addChild(stork);

      localStorage.setItem("storkName", storkName);

      setGameStatus(IS_READY);

      return;
    }

    app.stage.removeChildAt(1);

    app.renderer.render(app.stage);

    restoreStork();

    if (name === TRY_AGAIN) {
      const newStork = createStork();

      newStork.position.x = app.screen.width * 0.37;
      newStork.position.y = app.screen.height * 0.48;

      app.stage.addChild(newStork);

      setGameStatus(IS_READY);

      return;
    }

    if (name === QUIT) {
      setGameStatus(IS_WAITING);
    }
  }, [storkName]);

  const handleKeyUp = useCallback(({ key }) => {
    if (key === "Enter" && gameStatus === IS_WAITING) {
      const readyButton = document.getElementsByClassName(READY)[0];

      readyButton.click();

      return;
    }

    if (key === " " && gameStatus === IS_READY) {
      setGameStatus(IS_PLAYING);
    }

    if ((key === "ArrowLeft" || key === "ArrowRight") && gameStatus === IS_PLAYING) {
      setStorkControlStatus("isUncontrolled");
    }
  }, [gameStatus]);

  const handleKeyDown = useCallback(({ key }) => {
    if (key === "ArrowLeft") {
      setStorkControlStatus("isControlled");

      app.ticker.addOnce(() => controlStork(LEFT));
    }

    if (key === "ArrowRight") {
      setStorkControlStatus("isControlled");

      app.ticker.addOnce(() => controlStork(RIGHT));
    }
  }, []);

  useEffect(() => {
    setup();
  }, [setup]);

  useEffect(() => {
    if (gameStatus === IS_WAITING) {
      setDistance(0);
    }

    if (gameStatus === IS_READY) {
      document.body.addEventListener("keyup", handleKeyUp);

      app.renderer.render(app.stage);

      return () => document.body.removeEventListener("keyup", handleKeyUp);
    }

    if (gameStatus === IS_PLAYING) {
      document.body.addEventListener("keydown", handleKeyDown);
      document.body.addEventListener("keyup", handleKeyUp);

      app.ticker.start();

      return () => {
        document.body.removeEventListener("keydown", handleKeyDown);
        document.body.removeEventListener("keyup", handleKeyUp);
      };
    }

    if (gameStatus === IS_OVER) {
      writeStorkData(storkName, distance);

      (async () => {
        const rankingList = await getRankingListSortedByDistance();

        setRankingList(rankingList);
      })();

      app.ticker.stop();
    }
  }, [gameStatus, handleKeyUp, handleKeyDown, storkName, distance]);

  return (
    <ContentContainer>
      {gameStatus === IS_WAITING && (
        <PreparationContent>
          <Message gameStatus={gameStatus} />
          <NameInput
            onType={setStorkName}
            onKeyUp={handleKeyUp}
          />
          <Button
            buttonName={READY}
            onClick={handleButtonClick}
            className={READY}
          />
        </PreparationContent>
      )}
      {gameStatus === IS_READY && (
        <PreparationContent>
          <Message gameStatus={gameStatus} />
        </PreparationContent>
      )}
      {gameStatus === IS_PLAYING && (
        <Distance
          gameStatus={gameStatus}
        >
          {distance} m
        </Distance>
      )}
      {gameStatus === IS_OVER && (
        <>
          <Distance
            gameStatus={gameStatus}
          >
            {distance} m
          </Distance>
          <RankingBox>
            {rankingList && rankingList.map((data, index) => (
              <List key={index}>{`${index + 1}위 : ${data.name}, ${data.distance} m`}</List>
            ))}
          </RankingBox>
          <ButtonBox>
            <StyledButton
              buttonName={TRY_AGAIN}
              onClick={handleButtonClick}
            />
            <StyledButton
              buttonName={QUIT}
              onClick={handleButtonClick}
            />
          </ButtonBox>
        </>
      )}
    </ContentContainer>
  );
}

BoardContent.propTypes = {
  canvasContainer: PropTypes.shape({
    current: PropTypes.object,
  }),
};
