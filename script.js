//dostop do canvasa
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//velikost enega polja na igriscu
const box = 40;

let direction = "RIGHT";

document.addEventListener("keydown", function(event) {
  if (event.key === "ArrowUp" && direction !== "DOWN") {
    direction = "UP";
  } else if (event.key === "ArrowDown" && direction !== "UP") {
    direction = "DOWN";
  } else if (event.key === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT";
  } else if (event.key === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT";
  }
});


const snakeImg = new Image();
snakeImg.src = "snake.gif";

const appleImg = new Image();
appleImg.src = "apple.png";


let snake = [
  {
    x: Math.floor((canvas.width / box) / 2) * box,
    y: Math.floor((canvas.height / box) / 2) * box
  }
];


function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      // glava kače
      ctx.drawImage(snakeImg, snake[i].x, snake[i].y, box, box);
    } else {
      // telo ostane zeleno (ali lahko tudi sliko dodaš kasneje)
      ctx.fillStyle = "lime";
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
  }
}

let food = {
  x: Math.floor(Math.random() * (canvas.width / box)) * box,
  y: Math.floor(Math.random() * (canvas.height / box)) * box
};


//gumb za start (kot objekt)
const startButton = {
  x: canvas.width / 2 - 60, // centrirano vodoravno
  y: canvas.height / 2 - 25, // centrirano navpično
  width: 120,
  height: 50,
  visible: true // dugme je vidno dok igru ne pokrenemo
};


//glavna funkcija katera se skoz na novo klice
function gameLoop () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawStartButton();
  drawSnake();
  ctx.drawImage(appleImg, food.x, food.y, box, box); // narišemo jabolko

  // premik glave glede na smer
  let head = { x: snake[0].x, y: snake[0].y };

  if (direction === "RIGHT") head.x += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // preveri če je glava zadela rob → konec igre
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height
  ) {
    clearInterval(game);
    alert("GAME OVER 💥");
    return;
  }

  // preveri ali je pojedla jabolko
  if (head.x === food.x && head.y === food.y) {
    // ne odstranjuj zadnjega dela → zmija zraste
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
  } else {
    // če ni pojedla → odstrani zadnji del (rep)
    snake.pop();
  }

  // dodaj novo glavo
  snake.unshift(head);
}




// funkcija za risanje gumba "START"
function drawStartButton () {
  if (!startButton.visible) return;

  // senca za globino
  ctx.shadowColor = "#00000088"; // črna senca z rahlo prosojnostjo
  ctx.shadowBlur = 10;

  // ozadje gumba
  ctx.fillStyle = "#f424bc";
  ctx.fillRect(startButton.x, startButton.y, startButton.width, startButton.height);

  // obroba gumba
  ctx.strokeStyle = "#f2aae4";
  ctx.strokeRect(startButton.x, startButton.y, startButton.width, startButton.height);

  // besedilo "START"
  ctx.fillStyle = "white";
  ctx.font = "10px 'Press Start 2P'";
  //ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("START GAME", canvas.width / 2, canvas.height / 2);

  // izklopimo senco za ostale elemente
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
}



// dogodek klik na platno (canvas)
canvas.addEventListener("click", function(event) {
  // pridobimo položaj platna na strani
  const rect = canvas.getBoundingClientRect();

  // izračunamo položaj miške glede na platno
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // preverimo, ali je klik bil znotraj gumba in če je gumb viden
  if (
    startButton.visible &&
    mouseX >= startButton.x &&
    mouseX <= startButton.x + startButton.width &&
    mouseY >= startButton.y &&
    mouseY <= startButton.y + startButton.height
  ) {
    startButton.visible = false; // skrij gumb
    startGame(); // zaženi igro (gameLoop)
  }
});

// sprememba kazalca miške nad gumbom
canvas.addEventListener("mousemove", function(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  if (
    startButton.visible &&
    mouseX >= startButton.x &&
    mouseX <= startButton.x + startButton.width &&
    mouseY >= startButton.y &&
    mouseY <= startButton.y + startButton.height
  ) {
    canvas.style.cursor = "pointer";
  } else {
    canvas.style.cursor = "default";
  }
});




// funkcija katera starta gameLoop
let game;
function startGame() {
  if (!game) {
    game = setInterval(gameLoop, 400); // klici gameLoop vsakih 400ms
  }
}

//startGame(); // privremeno

// ob prvem zagonu narišemo samo gumb
drawStartButton();


