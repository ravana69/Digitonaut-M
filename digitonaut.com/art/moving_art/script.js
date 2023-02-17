let url = "https://coolors.co/app/00447c-ff0d57-1e88e5-e3b505-95190c";
let cols;
let obj = [];
let num = 25;


function setup() {
	createCanvas(windowWidth, windowHeight);
	cols = createCols(url);
	for(let i = 0; i < num; i++)obj[i] = new MoveObj(cols[Math.floor(random(cols.length))]);
	blendMode(MULTIPLY);
}

function draw() {
	clear();
	background(240);
	for(let i = 0; i < obj.length; i++)obj[i].update();
}


class MoveObj
{
	constructor(col)
	{
		this.col = col;
		this.mode = Math.floor(random(4));
		this.schedule = [];
		let num = Math.floor(random(5,15));
		for(let i = 0; i < num; i ++)
		{
			let _x = random(width);
			let _y = random(height);
			let _w = random(0.01,0.5) * width;
			let _h = random(0.01,0.5) * height;
			this.schedule.push({pos:createVector(_x,_y),size : createVector(_w,_h)});
		}
		this.interval = 2;
		this. movingTimeAmount = 0.3;//0-1
		this.time  = 0;
	}
	
	update()
	{
		this.time += deltaTime/1000;
		let count = Math.floor(this.time/this.interval);
		let degree = map(this.time-count * this.interval,0,this.interval,0,1);
		count %= this.schedule.length;
		let nextCount = (count + 1) %this.schedule.length;
		degree = degree <= this. movingTimeAmount ? map(degree,0,this. movingTimeAmount,0,0.95) : map(degree,this. movingTimeAmount,1,0.95,1);
		
		let currentPos = this.getLerpVec(this.schedule[count].pos, this.schedule[nextCount].pos,degree,easingLinear);
		let currentSize = this.getLerpVec(this.schedule[count].size, this.schedule[nextCount].size,degree,easingEaseInCubic);
		this.display(currentPos,currentSize);
	}
	
	getLerpVec(_startPos,_endPos,_degree,easeFunc)
	{
		_degree = easeFunc(_degree);
		let v = p5.Vector.lerp(_startPos, _endPos, _degree);
		return v;
	}
	
	gerLerpVal(_startVal,_endVal,_degree,easeFunc)
	{
		_degree = easeFunc(_degree);
		let v = lerp(_startVal, _endVal, _degree);
		return v;
	}
	
	display(_pos,_size)
	{
		ellipseMode(CENTER);
		rectMode(CENTER);
		push();
		translate(_pos);
		if(this.mode == 0){
			noStroke();
			fill(this.col);
			ellipse(0,0,_size.x/2,_size.x/2);
		}
		else if(this.mode == 1){
			noStroke();
			fill(this.col);
			rect(0,0,_size.x,_size.y);
		}
		else if(this.mode == 2){
			stroke(this.col);
			noFill();
			for(let x = _size.x*-0.5;  x < _size.x*0.5; x += 5)line(x,_size.y*-0.5,x,_size.y*0.5);
		}
		else{
			stroke(this.col);
			noFill();
			for(let y = _size.y*-0.5;  y < _size.y*0.5; y += 5)line(_size.x*-0.5,y,_size.x*0.5,y);
		}
		pop();
	}
}


//////

function createCols(_url) {
  let slash_index = _url.lastIndexOf('/');
  let pallate_str = _url.slice(slash_index + 1);
  let arr = pallate_str.split('-');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = '#' + arr[i];
  }
  return arr;
}

//////
function easingLinear(x) {
	return x;
}
function easingEaseInCubic (x) {
	return pow(x,3);
}

function easingEaseOutCubic (x) {
	return pow(x-1,3) + 1;
}

function easingEaseInOutCubic (x) {
	if(x < 0.5)return 0.5 * pow(2*x, 3);
	else return 0.5 * pow(2*(x-1), 3) + 1;
}