// Tutorial code from Dr. Palmer's YouTube video : https://www.youtube.com/watch?v=grlg4I-Bt24
var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(400, 400, {backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

var background = PIXI.Sprite.fromImage("./assets/img/wood_BG.jpg");

var stage = new PIXI.Container();

var game = new PIXI.Container();
var tilebag = [];

var credits = new PIXI.Container();

var instructions = new PIXI.Container();

var winScreen = new PIXI.Container();

stage.addChild(background);

//Create Title Screen
var title = new PIXI.Container();
var title1;
var title5;
var titlet;
var titlei;
var titlel;
var titlee;
PIXI.loader
  .add('./assets/img/title.json')
  .load(titleLoader)
title.interactive = true;
title.on('mousedown', startMenu);
stage.addChild(title);

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
}


function startGame(e){
  title.removeChildren();
  stage.removeChild(title);
  stage.addChild(game);

  PIXI.loader
    .add('./assets/img/tiles.json')
    .load(ready);
  }



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
  //shuffleBoard();
}

function shuffleBoard(){
  var currentIndex = tilebag.length - 1;
  var randomIndex;
  var new_x;
  var new_y;

  while(0 <= currentIndex){
    randomIndex = Math.floor(Math.random() * currentIndex);
    setTimeout(shuffleHelp(currentIndex, randomIndex), 1000);
    currentIndex--;
  }
}

function shuffleHelp(currentIndex, randomIndex){
  new_x = tilebag[currentIndex].position.x;
  new_y = tilebag[currentIndex].position.y;
  createjs.Tween.get(tilebag[currentIndex]).to({x: tilebag[randomIndex].position.x, y: tilebag[randomIndex].position.y}, 1000);
  createjs.Tween.get(tilebag[randomIndex]).to({x: new_x, y: new_y}, 500);
}

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
    console.log("Win!");
  }
}

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
      console.log("Not a good move");
      break;
  }
  createjs.Tween.get(t.position).to({x: new_x, y: new_y}, 100);
}

function tileHandler(e){
  //var target = event.getCurrentTarget();
  var move = checkFree(this);
  tileMove(this, move);
  checkWin();
  //console.log(this.x);
}

function startMenu(e){
  createjs.Tween.get(title1.position).to({x: 200, y: 100}, 100);
  createjs.Tween.get(title5.position).to({x: 300, y: 100}, 100);
  createjs.Tween.get(titlet.position).to({x: 100, y: 200}, 100);
  createjs.Tween.get(titlei.position).to({x: 100, y: 400}, 100);
  createjs.Tween.get(titlel.position).to({x: 400, y: 400}, 100);
  createjs.Tween.get(titlee.position).to({x: 400, y: 200}, 100);
  var playButton = PIXI.Sprite.fromImage("./assets/img/playButton.png");
  playButton.anchor.x = 0.5;
  playButton.anchor.y = 0;
  playButton.position.x = 200;
  playButton.position.y = 125;
  playButton.interactive = true;
  playButton.on('mousedown', startGame);
  title.addChild(playButton);
  var instructions = PIXI.Sprite.fromImage("./assets/img/instructions.png");
  instructions.anchor.x = 0.5;
  instructions.anchor.y = 0;
  instructions.position.x = 200;
  instructions.position.y = 200;
  title.addChild(instructions);
  var credits = PIXI.Sprite.fromImage("./assets/img/credits.png");
  credits.anchor.x = 0.5;
  credits.anchor.y = 0;
  credits.position.x = 200;
  credits.position.y = 275;
  title.addChild(credits);
}


function animate(){
  requestAnimationFrame(animate);
  renderer.render(stage);
}
animate();
