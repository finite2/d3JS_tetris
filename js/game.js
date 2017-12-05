

var newPlayer = function(id, difficulty = 'normal', gridID = null, hPos = 4){
  this.id = id
  this.gridID = gridID == null? id: gridID;
  this.width = game.width;
  this.height = game.height;
  this.hMin = 0;
  this.hMax = game.width-1;
  this.scale = game.scale;
  this.hPos = hPos;
  this.grid = [];
  this.score = 0;
  this.vsScore = 0;
  this.rowsCleared = 0;
  if(difficulty === 'normal'){
    this.blockMin = 1;
    this.blockMax = 7;
    this.speedup = [1000, 900, 800, 700, 600, 500, 450, 400, 350, 325, 300, 280, 265, 250, 240, 230, 220, 220, 210, 200, 190, 180, 170, 160, 150]; // 
  } else if(difficulty === 'hard'){ // there is code to make 8-22 25% of the time and 1-7 75% of the time
    this.blockMin = 1;
    this.blockMax = 22;
    this.speedup = [800, 700, 600, 500, 400, 350, 300, 275, 250, 225, 200, 190, 180, 170, 160, 150, 140, 130, 120, 110, 100,95, 90, 85, 80, 75, 70, 65, 60, 55, 50];
  } else if(difficulty === 'intense'){
    this.blockMin = 1;
    this.blockMax = 22;
    this.speedup = [700, 500, 400, 350, 300, 275, 250, 225, 200, 190, 180, 170, 160, 150, 140, 130, 120, 110, 100,95, 90, 85, 80, 75, 70, 65, 60, 55, 50];
  } else if(difficulty === 'extreme'){
    this.blockMin = 1;
    this.blockMax = 26;
    this.speedup = [400, 35, 300, 275, 250, 225, 200, 180, 160, 140, 120, 100,95, 90, 85, 80, 75, 70, 65, 60,55,50, 48, 46, 44, 42, 40, 38, 36, 34, 32, 30];
  }
  this.nextBlock = [];
  this.active = true;
  this.difficulty = difficulty;
  this.speed = this.speedup[0];
} 

var newGame = function(){
  this.sharedGrid = false;
  this.speed = 1000;
  this.width = 10;
  this.height = 20;
  this.scale = 30;
  this.highScore = 0;
  this.colors = ['black', 'green', 'blue', 'red', 'brown', 'purple', 'Yellow', 'orange', 'magenta', 'teal', 'sienna', 'maroon', 'slategray', 'khaki', 'mediumpurple', 'blueviolet', 'darkgreen', 'darkcyan', 'dodgerblue', 'chocolate', 'dimgray', 'yellowgreen', 'orchid', 'firebrick', 'moccasin', 'palegreen', 'aquamarine']
}



function createArray(row, col, startValue) {
  'use strict';
  var i, j, arr = new Array(row);
	for (i = 0; i < row; i += 1) {
		arr[i] = new Array(col);
	}
  
  for (i = 0; i < row; i += 1) {
    for (j = 0; j < col; j += 1) {
      arr[i][j] = startValue;
    }
  }
	return arr;
}

// standard 4 blocks 1-7
// standard 5 blocks 8-22
// hard blocks 23-26
var block = function(player, type){
  this.type = type;
  this.rotation = Math.floor(Math.random() * 4);
  this.color = game.colors[type]
  if(type == 1){
    this.relPos = [
      [{x:0, y:-1},{x:0, y:0},{x:0, y:1},{x:0, y:2}],
      [{x:-1, y:0},{x:0, y:0},{x:1, y:0},{x:2, y:0}],
      [{x:0, y:0},{x:0, y:1},{x:0, y:2},{x:0, y:3}],
      [{x:-1, y:0},{x:0, y:0},{x:1, y:0},{x:2, y:0}]
    ]
  } else if(type == 2){
    this.relPos = [
      [{x:0, y:0},{x:0, y:1},{x:1, y:0},{x:1, y:1}],
      [{x:0, y:0},{x:1, y:0},{x:0, y:1},{x:1, y:1}],
      [{x:0, y:0},{x:0, y:1},{x:1, y:0},{x:1, y:1}],
      [{x:0, y:0},{x:1, y:0},{x:0, y:1},{x:1, y:1}]
    ]
  } else if(type == 3){
    this.relPos = [
      [{x:0, y:0},{x:-1, y:0},{x:0, y:1},{x:1, y:1}],
      [{x:0, y:2},{x:0, y:1},{x:1, y:1},{x:1, y:0}],
      [{x:0, y:0},{x:-1, y:0},{x:0, y:1},{x:1, y:1}],
      [{x:0, y:2},{x:0, y:1},{x:1, y:1},{x:1, y:0}]
    ]
  } else if(type == 4){
    this.relPos = [
      [{x:0, y:0},{x:-1, y:1},{x:0, y:1},{x:1, y:0}],
      [{x:0, y:2},{x:0, y:1},{x:-1, y:1},{x:-1, y:0}],
      [{x:0, y:0},{x:-1, y:1},{x:0, y:1},{x:1, y:0}],
      [{x:0, y:2},{x:0, y:1},{x:-1, y:1},{x:-1, y:0}]
    ]
  } else if(type == 5){
    this.relPos = [
      [{x:0, y:0},{x:0, y:1},{x:0, y:2},{x:1, y:0}],
      [{x:-1, y:0},{x:-1, y:1},{x:0, y:1},{x:1, y:1}],
      [{x:0, y:2},{x:1, y:2},{x:1, y:1},{x:1, y:0}],
      [{x:-1, y:0},{x:0, y:0},{x:1, y:0},{x:1, y:1}]
    ]
  } else if(type == 6){
    this.relPos = [
      [{x:0, y:0},{x:1, y:0},{x:1, y:1},{x:1, y:2}],
      [{x:-1, y:0},{x:-1, y:1},{x:0, y:0},{x:1, y:0}],
      [{x:0, y:0},{x:0, y:1},{x:0, y:2},{x:1, y:2}],
      [{x:-1, y:1},{x:0, y:1},{x:1, y:1},{x:1, y:0}]
    ]
  } else if(type == 7){
    this.relPos = [
      [{x:-1, y:0},{x:0, y:0},{x:1, y:0},{x:0, y:1}],
      [{x:0, y:0},{x:0, y:1},{x:0, y:2},{x:1, y:1}],
      [{x:-1, y:1},{x:0, y:1},{x:1, y:1},{x:0, y:0}],
      [{x:0, y:0},{x:0, y:1},{x:0, y:2},{x:-1, y:1}]
    ]
    // 5 piece blocks
  } else if(type == 8){ // u
    this.relPos = [
      [{x:-1, y:1},{x:-1, y:0},{x:0, y:0},{x:1, y:0},{x:1, y:1}],
      [{x:1, y:1},{x:0, y:1},{x:0, y:0},{x:0, y:-1},{x:1, y:-1}],
      [{x:1, y:-1},{x:1, y:0},{x:0, y:0},{x:-1, y:0},{x:-1, y:-1}],
      [{x:-1, y:-1},{x:0, y:-1},{x:0, y:0},{x:0, y:1},{x:-1, y:1}]
    ]
  } else if(type == 9){ // cross
    this.relPos = [
      [{x:-1, y:0},{x:0, y:0},{x:1, y:0},{x:0, y:-1},{x:0, y:1}],
      [{x:-1, y:0},{x:0, y:0},{x:1, y:0},{x:0, y:-1},{x:0, y:1}],
      [{x:-1, y:0},{x:0, y:0},{x:1, y:0},{x:0, y:-1},{x:0, y:1}],
      [{x:-1, y:0},{x:0, y:0},{x:1, y:0},{x:0, y:-1},{x:0, y:1}]
    ]
  } else if(type == 10){ // L
    this.relPos = [
      [{x:-1, y:-1},{x:-1, y:0},{x:-1, y:1},{x:0, y:1},{x:1, y:1}],
      [{x:-1, y:1},{x:0, y:1},{x:1, y:1},{x:1, y:0},{x:1, y:-1}],
      [{x:1, y:1},{x:1, y:0},{x:1, y:-1},{x:0, y:-1},{x:-1, y:-1}],
      [{x:1, y:-1},{x:0, y:-1},{x:-1, y:-1},{x:-1, y:0},{x:-1, y:1}]
    ]
    } else if(type == 11){ // ofset cross 1
    this.relPos = [
      [{x:0, y:0},{x:0, y:1},{x:1, y:-1},{x:0, y:-1},{x:-1, y:0}],
      [{x:0, y:0},{x:0, y:1},{x:1, y:0},{x:-1, y:-1},{x:-1, y:0}],
      [{x:0, y:0},{x:0, y:1},{x:0, y:-1},{x:-1, y:1},{x:1, y:0}],
      [{x:0, y:0},{x:-1, y:0},{x:1, y:1},{x:1, y:0},{x:0, y:-1}]
    ]
  } else if(type == 12){ // ofset cross 2
    this.relPos = [
      [{x:0, y:0},{x:0, y:1},{x:1, y:1},{x:0, y:-1},{x:-1, y:0}],
      [{x:0, y:0},{x:0, y:1},{x:1, y:0},{x:1, y:-1},{x:-1, y:0}],
      [{x:0, y:0},{x:0, y:1},{x:0, y:-1},{x:-1, y:-1},{x:1, y:0}],
      [{x:0, y:0},{x:-1, y:0},{x:-1, y:1},{x:1, y:0},{x:0, y:-1}]
    ]
  } else if(type == 13){ // T
    this.relPos = [
      [{x:-1, y:1},{x:0, y:1},{x:1, y:1},{x:0, y:0},{x:0, y:-1}],
      [{x:1, y:1},{x:1, y:0},{x:1, y:-1},{x:0, y:0},{x:-1, y:0}],
      [{x:1, y:-1},{x:0, y:-1},{x:-1, y:-1},{x:0, y:0},{x:0, y:1}],
      [{x:-1, y:-1},{x:-1, y:0},{x:-1, y:1},{x:0, y:0},{x:1, y:0}]
    ]
  } else if(type == 14){ // z
    this.relPos = [
      [{x:-1, y:1},{x:0, y:1},{x:0, y:0},{x:0, y:-1},{x:1, y:-1}],
      [{x:1, y:1},{x:1, y:0},{x:0, y:0},{x:-1, y:0},{x:-1, y:-1}],
      [{x:-1, y:1},{x:0, y:1},{x:0, y:0},{x:0, y:-1},{x:1, y:-1}],
      [{x:1, y:1},{x:1, y:0},{x:0, y:0},{x:-1, y:0},{x:-1, y:-1}]
    ]
  } else if(type == 15){ // s
    this.relPos = [
      [{x:1, y:1},{x:0, y:1},{x:0, y:0},{x:0, y:-1},{x:-1, y:-1}],
      [{x:-1, y:1},{x:1, y:0},{x:0, y:0},{x:-1, y:0},{x:1, y:-1}],
      [{x:1, y:1},{x:0, y:1},{x:0, y:0},{x:0, y:-1},{x:-1, y:-1}],
      [{x:-1, y:1},{x:1, y:0},{x:0, y:0},{x:-1, y:0},{x:1, y:-1}]
    ]
  } else if(type == 16){ // p
    this.relPos = [
      [{x:-1, y:1},{x:0, y:1},{x:1, y:1},{x:-1, y:0},{x:0, y:0}],
      [{x:1, y:1},{x:1, y:0},{x:1, y:-1},{x:0, y:1},{x:0, y:0}],
      [{x:1, y:-1},{x:0, y:-1},{x:-1, y:-1},{x:1, y:0},{x:0, y:0}],
      [{x:-1, y:-1},{x:-1, y:0},{x:-1, y:1},{x:0, y:-1},{x:0, y:0}]
    ]
  } else if(type == 17){ // q
    this.relPos = [
      [{x:-1, y:1},{x:0, y:1},{x:1, y:1},{x:1, y:0},{x:0, y:0}],
      [{x:1, y:1},{x:1, y:0},{x:1, y:-1},{x:0, y:-1},{x:0, y:0}],
      [{x:1, y:-1},{x:0, y:-1},{x:-1, y:-1},{x:-1, y:0},{x:0, y:0}],
      [{x:-1, y:-1},{x:-1, y:0},{x:-1, y:1},{x:0, y:1},{x:0, y:0}]
    ]
  } else if(type == 18){ // l
    this.relPos = [
      [{x:-1, y:0},{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:2, y:1}],
      [{x:0, y:2},{x:0, y:1},{x:0, y:0},{x:0, y:-1},{x:1, y:-1}],
      [{x:-1, y:0},{x:-1, y:1},{x:0, y:1},{x:1, y:1},{x:2, y:1}],
      [{x:0, y:2},{x:1, y:2},{x:1, y:1},{x:1, y:0},{x:1, y:-1}]
    ]
  } else if(type == 19){ // l backwards
    this.relPos = [
      [{x:-1, y:0},{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:-1, y:1}],
      [{x:0, y:2},{x:0, y:1},{x:0, y:0},{x:0, y:-1},{x:1, y:2}],
      [{x:2, y:0},{x:-1, y:1},{x:0, y:1},{x:1, y:1},{x:2, y:1}],
      [{x:0, y:-1},{x:1, y:2},{x:1, y:1},{x:1, y:0},{x:1, y:-1}]
    ]
  } else if(type == 20){ // long s-
    this.relPos = [
      [{x:-1, y:0},{x:0, y:0},{x:0, y:1},{x:1, y:1},{x:2, y:1}],
      [{x:0, y:2},{x:0, y:1},{x:1, y:1},{x:1, y:0},{x:1, y:-1}],
      [{x:2, y:1},{x:1, y:1},{x:1, y:0},{x:0, y:0},{x:-1, y:0}],
      [{x:1, y:-1},{x:1, y:0},{x:0, y:0},{x:0, y:1},{x:0, y:2}]
    ]
  } else if(type == 21){ // long -s
    this.relPos = [
      [{x:-1, y:1},{x:0, y:1},{x:0, y:0},{x:1, y:0},{x:2, y:0}],
      [{x:1, y:2},{x:1, y:1},{x:0, y:1},{x:0, y:0},{x:0, y:-1}],
      [{x:2, y:0},{x:1, y:0},{x:1, y:1},{x:0, y:1},{x:-1, y:1}],
      [{x:0, y:-1},{x:0, y:0},{x:1, y:0},{x:1, y:1},{x:1, y:2}]
    ]
  } else if(type == 22){ // line
    this.relPos = [
      [{x:-2, y:0},{x:-1, y:0},{x:0, y:0},{x:1, y:0},{x:2, y:0}],
      [{x:0, y:-2},{x:0, y:-1},{x:0, y:0},{x:0, y:1},{x:0, y:2}],
      [{x:-2, y:0},{x:-1, y:0},{x:0, y:0},{x:1, y:0},{x:2, y:0}],
      [{x:0, y:-2},{x:0, y:-1},{x:0, y:0},{x:0, y:1},{x:0, y:2}]
    ]
  } else if(type == 23){ // line
    this.relPos = [
      [{x:0, y:1},{x:1, y:0},{x:0, y:-1},{x:-1, y:0}],
      [{x:0, y:1},{x:1, y:0},{x:0, y:-1},{x:-1, y:0}],
      [{x:0, y:1},{x:1, y:0},{x:0, y:-1},{x:-1, y:0}],
      [{x:0, y:1},{x:1, y:0},{x:0, y:-1},{x:-1, y:0}]
    ]
  } else if(type == 24){ // line
    this.relPos = [
      [{x:0, y:0},{x:1, y:1},{x:1, y:-1},{x:-1, y:-1}],
      [{x:0, y:0},{x:1, y:-1},{x:-1, y:-1},{x:-1, y:1}],
      [{x:0, y:0},{x:-1, y:-1},{x:-1, y:1},{x:1, y:1}],
      [{x:0, y:0},{x:-1, y:1},{x:1, y:1},{x:1, y:-1}]
    ]
  } else if(type == 25){ // line
    this.relPos = [
      [{x:1, y:1},{x:1, y:-1},{x:-1, y:-1},{x:-1, y:1}],
      [{x:1, y:1},{x:1, y:-1},{x:-1, y:-1},{x:-1, y:1}],
      [{x:1, y:1},{x:1, y:-1},{x:-1, y:-1},{x:-1, y:1}],
      [{x:1, y:1},{x:1, y:-1},{x:-1, y:-1},{x:-1, y:1}]
    ]
  } else if(type == 26){ // line
    this.relPos = [
      [{x:-1, y:-1},{x:0, y:0},{x:1, y:1},{x:2, y:2}],
      [{x:-1, y:2},{x:0, y:1},{x:1, y:0},{x:2, y:-1}],
      [{x:-1, y:-1},{x:0, y:0},{x:1, y:1},{x:2, y:2}],
      [{x:-1, y:2},{x:0, y:1},{x:1, y:0},{x:2, y:-1}]
    ]
  }
  this.lastDir = '';
  this.vPos = player.grid.length;
  this.hPos = player.hPos;

}


function reset(player) {
  
  player.score = 0
  player.rowsCleared = 0
  
  player.grid = createArray(game.height, game.width, 0);
  player.rowRecord = new Array(game.height);
  for(i = 0; i < player.grid.length; i++) {
      player.rowRecord[i] = 0
  }

  var playerUI = d3.select('#blockArea' + player.gridID);
  if(player.id === player.gridID){
    playerUI.selectAll("*").remove();

    var svg = playerUI.append('svg')
      .attr('width', player.width * player.scale)
      .attr('height', player.grid.length * player.scale)
      .attr('background', 'white')

    svg.append('g').append('rect')
      .attr('width', player.width * player.scale)
      .attr('height', player.grid.length * player.scale)
      .attr('fill', 'white')

    svg.append('g')
      .attr('id', "grid" + player.id)
  }
  d3.select('#blockArea' + player.gridID + ' svg').append('g')
    .attr('id', "curBlock" + player.id)
    .append('g')
  
  player.cBlock = game.randomBlock(player, player.blockMin, player.blockMax);
  player.nextBlock = [game.randomBlock(player, player.blockMin, player.blockMax), game.randomBlock(player, player.blockMin, player.blockMax), game.randomBlock(player, player.blockMin, player.blockMax)];
  
  var nextBlock = d3.select('#nextBlock' + player.id).selectAll('div')
    .remove()
  
  paintGrid(player);
  paintNextBlocks(player);
  
}

// JSON.parse(JSON.stringify(levels[nextLevel]));




function paintGrid(p) {
  
  var player = game.sharedGrid ? game.player[0]: p;
  
  d3.select('#blockArea' + player.gridID + ' svg')
    .attr('height', game.scale * player.grid.length)
  
  
  var playerGrid = d3.select('#grid' + player.id).selectAll('g').data(player.grid);
  
  playerGrid
    .attr("transform", function(d,i){ return "translate(0," + player.scale * (player.grid.length - i - 1) + ")"})
  
  var rows = playerGrid.enter()
    .append('g')
      .attr("transform", function(d,i){ return "translate(0," + player.scale * (player.grid.length - i - 1) + ")"})
      .selectAll('rect').data(function(d){return d})

  
  rows.enter()
    .append('rect')
    .attr('x', function(d,i) {
      return player.scale * i
    })
    .attr('y', 0)
    .attr('width', player.scale + 1)
    .attr('height', player.scale + 1)
    .attr('fill', function(d){ return game.colors[d]});
  
  playerGrid.enter()
  
  playerGrid.selectAll('rect').data(function(d){return d})
    .attr('x', function(d,i) {
      return player.scale * i
    })
    .attr('y', 0)
    .attr('width', player.scale + 1)
    .attr('height', player.scale + 1)
    .attr('fill', function(d){ return game.colors[d]});

}

function randomBlock(player, min = 1, max = 7) {
  var type = Math.floor(Math.random() * (max + 1 - min)) + min
  // console.log(type)
  return new block(player, type);
}

function getNextBlock(player) {
  player.cBlock = player.nextBlock[0];
  player.nextBlock.splice(0,1);
  player.nextBlock.push(game.randomBlock(player, player.blockMin, player.blockMax));
  
  paintNextBlocks(player);
}


function paintCBlock(player) {
  
  // console.log('player.id: ' + player.id + ' ' + player.cBlock.color);
  
  var cBlock = d3.select("#curBlock" + player.id).select('g')
    .attr("transform", "translate(" + player.scale * (player.cBlock.hPos) + "," + player.scale * (player.grid.length - player.cBlock.vPos - 1) + ")")
  
  var iBlock = cBlock.selectAll('rect').data(player.cBlock.relPos[player.cBlock.rotation])
    
  iBlock.enter()
    .append('rect')
      .attr('x', function(d) {return player.scale * d.x})
      .attr('y', function(d) {return - player.scale * (d.y)})
      .attr('width', player.scale + 1)
      .attr('height', player.scale + 1)
      .attr('fill', player.cBlock.color)
  
  iBlock
    .attr('x', function(d) {return player.scale * (d.x)})
    .attr('y', function(d) {return - player.scale * (d.y)})
    .attr('fill', player.cBlock.color)
  
  iBlock.exit().remove();
  
}


function paintNextBlocks(player) {
  
  var blocksData = player.nextBlock.slice(0,3);
  // console.log(player.id)
  var blocks = d3.select('#nextBlock' + player.id).selectAll('div').data(blocksData)
  
  blocks.enter()
    .append('div')
    .append('svg')
      .attr('width', player.scale * 5)
      .attr('height', player.scale * 5)
      .append('g')
        .append('rect')
        .attr('width', player.scale * 5)
        .attr('height', player.scale * 5)
        .attr('fill', game.bgColor)
  
  blocks.select('svg').append('g')
    .classed({block: true})
  
  var rects = blocks.select('svg .block').selectAll('rect').data(function(d){ 
    for(j = 0; j < d.relPos[d.rotation].length; j++){
      d.relPos[d.rotation][j].color = d.color
    }
    return d.relPos[d.rotation]
  })
  
  rects.enter()
    .append('rect')
  
  rects.attr('x', function(d) {return player.scale * (2 + d.x)})
      .attr('y', function(d) {return player.scale * (2 - d.y)})
      .attr('width', player.scale)
      .attr('height', player.scale)
      .attr('fill', function(d) {return d.color})
  
  rects.exit().remove()
    
}



function checkCollision(player, hPos, vPos, rotation, forceDown = false) {
  var collision = false;
  var h,v;
  for(var i = 0; i<player.cBlock.relPos[0].length; i++) {
    h = player.cBlock.relPos[rotation][i].x + hPos;
    v = player.cBlock.relPos[rotation][i].y + vPos;
    // console.log(h + ',' + v + ',' + collision);
    if(v < 0 || h < player.hMin || h > player.hMax) {
      collision = true;
    } else if(v < player.grid.length) {
      if(player.grid[v][h] !== 0){
        collision = true;
      }
    }
  }
  
  if(game.sharedGrid & !forceDown){
    collision = checkPlayerCollision(player, hPos, vPos, rotation, collision);
  }
  
  return collision
}

function checkPlayerCollision(player, hPos, vPos, rotation, collision) {
  var h,v,h2,v2;
  var player2 = game.player[2-player.id]
  for(var i = 0; i<player.cBlock.relPos[0].length; i++) {
    h = player.cBlock.relPos[rotation][i].x + hPos;
    v = player.cBlock.relPos[rotation][i].y + vPos;
    for(var j = 0; j < player2.cBlock.relPos[0].length; j++) {
      h2 = player2.cBlock.relPos[player2.cBlock.rotation][j].x + player2.cBlock.hPos;
      v2 = player2.cBlock.relPos[player2.cBlock.rotation][j].y + player2.cBlock.vPos;
      if(h == h2 && v == v2) {
        collision = true;
      }
    }
  }
  return collision;
}

function addToGrid(player) {
  
  var playerGrid = game.player[player.gridID - 1];
  
  
  var h,v;
  for(i = 0; i<player.cBlock.relPos[0].length; i++) {
    h = player.cBlock.relPos[player.cBlock.rotation][i].x + player.cBlock.hPos;
    v = player.cBlock.relPos[player.cBlock.rotation][i].y + player.cBlock.vPos;
    if(v < player.grid.length){ // lose condition near here
      playerGrid.grid[v][h] = player.cBlock.type;
      playerGrid.rowRecord[v] += 1
    }
  }

  if(Math.max.apply(null, playerGrid.rowRecord) === playerGrid.width){
    console.log('Completed row! by player: ' + player.id)
    var completeRows = 0;
    var newRow;
    for(i = player.grid.length - 1 ; i>=0; i--) {
      if(playerGrid.rowRecord[i] === playerGrid.width) {
        
        completeRows ++;
        playerGrid.grid.splice(i,1);
        playerGrid.grid.push(new Array(playerGrid.width).fill(0));
        playerGrid.rowRecord.splice(i,1);
        playerGrid.rowRecord.push(0);
        playerGrid.rowsCleared ++;
      }
    }
    game.completeRow(playerGrid, completeRows)
    
    if(player.id != player.gridID){
      game.updateScore(playerGrid);
    }
    game.updateScore(player);
  }
}



function addBlockGrid(player) {
  
  for(i=0; i<4; i++){
    player.grid[player.cBlock.vPos + player.cBlock.relPos[player.cBlock.rotation][i].y][player.cBlock.hPos + player.cBlock.relPos[player.cBlock.rotation][i].x] = player.cBlock.type
  }
  paintGrid(player);
}

 function updateTimer(player) {
  console.log('Player: ' + player.id + ' speed: ' + player.speed)
  clearInterval(player.timer);
  
  player.timer = setInterval(function(){moveDown(player, true)}, player.speed);
  
}

/***************************************************************************************************************/
/* Movement */
/***************************************************************************************************************/



function moveLeft(player){
  if(player.active){
    if(!checkCollision(player, player.cBlock.hPos - 1, player.cBlock.vPos, player.cBlock.rotation)){
      player.cBlock.hPos --
      paintCBlock(player);
    } else {
      console.log('Left collision, player ' + player.id)
    }
  }
}

function moveRight(player){
  if(player.active){
    if(!checkCollision(player, player.cBlock.hPos + 1, player.cBlock.vPos, player.cBlock.rotation)){
      player.cBlock.hPos ++
      paintCBlock(player);
    } else {
      console.log('Right collision, player ' + player.id)
    }
  }
}

function moveDown(player, forceDown = false){
  if(player.active){
    if(checkCollision(player, player.cBlock.hPos, player.cBlock.vPos - 1, player.cBlock.rotation, forceDown)){
      console.log('Vertical collision  player ' + player.id)
      if(forceDown || checkCollision(player, player.cBlock.hPos, player.cBlock.vPos - 1, player.cBlock.rotation, true)){
        game.addToGrid(player);
        paintGrid(player);
        getNextBlock(player);
        player.score += 10;
        game.updateScore(player);
        paintCBlock(player);
        if(player.rowRecord[player.rowRecord.length - 1] > 0) {
          game.endRun(player);
        }
        return false
      }
    } else {
      player.cBlock.vPos -= 1
      paintCBlock(player);
      if(player.rowRecord[player.rowRecord.length - 1] > 0) {
        game.endRun(player);
        return false
      }
      return true
    } 
  }
}

function moveRotateLeft(player){
  if(player.active){
    if(!checkCollision(player, player.cBlock.hPos, player.cBlock.vPos, (player.cBlock.rotation + 3) % 4)){
      player.cBlock.rotation = (player.cBlock.rotation + 3) % 4
      paintCBlock(player);
    } else if(!checkCollision(player, player.cBlock.hPos - 1, player.cBlock.vPos, (player.cBlock.rotation + 3) % 4)){
      player.cBlock.rotation = (player.cBlock.rotation + 3) % 4
      player.cBlock.hPos --
      paintCBlock(player);
    } else if(!checkCollision(player, player.cBlock.hPos + 1, player.cBlock.vPos, (player.cBlock.rotation + 3) % 4)){
      player.cBlock.rotation = (player.cBlock.rotation + 3) % 4
      player.cBlock.hPos ++
      paintCBlock(player);
    } else if(!checkCollision(player, player.cBlock.hPos - 2, player.cBlock.vPos, (player.cBlock.rotation + 3) % 4)){
      player.cBlock.rotation = (player.cBlock.rotation + 3) % 4
      player.cBlock.hPos -=2
      paintCBlock(player);
    } else if(!checkCollision(player, player.cBlock.hPos + 2, player.cBlock.vPos, (player.cBlock.rotation + 3) % 4)){
      player.cBlock.rotation = (player.cBlock.rotation + 3) % 4
      player.cBlock.hPos +=2
      paintCBlock(player);
    }
  }
}

function moveRotateRight(player){
  if(player.active){
    if(!checkCollision(player, player.cBlock.hPos, player.cBlock.vPos, (player.cBlock.rotation + 1) % 4)) {
      player.cBlock.rotation = (player.cBlock.rotation + 1) % 4
      paintCBlock(player);
    } else if(!checkCollision(player, player.cBlock.hPos - 1, player.cBlock.vPos, (player.cBlock.rotation + 1) % 4)) {
      player.cBlock.rotation = (player.cBlock.rotation + 1) % 4
      player.cBlock.hPos --
      paintCBlock(player);
    } else if(!checkCollision(player, player.cBlock.hPos + 1, player.cBlock.vPos, (player.cBlock.rotation + 1) % 4)) {
      player.cBlock.rotation = (player.cBlock.rotation + 1) % 4
      player.cBlock.hPos ++
      paintCBlock(player);
    } else if(!checkCollision(player, player.cBlock.hPos - 2, player.cBlock.vPos, (player.cBlock.rotation + 1) % 4)) {
      player.cBlock.rotation = (player.cBlock.rotation + 1) % 4
      player.cBlock.hPos -= 2
      paintCBlock(player);
    } else if(!checkCollision(player, player.cBlock.hPos + 2, player.cBlock.vPos, (player.cBlock.rotation + 1) % 4)) {
      player.cBlock.rotation = (player.cBlock.rotation + 1) % 4
      player.cBlock.hPos += 2
      paintCBlock(player);
    }
  }
}

/***************************************************************************************************************/
/***************************************************************************************************************/
/***************************************************************************************************************/

function updateScore(player) {

  if(player.score > highscores.onePlayer[game.difficulty]) {
    highscores.onePlayer[game.difficulty] = player.score;
  }
  d3.select('#rowsCleared'  + player.id).html('Rows cleared: ' + player.rowsCleared);
  d3.select('#score'  + player.id).html('Score: ' + player.score);
  d3.select('#highScore'  + player.id).html('High Score:' + highscores.onePlayer[game.difficulty]);
  
}


function generatePlayerUI(player) {

  var ui = d3.select('#gameArea')
    .append('div')
      .attr('id', 'player' + player.id)
      .classed({'col-xs-6': true, center: true})
  
  ui.append('div')
    .classed({'col-xs-7': true, center: true})
    .append('div')
      .attr('id', 'blockArea' + player.id)
  
  var div = ui.append('div')
    .classed({'col-xs-5': true, center: true})
  
  div.append('div')
    .attr('id', 'nextBlock' + player.id)
  
  div.append('h3')
    .classed({center: true})
    .attr('id', 'rowsCleared' + player.id)
  
  div.append('h3')
    .classed({center: true})
    .attr('id', 'score' + player.id)
  
  div.append('h3')
    .classed({center: true})
    .attr('id', 'highScore' + player.id)
}

function generateSharedGrid() {
  
  var player0 = game.player[0]
  var player1 = game.player[1]
  
  var ui = d3.select('#gameArea')
  
  var div = ui.append('div')
      .attr('id', 'player' + player0.id)
      .classed({'col-xs-3': true, center: true})
  
  div.append('div')
    .attr('id', 'nextBlock' + player0.id)
  
  div.append('h3')
    .classed({center: true})
    .attr('id', 'rowsCleared' + player0.id)
  
  div.append('h3')
    .classed({center: true})
    .attr('id', 'score' + player0.id)
  
  div.append('h3')
    .classed({center: true})
    .attr('id', 'highScore' + player0.id)
  
  ui.append('div')
      .attr('id', 'player' + player0.id)
      .classed({'col-xs-6': true, center: true})
      .append('div')
        .attr('id', 'blockArea' + player0.id)
  
  var div = ui.append('div')
      .attr('id', 'player' + player1.id)
      .classed({'col-xs-3': true, center: true})
  
  div.append('div')
    .attr('id', 'nextBlock' + player1.id)
  
  div.append('h3')
    .classed({center: true})
    .attr('id', 'rowsCleared' + player1.id)
  
  div.append('h3')
    .classed({center: true})
    .attr('id', 'score' + player1.id)
  
  div.append('h3')
    .classed({center: true})
    .attr('id', 'highScore' + player1.id)
}


function difficutlyMenu() {
  
  var region = d3.select('#gameArea');
  
  region.selectAll('*').remove();
  
  var div = region.append('div')
    .classed({'col-xs-6': true, 'col-xs-offset-3':true, 'center': true})
    .append('div')
    .classed({panel: true, 'panel-info': true})
  
    div.append('div')
      .classed({'panel-heading': true})
      .append('h4')
        .html('Select Difficulty');
      
  var div2 = div.append('div')
      .classed({'panel-body': true})
    
      div2.append('button')
        .attr('id','normal')
        .classed({btn: true, 'btn-success': true, difficultyButton: true})
        .html('Difficulty: Normal')
        .on('click', function(){
          game.difficulty = 'normal';
          d3.select('#normal').classed({'btn-success': true, 'btn-warning': false});
          d3.select('#hard').classed({'btn-success': false, 'btn-warning': true});
          d3.select('#intense').classed({'btn-success': false, 'btn-warning': true});
          d3.select('#extreme').classed({'btn-success': false, 'btn-warning': true});
        })
    
    div2.append('div')
      .classed({'col-xs-12': true})
        .append('button')
        .attr('id','hard')
        .classed({btn: true, 'btn-warning': true, difficultyButton: true})
        .html('Difficulty: Hard')
        .on('click', function(){
          game.difficulty = 'hard';
          d3.select('#normal').classed({'btn-success': false, 'btn-warning': true});
          d3.select('#hard').classed({'btn-success': true, 'btn-warning': false});
          d3.select('#intense').classed({'btn-success': false, 'btn-warning': true});
          d3.select('#extreme').classed({'btn-success': false, 'btn-warning': true});
        })
    
    div2.append('div')
      .classed({'col-xs-12': true})
        .append('button')
        .attr('id','intense')
        .classed({btn: true, 'btn-warning': true, difficultyButton: true})
        .html('Difficulty: Intense')
        .on('click', function(){
          game.difficulty = 'intense';
          d3.select('#normal').classed({'btn-success': false, 'btn-warning': true});
          d3.select('#hard').classed({'btn-success': false, 'btn-warning': true});
          d3.select('#intense').classed({'btn-success': true, 'btn-warning': false});
          d3.select('#extreme').classed({'btn-success': false, 'btn-warning': true});
        })
    
    div2.append('div')
      .classed({'col-xs-12': true})
        .append('button')
        .attr('id','extreme')
        .classed({btn: true, 'btn-warning': true, difficultyButton: true})
        .html('Difficulty: Extreme')
        .on('click', function(){
          game.difficulty = 'extreme';
          d3.select('#normal').classed({'btn-success': false, 'btn-warning': true});
          d3.select('#hard').classed({'btn-success': false, 'btn-warning': true});
          d3.select('#intense').classed({'btn-success': false, 'btn-warning': true});
          d3.select('#extreme').classed({'btn-success': true, 'btn-warning': false});
        })

  div.append('div')
    .classed({'col-xs-12': true})
      .append('button')
      .attr('id','play')
      .classed({btn: true, 'btn-success': true, gameModeButton: true})
      .html('Start')
      .on('click', function() {
        if(game.mode === "singlePlayer") {
          onePlayer();
        } else if(game.mode === "twoPlayer") {
          twoPlayer();
        } else {
          twoPlayerCoop();
        }
      })
  
  backButton();
  instructions();
  
}

function backButton() {
  d3.select('#gameArea')
    .append('div')
    .classed({'col-xs-12': true, center: true})
    .append('button')
      .classed({'btn': true, 'btn-warning': true, gameModeButton: true})
      .html('Back') 
      .on('click', function(){
        back();
      })
}

function onePlayer() {
  
  game.player = [new newPlayer(1, game.difficulty)]
  
  var region = d3.select('#gameArea')
  
  region.selectAll('*').remove()
  
  
  region.append('div')
    .classed({'col-xs-3': true, center: true});
  
  generatePlayerUI(game.player[0]);
  backButton();
  
  /* setup functions unique to mode */
  game.completeRow = function(player, completeRows) {
    player.score += 1000 * (completeRows) * (completeRows + 1) / 2
    var speedID = Math.floor(player.rowsCleared / 1)
    if(speedID < player.speedup.length / 5){ // speedup every 10 rows cleared
      if(player.speedup[speedID] !== player.speed) {
        player.speed = player.speedup[speedID]
        game.updateTimer(game.player[0]);
      }
    }
  }
  
  game.updateTimer = updateTimer;
  game.updateScore = updateScore;
  game.addToGrid = addToGrid;
  game.randomBlock = function(player, blockMin, blockMax){
    if(game.difficulty === 'hard'){
      if(Math.random() > 0.25){
        return randomBlock(player,1,7);
      } else {
        return randomBlock(player,8,22);
      }
    } else {
      return randomBlock(player, blockMin, blockMax)
    }
  }
  
  /* prepare variable and run game */
  
  
  reset(game.player[0]);
  game.updateScore(game.player[0]);

  game.updateTimer(game.player[0]);
  
  game.endRun = function(player) {
      clearInterval(player.timer);
      player.active = false;
    setTimeout(function(){
      reset(player);
      game.updateScore(player);
      player.active = true;
      game.updateTimer(player);
    }, 5000)
  }
}


function twoPlayer() {
  
  game.player = [new newPlayer(1, game.difficulty), new newPlayer(2, game.difficulty)]
  
  d3.select('#gameArea').selectAll('*').remove();
  
  generatePlayerUI(game.player[0]);
  generatePlayerUI(game.player[1]);
  backButton();
  
  game.updateTimer = updateTimer;
  
  game.completeRow = function(player, completeRows) {
    player.score += 1000 * (completeRows) * (completeRows + 1) / 2
    var speedID = Math.floor(player.rowsCleared / 5)
    if(speedID < player.speedup.length){ // speedup every 10 rows cleared
      if(player.speedup[speedID] !== player.speed) {
        player.speed = player.speedup[speedID]
        game.updateTimer(game.player);
      }
    }
  }
  
  game.randomBlock = function(player, blockMin, blockMax){
    if(game.difficulty === 'hard'){
      if(Math.random() > 0.25){
        return randomBlock(player,1,7);
      } else {
        return randomBlock(player,8,22);
      }
    } else {
      return randomBlock(player, blockMin, blockMax)
    }
  }
  
  game.endRun = function(player) {
      clearInterval(player.timer);
      player.active = false;
    setTimeout(function(){
      reset(player);
      game.updateScore(player);
      player.active = true;
      game.updateTimer(player);
    }, 5000)
  }
  
  game.addToGrid = addToGrid;
  
  reset(game.player[0]);
  reset(game.player[1]);
  game.updateScore = updateScore;
  game.updateScore(game.player[0]);
  game.updateScore(game.player[1]);
  
  game.updateTimer(game.player[0]);
  game.updateTimer(game.player[1]);
}

function twoPlayerCoop() {
  
  game.width = 20;
  if(game.difficulty == 'hard') {
    game.width = 18;
  } else if(game.difficulty == 'extreme') {
    game.width = 16;
  }
  game.sharedGrid = true;
  game.player = [new newPlayer(1, game.difficulty), new newPlayer(2,game.difficulty, 1,14)]
  
  if(game.difficulty === 'normal'){
    game.player[0].hMax = 11;
    game.player[1].hMin = 8;
  } else if(game.difficulty === 'hard' || game.difficulty === 'intense'  ){
    game.player[0].hMax = 11;
    game.player[1].hMin = 6;
  } else if(game.difficulty === 'extreme'){
    game.player[0].hMax = 10;
    game.player[1].hMin = 5;
  }
  
  var region = d3.select('#gameArea')
  
  region.selectAll('*').remove()
  
  generateSharedGrid();
  backButton();
  
  
  game.randomBlock = function(player, blockMin, blockMax){
    if(game.difficulty === 'hard'){
      if(Math.random() > 0.25){
        return randomBlock(player,1,7);
      } else {
        return randomBlock(player,8,22);
      }
    } else {
      return randomBlock(player, blockMin, blockMax)
    }
  }
  
  game.updateTimer = updateTimer;
  
  game.completeRow = function(player, completeRows) {
    player = game.player[0]
    player.score += 1000 * (completeRows) * (completeRows + 1) / 2
    var speedID = Math.floor(player.rowsCleared / 5)
    if(speedID < player.speedup.length){ // speedup every 5 rows cleared
      if(player.speedup[speedID] !== player.speed) {
        player.speed = player.speedup[speedID]
        game.player[1].speed = player.speed
        game.updateTimer(game.player[0]);
        game.updateTimer(game.player[1]);
      }
    }
  }
  
  game.addToGrid = addToGrid
  
  
  
  game.endRun = function(player) {
      clearInterval(player.timer);
      player.active = false;
    setTimeout(function(){
      reset(player);
      game.updateScore(player);
      player.active = true;
      game.updateTimer(player);
    }, 5000)
  }
  
  game.updateScore = function(player) {
    var player2 = game.player[2 - player.id]
    
    game.score = player.score + player2.score;
    
  if(player.score + player2.score > highscores.coop[game.difficulty]) {
    highscores.coop[game.difficulty] = player.score + player2.score;
  }
  d3.select('#rowsCleared'  + player.id).html('Rows cleared: ' + game.player[0].rowsCleared);
  d3.select('#score'  + player.id).html('Score: ' + game.score);
  d3.select('#highScore'  + player.id).html('High Score:' + highscores.coop[game.difficulty]);
    
  d3.select('#rowsCleared'  + player2.id).html('Rows cleared: ' + game.player[0].rowsCleared);
  d3.select('#score'  + player2.id).html('Score: ' + game.score);
  d3.select('#highScore'  + player2.id).html('High Score:' + highscores.coop[game.difficulty]);
  
}

  
  reset(game.player[0]);
  reset(game.player[1]);
  
  game.player[1].grid = game.player[0].grid
  

  game.updateScore(game.player[0]);
  game.updateScore(game.player[1]);
  
  game.updateTimer(game.player[0]);
  game.updateTimer(game.player[1]);
}

function twoPlayerBlockUp() {
  
  game.player = [new newPlayer(1), new newPlayer(2)]
  
  var region = d3.select('#gameArea')
  
  region.selectAll('*').remove()
  
  
  
  generatePlayerUI(game.player[0]);
  generatePlayerUI(game.player[1]);
  backButton();
  
  reset(game.player[0]);
  reset(game.player[1]);
  
  game.updateTimer = updateTimer;
  
  game.updateScore = function(player){
    d3.select('#rowsCleared'  + player.id).html('Rows cleared: ' + player.rowsCleared);
    d3.select('#score'  + player.id).html('Wins: ' + player.vsScore);
  }
  game.addToGrid = addToGrid;
  game.randomBlock = randomBlock;
  
  game.completeRow = function(player, completeRows) {
    var player2 = game.player[2 - player.id]
    if(completeRows == 1) {
      player2.nextBlock.push(game.randomBlock(player, 8, 22));
    } else if(completeRows == 2) {
      player2.nextBlock.push(game.randomBlock(player, 8, 22));
      player2.nextBlock.push(game.randomBlock(player, 8, 22));
    } else if(completeRows == 3) {
      player2.nextBlock.push(game.randomBlock(player, 23, 26));
      player2.nextBlock.push(game.randomBlock(player, 8, 22));
    } else if(completeRows == 4) {
      player2.nextBlock.push(game.randomBlock(player, 23, 26));
      player2.nextBlock.push(game.randomBlock(player, 23, 26));
      player2.nextBlock.push(game.randomBlock(player, 8, 22));
    } else if(completeRows == 5) {
      player2.nextBlock.push(game.randomBlock(player, 23, 26));
      player2.nextBlock.push(game.randomBlock(player, 23, 26));
      player2.nextBlock.push(game.randomBlock(player, 23, 26));
      player2.nextBlock.push(game.randomBlock(player, 8, 22));
      player2.nextBlock.push(game.randomBlock(player, 8, 22));
    }
    
    var speedID = Math.floor(player.rowsCleared / 10)
    if(speedID < player.speedup.length / 5){ // speedup every 5 rows cleared
      if(player.speedup[speedID] !== player2.speed) {
        player2.speed = player.speedup[speedID]
        game.updateTimer(player2);
      }
    }
  }
  
  game.endRun = function(player) {
    game.player[2 - player.id].vsScore ++
    game.updateScore(game.player[0]);
    game.updateScore(game.player[1]);
    
    clearInterval(game.player[0].timer);
    clearInterval(game.player[1].timer);
    game.player[0].active = false;
    game.player[1].active = false;
    
    setTimeout(function(){
      reset(game.player[0]);
      reset(game.player[1]);
      game.updateScore(game.player[0]);
      game.updateScore(game.player[1]);
      game.player[0].active = true;
      game.player[1].active = true;
      game.updateTimer(game.player[0]);
      game.updateTimer(game.player[1]);
    }, 5000)
  }

  game.updateScore(game.player[0]);
  game.updateScore(game.player[1]);
  
  updateTimer(game.player[0]);
  updateTimer(game.player[1]);
}


function twoPlayerStealSpace() {
  
  game.player = [new newPlayer(1), new newPlayer(2)]
  
  
  var region = d3.select('#gameArea')
  
  region.selectAll('*').remove()
  
  
  
  generatePlayerUI(game.player[0]);
  generatePlayerUI(game.player[1]);
  backButton();
  
  reset(game.player[0]);
  reset(game.player[1]);
  
  game.updateScore = function(player){
    d3.select('#rowsCleared'  + player.id).html('Rows cleared: ' + player.rowsCleared);
    d3.select('#score'  + player.id).html('Wins: ' + player.vsScore);
  }
  game.addToGrid = addToGrid;
  
  game.updateTimer = updateTimer;
  game.randomBlock = randomBlock;
  
  game.completeRow = function(player, completeRows) {
    var player2 = game.player[2 - player.id]
    var nSteal = 0
    if(completeRows === 1 && player.rowsCleared % 2 === 0) {
      nSteal = 1
    } else if(completeRows === 2) {
      nSteal = 1;
    } else if(completeRows === 3) {
      if(player.rowsCleared % 2 === 0) {
        nSteal = 2;
      } else {
        nSteal = 1;
      }
    } else if(completeRows === 4) {  
      nSteal = 2;
    } else if(completeRows === 5) {  
      nSteal = 3;
    }
    
    if(nSteal > 0) {
      for(var i = 0; i<nSteal; i++) {
        player.grid.push(new Array(10).fill(0));
        player.rowRecord.push(0);
        player2.grid.pop();
        player2.rowRecord.pop();
      }
    }
    

    var speedID = Math.floor(player.rowsCleared / 10)
    if(speedID < player.speedup.length){ // speedup every 10 rows cleared
      if(player.speedup[speedID] !== player2.speed) {
        player2.speed = player.speedup[speedID]
        game.updateTimer(player2);
      }
    }
  }
  
  game.endRun = function(player) {
    game.player[2 - player.id].vsScore ++
    game.updateScore(game.player[0]);
    game.updateScore(game.player[1]);
    
    clearInterval(game.player[0].timer);
    clearInterval(game.player[1].timer);
    game.player[0].active = false;
    game.player[1].active = false;
    
    setTimeout(function(){
      reset(game.player[0]);
      reset(game.player[1]);
      game.updateScore(game.player[0]);
      game.updateScore(game.player[1]);
      game.player[0].active = true;
      game.player[1].active = true;
      game.updateTimer(game.player[0]);
      game.updateTimer(game.player[1]);
    }, 5000)
  }

  game.updateScore(game.player[0]);
  game.updateScore(game.player[1]);
  
  game.updateTimer(game.player[0]);
  game.updateTimer(game.player[1]);
}

function back() {
  console.log('Back!')
  for(var i in game.player) {
    clearInterval(game.player[i].timer)
  }
  chooseMode()
}

function instructions(){
  d3.select('#gameArea')
    .append('div')
    .classed({'col-xs-12': true, center: true})
    .append('a')
    .attr('href', 'instructions.html')
    .append('button')
    .classed({btn: true, 'btn-warning': true, gameModeButton: true})
    .html('Instructions')
}

function chooseMode() {
  
  
  
  game = new newGame()
  
  var region = d3.select('#gameArea')
  
  region.selectAll('*').remove()
  
  
  
  var div = region.append('div')
    .classed({'col-xs-12': true, center: true})
  
  div.append('div')
    .classed({'col-xs-12': true})
    .append('h2')
      .html('D3.JS Tetris (Peter Dutton)')
  
  div.append('div')
    .classed({'col-xs-12': true})
      .append('button')
      .attr('id','onePlayer')
      .classed({btn: true, 'btn-success': true, gameModeButton: true})
      .html('Single Player')
      .on('click', function() {
        game.mode = "singlePlayer"
        difficutlyMenu();
      })
  
  div.append('div')
    .classed({'col-xs-12': true})
      .append('button')
      .attr('id','twoPlayer')
      .classed({btn: true, 'btn-success': true, gameModeButton: true})
      .html('Two Player: Independent')
      .on('click', function(){
        game.mode = "twoPlayer";
        difficutlyMenu();
      })
  
    div.append('div')
    .classed({'col-xs-12': true})
      .append('button')
      .attr('id','twoPlayerCoop')
      .classed({btn: true, 'btn-success': true, gameModeButton: true})
      .html('Two Player: Cooperative')
      .on('click', function(){
        game.mode = "twoPlayerCoop";
        difficutlyMenu();
      })
  
  div.append('div')
    .classed({'col-xs-12': true})
      .append('button')
      .attr('id','twoPlayerBlock')
      .classed({btn: true, 'btn-success': true, gameModeButton: true})
      .html('Two Player: Bad Blocks')
      .on('click', function(){
        game.mode = "twoPlayer";
        twoPlayerBlockUp();
      })

  div.append('div')
    .classed({'col-xs-12': true})
      .append('button')
      .attr('id','twoPlayerSteal')
      .classed({btn: true, 'btn-success': true, gameModeButton: true})
      .html('Two Player: Steal Space')
      .on('click', function(){
        game.mode = "twoPlayer";
        twoPlayerStealSpace();
      })
  
  instructions();
  
}


var game;
var highscores = {};
highscores.onePlayer = {};
highscores.onePlayer.normal = 0;
highscores.onePlayer.hard = 51231;
highscores.onePlayer.intense = 35000;
highscores.onePlayer.extreme = 0;
highscores.coop = {};
highscores.coop.normal = 0;
highscores.coop.hard = 0;
highscores.coop.intense = 0;
highscores.coop.extreme = 0;
chooseMode();


$( document ).bind('keydown','e', function(){
  moveRotateRight(game.player[0]);
})

$( document ).bind('keydown','w', function(){
  moveRotateRight(game.player[0]);
})

$( document ).bind('keydown','q', function(){
  moveRotateLeft(game.player[0]);
})



$( document ).bind('keydown','a', function(){
  moveLeft(game.player[0]);
})

$( document ).bind('keydown','s', function(){
 if(moveDown(game.player[0])) {  // score down!!!!!
    game.player[0].score ++
    game.updateScore(game.player[0]);
  }
})

$( document ).bind('keydown','d', function(){
  moveRight(game.player[0]);
})


$( document ).bind('keydown','up', function(){
  moveRotateRight(game.player[game.player.length - 1]);
})


$( document ).bind('keydown','down', function(){
  if(moveDown(game.player[game.player.length - 1])) {  // score down!!!!!
    game.player[game.player.length - 1].score ++
    game.updateScore(game.player[game.player.length - 1]);
  }
})

$( document ).bind('keydown','left', function(){
  moveLeft(game.player[game.player.length - 1]);
})

$( document ).bind('keydown','right', function(){
  moveRight(game.player[game.player.length - 1]);
})


$( document ).bind('keydown','9', function(){
  moveRotateRight(game.player[game.player.length - 1]);
})

$( document ).bind('keydown','8', function(){
  moveRotateRight(game.player[game.player.length - 1]);
})

$( document ).bind('keydown','7', function(){
  moveRotateLeft(game.player[game.player.length - 1]);
})



$( document ).bind('keydown','4', function(){
  moveLeft(game.player[game.player.length - 1]);
})

$( document ).bind('keydown','5', function(){
 if(moveDown(game.player[game.player.length - 1])) {  // score down!!!!!
    game.player[game.player.length - 1].score ++
    game.updateScore(game.player[game.player.length - 1]);
  }
})

$( document ).bind('keydown','6', function(){
  moveRight(game.player[game.player.length - 1]);
})


/*
$( document ).bind('keydown','p', function(){
  
})
*/