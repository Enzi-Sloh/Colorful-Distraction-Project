
import axios from 'axios';
import React, { useEffect, useState } from 'react';


const ProPic = (props) => {
    const [photo, setPhoto] = useState("")
    const [url, setUrl] = useState("");
    const onDrop = (e) => {
        setPhoto(e.target.files[0]);
    };
    useEffect(()=>{
        if(url)
        {fetch("http://localhost:8000/users/"+props.id+"/image",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                image: url
            })
        })
        .then(res=>res.json())
        .catch(err=>{
            console.log(err)
        })}
    },[url])
    const photoupload = (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append("file", photo)
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
    return(<div >
        <form onSubmit={photoupload} encType='multipart/form-data'>
        <input 
                type="file" 
                name="image"
                onChange={onDrop}
            />
        <button  type = 'submit'>SUBMIT</button>
        </form>
    </div>)
}
export default ProPic;