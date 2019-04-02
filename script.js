const pixelSize = 10, backPixelSize = 10;
let Canvas = document.getElementById("Draw_Canvas");
let ctx = Canvas.getContext("2d");
let backCanvas = document.getElementById("Back_Canvas");
let ctxBack = backCanvas.getContext("2d");
let W = Canvas.offsetWidth;
let H = Canvas.offsetHeight;
let p2;
let colorPicker = document.getElementById("colorPicker");
let Color = colorPicker.value;
let toolIndex = 0;
let Tools = document.getElementsByClassName('Tools');
let toolsImages = ['url(Tools/pencil.png)','url(Tools/eraser.png)','url(Tools/fill.png)','url(Tools/pipette.png)'];
let colors = ['#000000','#FFFFFF','#808080','#D3D3D3','#8B0000','#964B00','#FF0000','#FF69B4','#FFA500','#FFD700','#FFFF00','#FFD697','#00FF00','#ADFF2F','#4B0082','#40E0D0','#0000FF','#800080'];
let colorDiv = document.getElementsByClassName("colorDiv");
for(let i  = 0;i<colorDiv.length;i++){
    colorDiv[i].style.backgroundColor = colors[i];
}
changeCursor(0);
function changeCursor(n){
    Canvas.style.cursor = toolsImages[n]+'0 17,auto';
}

function colorChanged(){
    Color = colorPicker.value;
}
function colorChange(ind){
    Color = colors[ind];
    colorPicker.value=colors[ind];
}
function toolChange(vlu){
    toolIndex=vlu;
    changeCursor(vlu);
    for(let i = 0; i<Tools.length;i++){
        Tools[i].style.boxShadow = 'inset 0 0 0 0 blue';
    }
    
    Tools[vlu].style.boxShadow = 'inset 0 0 0 2px blue';
}

function rgbToHex(rgb){
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}
function mouseClick(){
    if(event.which == 1){    
        let x = event.clientX - Canvas.getBoundingClientRect().left;
        let y = event.clientY - Canvas.getBoundingClientRect().top;
        let p1 = convertPoint(x,y);
        p2=p1;
        if(toolIndex<2){
            drawLine(p2,p1,toolIndex);
            changeCursor(toolIndex);
        }
        else
        if(toolIndex==2){
            floodFill(x,y,Color,'#000000');
        }
        else
        if(toolIndex==3){
            pip()
        }
        
    } 
    else
    if(event.which == 2){
        pip();
    }
    else
    if(event.which == 3){
        let x = event.clientX - Canvas.getBoundingClientRect().left;
        let y = event.clientY - Canvas.getBoundingClientRect().top;
        let p1 = convertPoint(x,y);       
        p2=p1;
        if(toolIndex==1){
            drawLine(p2,p1,0);
            changeCursor(0);
        }else
        if(toolIndex==0){            
            drawLine(p2,p1,1);
            changeCursor(1);
        }
    }    
}
function mouseMove(){
    
    if(event.which == 1){
        let x = event.clientX - Canvas.getBoundingClientRect().left;
        let y = event.clientY - Canvas.getBoundingClientRect().top;
        let p1 = convertPoint(x,y);
        if(toolIndex<2){
            drawLine(p2,p1,toolIndex);
            changeCursor(toolIndex);
        }
        else
        if(toolIndex==3){
            pip()
        }

        p2=p1;
    }
    else
    if(event.which == 2){        
        pip();
    }else
    if(event.which == 3){
        let x = event.clientX - Canvas.getBoundingClientRect().left;
        let y = event.clientY - Canvas.getBoundingClientRect().top;
        let p1 = convertPoint(x,y);
        if(toolIndex==1){
            drawLine(p2,p1,0);
            changeCursor(0);
        }else
        if(toolIndex==0){            
            drawLine(p2,p1,1);
            changeCursor(1);
        }
        p2=p1;
    }
    else
    {
        changeCursor(toolIndex);
    }
}

function mouseUp(){    
    changeCursor(toolIndex);
}

document.getElementById("Draw_Canvas").oncontextmenu=new Function('return false');

function colorDivHover(ind){
    
    for(let i = 0;i<colorDiv.length;i++){
        colorDiv[i].style.boxShadow = '';
    }
    colorDiv[ind].style.boxShadow = '0 0 4px black';
    
}

function colorDivOut(){
    for(let i = 0;i<colorDiv.length;i++){
        colorDiv[i].style.boxShadow = '';
    }
}


function convertPoint(x,y){
    return P(Math.floor(x/pixelSize)*pixelSize,Math.floor(y/pixelSize)*pixelSize);
}
function P(x,y){return {x,y}}

function drawLine(P1,P2,n){
    ctx.fillStyle = Color;
    
    let deltaX = Math.abs(P2.x - P1.x);
    let deltaY = Math.abs(P2.y - P1.y);
    let signX = P1.x < P2.x ? pixelSize : -pixelSize;
    let signY = P1.y < P2.y ? pixelSize : -pixelSize;
    
    let error = deltaX - deltaY;
    
    if(n == 0){
        ctx.fillRect(P2.x,P2.y,pixelSize,pixelSize);
    }
    else
    if(n == 1){        
        ctx.clearRect(P2.x, P2.y, pixelSize, pixelSize);
    }
    
    while(P1.x != P2.x || P1.y != P2.y) 
    {        
        if(n == 0){
            ctx.fillRect(P1.x,P1.y,pixelSize,pixelSize);
        }
        else
        if(n == 1){        
            ctx.clearRect(P1.x, P1.y, pixelSize, pixelSize);
        }

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

function pip(){
    let clr = ctx.getImageData(event.clientX - Canvas.getBoundingClientRect().left,event.clientY - Canvas.getBoundingClientRect().top,1,1).data;    
    colorPicker.value=rgbToHex(clr);
    Color = colorPicker.value;
    changeCursor(3);
    
    if(clr=='0,0,0,0'){
        if(toolIndex!=3){                
            toolIndex=1;                
            for(let i = 0; i<Tools.length;i++){
                Tools[i].style.boxShadow = 'inset 0 0 0 0 blue';
            }            
            Tools[1].style.boxShadow = 'inset 0 0 0 2px blue';
        }
    }
    else
    {
        if(toolIndex!=3){
            toolIndex=0;            
            for(let i = 0; i<Tools.length;i++){
                Tools[i].style.boxShadow = 'inset 0 0 0 0 blue';
            }                
            Tools[0].style.boxShadow = 'inset 0 0 0 2px blue';
        }
    }    
    
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

function floodFill(x, y, color, borderColor){
    var imageData = ctx.getImageData(0, 0, W, H);
    var width = W;
    var height = H;
    var stack = [[x, y]];
    var pixel;
    var point = 0;
    while (stack.length > 0)
    {   
        pixel = stack.pop();
        if (pixel[0] < 0 || pixel[0] >= width)
            continue;
        if (pixel[1] < 0 || pixel[1] >= height)
            continue;
        
        // Alpha
        point = pixel[1] * 4 * width + pixel[0] * 4 + 3;
        
        // Если это не рамка и ещё не закрасили
        if (imageData.data[point] != borderColor && imageData.data[point] != color)
        {
            // Закрашиваем
            imageData.data[point] = color;
            
            // Ставим соседей в стек на проверку
            stack.push([
                pixel[0] - 1,
                pixel[1]
            ]);
            stack.push([
                pixel[0] + 1,
                pixel[1]
            ]);
            stack.push([
                pixel[0],
                pixel[1] - 1
            ]);
            stack.push([
                pixel[0],
                pixel[1] + 1
            ]);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}