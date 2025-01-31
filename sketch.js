var dog,running,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload()
{
  dogImg = loadImage("images/dogImg.png")
  happyDog = loadImage("images/dogImg1.png")
  milkImg = loadImage("Milk.png")
  runningImg = loadImage("images/running.png")
  garden=loadImage("images/Garden.png");
  washroom=loadImage("WashRoom.png");
  bedroom=loadImage("images/BedRoom.png");
	//load images here
}

function setup() {

  createCanvas(1000, 500);

  database = firebase.database();
 
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  
  dog = createSprite(800,220,150,150)
  dog.addImage(dogImg)
  dog.scale = 0.15
  
  feed = createButton("Feed the dog");
  feed. position(700,95);
  feed.mousePressed(feedDog);
 
  addFood = createButton("Add food");
  addFood. position(800,95);
  addFood.mousePressed(addFoods)
}


function draw() {  
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    
   }

  foodObj.display();

  drawSprites();
  //add styles here
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.writeStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
   Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}






