const pixelSize = 30, backPixelSize = 10;
let Canvas = document.getElementById("Draw_Canvas");
let ctx = Canvas.getContext("2d");
let backCanvas = document.getElementById("Back_Canvas");
let ctxBack = backCanvas.getContext("2d");
let W = Canvas.offsetWidth;
let H = Canvas.offsetHeight;
let p2;
let colorPicker = document.getElementById("colorPicker");
let Color = colorPicker.value;
let toolIndex = 1,tools = 1;
let colors = ['#000000','#FFFFFF','#808080','#D3D3D3','#8B0000','#964B00','#FF0000','#FF69B4','#FFA500','#FFD700','#FFFF00','#FFD697','#00FF00','#ADFF2F','#4B0082','#40E0D0','#0000FF','#800080'];
let colorDiv = document.getElementsByClassName("colorDiv");
    for(let i  = 0;i<colorDiv.length;i++){
        colorDiv[i].style.backgroundColor = colors[i];
    }


function colorChanged(){
    Color = colorPicker.value;
}
function colorChange(ind){
    Color = colors[ind];
    colorPicker.value=colors[ind];
}
function toolChange(vlu){
    tools=vlu;
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
    function rgbToHex(rgb){
        return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
    }

    if(event.which == 2){
        let clr = ctx.getImageData(event.clientX - Canvas.getBoundingClientRect().left,event.clientY - Canvas.getBoundingClientRect().top,1,1).data;
        if(clr=='0,0,0,0'){
            tools=0;
        }
        else
        {
            colorPicker.value=rgbToHex(clr);
            Color = colorPicker.value;
            tools=1;
        }    
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
    
    if(toolIndex==1 && tools == 1)
    ctx.fillRect(P2.x,P2.y,pixelSize,pixelSize);
    else
    ctx.clearRect(P2.x, P2.y, pixelSize, pixelSize);
    
    while(P1.x != P2.x || P1.y != P2.y) 
    {        
        if(toolIndex==1 && tools == 1)
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
