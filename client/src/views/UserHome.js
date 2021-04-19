import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, navigate } from '@reach/router';
import ProPic from '../components/profilepic'
const Home = (props) =>{
    const [user, setUser] = useState({})
    useEffect(() =>{axios.get('http://localhost:8000/users/' +props.id)
    .then(res => setUser(res.data));})
    return(<div >
        <img src={user.image}></img>
        <button><Link  to ={"/" + props.id + "/canvas"}>to canvas</Link></button>
        <button><Link  to ={"/" + props.id + "/gallery"}>to Gallery</Link></button>
        <ProPic {...props}></ProPic>
    </div>)
}

export default Home;