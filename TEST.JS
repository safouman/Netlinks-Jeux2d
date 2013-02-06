var
	// Get our canvas reference
	canvas = document.getElementById("canvas2D"),
	// Size object containing height and width
	size = {
		width: canvas.width,
		height: canvas.height
	       },
	// The color of the different objects on canvas
	/*color = {
		bar: "blue"
	        }*/
	// Get the 2D context
	context = canvas.getContext("2d");
				 
			 
//***********************************************************************				
window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame              ||
        window.mozCancelRequestAnimationFrame      ||
        window.webkitCancelRequestAnimationFrame    ||
        window.oCancelRequestAnimationFrame         ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout 

} )();				

			
//************************************************************************ 
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.mozRequestAnimationFrame    || 
			window.webkitRequestAnimationFrame || 
			
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function( callback ){
				window.setTimeout(callback, 1000 / 60);
		};
})();

var game;

var play=false;
//*************************************************************************
/*
*  Render the elements on the canvas
*/
var renderer = (function() {
	var bar={
		y:380,
		x:310,
		l:80,
		h:10,
		color:"blue"


	};
	var ball = {
		pos:{x:350,y:370},
		vit:{dx:5,dy:5},
		color: "0FFFD4",
		r:10
	};
	var briques = {
		lingnes:4,
		colones:10,
		decalage:1,
		l:42,
		h:25,
		couleur: "#850606"
	};

	var tabBrik;

                             //******************************************
	function moveBar(bar)
	{
		if(bar.x<0) bar.x = 0;
		if(bar.x>620) bar.x = 620;

		context.fillStyle = bar.color;
		context.fillRect(bar.x,bar.y, bar.l, bar.h);
	}
 							//*******************************************
	function moveBall(ball)
	{
		context.beginPath();//3awed mnin wselet 

		context.fillStyle = ball.color;

		context.arc(ball.pos.x, ball.pos.y, 10, 0, Math.PI*2);

		context.fill();
		context.closePath();
	}
							//*******************************************
	function render() {             
		
    if (play){    //si on a deja cliqué
    	if( ball.pos.x+ball.vit.dx<10 || ball.pos.x+ball.vit.dx>690) {ball.vit.dx=-ball.vit.dx; } 
   		if( ball.pos.y+ball.vit.dy<10 ) {ball.vit.dy=-ball.vit.dy;}
    	else if ((ball.pos.y>=370) && (ball.pos.y<373))
    	{
    		if (((bar.x+92.5)>ball.pos.x) && ((bar.x-12.5)<ball.pos.x))  //lorsque la balle touche la barre
    		{
    			ball.vit.dx = 10 * ((ball.pos.x-(bar.x+bar.l/2))/bar.l);  // alert('y');
        		ball.vit.dy = -ball.vit.dy;}                               
        }		
    	else if(ball.pos.y>410)       //lorqu'on a pas encore cliqué
    	{
    		gameover();                             //arret du jeu
    	}
	
		ball.pos.x +=ball.vit.dx;
		ball.pos.y+=ball.vit.dy;

		context.clearRect(0, 0, size.width, size.height); 
		
	$(canvas).mousemove(function(e){//la fct mousemove te5ou comm parametre 
				bar.x=e.offsetX-40;
			
			});
	
    moveBall(ball);
	moveBar(bar);}
	else{                                //si on a pas cliqué
		context.clearRect(0, 0, size.width, size.height); 
		
	    $(canvas).mousemove(function(e){
				bar.x=e.offsetX-40;
			    
			}); 
	    moveBar(bar);
	    ball.pos.x=bar.x+40;  //bech lboule tabba3 lbarre
	    moveBall(ball);}
	}
								//*******************************************

	function initBrik()
	{
		briques.l=size.width/briques.colones-1;
		tabBrik=new Array (briques.lingnes);
		for (var i = 0; i < briques.lingnes; i++) 
		{
			tabBrik[i]=new Array(briques.colones);
			for (var j = 0; j <briques.colones; j++) {tabBrik[i][j]=1;}
		}
				
	}		
			
	function drawBrik()
	{   var e=false;
		for (var i = 0; i < briques.lingnes; i++) 
			{for (var j = 0; j <briques.colones; j++) 
				{
					if (tabBrik[i][j]==1) 
					{
						context.fillStyle=briques.couleur;
						context.fillRect(j*(briques.l+briques.decalage),i*(briques.h+briques.decalage),briques.l,briques.h);
						e=true;//s'il y a au moins une brique,e=true
					}
				}
		}
		if (!e) {gameover();}   //s'il n'y a pas aucune brique,game over
		var lig=Math.floor((ball.pos.y)/(briques.h+briques.decalage)) ; //ds quel ligne se trouve la boule
		var col=Math.floor(ball.pos.x/(briques.l+briques.decalage)); //ds quel colonne se trouve la boule
		

		if (ball.pos.y<(briques.lingnes*(briques.h+briques.decalage)) && (tabBrik[lig][col]==1))
			{
				ball.vit.dy=-ball.vit.dy;
				tabBrik[lig][col] = 0; //brick cassée
			//	alert('j');
			}
	}							
	
	function gameover()
	{
		cancelRequestAnimFrame(game);   
	}

	function animloop(){
				game=requestAnimFrame(animloop);
				render();
				drawBrik();
		

			}
	
	return {
		startRendering: function() {
			canvas.addEventListener('click', function (){play=true;}, false);		//lorsqu'on clique,play devient true
			initBrik();
			game=requestAnimFrame(animloop);   // game c pour qu'on utilise cancelanimerequest pour arreter le jeu
			
		}
	}
})();

renderer.startRendering();

// Start animating
