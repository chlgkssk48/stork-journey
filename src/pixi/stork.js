import * as PIXI from "pixi.js";

const stork = new PIXI.Container();
const head = new PIXI.Container();
const body = new PIXI.Container();
const wing = new PIXI.Container();
const leftLeg = new PIXI.Container();
const rightLeg = new PIXI.Container();

let wingRadian = 0;
let leftLegRadian = 0;
let rightLegRadian = Math.PI;

const createStork = () => {
  const lineStyle = {
    width: 7,
    color: 0x000000,
    cap: "round",
    join: "round",
  };

  head.addChild(
    new PIXI.Graphics()
      .lineStyle(lineStyle)
      .moveTo(300, 0)
      .beginFill(0xfffae6)
      .arc(190, 0, 23, 0, Math.PI * 2)
      .moveTo(187, 0)
      .arc(187, 0, 1, 0, Math.PI * 2)
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

  leftLeg.addChild(
    new PIXI.Graphics()
      .lineStyle(lineStyle)
      .moveTo(100, 170)
      .lineTo(100, 300)
      .lineTo(125, 300)
  );

  rightLeg.addChild(
    new PIXI.Graphics()
      .lineStyle(lineStyle)
      .moveTo(145, 170)
      .lineTo(145, 300)
      .lineTo(170, 300)
  );

  stork.addChild(leftLeg, rightLeg, body, wing, head);

  return stork;
};

const animateStork = () => {
  wingRadian += 0.25;
  leftLegRadian += 0.13;
  rightLegRadian += 0.13;

  wing.pivot.set(155, 145);
  wing.position.set(155, 145);
  wing.rotation += Math.sin(wingRadian) * 0.02;

  leftLeg.pivot.set(100, 170);
  leftLeg.position.set(122.5 + Math.cos(leftLegRadian) * 22, 170);
  leftLeg.rotation += Math.cos(leftLegRadian) / 20;

  rightLeg.pivot.set(145, 170);
  rightLeg.position.set(122.5 + Math.cos(rightLegRadian) * 22, 170);
  rightLeg.rotation += Math.cos(rightLegRadian) / 20;

  requestAnimationFrame(animateStork);
};

export {
  createStork,
  animateStork,
};
