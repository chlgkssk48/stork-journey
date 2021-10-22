import { useState, useCallback, useEffect } from "react";
import * as PIXI from "pixi.js";
import { getDatabase, update, get, push, child, ref } from "firebase/database";
import styled from "styled-components";
import PropTypes from "prop-types";

import Message from "./Message";
import NameInput from "./NameInput";
import Button from "./common/Button";

import createBackground from "../pixi/createBackground";

import {
  createStork,
  animateStork,
  controlStork,
  restoreStork,
} from "../pixi/stork";

import firebaseApp from "../config/firebase";

import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  MOCKUP_BACKGROUND_SCALE,
  MOCKUP_BACKGROUND_VARIANT,
} from "../constants/figures";

import {
  MOCKUP_BACKGROUND_SOURCE,
  BACKGROUND_MUSIC_SOURCE,
  DRUM_SOUND_SOURCE,
  APPEARANCE_SOUND_SOURCE,
  DUCK_SOUND_SOURCE,
} from "../constants/sources";

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
  height: 165px;
  padding-left: 15px;
  border: 2px solid #8f8f8f;
  border-radius: 5px;
  list-style-type: none;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 40px;
  top: 40px;
`;

const Loading = styled.p`
  margin-top: 290px;
  text-align: center;
  font-size: 25px;
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

let background = null;
let backgroundMusic = null;
let drumSound = null;
let appearanceSound = null;
let duckSound = null;

const app = new PIXI.Application({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  antialias: true,
  backgroundAlpha: 0,
});

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
  const [stork, setStork] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [rankingList, setRankingList] = useState(null);
  const [progress, setProgress] = useState(0);

  const update = () => {
    animateStork(setGameStatus);

    background.tilePosition.x -= MOCKUP_BACKGROUND_VARIANT;

    if (Math.abs(background.tilePosition.x) % 250 === 0) {
      setDistance((distance) => distance + 1);
    }
  };

  const setup = useCallback(() => {
    const loader = PIXI.Loader.shared;

    loader
      .add("background", MOCKUP_BACKGROUND_SOURCE)
      .add("backgroundMusic", BACKGROUND_MUSIC_SOURCE)
      .add("drumSound", DRUM_SOUND_SOURCE)
      .add("appearanceSound", APPEARANCE_SOUND_SOURCE)
      .add("duckSound", DUCK_SOUND_SOURCE)
      .load((loader, resources) => {
        background = createBackground(
          resources.background.data,
          SCREEN_WIDTH,
          SCREEN_HEIGHT,
          MOCKUP_BACKGROUND_SCALE,
        );

        backgroundMusic = resources.backgroundMusic.data;
        drumSound = resources.drumSound.data;
        appearanceSound = resources.appearanceSound.data;
        duckSound = resources.duckSound.data;

        app.stage.addChild(background);

        app.renderer.render(app.stage);

        canvasContainer.current.appendChild(app.view);
      });

    loader.onProgress.add(() => {
      setProgress(loader.progress);
    });

    setTimeout(() => {
      app.ticker.add(update);

      app.ticker.stop();
    }, 100);
  }, [canvasContainer]);

  const handleButtonClick = useCallback(({ name }) => {
    if (name === READY) {
      if (storkName === "") {
        return;
      }

      drumSound.play();

      const stork = createStork();

      stork.position.x = app.screen.width * 0.37;
      stork.position.y = app.screen.height * 0.48;

      app.stage.addChild(stork);

      localStorage.setItem("storkName", storkName);

      setStork(stork);
      setGameStatus(IS_READY);

      return;
    }

    app.stage.removeChild(stork);

    setStork(null);

    app.renderer.render(app.stage);

    restoreStork();

    if (name === TRY_AGAIN) {
      backgroundMusic.play();

      const newStork = createStork();

      newStork.position.x = app.screen.width * 0.37;
      newStork.position.y = app.screen.height * 0.48;

      app.stage.addChild(newStork);

      setStork(newStork);
      setDistance(0);
      setIsRetrying(true);
      setGameStatus(IS_READY);

      return;
    }

    if (name === QUIT) {
      localStorage.removeItem("storkName");

      setGameStatus(IS_WAITING);
    }
  }, [storkName, stork]);

  const handleKeyUp = useCallback(({ key }) => {
    if (key === "Enter" && gameStatus === IS_WAITING) {
      const readyButton = document.getElementsByClassName(READY)[0];

      readyButton.click();

      return;
    }

    if (key === " " && gameStatus === IS_READY) {
      backgroundMusic.loop = true;
      backgroundMusic.play();

      setGameStatus(IS_PLAYING);
    }
  }, [gameStatus]);

  const handleKeyDown = useCallback(({ key }) => {
    if (key === "ArrowLeft") {
      app.ticker.addOnce(() => controlStork(LEFT));

      return;
    }

    if (key === "ArrowRight") {
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
      if (isRetrying) {
        document.body.addEventListener("keyup", handleKeyUp);

        app.renderer.render(app.stage);
      } else {
        setTimeout(() => {
          document.body.addEventListener("keyup", handleKeyUp);

          app.renderer.render(app.stage);

          appearanceSound.play();
        }, 3000);
      }

      return () => {
        setIsRetrying(false);

        document.body.removeEventListener("keyup", handleKeyUp);
      };
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

      backgroundMusic.pause();
      duckSound.play();

      app.ticker.stop();
    }
  }, [gameStatus, handleKeyUp, isRetrying, handleKeyDown, storkName, distance]);

  return (
    <ContentContainer>
      {progress < 100 ? (
        <Loading>로딩 중입니다.<br />잠시만 기다려 주세요!<br />({progress} / 100)</Loading>
      ) : (
        <>
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
