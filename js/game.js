// create GameBoard context and mouse position tracker
var game = document.getElementById('gameboard');
var game_ctx = game.getContext('2d');
var game_mousePos = 0;
// add GameBoard event listener for click events



// create Color Select context and mouse position tracker, and a variable to hold the current color selection
var select = document.getElementById('selector');
var select_ctx = select.getContext('2d');
var select_mousePos = 0;
var select_color = 'red';

// define colors
var color_boxes_shades = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo'];

// game logic variables
var playgame = true;
var activeRow = 7; // decrements by 1 for each completed line
var show_answer = false;
var win_or_lose_message = "";

// create array of feedback for each row, set all to 0;

var feedback_array = makeFeedbackArray();

function makeFeedbackArray() {
  var fbarray = [];
  for (var i = 0; i < 8; i++) {
    var rowfeedback = [0,0];
    fbarray[i] = rowfeedback;
    }
  return fbarray;
  }


// set a random solution
var solution = genRandomSolution();
function genRandomSolution() {
  var random_array = [];
  var color_array = []
  var min = 0;
  var max = 6;
  // fill random_array with random integers between 0 and 5
  for (var i = 0; i < 4; i++) {
    var random = Math.floor(Math.random() * (+max - +min)) + +min;
    random_array[i] = random;
  }
  for (var i = 0; i < 4; i++) {
    color_number = random_array[i];
    color_array[i] = color_boxes_shades[color_number];
  }
  return color_array;
}

// create the color selection boxes for the Color Select canvas
var color_rect_coords = makeColorRectCoords();
makeColorRectBoxes();

function makeColorRectCoords() {
  var rectarray = [];
  for (var i = 0; i < 6; i++) {
    var newrect = {x:10 + 60*i, y:10, height:50, width:50, boxcolor:color_boxes_shades[i]};
    rectarray[i] = newrect;
  }
  return rectarray;
}

function makeColorRectBoxes() {
  for (var i = 0; i < 6; i++) {
    var newPath = new Path2D();
    newPath.rect(
      color_rect_coords[i].x,
      color_rect_coords[i].y,
      color_rect_coords[i].height,
      color_rect_coords[i].width);

    color_rect_coords[i].rectangle = newPath;
  }
}

// create the game pegs for the GameBoard canvas
var gamepegs = makeGamePegs();
makePegBoxes();

function makeGamePegs() {
  var pegs = [];
    for (var c=0; c<8; c++) {
      pegs[c] = ['x'];
      for (var r=0; r<4; r++) {
        pegs[c][r] = {x:60 + 60*r,
          y:100 + 60*c,
          height:50,
          width:50,
          color:'white'};
      }
    }
  return pegs;
}

function makePegBoxes() {
  for (var c = 0; c < 8; c++) {
    for (var r = 0; r < 4; r++) {
      var boxPath = new Path2D();
      boxPath.rect(
        gamepegs[c][r].x,
        gamepegs[c][r].y,
        gamepegs[c][r].width,
        gamepegs[c][r].height);
      gamepegs[c][r].rectangle = boxPath;
    };
  };
}

// --- USER INPUT FUNCTIONS ---

// add EventListener to Select canvas and define its function (to get the color of the square clicked in

select.addEventListener("click", function(evt) {

  select_mousePos = getSelectMousePos(select, evt);
  select_color = getSelectorColorAtMouseClick(select_mousePos)
});

function getSelectorColorAtMouseClick(inputxy) {
  var newcolor = 'none';
  for (var i = 0; i < 6; i++) {
    var boxtocheck = color_rect_coords[i];
    if (inputxy.x > boxtocheck.x && inputxy.y > boxtocheck.y) {
      newcolor = boxtocheck.boxcolor;
    }
  }
  return newcolor;
}

function getSelectMousePos(gameboard, evt) {
  var rect = gameboard.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}

// add EventListener to GameBoard canvas and define its functions (place color at square clicked if and only if the row is valid

game.addEventListener("click", function(evt) {
  game_mousePos = getGameMousePos(game, evt);
  for (var r = 0; r < 4; r++) {
    var activebox = gamepegs[activeRow][r];
    if (playgame == true) {
      if (game_mousePos.x > activebox.x && game_mousePos.y > activebox.y && game_mousePos.x < activebox.x + 50 && game_mousePos.y < activebox.y + 50) {
        activebox.color = select_color;
      }
    }
  }
});
function getGameMousePos(game, evt) {
  var rect = game.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}

// page button functions
function newGame() {
  playgame = true;
  gamepegs = makeGamePegs();
  makePegBoxes();
  feedback_array = makeFeedbackArray();
  solution = genRandomSolution();
  activeRow = 7;
  show_answer = false;
  win_or_lose_message = "";
  select_color = 'red';
}

function resetRow() {
  for (var r = 0; r < 4; r++) {
    var activebox = gamepegs[activeRow][r];
    activebox.color = 'white';
  }
}

function testRow() {
  for (var r = 0; r < 4; r++) {
    // test for whether there are any white cells in the active row
    if (gamepegs[activeRow][r].color == 'white') {
      alert("Rows cannot have white squares.");
      return;
    }
  }
  var row_to_test = [
    gamepegs[activeRow][0].color,
    gamepegs[activeRow][1].color,
    gamepegs[activeRow][2].color,
    gamepegs[activeRow][3].color];
  setFeedback(row_to_test, solution);
  var is_match = testRowEqualsAnswer(row_to_test, solution);
  if (is_match == false) {
    if (activeRow == 0) {
      show_answer = true;
      win_or_lose_message = "NO MATCH";
      playgame = false;
    } else {
      activeRow--;
    }
  } else if (is_match == true) {
    show_answer = true;
    win_or_lose_message = "MATCH";
    playgame = false;
  }
}

function testRowEqualsAnswer(testing_row, correct) {
  for (var i = 0; i < 4; i++) {
    if (testing_row[i] !== correct[i]) {
      return false;
    }
  }
  return true;
}

function setFeedback(rowbeingtested, hiddencode) {
  var temp_rowbeingtested = [...rowbeingtested];
  var temp_hiddencode = [...hiddencode];
  var num_correct_place = 0;
  var num_correct_color = 0;
  // count number of colored squares that match the hidden code
  for (var i = 0; i < 4; i++) {
    if (temp_rowbeingtested[i] == temp_hiddencode[i]) {
      num_correct_place++;
      temp_rowbeingtested[i] = 0;
      temp_hiddencode[i] = 0;
    }
  }
  for (var i = 0; i < 4; i++) {
    if (temp_rowbeingtested[i] != 0) {
      for (j = 0; j < 4; j++) {
        if (temp_rowbeingtested[i] == temp_hiddencode[j] && temp_hiddencode[j] != 0) {
          num_correct_color++;
          temp_hiddencode[j] = 0;
        }
      }
    }
  }

  feedback_array[activeRow][0] = num_correct_place;
  feedback_array[activeRow][1] = num_correct_color;
}

// --- DRAWING FUNCTIONS ---
function drawColorSelector() {
  for (var i = 0; i < 6; i++) {
    select_ctx.fillStyle = color_rect_coords[i].boxcolor;
    select_ctx.fill(color_rect_coords[i].rectangle);
  };
}

function drawGamePegs() {
  for (var c = 0; c < 8; c++) {
    for (var r = 0; r < 4; r++) {
      game_ctx.fillStyle = gamepegs[c][r].color;
      game_ctx.fill(gamepegs[c][r].rectangle);
    }
  }
}

function drawActiveColor() {
  game_ctx.beginPath();
  game_ctx.rect(60, 620, 230, 25);
  game_ctx.fillStyle = select_color;
  game_ctx.fill();
  game_ctx.closePath();
}

function drawActiveBox() {
  game_ctx.beginPath();
  game_ctx.strokeRect(55, 95+(60*activeRow), 240, 60);
}

function drawAnswerFrame() {
  game_ctx.beginPath();
  game_ctx.fillStyle = 'white';
  game_ctx.fillRect(50, 20, 250, 70);
}

function drawAnswer() {
  for (var i = 0; i < 4; i++) {
    game_ctx.beginPath();
    game_ctx.rect(55 + 60*i, 30, 50, 50);
    game_ctx.fillStyle = solution[i];
    game_ctx.fill();
    game_ctx.closePath();
  }
}

function drawFeedback() {
  for (var i = 0; i < 8; i++) {
    game_ctx.fillStyle = 'black';
    game_ctx.font = "12 px Arial";
    game_ctx.fillText("[" + feedback_array[i] + "]", 312.5, 130+(60*i));
    }
}


// --- MAIN DRAWING FUNCTION ---
function drawGameBoard() {

  game_ctx.clearRect(0,0, game.width, game.height);
  drawGamePegs();
  drawActiveColor();
  drawAnswerFrame();
  drawActiveBox();


  game_ctx.fillStyle = 'black';
  game_ctx.font = "12px Arial";
  game_ctx.textAlign = "center";
  drawFeedback();

  if (show_answer == true) {
    drawAnswer();
    var canvas_x = game.width / 2;
    game_ctx.fillStyle = "black";
    game_ctx.textAlign = "center";
    game_ctx.font = "48px Arial";
    game_ctx.fillText(win_or_lose_message, canvas_x, 620);
  }
}

drawColorSelector();
setInterval(drawGameBoard, 10);
// -----------------------------
