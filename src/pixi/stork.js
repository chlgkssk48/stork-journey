import * as PIXI from "pixi.js";

import {
  LEFT,
  RIGHT,
} from "../constants/directions";

import { IS_OVER } from "../constants/gameStatus";

const lineStyle = {
  width: 6,
  color: 0x000000,
  cap: "round",
  join: "round",
};

let leftLeg = new PIXI.Container();
let rightLeg = new PIXI.Container();
let body = new PIXI.Container();
let wing = new PIXI.Container();
let head = new PIXI.Container();
let legs = new PIXI.Container();
let upperBody = new PIXI.Container();
let stork = new PIXI.Container();

let leftLegRadian = 0;
let rightLegRadian = Math.PI;
let wingRadian = 0;

let animationAmount = 0;
let animationRadian = 0.004;

const createStork = () => {
  leftLeg.addChild(
    new PIXI.Graphics()
      .lineStyle(lineStyle)
      .moveTo(100, 190)
      .bezierCurveTo(95, 297, 70, 303, 117, 300)
  );

  rightLeg.addChild(
    new PIXI.Graphics()
      .lineStyle(lineStyle)
      .moveTo(140, 190)
      .bezierCurveTo(145, 297, 120, 303, 167, 300)
  );

  body.addChild(
    new PIXI.Graphics()
      .lineStyle(lineStyle)
      .moveTo(190, 0)
      .lineTo(190, 50)
      .beginFill(0xfffae6)
      .bezierCurveTo(190, 80, 187, 95, 185, 110)
      .bezierCurveTo(165, 140, 135, 130, 120, 133)
      .bezierCurveTo(100, 134, 80, 130, 60, 150)
      .bezierCurveTo(50, 158, 55, 158, 65, 163)
      .bezierCurveTo(55, 170, 50, 175, 80, 190)
      .bezierCurveTo(110, 200, 190, 225, 190, 50)
  );

  wing.addChild(
    new PIXI.Graphics()
      .lineStyle(lineStyle)
      .moveTo(155, 145)
      .beginFill(0xfffae6)
      .bezierCurveTo(140, 155, 120, 150, 105, 153)
      .bezierCurveTo(95, 157, 90, 161, 100, 167)
      .bezierCurveTo(96, 170, 92, 175, 105, 179)
      .bezierCurveTo(115, 182, 130, 184, 155, 145)
  );

  head.addChild(
    new PIXI.Graphics()
      .lineStyle(lineStyle)
      .moveTo(290, 6)
      .lineTo(213, 6)
      .beginFill(0xfffae6)
      .bezierCurveTo(210, -12, 201.5, -22, 190, -22)
      .bezierCurveTo(178.5, -20, 167, -18, 165, 0)
      .bezierCurveTo(167, 19, 169, 22, 186, 24)
      .bezierCurveTo(200, 24, 211, 18, 213, 6)
      .moveTo(193, 0)
      .arc(193, 0, 1.5, 0, Math.PI * 2)
  );

  stork.addChild(leftLeg, rightLeg, body, wing, head);

  return stork;
};

const animateStork = (setGameStatus) => {
  leftLegRadian += 0.19;
  rightLegRadian += 0.19;
  wingRadian += 0.3;

  leftLeg.pivot.set(100, 190);
  leftLeg.position.set(120 + Math.cos(leftLegRadian) * 10, 190);
  leftLeg.rotation += Math.cos(leftLegRadian) / 30;

  rightLeg.pivot.set(140, 190);
  rightLeg.position.set(120 + Math.cos(rightLegRadian) * 10, 190);
  rightLeg.rotation += Math.cos(rightLegRadian) / 30;

  wing.pivot.set(155, 145);
  wing.position.set(155, 145);
  wing.rotation += Math.sin(wingRadian) * 0.02;

  head.pivot.set(190, 0);
  head.position.set(190, 0);

  legs.pivot.set(120, 225);
  legs.position.set(120, 225);

  upperBody.pivot.set(120, 197);
  upperBody.position.set(120, 197);

  if (Math.abs(upperBody.rotation) <= 0.08) {
    if (animationRadian >= 0) {
      animationRadian += 0.001;
    } else {
      animationRadian -= 0.001;
    }
  }

  if (upperBody.rotation >= 0) {
    animationAmount += 0.0002;

    if (animationAmount > 0.013) {
      animationAmount = 0.006;
    }

    if (animationRadian > 0) {
      animationRadian += 17 * Math.pow(animationAmount, 2);
    } else {
      animationAmount -= 0.0002;
      animationRadian += 7 * Math.pow(animationAmount, 2);
    }
  } else {
    animationAmount -= 0.0002;

    if (animationAmount < -0.013) {
      animationAmount = 0.006;
    }

    if (animationRadian > 0) {
      animationRadian -= 17 * Math.pow(animationAmount, 2);
    } else {
      animationAmount += 0.0002;
      animationRadian -= 7 * Math.pow(animationAmount, 2);
    }
  }

  head.rotation -= animationRadian * 2;
  legs.rotation += animationRadian;
  upperBody.rotation += animationRadian * 3;

  if (upperBody.rotation >= 1.6) {
    head.rotation = -1.6;
    head.position.set(175, 10);

    legs.rotation = 1.6;
    legs.position.set(90, 230);

    upperBody.position.set(120, 230);

    setGameStatus(IS_OVER);
  }

  if (upperBody.rotation <= -2.2) {
    head.rotation = -0.6;
    head.position.set(180, 10);

    legs.rotation = -1.8;
    legs.position.set(150, 230);

    upperBody.position.set(120, 230);

    setGameStatus(IS_OVER);
  }

  legs.addChild(leftLeg, rightLeg);
  upperBody.addChild(body, wing, head);
  stork.addChild(legs, upperBody);
};

const controlStork = (arrowDirection) => {
  if (upperBody.rotation >= 0) {
    if (arrowDirection === LEFT) {
      animationRadian = -0.0075;
    }

    if (arrowDirection === RIGHT) {
      animationRadian += 0.003;
    }
  } else {
    if (arrowDirection === LEFT) {
      animationRadian -= 0.004;
    }

    if (arrowDirection === RIGHT) {
      animationRadian = 0.0095;
    }
  }
};

const restoreStork = () => {
  leftLeg = new PIXI.Container();
  rightLeg = new PIXI.Container();
  body = new PIXI.Container();
  wing = new PIXI.Container();
  head = new PIXI.Container();
  legs = new PIXI.Container();
  upperBody = new PIXI.Container();
  stork = new PIXI.Container();

  leftLegRadian = 0;
  rightLegRadian = Math.PI;
  wingRadian = 0;

  animationAmount = 0;
  animationRadian = 0.004;
};

export {
  createStork,
  animateStork,
  controlStork,
  restoreStork,
};
