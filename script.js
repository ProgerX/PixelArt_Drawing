const pixelSize = 10, backPixelSize = 10;
let Canvas = document.getElementById("Draw_Canvas");
let ctx = Canvas.getContext("2d");
let backCanvas = document.getElementById("Back_Canvas");
let ctxBack = backCanvas.getContext("2d");
let W = Canvas.offsetWidth;
let H = Canvas.offsetHeight;
let p2;
let Color = document.getElementById("colorPicker").value;
let toolIndex = 1;

function colorChanged(){
    Color = document.getElementById("colorPicker").value;
}
function toolChange(vlu){
    toolIndex=vlu;   
}

drawGrid();
function drawGrid(){
    
    let col = "rgb(217, 217, 217)";
    
    for(let i = 0, k = true; i < W/backPixelSize; i++){        
        for(let j = 0; j < H/backPixelSize; j++){
            if(k){
                col = "rgb(217, 217, 217)";
                k=false;
            }
            else{
                col = "rgb(255, 255, 255)";
                k=true;
            }
            
            ctxBack.fillStyle = col;
            ctxBack.fillRect(i*backPixelSize,j*backPixelSize,backPixelSize,backPixelSize);
        }
        if(k)
        k=false;
        else
        k=true;
    }
}

function mouseClick(){
    if(event.which == 1){    
        let x = event.clientX - Canvas.getBoundingClientRect().left;
        let y = event.clientY - Canvas.getBoundingClientRect().top;
        toolIndex=1;
        let p1 = convertPoint(x,y);
        p2=p1;
        drawLine(p2,p1);
    }
    if(event.which == 3){
        let x = event.clientX - Canvas.getBoundingClientRect().left;
        let y = event.clientY - Canvas.getBoundingClientRect().top;
        let p1 = convertPoint(x,y);
        toolIndex=0;
        p2=p1;
        drawLine(p2,p1);
    }
}
function mouseMove(){
    
    if(event.which == 1){
        let x = event.clientX - Canvas.getBoundingClientRect().left;
        let y = event.clientY - Canvas.getBoundingClientRect().top;
        let p1 = convertPoint(x,y);
        toolIndex=1;
        drawLine(p2,p1);
        p2=p1;
    }
    if(event.which == 3){
        let x = event.clientX - Canvas.getBoundingClientRect().left;
        let y = event.clientY - Canvas.getBoundingClientRect().top;
        let p1 = convertPoint(x,y);
        toolIndex=0;
        drawLine(p2,p1);
        p2=p1;
    }
}
document.getElementById("Draw_Canvas").oncontextmenu=new Function('return false');

function convertPoint(x,y){
    return P(Math.floor(x/pixelSize)*pixelSize,Math.floor(y/pixelSize)*pixelSize);
}
function P(x,y){return {x:x,y:y}}

function drawLine(P1,P2){
    ctx.fillStyle = Color;
    
    let deltaX = Math.abs(P2.x - P1.x);
    let deltaY = Math.abs(P2.y - P1.y);
    let signX = P1.x < P2.x ? pixelSize : -pixelSize;
    let signY = P1.y < P2.y ? pixelSize : -pixelSize;
    
    let error = deltaX - deltaY;
    
    if(toolIndex==1)
    ctx.fillRect(P2.x,P2.y,pixelSize,pixelSize);
    else
    ctx.clearRect(P2.x, P2.y, pixelSize, pixelSize);
    
    while(P1.x != P2.x || P1.y != P2.y) 
    {        
        if(toolIndex==1)
        ctx.fillRect(P1.x,P1.y,pixelSize,pixelSize);
        else
        ctx.clearRect(P1.x, P1.y, pixelSize, pixelSize);
        let error2 = error * 2;
        
        if(error2 > -deltaY) 
        {
            error -= deltaY;
            P1.x += signX;
        }
        if(error2 < deltaX) 
        {
            error += deltaX;
            P1.y += signY;
        }
    }
}
