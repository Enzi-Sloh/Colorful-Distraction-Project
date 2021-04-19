import React, { useState } from 'react'
import axios from 'axios';
import { Link, navigate } from '@reach/router';
const User = () =>{
    const [email, setEmail] = useState("");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState({});
    const createUser = ( e ) => {
        e.preventDefault();
        axios.post('http://localhost:8000/signup', {
            email,
            username,
            password,
            confirmPassword
        })
            .then(res => {
                if(res.data.errors) {
                    setErrors(res.data.errors);
                }
                else {
                    findNsend()
                }
                console.log(res)
                
            })
            .catch(err => console.log(err))
    }
    const findNsend = (user) =>{
        axios.get('http://localhost:8000/users')
        .then(res => {for(let i = 0; i < res.data.length; i++ ){
            if(res.data[i].email === email){
                navigate('/'+res.data[i]._id+'/Home')
            }
        }})
    }
    return(
        <div class="main">
            <h1>Sign Up</h1>
            <div class="details">
        <form onSubmit={createUser} >
            <div class="left">
            <p>
                <label>Email: </label><br/>
                <input type="text" placeholder={email} onChange = {(e)=>setEmail(e.target.value)}/><br/>
                <span>{errors.email ? errors.email.message: "" }</span>
            </p>
            <p>
                <label>Username:</label><br/>
                <input type="text"  onChange = {(e)=>setUserName(e.target.value)}/><br/>
                <span>{errors.username ? errors.username.message: "" }</span>
            </p>
            <p>
                <label>Password:</label><br/>
                <input type="text"  onChange = {(e)=>setPassword(e.target.value)}/><br/>
                <span>{errors.password ? errors.password.message: "" }</span>
            </p>
            <p>
                <label>Confirm Password:</label><br/>
                <input type="text"  onChange = {(e)=>setConfirmPassword(e.target.value)}/><br/>
                <span>{errors.confirmPassword ? errors.confirmPassword.message: "" }</span>
            </p>
            <button>Register</button>
            </div>
            
            
        </form>
            </div>
        </div>
    )
    
}

export default User;