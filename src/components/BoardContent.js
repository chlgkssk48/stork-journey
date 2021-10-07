import { useState } from "react";
import styled from "styled-components";

import Message from "./Message";
import NameInput from "./NameInput";
import Button from "./common/Button";

import {
  IS_WAITING,
  IS_READY,
} from "../constants/gameStatus";

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

export default function BoardContent() {
  const [gameStatus, setGameStatus] = useState(IS_WAITING);
  const [storkName, setStorkName] = useState("");

  const handleKeyPress= (key) => {
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
