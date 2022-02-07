"use strict";
var thetaLoc;
var thetaX;
var points;
var gl;
var modely=mat4();
var Tx=0,Ty=0,Tz=0;
var Sx=1,Sy=1,Sz=0;
var angleX=0;
var angleY=0 ;
var angleZ=0;
var k2 =-0.2;
var PrimitiveType ;
var r1;
var r2;
var r3;
var r4;
var r5;
var r6;
var colorLocation;
var click=0;
var color = [1.0, 1.0, 1.0, 1];
function rotationX(theta)
{
    var c = Math.cos( radians(theta) );
    var s = Math.sin( radians(theta) );
    var rx = mat4( 1.0,  0.0,  0.0, 0.0,
        0.0,  c,  -s, 0.0,
        0.0, s,  c, 0.0,
        0.0,  0.0,  0.0, 1.0 );
    modely=mult(rx,modely);
    modely =rotationY(theta);
    modely =rotationZ(theta);
    return modely;
}
function rotationY(theta) {
    var c = Math.cos( radians(theta) );
    var s = Math.sin( radians(theta) );
    var ry = mat4( c, 0.0, s, 0.0,
        0.0, 1.0,  0.0, 0.0,
        -s, 0.0,  c, 0.0,
        0.0, 0.0,  0.0, 1.0 );
        modely=mult(ry,modely);
    return modely;
}
function rotationZ(theta) {
    var c = Math.cos( radians(theta) );
    var s = Math.sin( radians(theta) );
    var rz = mat4( c, -s, 0.0, 0.0,
        s,  c, 0.0, 0.0,
        0.0,  0.0, 1.0, 0.0,
        0.0,  0.0, 0.0, 1.0 );
        modely=mult(rz,modely);
    return modely;
  }
function scale1(Sx,Sy,Sz)
{
    var identity = mat4();
    identity[0][0] = Sx;
    identity[1][1] = Sy;
    identity[2][2] = Sz;
    return identity;
}
function Translation(Tx,Ty,Tz)
{
    var identity = mat4();
    identity[0][3] = Tx;
    identity[1][3] = Ty;
    identity[2][3] = Tz;

    return identity;
}
window.onload = function init() {
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    var k =1/80;
    var k1=1/4;
    var points =
    [// For Y 
        [-0.1*k1+k2,0],//0
        [-0.1*k1+k2,0.5*k1],//1
        [(-0.1-0.25*Math.sqrt(3))*k1+k2,0.75*k1],//2
        [(-0.25*Math.sqrt(3))*k1+k2,(0.75+0.1*Math.sqrt(3))*k1],//3
        [0+k2,(0.5+0.1*Math.sqrt(3))*k1],//4
        [(0.25*Math.sqrt(3))*k1+k2,(0.75+0.1*Math.sqrt(3))*k1],//5
        [(0.1+0.25*Math.sqrt(3))*k1+k2,0.75*k1],//6
        [0.1*k1+k2,0.5*k1],//7
        [0.1*k1+k2,0],//8
    ];
    var points1 =
    [//for N
        [-4*k,0],//0
        [-4*k,16*k],//1
        [0,16*k],//2
        [0,0],//3
        [12*k/5,71*k/5],//4
        [0,11*k],//5
        [44*k/3],//6
        [256*k/15,16*k/5],//7
        [256*k/15,0],//8
        [256*k/15,16*k],//9
        [316*k/15,16*k],//10
        [316*k/15,0]//11

    ];
    var vertices1 =
    [
        vec2(points[0]),
        vec2(points[1]),// A triangle
        vec2(points[7]),

        vec2(points[0]),
        vec2(points[8]),// B triangle
        vec2(points[7]),

        vec2(points[1]),
        vec2(points[4]),// C triangle
        vec2(points[7]),

        vec2(points[1]),
        vec2(points[2]),// D triangle
        vec2(points[4]),

        vec2(points[2]),
        vec2(points[3]),// E triangle
        vec2(points[4]),
        
        vec2(points[4]),
        vec2(points[5]),// F triangle
        vec2(points[6]),

        vec2(points[4]),
        vec2(points[6]),// G triangle
        vec2(points[7]),
        
        vec2(points[7]),
        vec2(points[8]), // Bottom line
        vec2(points[0])
    ];
    var vertices =
    [
        vec2(points1[0]),
        vec2(points1[1]),// A triangle
        vec2(points1[2]),

        vec2(points1[0]),
        vec2(points1[3]),// B triangle
        vec2(points1[2]),

        vec2(points1[2]),
        vec2(points1[4]),// C triangle
        vec2(points1[5]),

        vec2(points1[4]),
        vec2(points1[5]),// D triangle
        vec2(points1[6]),

        vec2(points1[4]),
        vec2(points1[7]),// E triangle
        vec2(points1[6]),

        vec2(points1[6]),
        vec2(points1[8]),// F triangle
        vec2(points1[7]),

        vec2(points1[8]),
        vec2(points1[9]),// G triangle
        vec2(points1[10]),

        vec2(points1[8]),
        vec2(points1[11]),// H triangle
        vec2(points1[10]),


    ];
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    document.getElementById("slide1").onchange = function() {
        r1 = (this.value)/100;
        color=[r1,r3,r5,1];
    };
    document.getElementById("slide2").onchange = function() {r3 = (this.value)/100;color=[r1,r3,r5,1];};
    document.getElementById("slide3").onchange = function() {r5 = (this.value)/100;color=[r1,r3,r5,1];};
    window.addEventListener('keydown', keyboard);
	function keyboard(b){
		if(b.which == '38'){Ty+=0.1;}
		if (b.which == '40'){ Ty-=0.1;}
		if(b.which== '39'){Tx =Tx+0.1}
		if(b.which =='37'){ Tx = Tx-0.1;}
        if(b.which=='87'){Sy=Sy+0.1;}
        if(b.which=='83'){Sy=Sy-0.1;}
        if(b.which=='68'){Sx=Sx+0.1;}
        if(b.which=='65'){Sx=Sx-0.1;}
	}
    window.addEventListener('click', mouse);
    function mouse(event)
    {
        if(event.which=='1'){click+=1;
            if(click%2==1)
                thetaX=0;
            else
                thetaX=0.5;
        }
    }
    PrimitiveType=gl.TRIANGLES;
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER,flatten(vertices), gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    colorLocation = gl.getUniformLocation(program, "u_color");
    gl.uniform4fv(colorLocation, color);
    thetaLoc = gl.getUniformLocation(program, "theta");
    thetaX=0;
    gl.uniform1f(thetaLoc, thetaX);
    thetaX=0.5;
    var modelyLoc = gl.getUniformLocation(program,"model");
    setInterval(
        render,1000/60,vertices,vertices1,modelyLoc
    );
}
function render(vertices,vertices1,modelyLoc) {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(vertices), gl.STATIC_DRAW );
    gl.drawArrays(PrimitiveType,0,24);
    gl.bufferData( gl.ARRAY_BUFFER,flatten(vertices1), gl.STATIC_DRAW );
    modely = mult(modely,scale1(Sx,Sy,Sz));
    modely=rotationX(thetaX);
    gl.uniform1f(thetaLoc, thetaX);
    modely = mult(modely, Translation(Tx,Ty,Tz));
    gl.uniformMatrix4fv(modelyLoc,false,flatten(modely)); 
    gl.drawArrays(PrimitiveType,0,24);
    gl.uniform4fv(colorLocation, color);
    gl.uniform1f(r2,r1);
	gl.uniform1f(r4,r3);
	gl.uniform1f(r6,r5);
    Tx=0;
    Ty=0;
    Tz=0;
    Sx=1;
    Sy=1;
    Sz=0;
}
