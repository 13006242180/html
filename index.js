const colorPicker =document.querySelector('input');
const cvs=document.querySelector('canvas');
const ctx  =cvs.getContext('2d');

function init(){
    const w =500,h=300;
    cvs.width= w * devicePixelRatio;
    cvs.height= h *devicePixelRatio;
    cvs.style.width = w + 'px';
    cvs.style.height = h + 'px';
}
init();
const shapes=[];
class Rectangle{
    constructor(color , startX, startY){
        this.color=color;
        this.startX=startX;
        this.startY=startY;
        this.endX = startX;
        this.endY=startY;
    }
    get minX(){
        return Math.min(this.startX,this.endX);
    }
    get maxX(){
        return Math.max(this.startX,this.endX )
    }
    get minY() {
        return Math.min(this.startY, this.endY);
    }
    get maxY() {
        return Math.max(this.startY, this.endY);
    }
    
    draw(){
        ctx.beginPath();
        ctx.moveTo(this.minX*devicePixelRatio,this.minY*devicePixelRatio);
        ctx.lineTo(this.maxX*devicePixelRatio,this.minY*devicePixelRatio);
        ctx.lineTo(this.maxX*devicePixelRatio,this.maxY*devicePixelRatio);
        ctx.lineTo(this.minX*devicePixelRatio,this.maxY*devicePixelRatio);
        ctx.lineTo(this.minX*devicePixelRatio,this.minY*devicePixelRatio);
        ctx.fillStyle=this.color;
        ctx.fill();
        ctx.strokeStyle='#fff';
        ctx.lineWidth =3*devicePixelRatio;
        ctx.stroke();
    }



    isInside(x,y){
         return x>=this.minX && x<=this.maxX && y>=this.minY && y<=this.maxY; 

    }
}


cvs.onmousedown=(e)=>{
    const rect=cvs.getBoundingClientRect();
    const clickX=e.clientX-rect.left;
    const clickY=e.clientY-rect.top;
    const shape =getShape(clickX,clickY);
    if(shape){
//拖动
const{ startX,startY,endX,endY}= shape;
window.onmousemove=e=>{
const disX=e.clientX-rect.left-clickX;
const disY=e.clientY-rect.top-clickY;
shape.startX=startX+disX;
shape.startY=startY+disY;
shape.endX=endX+disX;  
shape.endY=endY+disY;
}
    }else{
        //新建
        const shape=new Rectangle(colorPicker.value,clickX,clickY);
        shapes.push(shape);
        window.onmousemove=(e)=>{
            shape.endX=e.clientX-rect.left;
            shape.endY=e.clientY-rect.top;
        };

    }


window.onmouseup=()=>{
    window.onmousemove=null;
    window.onmouseup=null;
}

};
function getShape(x,y){
    for(let i=shapes.length-1;i>=0;i--){
        const s=shapes[i];
        if(s.isInside(x,y)){
            return s;
        }
    }
    return null;
}
function draw(){
    requestAnimationFrame(draw);
    ctx.clearRect(0,0,cvs.width,cvs.height);
    for(const s of shapes){
        s.draw();
    }
}
draw();