import React,{useState} from 'react'
import './Delet.css';
 const UpdateUser=()=> {
    const [user,setUser]=useState("");

    return (
        <div className="d-user">
            <h2> Modifier un utilisateur</h2>
            <table align="center"><tbody>
           <tr><td> <label>tapez le nom de l'utilisateur à modifier:</label></td></tr>
       <tr><td>     <input type="text" placeholder="user" onChange={(e)=>{setUser(e.target.value)}}/></td></tr>


       <tr><td>       
       <button >Modifier</button>   </td></tr>
        </tbody></table>
        </div>
    )
}
export default UpdateUser