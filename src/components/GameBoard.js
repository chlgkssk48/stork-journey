import { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";
import styled from "styled-components";
import PropTypes from "prop-types";

import createBackground from "../pixi/createBackground";

import {
  RENDERERS_VIEW_WIDTH,
  RENDERERS_VIEW_HEIGHT,
} from "../constants/figures";

const CanvasContainer = styled.div`
  width: ${RENDERERS_VIEW_WIDTH}px;
  height: ${RENDERERS_VIEW_HEIGHT}px;
  border: 3px solid black;
  border-radius: 5px;
`;

const app = new PIXI.Application({
  width: RENDERERS_VIEW_WIDTH,
  height: RENDERERS_VIEW_HEIGHT,
  antialias: true,
  backgroundAlpha: 0,
});

export default function GameBoard({ backgroundCondition }) {
  const canvasRef = useRef(null);

  const {
    source,
    scale,
    variant,
  } = backgroundCondition;

  useEffect(() => {
    const background = createBackground(
      source,
      scale,
      app.screen.width,
      app.screen.height,
    );

    canvasRef.current.appendChild(app.view);

    background.tileScale.set(scale);

    app.ticker.add(() => {
      background.tilePosition.x -= variant;
    });

    app.stage.addChild(background);

    return () => canvasRef.current = null;
  }, [source, scale, variant]);

  return (
    <CanvasContainer ref={canvasRef} />
  );
}

GameBoard.propTypes = {
  backgroundCondition: PropTypes.shape({
    source: PropTypes.string.isRequired,
    scale: PropTypes.number,
    variant: PropTypes.number,
  }),
};
