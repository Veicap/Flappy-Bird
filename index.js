const canvas = document.getElementById('canvas1');
const c = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;
let timetoNextOb = 0;
let obstacleInterval = 850;
let lastTime = 0;
let groupObstacles = [];
let gameOver = false;
let score = 0;
const speedGame = 8;
const countScore = document.getElementById('score');
const backgroundLayer1 = new Image();
backgroundLayer1.src = 'layer-1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = 'layer-2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = 'layer-3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = 'layer-4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = 'layer-5.png';
c.font = '20px Impact';
class Player {
	constructor() {
		this.x = 5;
		this.y = canvas.width/2;
		this.width = 40;
		this.height = 40;
		this.gravity = 2;
		this.image = new Image();
		this.image.src = 'bird1.png';
		this.frame = 0;
		this.timer = 0;
		this.spriteWidth = 16;
		this.spriteHeight = 16;
	}
	update() {
		this.timer++;
		if(this.timer % 5 === 0) {
			if(this.frame > 2) this.frame = 0;
			else this.frame++;
		}
		this.y += this.gravity;
		if(this.y + this.width > canvas.height) {
			gameOver = true
		}

	}	
	draw() {
		c.fillStyle = "red";
		//c.strokeRect(this.x, this.y, this.width, this.height);
		c.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,this.x, this.y, this.width, this.height);
	}
};
const player = new Player();
class Obstacle {
	constructor() {
		this.width = 78
		this.height1 = Math.random() * (canvas.height/2 - 180) + 90;
		this.height2 = Math.random() * (canvas.height/2 - 180) + 90;
		this.x = canvas.width - this.width;
		this.y1 = 0;
		this.y2 = (canvas.height-118) - this.height2;
		this.markedForDeletion = false;
		this.image = new Image();
		this.image.src = 'PipeStyle1.png';
		this.spriteWidth = 32;
		this.spriteHeight = 80;
		this.frameX = 2;
		this.frameY = 1;
	}
	update() {
		this.x -= 1.5;
		if(this.x < -this.width) {
			this.markedForDeletion = true;
			score++;
		}
	}
	draw() {
		/*c.fillStyle = 'blue'
		c.fillRect(this.x, this.y1, this.width, this.height1);
		c.fillStyle = 'green'
		c.fillRect(this.x, this.y2, this.width, this.height2);*/
		 c.drawImage(this.image, 2 * this.spriteWidth, 1 * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y1, this.width, this.height1 )
		 c.drawImage(this.image, 2 * this.spriteWidth, 1 * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y2, this.width, this.height2 )
	}
}

window.addEventListener('keydown', function(e) {
	if(e.key ==='w' || e.key === 'ArrowUp') {
		player.y -= 45;
	}
	//console.log(e);
});
window.addEventListener('click', function(e) {
	player.y-= 50;
	console.log(e);
})
let count = 0;
function endGame() {
	groupObstacles.forEach(objects => {
		if((player.x > objects.x + objects.width ||
			player.x + player.width < objects.x ||
			player.y  > objects.y1 + objects.height1 ||
			player.y + player.height < objects.y1) &&
			(player.x > objects.x + objects.width ||
			player.x + player.width < objects.x ||
			player.y  > objects.y2 + objects.height2 ||
			player.y + player.height < objects.y2)) {
			//gameOver = false		
		} 
		else {
			gameOver = true

		}
	})
	
}
function gameover() {
	c.textAlign = 'center'
	c.fillStyle = 'Yellow';
	c.fillText('Game Over. Your score is: ' + score, canvas.width/2, canvas.height/2);
}
class Layer {
	constructor(image) {
		this.x = 0;
		this.x2 = 2400;
		this.width = 2400;
		this.height = 700;
		this.y = 0;
		this.image = image;
	}
	update() {
		if(this.x < - this.width) {
			this.x = this.width - speedGame + this.x2;
		} else {
			this.x = this.x - speedGame
		}
		if(this.x2 < -this.width) {
			this.x2 = this.width - speedGame + this.x;
		} else {
			this.x2 = this.x2 - speedGame
		}
	}
	draw() {
		c.drawImage(this.image, this.x, this.y, this.width, this.height);
		c.drawImage(this.image, this.x2, this.y, this.width, this.height);
	}
}
const layer1 = new Layer(backgroundLayer1);
const layer2 = new Layer(backgroundLayer2);
const layer3 = new Layer(backgroundLayer3);
const layer4 = new Layer(backgroundLayer4);
const layer5 = new Layer(backgroundLayer5);
const layerGroups = [layer1, layer2, layer3, layer4, layer5];
function animate(timestamp) {
	c.clearRect(0, 0, canvas.width, canvas.height)
	let deltatime = timestamp - lastTime;
	lastTime = timestamp;
	timetoNextOb += deltatime;
	if(timetoNextOb > obstacleInterval) {
		groupObstacles.push(new Obstacle());
		timetoNextOb = 0;
	};
	
	[...layerGroups,...groupObstacles].forEach(objects => objects.draw());
	[...layerGroups,...groupObstacles].forEach(objects => objects.update());	
	
	groupObstacles = groupObstacles.filter(objects => !objects.markedForDeletion);
	player.draw();	
	player.update();
	countScore.innerHTML = score;
	endGame();
	if(gameOver === false)requestAnimationFrame(animate);
	else gameover()
}

animate(0);

