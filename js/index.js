/* Variables */
let fps;
let lastKey;
const canvas = document.createElement("canvas");
const c = canvas.getContext("2d");
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  up: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
  down: {
    pressed: false,
  },
};

// Canvas Configuration
canvas.width = innerWidth;
canvas.height = innerHeight;
function drawCanvas(color = "grey") {
  document.body.appendChild(canvas);
  if (color === "grey") {
    c.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    c.fillStyle = color;
    c.fillRect(0, 0, canvas.width, canvas.height);
  }
}

/* Game Variables */
const Map = { width: 1000, height: 0 } || canvas.width;
const Gravity = fps > 60 ? 0.5 : 1;
const GroundLevel = canvas.height;
const PLAYER_MOVEMENT_SPEED = 10;
const PLAYER_JUMP_HEIGHT = 20;

/* Classes */
class Object {
  constructor({
    name = "object",
    pos = { x: 0, y: 0 },
    velocity = { x: 0, y: 0 },
    width,
    height,
    color = "black",
  }) {
    this.name = name;
    this.pos = pos;
    this.velocity = velocity;
    this.color = color;
    this.width = width;
    this.height = height;
    this.isFalling = false;
  }

  draw() {
    c.fillStyle = this.color;
    c.beginPath();
    c.rect(this.pos.x, this.pos.y, this.width, this.height);
    c.closePath();
    c.fill();
  }

  update() {
    this.draw();

    // Applying Gravity and Velocity
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;

    if (this.pos.y + this.height >= GroundLevel) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += Gravity;
    }

    //   Set is Falling to false if player is on ground
    if (this.pos.y + this.height >= GroundLevel) this.isFalling = false;
    else this.isFalling = true;
    // prevent player from going off the map
    if (this.pos.x < 0) this.pos.x = 0;
    else if (this.pos.x > Map.width) this.pos.x = Map.width;
    if (this.pos.y < 0) this.pos.y = 0;
  }
}

class Text {
  constructor({ pos = { x: 0, y: 0 }, object, offset, text, font, color }) {
    this.name = name;
    this.pos = pos;
    this.obj = object;
    this.offset = offset;
    this.text = text;
    this.font = font;
    this.color = color;
  }

  draw() {
    c.fillStyle = this.color;
    c.font = this.font;
    c.textAlign = "center";
    c.fillText(
      this.text,
      this.pos.x + this.offset.x,
      this.pos.y - this.offset.y,
      canvas.width * canvas.height
    );
  }

  update() {
    this.draw();
    this.pos.x = this.obj.pos.x + this.obj.width / 2;
    this.pos.y = this.obj.pos.y;
  }
}

/* Objects Inits */
const player = new Object({
  name: "Player 1",
  pos: {
    x: 100,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  width: 75,
  height: 200,
  color: "white",
});

const nametag = new Text({
  offset: { x: 0, y: 20 },
  object: player,
  text: player.name,
  font: "25px Verdana",
  color: "white",
});

/* Animation Loop */
function getFps(now) {
  let t = [];
  t.unshift(now);
  if (t.length > 10) {
    var t0 = t.pop();
    fps = Math.floor((1000 * 10) / (now - t0));
  }
  return fps;
}
function animate(now) {
  getFps(now);
  requestAnimationFrame(animate);
  drawCanvas("rgba(0, 0, 0, 0.4)");
  player.update();
  nametag.update();

  // console.log(player.name);
  // Game Logic Goes Here 👇

  //   Moving
  if (
    keys.d.pressed &&
    lastKey === "d" &&
    !keys.a.pressed &&
    player.pos.x <= Map.width
  ) {
    setTimeout(() => {
      player.velocity.x = PLAYER_MOVEMENT_SPEED;
    }, 25);
  } else if (
    keys.a.pressed &&
    lastKey === "a" &&
    !keys.d.pressed &&
    player.pos.x >= 0
  ) {
    setTimeout(() => {
      player.velocity.x = -PLAYER_MOVEMENT_SPEED;
    }, 25);
  } else {
    if (player.velocity.x > 0) {
      player.velocity.x = Number(
        (player.velocity.x -= PLAYER_MOVEMENT_SPEED * 0.04).toFixed(2)
      );
    } else if (player.velocity.x < 0) {
      player.velocity.x = Number(
        (player.velocity.x += PLAYER_MOVEMENT_SPEED * 0.04).toFixed(2)
      );
    }
  }

  //   Jumping
  if (keys.w.pressed && !player.isFalling && player.pos.y >= Map.height * -1) {
    setTimeout(() => {
      keys.w.pressed = false;
      player.velocity.y = -PLAYER_JUMP_HEIGHT;
    }, 25);
  }
}

/* Event Listener */
addEventListener("keydown", ({ key }) => {
  switch (key.toLowerCase()) {
    case "w":
      keys.w.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;

    default:
      break;
  }
});
addEventListener("keyup", ({ key }) => {
  switch (key.toLowerCase()) {
    case "w":
      keys.w.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    default:
      break;
  }
});

// Mounting Animation Loop Function
animate();
