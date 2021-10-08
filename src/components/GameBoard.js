import { useRef } from "react";
import styled from "styled-components";

import BoardContent from "./BoardContent";

import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from "../constants/figures";

const CanvasContainer = styled.div`
  width: ${SCREEN_WIDTH}px;
  height: ${SCREEN_HEIGHT}px;
  border: 3px solid black;
  border-radius: 5px;
`;

export default function GameBoard() {
  const canvasContainerRef = useRef(null);

  return (
    <CanvasContainer ref={canvasContainerRef}>
      <BoardContent canvasContainer={canvasContainerRef} />
    </CanvasContainer>
  );
}
