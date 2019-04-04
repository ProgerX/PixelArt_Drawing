const pixelSize = 10, backPixelSize = 10;W=720;H=720;
let Canvas = document.getElementById("Draw_Canvas");
Canvas.width=W;
Canvas.height=H;
let ctx = Canvas.getContext("2d");
let backCanvas = document.getElementById("Back_Canvas");
backCanvas.width=W;
backCanvas.height=H;
let ctxBack = backCanvas.getContext("2d");
let w = W/pixelSize;
let h = H/pixelSize;
let p2;
let colorPicker = document.getElementById("colorPicker");
let Color =colorPicker.value;
let toolIndex = 0;
let Tools = document.getElementsByClassName('Tools');
let toolsImages = ['url(Images/Tools/pencil.png)','url(Images/Tools/eraser.png)','url(Images/Tools/fill.png)','url(Images/Tools/pipette.png)'];
let colors = ['#000000','#FFFFFF','#808080','#D3D3D3','#8B0000','#964B00','#FF0000','#FF69B4','#FFA500','#FFD700','#FFFF00','#FFD697','#00FF00','#ADFF2F','#0000FF','#40E0D0','#4B0082','#800080'];
let colorDiv = document.getElementsByClassName("colorDiv");
let steps = new Array;
let stepIndex = -1;
let matrixPixels =new Array(w);
for(let i = 0;i<w;i++){  
    matrixPixels[i]=new Array(h);
    for(let j =0;j<h;j++)
        matrixPixels[i][j]="0"
}


for(let i  = 0;i<colorDiv.length;i++){
    colorDiv[i].style.backgroundColor = colors[i];
}
changeCursor(0);
function changeCursor(n){
    Canvas.style.cursor = toolsImages[n]+'0 17,auto';
}
function keyPress(e){
    if(e.code=='KeyB')
    toolChange(0);
    if(e.code=='KeyE')
        toolChange(1);
    if(e.code=='KeyG')
        toolChange(2);
        if(e.code=='KeyI')
        toolChange(3); 
        if(e.code=='KeyZ' && e.ctrlKey)
        undo(0);
        if(e.code=='KeyY' && e.ctrlKey)
        undo(1);
    }
    function colorChanged(){
        Color = colorPicker.value;
    }
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
function colorChange(ind){
    Color = colors[ind];
    colorPicker.value=colors[ind];
}
function toolChange(vlu){
    toolIndex=vlu;
    changeCursor(vlu);
    for(let i = 0; i<Tools.length;i++){
        Tools[i].style.boxShadow = 'inset 0 0 0 0 white';
    }
    
    Tools[vlu].style.boxShadow = 'inset 0 0 0 2px white';
}
function stepTaken(){    
    stepIndex++;
    if(steps.length>stepIndex)
        for(let i = steps.length; i>stepIndex;i--){
            steps.pop();
        }        
    steps.push('');
}
function undo(n){
    if(n==0 && steps.length!=0){
        let str1 = steps[stepIndex].split(';');
        str1.pop();
        let str2 = Array();
        for(let i = 0; i < str1.length;i++){
            str2.push(str1[i].split(','));
            ctx.fillStyle = str2[i][2];
            matrixPixels[str2[i][0]][str2[i][1]] = str2[i][2];
            if(str2[i][2] == "0"){
                ctx.clearRect(str2[i][0]*pixelSize, str2[i][1]*pixelSize, pixelSize, pixelSize)
            }
            else{
                ctx.fillRect(str2[i][0]*pixelSize, str2[i][1]*pixelSize,pixelSize,pixelSize);
            }
        }

        stepIndex--; 
    }   
    else
    if(n==1 && steps.length>stepIndex+1)
    {
        stepIndex++;
        let str1 = steps[stepIndex].split(';');
        str1.pop();
        let str2 = Array();
        for(let i = 0; i < str1.length;i++){
            str2.push(str1[i].split(','));
            ctx.fillStyle = str2[i][3];
            matrixPixels[str2[i][0]][str2[i][1]] = str2[i][3];
            if(str2[i][3] == "0"){
                ctx.clearRect(str2[i][0]*pixelSize, str2[i][1]*pixelSize, pixelSize, pixelSize)
            }
            else{
                ctx.fillRect(str2[i][0]*pixelSize, str2[i][1]*pixelSize,pixelSize,pixelSize);
            }
        }
    }
}

function getImage(){
    let cnvs = document.createElement('canvas');
    let ctxSave = cnvs.getContext("2d");
    cnvs.style.display="none";
    cnvs.width=w;
    cnvs.height=h;
    for(let i = 0;i<w;i++){
        for(let j =0;j<h;j++){    
            if(matrixPixels[i][j]!="0"){
                ctxSave.fillStyle = matrixPixels[i][j];
                ctxSave.fillRect(i,j,1,1);
            }
        }
    }
    let imageData = cnvs.toDataURL();
    let image = new Image();
    image.src = imageData;
    cnvs.remove();
    return image;
} 
function saveImage(image) {
    let link = document.createElement("a");
 
    link.setAttribute("href", image.src);
    link.setAttribute("download", "canvasImage");
    link.click();
} 
function saveCanvasAsImageFile(){
    let image = getImage();
    saveImage(image);
}
function rgbToHex(rgb){
    if(rgb == '0,0,0,0')
        return 'none'
    else
        return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}
function mouseClick(){
    if(event.which == 1){    
        let x = event.clientX - Canvas.getBoundingClientRect().left;
        let y = event.clientY - Canvas.getBoundingClientRect().top;
        let p1 = convertPoint(x,y);
        p2=p1;
        if(toolIndex<2){
            stepTaken();
            drawLine(p2,p1,toolIndex);
            changeCursor(toolIndex);
        }
        else
        if(toolIndex==2){            
            let c = matrixPixels[p1.x/pixelSize][p1.y/pixelSize];
            stepTaken();            
            ctx.fillStyle = Color;
            floodFill(convertPoint(x,y).x/pixelSize,convertPoint(x,y).y/pixelSize,c);
        }
        else
        if(toolIndex==3){
            let x = event.clientX - Canvas.getBoundingClientRect().left;
            let y = event.clientY - Canvas.getBoundingClientRect().top;
            let p1 = convertPoint(x,y);
            pip(p1);
        }      
    } 
    else
    if(event.which == 2){
        let x = event.clientX - Canvas.getBoundingClientRect().left;
        let y = event.clientY - Canvas.getBoundingClientRect().top;
        let p1 = convertPoint(x,y);
        pip(p1);
    }
    else
    if(event.which == 3){
        let x = event.clientX - Canvas.getBoundingClientRect().left;
        let y = event.clientY - Canvas.getBoundingClientRect().top;
        let p1 = convertPoint(x,y);
        p2=p1;
        if(toolIndex==1){
            stepTaken();
            drawLine(p2,p1,0);
            changeCursor(0);
        }else
        if(toolIndex==0){
            stepTaken();      
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
            let x = event.clientX - Canvas.getBoundingClientRect().left;
            let y = event.clientY - Canvas.getBoundingClientRect().top;
            let p1 = convertPoint(x,y);
            pip(p1);
        }

        p2=p1;
    }
    else
    if(event.which == 2){
        let x = event.clientX - Canvas.getBoundingClientRect().left;
        let y = event.clientY - Canvas.getBoundingClientRect().top;
        let p1 = convertPoint(x,y);
        pip(p1);
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
    
    if(n == 0 && matrixPixels[P2.x/pixelSize][P2.y/pixelSize] != Color){
        ctx.fillRect(P2.x,P2.y,pixelSize,pixelSize);
        steps[stepIndex]+=P2.x/pixelSize + ',' + P2.y/pixelSize + ',' + matrixPixels[P2.x/pixelSize][P2.y/pixelSize] + ',' + Color + ';' ;
        matrixPixels[P2.x/pixelSize][P2.y/pixelSize] = Color;
    }
    else
    if(n == 1 && matrixPixels[P2.x/pixelSize][P2.y/pixelSize] != "0"){        
        ctx.clearRect(P2.x, P2.y, pixelSize, pixelSize);        
        steps[stepIndex]+=P2.x/pixelSize + ',' + P2.y/pixelSize + ',' + matrixPixels[P2.x/pixelSize][P2.y/pixelSize] + ',' +  "0" + ';' ;
        matrixPixels[P2.x/pixelSize][P2.y/pixelSize] = "0";
    }
    
    while(P1.x != P2.x || P1.y != P2.y) 
    {        
        if(n == 0 && matrixPixels[P1.x/pixelSize][P1.y/pixelSize] != Color){
            ctx.fillRect(P1.x,P1.y,pixelSize,pixelSize);            
            steps[stepIndex]+=P1.x/pixelSize + ',' + P1.y/pixelSize + ',' + matrixPixels[P1.x/pixelSize][P1.y/pixelSize] + ',' + Color +';' ;
            matrixPixels[P1.x/pixelSize][P1.y/pixelSize] = Color;
        }
        else
        if(n == 1 && matrixPixels[P1.x/pixelSize][P1.y/pixelSize] != "0"){        
            ctx.clearRect(P1.x, P1.y, pixelSize, pixelSize);            
            steps[stepIndex]+=P1.x/pixelSize + ',' + P1.y/pixelSize + ',' + matrixPixels[P1.x/pixelSize][P1.y/pixelSize] + ',' + "0" + ';' ;
            matrixPixels[P1.x/pixelSize][P1.y/pixelSize] = "0";
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

function floodFill(x,y,c){
    ctx.fillRect(x*pixelSize,y*pixelSize,pixelSize,pixelSize);
    steps[stepIndex]+= x + ',' + y + ',' + matrixPixels[x][y] + Color + ';' ;
    matrixPixels[x][y]=Color;

    if(x!=w-1)
        if(matrixPixels[x+1][y]==c){
            floodFill(x+1,y,c);
        }
    if(y!=h-1)    
        if(matrixPixels[x][y+1]==c){
            floodFill(x,y+1,c);
        } 
    if(x!=0)   
        if(matrixPixels[x-1][y]==c){
            floodFill(x-1,y,c);
        }
    if(y!=0)
        if(matrixPixels[x][y-1]==c){
            floodFill(x,y-1,c);
        } 
}
function pip(p){

    let clr = matrixPixels[p.x/pixelSize][p.y/pixelSize]; 
    changeCursor(3);
    
    if(clr=="0"){
        if(toolIndex!=3){
            toolChange(1);
        }
    }
    else
    {
        colorPicker.value = Color = clr;
        if(toolIndex!=3 && toolIndex!=2){
            toolChange(0);
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