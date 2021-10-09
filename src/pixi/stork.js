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
      .arc(190, 0, 25, 0, Math.PI * 2)
      .moveTo(187, 0)
      .arc(187, 0, 1, 0, Math.PI * 2)
  );

  body.addChild(
    new PIXI.Graphics()
      .lineStyle(lineStyle)
      .moveTo(190, 0)
      .lineTo(190, 110)
      .beginFill(0xfffae6)
      .bezierCurveTo(45, 100, 35, 110, 55, 130)
      .bezierCurveTo(45, 130, 35, 140, 60, 150)
      .bezierCurveTo(50, 150, 40, 160, 65, 170)
      .bezierCurveTo(60, 175, 55, 180, 90, 200)
      .bezierCurveTo(110, 210, 190, 220, 190, 110)
  );

  wing.addChild(
    new PIXI.Graphics()
      .lineStyle(lineStyle)
      .moveTo(160, 140)
      .beginFill(0xfffae6)
      .bezierCurveTo(90, 130, 80, 140, 100, 150)
      .bezierCurveTo(90, 150, 80, 155, 100, 170)
      .bezierCurveTo(105, 170, 120, 200, 160, 140)
  );

  leftLeg.addChild(
    new PIXI.Graphics()
      .lineStyle(lineStyle)
      .moveTo(100, 180)
      .lineTo(100, 300)
      .lineTo(125, 300)
  );

  rightLeg.addChild(
    new PIXI.Graphics()
      .lineStyle(lineStyle)
      .moveTo(145, 180)
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

  wing.pivot.set(165, 130);
  wing.position.set(165, 130);
  wing.rotation += Math.sin(wingRadian) * 0.02;

  leftLeg.pivot.set(100, 180);
  leftLeg.position.set(122.5 + Math.cos(leftLegRadian) * 22, 180);
  leftLeg.rotation += Math.cos(leftLegRadian) / 20;

  rightLeg.pivot.set(145, 180);
  rightLeg.position.set(122.5 + Math.cos(rightLegRadian) * 22, 180);
  rightLeg.rotation += Math.cos(rightLegRadian) / 20;

  requestAnimationFrame(animateStork);
};

export {
  createStork,
  animateStork,
};
