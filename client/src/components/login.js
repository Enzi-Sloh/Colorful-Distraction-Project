import React, { Component, useEffect, useState } from 'react'
import axios from 'axios';
import {  navigate } from '@reach/router';
const LogIn = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState([])
    useEffect(() =>{axios.get('http://localhost:8000/users')
    .then(res => setUser(res.data));})
    
    const Login = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/login', {
            email,
            password
        })
            .then(res => {
                if(res.data.errors) {
                    setErrors(res.data.errors);
                    console.log("there were errors")
                }
                else {
                    console.log("success!")
                    for(let i = 0; i < user.length; i++ ){
                        if(user[i].email === email){
                            console.log(user[i]._id)
                            navigate('/'+user[i]._id+'/Home')
                        }
                    }
                    //
                }
                console.log(res)
                
            })
            .catch(err => console.log(err))
    }
    
    
    return(
        <div class="main">
            <h1>Login</h1>
            <h3>Know a pet needing a home?</h3>
            <div class="details">
        <form onSubmit={Login}>
            <div class="left">
            <p>
                <label>Email: </label><br/>
                <input type="text" placeholder={email} onChange = {(e)=>setEmail(e.target.value)}/><br/>
                <span>{errors.email ? errors.email.message: "" }</span>
            </p>
            <p>
                <label>Password:</label><br/>
                <input type="text" placeholder={password} onChange = {(e)=>setPassword(e.target.value)} /><br/>
                <span>{errors.password ? errors.password.message: "" }</span>
            </p>
            <button>Add Pet</button>
            </div>
            
            
        </form>
            </div>
        </div>
    )
    
}

export default LogIn;