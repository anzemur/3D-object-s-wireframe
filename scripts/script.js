var points = [];
var triangelPoints = [];

var rotatationAngle = 5;
var objectScale = 700;

var translateX = 0.35;
var translateY = 0.35;
var translateZ = 0.35;

var scaleX = 0.1;
var scaleY = 0.1;
var scaleZ = 0.1;


var sX = 1;
var sY = 1;
var sZ = 1;

var initTranslation = 18;

var context = null;
var canvas = null;


function init() {


    /** INITIALIZE CANVAS **/
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");
    canvas.width = window.innerWidth/2 - 70;
    canvas.height = window.innerWidth/2 - 70;

    context.moveTo(0,0);

    var inputFile = document.getElementById("objectFile");
    var fileName = document.getElementById("fileName");


    inputFile.addEventListener('change', function(e) {

        var showFile = document.getElementById("showFileName");
        showFile.value = inputFile.value;

        points = [];
        triangelPoints = [];

        var objectFile = inputFile.files[0];
        var reader = new FileReader();
        fileName.innerText = reader.result;

        reader.onload = function(progressEvent) {


            //console.log(this.result);

            var lines = this.result.split('\n');

            for(var line = 0; line < lines.length; line++) {


                var tmp_line = lines[line].split(" ");
                //console.log(lines[line]);

                if(tmp_line[0] == 'v') {

                    var vector = new vec4.fromValues(tmp_line[1], tmp_line[2], tmp_line[3] , 1.0);

                    points.push(vector);
                    //console.log("BEREMT TOCKE")
                    //console.log(points);

                } else if (tmp_line[0] == 'f') {

                    var vector = new vec3.fromValues(tmp_line[1], tmp_line[2], tmp_line[3]);


                    triangelPoints.push(vector);
                }
            }
            console.log("PREBRANE TOCKE")
            console.log(points);

        };
        reader.readAsText(objectFile);

    });
}


var modern = true;

function changeStyle() {
    if(modern) {
        var stylesheet = document.getElementById("style");
        stylesheet.setAttribute('href', './style/retro.css');

        modern = false;

    } else {
        var stylesheet = document.getElementById("style");
        stylesheet.setAttribute('href', './style/modern.css');

        modern = true;

    }



}





function setRotationAngle() {
    if(document.getElementById("rotatationAngle").value == ""){
        rotatationAngle = 10;
        alert("Please set the rotation angle.")
    } else {
        rotatationAngle = document.getElementById("rotatationAngle").value;

    }
}

function setObjectScaling() {
    if(document.getElementById("scaleVal").value == ""){
        objectScale = 100;
        alert("Please set the object scaling.")
    } else {
        objectScale = document.getElementById("scaleVal").value;

    }

}

function setObjectScalingX() {
    if(document.getElementById("scaleValX").value == ""){
        scaleX = 0.1;
        alert("Please set the object scaling.")
    } else {
        scaleX = document.getElementById("scaleValX").value;

    }

}

function setObjectScalingY() {
    if(document.getElementById("scaleValY").value == ""){
        scaleY = 0.1;
        alert("Please set the object scaling.")
    } else {
        scaleY = document.getElementById("scaleValY").value;

    }
}

function setObjectScalingZ() {
    if(document.getElementById("scaleValZ").value == ""){
        scaleZ = 0.1;
        alert("Please set the object scaling.")
    } else {
        scaleZ = document.getElementById("scaleValZ").value;

    }

}

function setTranslationX() {
    if(document.getElementById("translateValX").value == ""){
        translateX = 0.35;
        alert("Please set the appropriate scaling.")
    } else {
        translateX = document.getElementById("translateValX").value;

    }

}

function setTranslationY() {
    if(document.getElementById("translateValY").value == ""){
        translateY = 0.35;
        alert("Please set the appropriate value.");
    } else {
        translateY = document.getElementById("translateValY").value;

    }

}

function setTranslationZ() {
    if(document.getElementById("translateValZ").value == ""){
        translateZ = 0.35;
        alert("Please set the appropriate value.");
    } else {
        translateZ = document.getElementById("translateValZ").value;

    }

}



/** TRS **/
var S = mat4.create();
var R = mat4.create();
var T = mat4.create();

/** View/Camera matrix **/
var C = mat4.create();


initMatrixes();

function initMatrixes () {
    /** We create the rotation matrix (R) **/
    rotateX(0);
    rotateY(0);
    rotateZ(0);

    translate(0,0,initTranslation);

    /** We set the camera to (0, 0, -8) **/
    C[11]= 8;

}


function createTransformedMatrix() {

    var matrixOut = mat4.create();
    var M = mat4.create();

    /** World coordinate system **/
    mat4.multiply(M, R, S);

    mat4.multiply(M, T, M);

    /** Camera coordinate system **/

    mat4.multiply(M, C, M);

    /** Perspective projection **/

    var d = 4;
    var P = mat4.create();
    P[10] = 0;
    P[11] = -1.0/d;
    mat4.multiply(matrixOut, P, M);

    return matrixOut;

}


function transformPoints() {
    var transformedMatrix = createTransformedMatrix();
    var transformedPoints = [];


    for(var i = 0; i < points.length; i++) {
        var transformedPoint = vec4.create();
        vec4.transformMat4(transformedPoint, points[i], transformedMatrix);
        transformedPoints.push(transformedPoint);

    }


    console.log(transformedPoints);

    for(var i = 0; i < transformedPoints.length; i++) {
        for(var j = 0; j < 3; j++) {
            if(j == 1) {
                transformedPoints[i][j] = -transformedPoints[i][j]/transformedPoints[i][3];

            } else {
                transformedPoints[i][j] = transformedPoints[i][j]/transformedPoints[i][3];

            }
        }
    }

    return transformedPoints;

}



function drawTriangle() {

    var drawingPoints = transformPoints();

    for (var i = 0; i < triangelPoints.length; i++) {
        /** We decrese the values by 1, so we get the indexes of points that we need to connect int the points[] vector. **/
        var point1 = triangelPoints[i][0] -1;
        var point2 = triangelPoints[i][1] -1;
        var point3 = triangelPoints[i][2] -1;


        context.beginPath();
        /** First we move the context to the point1, which is the starting point of our triangle. We get the coordinates from points[] vector **/
        /** We start at (0.0), so we have to add half of the canvas width and height to our drawing points. **/
        context.moveTo(drawingPoints[point1][0]*objectScale + canvas.width/2, drawingPoints[point1][1]*objectScale + canvas.height/2);
        /** Then we draw the lines. **/
        context.lineTo(drawingPoints[point2][0]*objectScale + canvas.width/2, drawingPoints[point2][1]*objectScale + canvas.height/2);
        context.lineTo(drawingPoints[point3][0]*objectScale + canvas.width/2, drawingPoints[point3][1]*objectScale + canvas.height/2);
        context.lineTo(drawingPoints[point1][0]*objectScale + canvas.width/2, drawingPoints[point1][1]*objectScale + canvas.height/2);
        context.lineWidth = 1;
        context.strokeStyle = "red";

        context.stroke();
        context.closePath();


    }


}

function getRadians(angle) {
    return angle*(Math.PI/180);

}


function rotateX(angleDegrees) {

    var angleRadians = getRadians(angleDegrees);


    var rotationMatrixX= mat4.fromValues(  1,    0,                          0,                          0,
                                           0,    Math.cos(angleRadians),     Math.sin(angleRadians),     0,
                                           0,   -Math.sin(angleRadians),     Math.cos(angleRadians),     0,
                                           0,    0,                          0,                          1);

    mat4.multiply(R, R, rotationMatrixX);


}


function rotateY(angleDegrees) {

    var angleRadians = getRadians(angleDegrees);


    var rotationMatrixY = mat4.fromValues( Math.cos(angleRadians),     0,   -Math.sin(angleRadians),     0,
                                           0,                          1,    0,                          0,
                                           Math.sin(angleRadians),     0,    Math.cos(angleRadians),     0,
                                           0,                          0,    0,                          1);

    mat4.multiply(R, R, rotationMatrixY);

}

function rotateZ(angleDegrees) {

    var angleRadians = getRadians(angleDegrees);


    var rotationMatrixZ = mat4.fromValues( Math.cos(angleRadians),     Math.sin(angleRadians),    0,  0,
                                          -Math.sin(angleRadians),     Math.cos(angleRadians),    0,  0,
                                           0,                          0,                         1,  0,
                                           0,                          0,                         0,  1);

    mat4.multiply(R, R, rotationMatrixZ);

}


function translate(x, y, z) {

	var translationMatrix = mat4.fromValues ( 1, 0, 0, 0,
									          0, 1, 0, 0,
									          0, 0, 1, 0,
									          x, y, z, 1,);

    mat4.multiply(T, T, translationMatrix);

}



function scale(x, y, z) {

    sX += x;
    sY += y;
    sZ += z;

    var tmpMatrix = mat4.create();
    var scalingMatrix = mat4.fromValues (   sX,  0,   0,  0,
									        0,   sY,  0,  0,
									        0,   0,   sZ, 0,
									        0,   0,   0,  1);

	mat4.multiply(S, tmpMatrix, scalingMatrix);
}



function perspective() {

    var d = 4;

	var perspectiveMatrix = mat4.fromValues ( 1, 0, 0, 	 0    ,
									          0, 1, 0, 	 0    ,
									          0, 0, 0,  -1.0/d,
									          0, 0, 0, 	 1   );

	return perspectiveMatrix;
}




function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}





var negative = false;

document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        /** W **/
        case 87:

            if(negative){
                rotatationAngle = 0 - rotatationAngle;
                negative = false;
            }
            rotateX(rotatationAngle);
            clear();
            drawTriangle();
            break;

        /** S **/
        case 83:

            if(!negative){
                rotatationAngle = 0 - rotatationAngle;
                negative = true;

            }
            rotateX(rotatationAngle);
            clear();
            drawTriangle();
            break;

        /** A **/
        case 65:

            if(negative){
                rotatationAngle = 0 - rotatationAngle;
                negative = false;
            }
            rotateY(rotatationAngle);
            clear();
            drawTriangle();
            break;

        /** D **/
        case 68:

            if(!negative){
                rotatationAngle = 0 - rotatationAngle;
                negative = true;
            }
            rotateY(rotatationAngle);
            clear();
            drawTriangle();
            break;

        /** Q **/
        case 81:

            if(negative){
                rotatationAngle = 0 - rotatationAngle;
                negative = false;
            }
            rotateZ(rotatationAngle);
            clear();
            drawTriangle();
            break;

        /** E **/
        case 69:

            if(!negative){
                rotatationAngle = 0 - rotatationAngle;
                negative = true;
            }
            rotateZ(rotatationAngle);
            clear();
            drawTriangle();
            break;

        /** F **/
        case 70:

            translate(-translateX, 0, 0);
            clear();
            drawTriangle();
            break;

        /** H **/
        case 72:

            translate(translateX,0 , 0);
            clear();
            drawTriangle();
            break;

        /** R **/
        case 82:

            translate(0, 0, translateZ);
            clear();
            drawTriangle();
            break;

        /** Z **/
        case 90:

            translate(0, 0, -translateZ);
            clear();
            drawTriangle();
            break;

        /** T **/
        case 84:

            translate(0, translateY, 0);
            clear();
            drawTriangle();
            break;

        /** G **/
        case 71:

            translate(0, -translateY, 0);
            clear();
            drawTriangle();
            break;

        /** F **/
        case 70:

            translate(-translateX, 0, 0);
            clear();
            drawTriangle();
            break;

        /** H **/
        case 72:

            translate(translateX,0 , 0);
            clear();
            drawTriangle();
            break;

        /** R **/
        case 82:

            translate(0, 0, translateZ);
            clear();
            drawTriangle();
            break;
            /** Z **/
        case 90:

            translate(0, 0, -translateZ);
            clear();
            drawTriangle();
            break;
            /** T **/
        case 84:

            translate(0, translateY, 0);
            clear();
            drawTriangle();
            break;

        /** G **/
        case 71:

            translate(0, -translateY, 0);
            clear();
            drawTriangle();
            break;

        /** J **/
        case 74:

            scale(-scaleX, 0 , 0);
            clear();
            drawTriangle();
            break;

        /** L **/
        case 76:

            scale(scaleX, 0 , 0);
            clear();
            drawTriangle();
            break;

        /** U **/
        case 85:

            scale(0, 0, scaleZ);
            clear();
            drawTriangle();
            break;

        /** O **/
        case 79:

            scale(0, 0, -scaleZ);
            clear();
            drawTriangle();
            break;

        /** I **/
        case 73:

            scale(0, scaleY , 0);
            clear();
            drawTriangle();
            break;

        /** K **/
        case 75:

            scale(0, -scaleY , 0);
            clear();
            drawTriangle();
            break;

        default:

    }


});
