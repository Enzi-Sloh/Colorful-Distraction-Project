import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { ChromePicker } from 'react-color'
import rough from "roughjs/bundled/rough.esm";
import axios from 'axios';
//make tools that change it from rect, line, and pen

let bgc = "white"


const CanvasStage = (props) => {
    const [color, setColor] = useState("black");
    const [shadeColor, setShadeColor] = useState("black");
    const [shadeblur, setShadeBlur] = useState(0);
    const [drawing, setDrawing]= useState(false);
    const [elements, setElements] = useState([]);
    const [drawWidth, setDrawWidth] = useState(1);
    const [tool, setTool] =  useState("brush")
    const [url, setUrl] = useState("");
    const[displayC,setDisplayC] = useState(false)
    const[displaySh,setDisplaySh] = useState(false)
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const restoreRef = useRef(null);
    const redoRef = useRef(null);
    const indexref = useRef(null);
    const reIndRef = useRef(null);

    useEffect(()=>{
        if(url)
        {fetch("http://localhost:8000/users/"+props.id+"/art",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                art: url
            })
        })
        .then(res=>res.json())
        .catch(err=>{
            console.log(err)
        })}
    },[url])

    useLayoutEffect(() =>{
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d")
        contextRef.current = ctx;
        ctx.clearRect(0,0,canvas.width,canvas.height)
        ctx.fillStyle = bgc
        ctx.fillRect(0,0, canvas.width, canvas.height)
        
        let restore_array = [];
        restoreRef.current = restore_array;
        let redo_array = [];
        redoRef.current = redo_array;
        let index = -1;
        indexref.current = index;
        let reindex = -1;
        reIndRef.current = reindex;
        restoreRef.current.push(contextRef.current.getImageData(0,0, canvasRef.current.width, canvasRef.current.height))
        indexref.current += 1;
    }, [elements]);
    const  getMousePos = (canvas, e) => {
        canvas = canvasRef.current;
        var rect = canvas.getBoundingClientRect(), // abs. size of element
            scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
            scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
      
        return {
          x: (e.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
          y: (e.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
      }
    const handleMouseDown = (e) => {
        setDrawing(true);
        const canvas = canvasRef.current;
        let pos = getMousePos(canvas, e);
        if(tool == "brush" || "eraser")
        {contextRef.current.beginPath()
        contextRef.current.moveTo(pos.x, pos.y)}


        e.preventDefault();
    }
    const handleMouseMove = (e) => {
        if(!drawing) return;
        const canvas = canvasRef.current;
        let pos = getMousePos(canvas, e);
        if(tool == "brush")
        {contextRef.current.lineTo(pos.x, pos.y)
        contextRef.current.strokeStyle = color;
        contextRef.current.lineCap = "round"
        contextRef.current.lineWidth = drawWidth;
        contextRef.current.shadowBlur = shadeblur;
        contextRef.current.shadowColor = shadeColor;
        contextRef.current.stroke()}
        if(tool == "eraser"){
            {contextRef.current.lineTo(pos.x, pos.y)
                contextRef.current.strokeStyle = bgc;
                contextRef.current.lineCap = "round"
                contextRef.current.lineWidth = drawWidth;
                contextRef.current.stroke()}
        }
    }
    const handleMouseUp = (e) => {
        if(tool == "brush"|| "eraser")
        {contextRef.current.closePath();}
        setDrawing(false);

        if(e.type != 'mouseout'){
            restoreRef.current.push(contextRef.current.getImageData(0,0, canvasRef.current.width, canvasRef.current.height))
            indexref.current += 1;
        }
        
    }
    const clearcanvas = () => {
        contextRef.current.fillStyle = bgc;
        contextRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height)
        contextRef.current.fillRect(0,0, canvasRef.current.width, canvasRef.current.height)  
        
        restoreRef.current.push(contextRef.current.getImageData(0,0, canvasRef.current.width, canvasRef.current.height))
        indexref.current += 1;
    }

    const undo = () =>{
        indexref.current -=1;
        redoRef.current.push(contextRef.current.getImageData(0,0, canvasRef.current.width, canvasRef.current.height))
        reIndRef.current +=1;
        restoreRef.current.pop();
        contextRef.current.putImageData(restoreRef.current[indexref.current], 0, 0);
    }
    const redo = () =>{
        contextRef.current.putImageData(redoRef.current[reIndRef.current], 0, 0);
        restoreRef.current.push(contextRef.current.getImageData(0,0, canvasRef.current.width, canvasRef.current.height))
        indexref.current += 1;
        reIndRef.current -=1;
        redoRef.current.pop();
    }
    const displayCol = () =>{
            setDisplayC(true)
    }
    const displaySha = () =>{
        setDisplaySh(true)
}
const displaynone = () =>{
    setDisplaySh(false)
    setDisplayC(false)
}
const savecanvas = () =>{
    const save = canvasRef.current.toDataURL();
    console.log(save);
    const data = new FormData()
    data.append("file", save)
        data.append("upload_preset", "cdgallery")
        data.append("cloud_name", "galleries")
        fetch("	https://api.cloudinary.com/v1_1/galleries/image/upload",{
            method:"post",
            body:data
        })
        .then (res=>res.json())
        .then(data =>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
}
  return (
    <div  id="main">
        <canvas id="canvas" ref={canvasRef} width={window.innerWidth *.80 } height={window.innerHeight *.60}
        onMouseDown = {handleMouseDown} onMouseMove = {handleMouseMove} onMouseUp = {handleMouseUp}></canvas>
        <div id="toolbar">
        <button  onClick={displayCol} style={{
            backgroundColor: color,
            height: 20,
            width: 20,
            borderRadius: 100,
        }}></button>
        {displayC ? <div style={{position: 'absolute', zIndex: '2'}}><div onClick={displaynone} style={{ position: 'fixed',top: '0px',right: '0px',bottom: '0px', left: '0px'}}><ChromePicker disableAlpha color={color} onChangeComplete = {(color)=>setColor(color.hex)} ></ChromePicker></div> </div> :null}
        <button style={{
            backgroundColor: shadeColor,
            height: 20,
            width: 20,
            borderRadius: 100,
        }} onClick={displaySha}></button>
        {displaySh ? <div style={{position: 'absolute', zIndex: '3'}}><div onClick={displaynone} style={{ position: 'fixed',top: '0px',right: '0px',bottom: '0px', left: '0px'}}><ChromePicker  disableAlpha color={shadeColor} onChangeComplete = {(color)=>setShadeColor(color.hex)}></ChromePicker></div></div> :null}
        <input type ="range" value={drawWidth} min="1" max="30" onInput={(e)=>setDrawWidth(e.target.value)} />
        <input type ="range" value={shadeblur} min="0" max="10" onInput={(e)=>setShadeBlur(e.target.value)} />
        <button onClick={clearcanvas} type="button">clear</button>
        <button onClick={undo} type="button">undo</button>
        <button onClick={redo} type="button">redo</button>
        <select  onClick={(e)=>setTool(e.target.value)}>
            <option  value="brush">Brush</option>
            <option  value="eraser">Eraser</option>
        </select>
        <button onClick={savecanvas}>SAVE</button>
        </div>

    </div>
  );
};

export default CanvasStage;