/*
 * This is a codeblind recreation of
 * @tmrDevelops pen "Plasmatic":
 * https://codepen.io/tmrDevelops/full/LVVaWz
 *
 */

var w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    ctx = c.getContext( '2d' ),
    
    totalCircleCount = 50,
    hueStart = 0,
    hueEnd = 50,
    hueChange = 1,
    minSize = 20,
    maxSize = 50,
    speed = .1,
    minGlowTime = 20,
    maxGlowTime = 50,
    glowSize = 1.5,
    repaintAlpha = 1,
    spawnChance = .2,
  	
    circles = [],
    frame = ( Math.random() * 360 ) |0,
    
    //gui = new dat.GUI,
    //parameters = [ 'totalCircleCount', 'hueStart', 'hueEnd', 'hueChange', 'minSize', 'maxSize', 'speed', 'minGlowTime', 'maxGlowTime', 'glowSize', 'repaintAlpha', 'spawnChance' ],
    boundaries = [ 1,200 , 0,360 , 0,360 , .1,4 , 10,100 , 20,200 , .05,2 , 10,100 , 10,100 , 0,2 , 0,1 , 0,.9 ];
        
function init() {
  
  //for( var i = 0; i < parameters.length; ++i )
    //gui.add( window, parameters[ i ], boundaries[ i * 2 ], boundaries[ i * 2 + 1 ] ).listen();
  
  //gui.domElement.style.setProperty( 'float', 'left' );
  //gui.domElement.style.setProperty( 'margin-left', '40px' );
  
  loop();
}

function loop() {
  
  window.requestAnimationFrame( loop );
  
  //reinforceGUI();
  trySpawning();
  step();
}

//function reinforceGUI() {
  //boundaries[ parameters.indexOf( 'hueStart' ) * 2 + 1 ] = boundaries[ parameters.indexOf( 'hueEnd' ) * 2 ];
  //boundaries[ parameters.indexOf( 'minSize' ) * 2 + 1 ] = boundaries[ parameters.indexOf( 'maxSize' ) * 2 ];
//}
function trySpawning() {
  
  if( circles.length < totalCircleCount && Math.random() < spawnChance ) circles.push( new Circle );
}
function step() {
  
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(0, 0, 0, alp)'.replace( 'alp', repaintAlpha );
  ctx.fillRect( 0, 0, w, h );
  ctx.globalCompositeOperation = 'lighter';
  
  frame += hueChange;
  
  for( var i = 0; i < circles.length; ++i ) {
    
    var circle = circles[i];
    
    circle.step();
    
    if( circle.dead ) {
      
      circles.splice( i, 1 );
      --i;
    }
  }
}



function Circle() {
  
  this.reset();
}
Circle.prototype.reset = function() {
  
  this.size = rand( minSize, maxSize );
  this.x = w + this.size;
  this.y = Math.random() * h;
  
  var glowTime = rand( minGlowTime, maxGlowTime );
  this.glow = Math.random();
  this.glowDirection = Math.random() < .5 ? 1/glowTime : -1/glowTime;
  
  var hue = ( ( frame |0 ) % ( hueEnd - hueStart ) ) + hueStart,
  		color = 'hsla(hue, 80%, 50%, alp)'.replace( 'hue', hue );
  this.shadowColor = color.replace( 'alp', 1 );
  
  this.gradient = ctx.createRadialGradient( 0, 0, 0, 0, 0, this.size );
  this.gradient.addColorStop( 0, color.replace( 'alp', .1 ) );
  this.gradient.addColorStop( .8, color.replace( 'alp', .2 ) );
  this.gradient.addColorStop( 1, color.replace( 'alp', .8 ) );
}
Circle.prototype.step = function() {
  
  this.update();
  this.render();
}
Circle.prototype.update = function() {
  
  this.x -= this.size * speed;
  this.glow += this.glowDirection;
  if( this.glow > 1 || this.glow < 0 ) this.glowDirection *= -1;
  
  if( this.glow < 0 ) this.glow = .1;
  
  if( this.x + this.size < 0 )
    if( totalCircleCount > circles.length) this.reset();
  	else this.dead = true;
}
Circle.prototype.render = function() {
  
  ctx.shadowBlur = this.glow * glowSize * this.size;
  ctx.fillStyle = this.gradient;
  ctx.shadowColor = this.shadowColor;
  
  ctx.translate( this.x, this.y );
  ctx.beginPath();
  ctx.arc( 0, 0, this.size, 0, Math.PI * 2 );
  ctx.fill();
  ctx.translate( -this.x, -this.y );
}


function rand( min, max ) {
  
  return Math.random() * ( max - min ) + min;
}


init();