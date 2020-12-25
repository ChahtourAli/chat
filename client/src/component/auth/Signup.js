import React,{useState} from 'react'
import Axios from 'axios';

   const Signup =()=> {
   const [nom,setNom]= useState("");
   const [prenom,setPrenom]= useState("");
   const [login,setLogin]= useState("");
   const [mdp,setMdp]= useState("");
   const Ajout =()=>{
    Axios.post('http://192.168.4.104:4000/create',{
nom: nom,
prenom:prenom,
login:login,
mdp:mdp,
    }).then ((response)=>{
        console.log (response.message);
    })};


    return (
        <div>
            <h2>Ajouter un Utilisateur</h2>
            <table align="center">
                <tbody>
           <tr><td> <label >Nom :</label></td>
           <td> <input type="text" placeholder="tapez le Nom" onChange={(e)=>{setNom(e.target.value)}} /></td></tr>
           <tr><td> <label >Prénom :</label></td>
           <td> <input type="text" placeholder="tapez le Prénom" onChange={(e)=>{setPrenom(e.target.value)}} /></td></tr>
           <tr><td> <label >Login :</label></td>
           <td> <input type="text" placeholder="tapez le Login" onChange={(e)=>{setLogin(e.target.value)}} /></td></tr>
           <tr><td> <label >Mot de passe :</label></td>
           <td> <input type="password" placeholder="tapez le Mot de passe" onChange={(e)=>{setMdp(e.target.value)}} /></td></tr>

            <tr><td colSpan="2"><button onClick={Ajout}>Ajouter Utilisateur</button></td></tr>
            </tbody></table>
        </div>
    )
}
export default Signup
