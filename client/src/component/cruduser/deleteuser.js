import React,{useState} from 'react'
import './Delet.css';
import Axios from 'axios';
 const DeleteUser=()=> {
    const [user,setUser]=useState("");

const supprimer =()=>{
Axios.put('http://192.168.4.102:4000/delet',{
prenom: user,   
}).then();
}

    return (
        <div className="d-user">
            <h2> Supprimer un utilisateur</h2>
            <table align="center"><tbody>
           <tr><td> <label>tapez le nom de l'utilisateur à supprimer :</label></td></tr>
       <tr><td>     <input type="text" placeholder="Search for user" onChange={(e)=>{setUser(e.target.value)}}/></td></tr>


       <tr><td>       
       <button onClick={supprimer}>Supprimer</button>   </td></tr>
        </tbody></table>
        </div>
    )
}
export default DeleteUser