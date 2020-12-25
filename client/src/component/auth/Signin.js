import React,{useState} from 'react';
import Axios from 'axios';

 const Signin =()=> {
     
     const    [username,setUsername]=useState("");
     const    [password,setPassword]=useState("");
     const Join =()=>{
     Axios.post('http://192.168.4.104:4000/login',{
 username: username,
 password:password,
 
     }).then ((response)=>{
         console.log (response.message);
     })};
     const handleSubmit =(e)=>{
    e.preventDefault();
    console.log(username,password);
 }
    return (
      <div className="sign"> 
          <form onSubmit={handleSubmit}>
            <h2> Page Login</h2>
            <table align ="center">
                <tbody>

            <tr><td><label>UserName :</label>
            <input type ="text" placeholder="username"  onChange={(e)=>{setUsername(e.target.value)}}/></td></tr>
            <tr><td><label >Password :</label>
            <input type="password" placeholder="password" onChange={(e)=>{setPassword(e.target.value)}}/></td></tr>
           <tr><td colSpan="2"> <button  onClick={Join} >Valider</button></td></tr>
            </tbody>
            </table>
            </form>
        </div>
    )
}
export default Signin