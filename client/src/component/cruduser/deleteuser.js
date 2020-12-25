import React,{useState} from 'react'
import './Delet.css';
 const DeleteUser=()=> {
    const [user,setUser]=useState("");

    return (
        <div className="d-user">
            <h2> Supprimer un utilisateur</h2>
            <table align="center"><tbody>
           <tr><td> <label>tapez le nom de l'utilisateur à supprimer :</label></td></tr>
       <tr><td>     <input type="text" placeholder="user" onChange={(e)=>{setUser(e.target.value)}}/></td></tr>


       <tr><td>       
       <button >Supprimer</button>   </td></tr>
        </tbody></table>
        </div>
    )
}
export default DeleteUser