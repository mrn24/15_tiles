
var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(400, 400, {backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);
//That nice wood finish
var background = PIXI.Sprite.fromImage("./assets/img/wood_BG.jpg");
//Make stage
var stage = new PIXI.Container();
stage.addChild(background);

//Load/store all sound elements.
var blip1;
var blip2;
var blip3;
var blip4;
var blip5;
var badMoveSound;
var winTheme;
var blipCount = 1;
var startSound;
PIXI.loader
  .add("./assets/sound/Powerup5.mp3")
  .add("./assets/sound/Powerup3.mp3")
  .add("./assets/sound/Explosion5.mp3")
  .add("./assets/sound/Blip_Select.mp3")
  .add("./assets/sound/Blip_Select2.mp3")
  .add("./assets/sound/Blip_Select3.mp3")
  .add("./assets/sound/Blip_Select4.mp3")
  .add("./assets/sound/Blip_Select5.mp3")
  .load(soundLoader);
function soundLoader(){
  blip1 = PIXI.audioManager.getAudio("./assets/sound/Blip_Select.mp3");
  blip2 = PIXI.audioManager.getAudio("./assets/sound/Blip_Select2.mp3");
  blip3 = PIXI.audioManager.getAudio("./assets/sound/Blip_Select3.mp3");
  blip4 = PIXI.audioManager.getAudio("./assets/sound/Blip_Select4.mp3");
  blip5 = PIXI.audioManager.getAudio("./assets/sound/Blip_Select5.mp3");
  startSound = PIXI.audioManager.getAudio("./assets/sound/Powerup5.mp3");
  winTheme = PIXI.audioManager.getAudio("./assets/sound/Powerup3.mp3");
  badMoveSound = PIXI.audioManager.getAudio("./assets/sound/Explosion5.mp3");
}

//Game screen with globals
var game = new PIXI.Container();
var tilebag = [];
var isRunning = false;
var isLoaded = false;
var validMove = true;

//credits screen with globals
var credits = new PIXI.Container();
var credit1;
var credit2;
var credit3;
var credit4;
var credit5;

//Instruction screen and globals
var instructions = new PIXI.Container();
var struct1;
var struct2;
var struct3;
var struct4;
var struct5;

//Win screen
var winScreen = new PIXI.Container();

//Create Title Screen and globals
var title = new PIXI.Container();
var title1;
var title5;
var titlet;
var titlei;
var titlel;
var titlee;
var titleText;

//Load title sheet
PIXI.loader
  .add('./assets/img/title.json')
  .load(titleLoader)
title.interactive = true;
title.on('mousedown', startMenu);

//Load up title screen
function titleLoader(){
  title1 = new PIXI.extras.TilingSprite(PIXI.Texture.fromFrame('title1.png'), 100, 100);
  title1.anchor.x = 1;
  title1.anchor.y = 1;
  title1.position.x = 200;
  title1.position.y = 150;
  title.addChild(title1);
  title5 = new PIXI.extras.TilingSprite(PIXI.Texture.fromFrame('title5.png'), 100, 100);
  title5.anchor.x = 1;
  title5.anchor.y = 1;
  title5.position.x = 300;
  title5.position.y = 150;
  title.addChild(title5);
  titlet = new PIXI.extras.TilingSprite(PIXI.Texture.fromFrame('titlet.png'), 100, 100);
  titlet.anchor.x = 1;
  titlet.anchor.y = 1;
  titlet.position.x = 100;
  titlet.position.y = 250;
  title.addChild(titlet);
  titlei = new PIXI.extras.TilingSprite(PIXI.Texture.fromFrame('titlei.png'), 100, 100);
  titlei.anchor.x = 1;
  titlei.anchor.y = 1;
  titlei.position.x = 200;
  titlei.position.y = 250;
  title.addChild(titlei);
  titlel = new PIXI.extras.TilingSprite(PIXI.Texture.fromFrame('titlel.png'), 100, 100);
  titlel.anchor.x = 1;
  titlel.anchor.y = 1;
  titlel.position.x = 300;
  titlel.position.y = 250;
  title.addChild(titlel);
  titlee = new PIXI.extras.TilingSprite(PIXI.Texture.fromFrame('titlee.png'), 100, 100);
  titlee.anchor.x = 1;
  titlee.anchor.y = 1;
  titlee.position.x = 400;
  titlee.position.y = 250;
  title.addChild(titlee);
  titleText = new PIXI.Text("Click to Continue!", {font: "25px Arial", fill:"yellow"});
  titleText.anchor.x = 0.5;
  titleText.anchor.y = 0;
  titleText.position.x = 200;
  titleText.position.y = 300;
  title.addChild(titleText);
  stage.addChild(title);
}

//Move from title to game
function startGame(e){
  title.removeChildren();
  stage.removeChild(title);
  stage.addChild(game);

  //load game spritesheet, for'd to catch reloads.
  if(isLoaded){
    ready();
  }
  else{
    isLoaded = true;
    PIXI.loader
      .add('./assets/img/tiles.json')
      .load(ready);
  }
}

//load tiles, set them on the board and put them in tilebag
function ready(){
  var posx = 100;
  var posy = 100;
  for (var i=1; i<=15; i++){
    var tile = new PIXI.extras.TilingSprite(PIXI.Texture.fromFrame('tile' + i + '.png'), 100, 100);
    tile.anchor.x = 1;
    tile.anchor.y = 1;
    tile.position.x = posx;
    tile.position.y = posy;
    tile.interactive = true;
    tile.on('mousedown', tileHandler);
    tilebag.push(tile);
    game.addChild(tile);
    if (posx == 400){
      posx = 100;
      posy += 100;
    }
    else{
      posx += 100;
    }
  }
  shuffleBoard();
  isRunning = true;
}

//Function to shuffle the pieces
function shuffleBoard(){
  var currentIndex = tilebag.length - 1;
  var randomIndex;
  var new_x;
  var new_y;

  while(0 <= currentIndex){
    randomIndex = Math.floor(Math.random() * currentIndex);
    new_x = tilebag[currentIndex].position.x;
    new_y = tilebag[currentIndex].position.y;
    tilebag[currentIndex].position.x = tilebag[randomIndex].position.x;
    tilebag[currentIndex].position.y = tilebag[randomIndex].position.y;
    tilebag[randomIndex].position.x = new_x;
    tilebag[randomIndex].position.y = new_y;
    currentIndex--;

    //Tween didn't work with this. Made the tiles stack
    //createjs.Tween.get(tilebag[currentIndex]).to({x: tilebag[randomIndex].position.x, y: tilebag[randomIndex].position.y}, 1000);
    //createjs.Tween.get(tilebag[randomIndex]).to({x: new_x, y: new_y}, 500);
  }
}

//Check for the tiles in the right order
function checkWin(){
  var posx = 100;
  var posy = 100;
  var isWin = true;
  for (i=0; i<15; i++){
    if(tilebag[i].position.x != posx || tilebag[i].position.y != posy){
      isWin = false;
    }
    if (posx == 400){
      posx = 100;
      posy += 100;
    }
    else{
      posx += 100;
    }
  }
  if(isWin){
    isRunning = false;
    winScreenMaker();
  }
}

//Check for free space adjacent to targeted tile and returns direction.
function checkFree(target){
  var freeNorth = true;
  var freeSouth = true;
  var freeEast = true;
  var freeWest = true;
  for (var i = 0; i<15; i++){
    if(tilebag[i].position.x == target.position.x && tilebag[i].position.y == (target.position.y - 100)){
      freeNorth = false;
    }
    if(tilebag[i].position.x == target.position.x && tilebag[i].position.y == (target.position.y + 100)){
      freeSouth = false;
    }
    if(tilebag[i].position.x == (target.position.x + 100) && tilebag[i].position.y == target.position.y){
      freeEast = false;
    }
    if(tilebag[i].position.x == (target.position.x - 100) && tilebag[i].position.y == target.position.y){
      freeWest = false;
    }
  }
  if(target.position.y == 100){
    freeNorth = false;
  }
  if(target.position.y == 400){
    freeSouth = false;
  }
  if(target.position.x == 400){
    freeEast = false;
  }
  if(target.position.x == 100){
    freeWest = false;
  }
  if(freeNorth){
    return 1;
  }
  else if (freeEast) {
    return 2;
  }
  else if (freeSouth) {
    return 3;
  }
  else if (freeWest) {
    return 4;
  }
  else{
    return 0;
  }
}

//Take a tile and a direction, tween it to the right direction.
//cycle through some blips for sound FX
function tileMove(t, m){
  switch(m){
    case 1:
      var new_x = t.position.x;
      var new_y = t.position.y - 100;
      break;
    case 2:
      var new_x = t.position.x + 100;
      var new_y = t.position.y;
      break;
    case 3:
      var new_x = t.position.x;
      var new_y = t.position.y + 100;
      break;
    case 4:
      var new_x = t.position.x - 100;
      var new_y = t.position.y;
      break;
    case 0:
      var new_x = t.position.x;
      var new_y = t.position.y;
      validMove = false;
      badMoveSound.play();
      break;
  }
  createjs.Tween.get(t.position).to({x: new_x, y: new_y}, 100);
  if (validMove){
    switch(blipCount){
      case 1:
        blip1.play();
        blipCount++;
        break;
      case 2:
        blip2.play();
        blipCount++;
        break;
      case 3:
        blip3.play();
        blipCount++;
        break;
      case 4:
        blip4.play();
        blipCount++;
        break;
      case 5:
        blip5.play();
        blipCount=1;
        break;
      }
    }
    else{
      validMove = true;
    }
}

//Handles clicks, sends to checkfree, then move functions.
function tileHandler(e){
  var move = checkFree(this);
  tileMove(this, move);
}

//Changes the title screen to the start menu.
//Tween the tiles around and make the menu buttons.
//Play cool sound. Get rid of text.
function startMenu(e){
  startSound.play();
  title.removeChild(titleText);
  createjs.Tween.get(title1.position).to({x: 200, y: 100}, 400);
  createjs.Tween.get(title5.position).to({x: 300, y: 100}, 400);
  createjs.Tween.get(titlet.position).to({x: 100, y: 200}, 400);
  createjs.Tween.get(titlei.position).to({x: 400, y: 200}, 400);
  createjs.Tween.get(titlel.position).to({x: 100, y: 400}, 400);
  createjs.Tween.get(titlee.position).to({x: 400, y: 400}, 400);
  var playButton = PIXI.Sprite.fromImage("./assets/img/playButton.png");
  playButton.anchor.x = 0.5;
  playButton.anchor.y = 0;
  playButton.position.x = 200;
  playButton.position.y = 125;
  playButton.interactive = true;
  playButton.on('mousedown', startGame);
  title.addChild(playButton);
  var instructionsB = PIXI.Sprite.fromImage("./assets/img/instructions.png");
  instructionsB.anchor.x = 0.5;
  instructionsB.anchor.y = 0;
  instructionsB.position.x = 200;
  instructionsB.position.y = 200;
  instructionsB.interactive = true;
  instructionsB.on('mousedown', startInstructions);
  title.addChild(instructionsB);
  var credits = PIXI.Sprite.fromImage("./assets/img/credits.png");
  credits.anchor.x = 0.5;
  credits.anchor.y = 0;
  credits.position.x = 200;
  credits.position.y = 275;
  credits.interactive = true;
  credits.on('mousedown', startCredits);
  title.addChild(credits);
}

//Load and stage the instructions screen.
function startInstructions(){
  struct1 = new PIXI.Text("Instructions:", {font: "25px Arial", fill:"yellow"});
  struct1.anchor.x = .5;
  struct1.anchor.y = 1;
  struct1.position.x = 200;
  struct1.position.y = 50;
  instructions.addChild(struct1);
  struct2 = new PIXI.Text("Click on a tile to move it to an adjacent empty space.", {font: "16px Arial", fill:"white"});
  struct2.anchor.x = .5;
  struct2.anchor.y = 1;
  struct2.position.x = 200;
  struct2.position.y = 100;
  instructions.addChild(struct2);
  struct3 = new PIXI.Text("Get all tiles in order from 1 - 15.", {font: "16px Arial", fill:"white"});
  struct3.anchor.x = .5;
  struct3.anchor.y = 1;
  struct3.position.x = 200;
  struct3.position.y = 150;
  instructions.addChild(struct3);
  struct5 = new PIXI.Text("Good Luck!", {font: "16px Arial", fill:"white"});
  struct5.anchor.x = .5;
  struct5.anchor.y = 1;
  struct5.position.x = 200;
  struct5.position.y = 200;
  instructions.addChild(struct5);
  struct4 = new PIXI.Text("Back to Menu", {font: "25px Arial", fill:"Blue"});
  struct4.anchor.x = .5;
  struct4.anchor.y = 1;
  struct4.position.x = 200;
  struct4.position.y = 250;
  struct4.interactive = true;
  struct4.on('mousedown', menuFromStruct);
  instructions.addChild(struct4);
  title.removeChildren();
  stage.removeChild(title);
  stage.addChild(instructions);
}

//Go back to the title screen from instructions screen
function menuFromStruct(){
  instructions.removeChildren();
  stage.removeChild(instructions);
  titleLoader();
}

//Make the win Screen. Bring Hoegarth back!
//Play more cool sounds!
function winScreenMaker(){
  var playAgain = PIXI.Sprite.fromImage("./assets/img/winRedo.png");
  playAgain.anchor.x = 0.5;
  playAgain.anchor.y = 1;
  playAgain.position.x = 200;
  playAgain.position.y = 400;
  playAgain.interactive = true;
  playAgain.on('mousedown', startGameAgain);
  winScreen.addChild(playAgain);
  var winScreenText = new PIXI.Text("You won! Congratulations!", {font: "25px Arial", fill:"yellow"})
  winScreenText.anchor.x = 0.5;
  winScreenText.anchor.y = 0;
  winScreenText.position.x = 200;
  winScreenText.position.y = 25;
  winScreen.addChild(winScreenText);
  var hoegarth = PIXI.Sprite.fromImage("./assets/img/hoegarth.png");
  hoegarth.anchor.x = 0.5;
  hoegarth.anchor.y = 1;
  hoegarth.position.x = 200;
  hoegarth.position.y = 275;
  winScreen.addChild(hoegarth);
  game.removeChildren();
  stage.removeChild(game);
  stage.addChild(winScreen);
  winTheme.play();
}

//Load title from win screen
function startGameAgain(e){
  winScreen.removeChildren();
  stage.removeChild(winScreen);
  titleLoader();
}

//Load credits page
function startCredits(e){
  credit1 = new PIXI.Text("att", {font: "25px Arial", fill:"yellow"});
  credit1.anchor.x = 0;
  credit1.anchor.y = 1;
  credit1.position.x = 150;
  credit1.position.y = 50;
  credits.addChild(credit1);
  credit1a = new PIXI.Text("ielsen", {font: "25px Arial", fill:"yellow"});
  credit1.anchor.x = 0;
  credit1.anchor.y = 1;
  credit1.position.x = 200;
  credit1.position.y = 50;
  credits.addChild(credit1);
  credit2 = new PIXI.Text("CS 413", {font: "25px Arial", fill:"yellow"});
  credit2.anchor.x = 0.5;
  credit2.anchor.y = 1;
  credit2.position.x = 200;
  credit2.position.y = 100;
  credits.addChild(credit2);
  credit3 = new PIXI.Text("Project 2 - Puzzles", {font: "25px Arial", fill:"yellow"});
  credit3.anchor.x = .5;
  credit3.anchor.y = 1;
  credit3.position.x = 200;
  credit3.position.y = 150;
  credits.addChild(credit3);
  credit4 = new PIXI.Text("15 Tile", {font: "25px Arial", fill:"yellow"});
  credit4.anchor.x = .5;
  credit4.anchor.y = 1;
  credit4.position.x = 200;
  credit4.position.y = 200;
  credits.addChild(credit4);
  credit5 = new PIXI.Text("Back to Menu", {font: "25px Arial", fill:"Blue"});
  credit5.anchor.x = .5;
  credit5.anchor.y = 1;
  credit5.position.x = 200;
  credit5.position.y = 250;
  credit5.interactive = true;
  credit5.on('mousedown', menuFromCredits);
  credits.addChild(credit5);
  title.removeChildren();
  stage.removeChild(title);
  stage.addChild(credits);
}

//Back to title from credits
function menuFromCredits(){
  credits.removeChildren();
  stage.removeChild(credits);
  titleLoader();
}

//Keep things running and check for win conditions
function animate(){
  requestAnimationFrame(animate);
  if(isRunning){
    checkWin();
  }
  renderer.render(stage);
}
animate();
