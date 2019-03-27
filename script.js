let Canvas = document.getElementById("Draw_Canvas");
let ctx = Canvas.getContext("2d");
let W = Canvas.offsetWidth;
let H = Canvas.offsetHeight;
let p2;
drawGrid();
function drawGrid(){
   
    let col = "rgb(217, 217, 217)";

    for(let i = 0, k = true; i < W/10; i++){        
        for(let j = 0; j < H/10; j++){
            if(k){
                col = "rgb(217, 217, 217)";
                k=false;
            }
            else{
                col = "rgb(255, 255, 255)";
            k=true;
            }

            ctx.fillStyle = col;
            ctx.fillRect(i*10,j*10,10,10);
        }
        if(k)
            k=false;
        else
            k=true;
    }
}

let mouseDown = 0;
document.body.onmousedown = function() { 
    mouseDown = 1;
}
document.body.onmouseup = function() {
    mouseDown = 0;
}

function mouseClick(){
    let x = event.clientX - Canvas.getBoundingClientRect().left;
    let y = event.clientY - Canvas.getBoundingClientRect().top;
    let p1 = convertPoint(x,y);
    p2=p1;
    drawLine(p2,p1);
    
}

function mouseMove(){
    
    if(mouseDown==1){
        let x = event.clientX - Canvas.getBoundingClientRect().left;
        let y = event.clientY - Canvas.getBoundingClientRect().top;
        let p1 = convertPoint(x,y);
        drawLine(p2,p1);
        p2=p1;
    }
}

function convertPoint(x,y){
    return P(Math.floor(x/10)*10,Math.floor(y/10)*10);
}
function P(x,y){return {x:x,y:y}}

function drawLine(P1,P2){
    ctx.fillStyle = "black";

    let deltaX = Math.abs(P2.x - P1.x);
    let deltaY = Math.abs(P2.y - P1.y);
    let signX = P1.x < P2.x ? 10 : -10;
    let signY = P1.y < P2.y ? 10 : -10;
    
    let error = deltaX - deltaY;
    
    ctx.fillRect(P2.x,P2.y,10,10);
    while(P1.x != P2.x || P1.y != P2.y) 
   {        
        ctx.fillRect(P1.x,P1.y,10,10);
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
