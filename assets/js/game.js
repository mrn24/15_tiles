// Tutorial code from Dr. Palmer's YouTube video : https://www.youtube.com/watch?v=grlg4I-Bt24
var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(400, 400, {backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

var background = PIXI.Sprite.fromImage("./assets/img/wood_BG.jpg");

var stage = new PIXI.Container();

stage.addChild(background);

PIXI.loader
  .add('./assets/img/tiles.json')
  .load(ready);

function ready(){
  var tilebag = [];
  var posx = 100;
  var posy = 100;
  for (var i=1; i<=15; i++){
    var tile = new PIXI.extras.TilingSprite(PIXI.Texture.fromFrame('tile' + i + '.png'), 100, 100);
    tile.anchor.x = 1;
    tile.anchor.y = 1;
    tilebag.push(tile);
    tile.position.x = posx;
    tile.position.y = posy;
    stage.addChild(tile);
    if(posx == 400){
      posx = 100;
      posy += 100;
    }
    else{
      posx += 100;
    }
  }
}

function animate(){
  requestAnimationFrame(animate);
  renderer.render(stage);
}
animate();
