var robot,rock,score,bullet;
var rockG, bulletG,potionG;
var gameState=0;
var gameOver,gameOverImg;
var robotImg,rockImg,bulletImg,potionImg;
var potion,number;
var size,size1,size2,speed,bulletSpeed;
var backGround, backGroundImg;
var restart, restartImg;
var backgroundMusic;

function preload(){
  robotImg=loadImage("robot.png");
  rockImg=loadImage("rockImg.png");
  bulletImg=loadImage("bullet.png");
  potionImg=loadImage("potion.png");
  backGroundImg=loadImage("spacePicture.jpg");
  gameOverImg=loadImage("gameOver.jpg");
  restartImg=loadImage("restart.png");
  backgroundMusic=loadSound("music.mp3");
}

function setup() {
  createCanvas(displayWidth-50,displayHeight-115);
  backGround=createSprite(width/2,height/2,width,height);
  backGround.addImage(backGroundImg);
  backGround.scale=2.5;

  size=0.4;
  size1=370;
  size2=430;

  speed=15;

  bulletSpeed=7;

  score=0;

  robot=createSprite(displayWidth/7, 200, 70, 70);
  robot.addImage(robotImg);

  rockG=createGroup();

  bulletG=createGroup();

  potionG=createGroup();

  gameOver=createSprite(width/2,(height/2)-150,10,10);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.7;
  gameOver.visible=false;

  restart=createSprite(width/2,(height/2) + 200,10,10);
  restart.addImage(restartImg);
  restart.visible=false;
  restart.scale=0.5;
}

function draw() {
  background("green"); 

  if (gameState===0) {

    backgroundMusic.play();

    robot.scale=size;
    robot.setCollider("rectangle",0,0,size1,size2)
    spawnRock();

    if (keyWentDown("SPACE") || touches.length>0) {
      spawnBullet();
      touches=[];
    }

    if (touches.length>0 || keyDown("UP_ARROW") && robot.y>(80)) {
      robot.y = robot.y-speed; 
      touches=[];
    }

    if (touches.length>0 || keyDown("DOWN_ARROW") && robot.y<(height-80)) {
      robot.y = robot.y+speed; 
      touches=[];
    }

    for (i=0;i<rockG.length;i++) {
        if (rockG.get(i).isTouching(bulletG)) {
          bulletG.destroyEach();
          rockG.get(i).destroy();
          score+=1
        }
    }

    if (rockG.isTouching(robot)) {
      robot.visible=false;
      score-=1;
      gameState=1;
    }

    if (frameCount%60===0) {
      number = Math.round(random(1,5));
      if (number===1) {
        spawnPotion();
      }
    }

    for (g=0;g<potionG.length;g++) {  
      if (potionG.get(g).isTouching(robot) && size>=0.1) {
        potionG.get(g).destroy();
        score+=1

        var rand=Math.round(random(1,3));
        console.log(rand);

        switch(rand) {
          case 1: size = size-(size/4);
                  size1 = size1-(size1/4);
                  size2 = size2-(size2/4);
                  break;
          case 2: speed+=2;
                  break;
          default:bulletSpeed+=2;
                  break;
        }
      
      }

      if (!backgroundMusic.isPlaying()) {
        backgroundMusic.play();
        //backgroundMusic.setVolume(0.05);
      }


    }

    

    backGround.velocityX=-3;

    if (backGround.x < 0){
      backGround.x = backGround.width/2;
    }
  }

  if (gameState===1) {
    gameOver.visible=true;
    restart.visible=true;
    rockG.destroyEach();
    backGround.velocityX=0;
    potionG.destroyEach();
    bulletG.destroyEach();
    if (mousePressedOver(restart) || touches.length>0) {
      reset();
      touches=[];
    }
    
  }

  console.log(number);

  drawSprites();

  fill("white");
  textSize(20);
  text("Score: "+score,width-150,50);
}

function spawnBullet() {
  var bullet = createSprite(100,100,60,10);
  bullet.addImage(bulletImg);
  bullet.x = robot.x+85;
  bullet.y = robot.y+25;
  bullet.velocityX = bulletSpeed;
  bullet.lifetime = width/bullet.velocityX;
  bulletG.add(bullet)
  //bullet.debug=true;
  bullet.scale = 0.1;
  bullet.setCollider("rectangle",0,0,600,200)
}

function spawnRock() {
  if (frameCount%60 === 0) {
    var rock = createSprite(width,100,40,40);
    rock.scale = 0.17;
    rock.addImage(rockImg);
    rock.y = random(200,displayHeight-200);
    rock.velocityX = -5;
    rock.lifetime = [width/(-rock.velocityX)];
    rockG.add(rock);
    //rock.debug = true;
    rock.setCollider("rectangle",0,0,900,900)
  }
}

function spawnPotion() {
  var potion = createSprite(width,100,40,40);
  potion.addImage(potionImg);
  potion.y = random(200,displayHeight-200);
  potion.velocityX = -6;
  potion.lifetime = width/-potion.velocityX;
  potionG.add(potion)
  potion.debug=true;
  potion.scale=0.4;
  potion.setCollider("rectangle",0,0,160,180)
}

function reset() {
  score=0;
  gameOver.visible=false;
  restart.visible=false;
  robot.visible=true;
  gameState=0;
  // if (!backgroundMusic.isPlaying()) {
  //   backgroundMusic.play();
  // }
}