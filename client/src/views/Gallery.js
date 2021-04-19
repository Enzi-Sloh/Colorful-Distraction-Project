import React, { useEffect, useState } from 'react';
import axios from 'axios';
const Gallery = (props) =>{
    const [userart, setUserArt] = useState([])
    
    useEffect(() =>{
        let art = []
        axios.get('http://localhost:8000/users/' +props.id)
    .then(res => {for(let i = 0; i < res.data.art.length; i++){
                art.push(<img src={res.data.art[i]} class="sketchy"></img>)
            }
            setUserArt(art)})
    
    })
    // if(user.art){
    //     
    // }
    return(<div >
        {userart}
    </div>)
}
export default Gallery;