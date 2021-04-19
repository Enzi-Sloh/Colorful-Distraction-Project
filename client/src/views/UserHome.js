import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, navigate } from '@reach/router';
import ProPic from '../components/profilepic'
const Home = (props) =>{
    const [user, setUser] = useState({})
    const[displayup,setDisplayUp] = useState(false)
    useEffect(() =>{axios.get('http://localhost:8000/users/' +props.id)
    .then(res => setUser(res.data));})
    const displayupload = () =>{
        setDisplayUp(true)
}
const displaynone = () =>{
    setDisplayUp(false)
}

    return(<div >
        <img class="image--cover" src={user.image} onMouseOver={displayupload}></img>
        {displayup ? <div style={{position: 'absolute', zIndex: '2'}}><div onMouseLeave={displaynone} style={{ position: 'fixed',top: '0px',right: '0px',bottom: '0px', left: '0px'}}><ProPic {...props}></ProPic></div> </div> :null}
        <button class="subscribe-button"><Link  to ={"/" + props.id + "/canvas"}>Start Drawing!</Link></button>
        <button class="subscribe-button"><Link  to ={"/" + props.id + "/gallery"}>to Gallery</Link></button>
        <button class="subscribe-button"><Link  to ={"/" }>LogOut</Link></button>
    </div>)
}

export default Home;