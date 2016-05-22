// Tutorial code from Dr. Palmer's YouTube video : https://www.youtube.com/watch?v=grlg4I-Bt24
var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(400, 400, {backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

var background = PIXI.Sprite.fromImage("./assets/img/wood_BG.jpg");

var stage = new PIXI.Container();
var title = new PIXI.Container();
var game = new PIXI.Container();
var credits = new PIXI.Container();
var instructions = new PIXI.Container();

stage.addChild(background);
stage.addChild(title);

PIXI.loader
  .add('./assets/img/tiles.json')
  .load(ready);

var tilebag = [];

function ready(){
  var posx = 100;
  var posy = 100;
  for (var i=1; i<=15; i++){
    var tile = new PIXI.extras.TilingSprite(PIXI.Texture.fromFrame('tile' + i + '.png'), 100, 100);
    tile.anchor.x = 1;
    tile.anchor.y = 1;
    tile.interactive = true;
    tile.on('mousedown', tileHandler);
    tilebag.push(tile);
    tile.position.x = posx;
    tile.position.y = posy;
    game.addChild(tile);
    if(posx == 400){
      posx = 100;
      posy += 100;
    }
    else{
      posx += 100;
    }
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
  createjs.Tween.get(target.position).to({x: new_x, y: new_y}, 100);
}

function tileHandler(e){
  //var target = event.getCurrentTarget();
  var move = checkFree(this);
  tileMove(this, move);
  //console.log(this.x);
}



function animate(){
  requestAnimationFrame(animate);
  renderer.render(stage);
}
animate();
