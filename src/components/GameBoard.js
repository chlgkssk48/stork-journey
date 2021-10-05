import { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";
import styled from "styled-components";

const CanvasContainer = styled.div`
  width: 1100px;
  height: 700px;
  border: 3px solid black;
  border-radius: 5px;
`;

const app = new PIXI.Application({
  width: 1100,
  height: 700,
  antialias: true,
  transparent: true,
});

export default function GameBoard() {
  const canvasRef = useRef(null);

  useEffect(() => {
    canvasRef.current.appendChild(app.view);

    return canvasRef.current = null;
  }, []);

  return (
    <CanvasContainer ref={canvasRef} />
  );
}
