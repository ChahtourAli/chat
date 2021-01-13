import React,{useState,useEffect} from 'react';
import Axios from 'axios';
import './sidebar.css';
import Socket from 'socket.io-client';

const ENDPOINT="http://192.168.4.102:4000";

const Sidebar=()=> {
    const [user,setUser]=useState([]) ;
    const [agent,setAgent]=useState([]);
    const [message, setMessage]=useState([]);
    const [msg,setMsg]=useState("");
    const [nouveau,setNouveau]=useState([]);
    
    
    
    useEffect(()=>{
        Axios.get('http://192.168.4.102:4000/afficher').then ((response)=>{            
            setUser(response.data);
        });
    },[]);
    


    useEffect(()=>{
    const  socket= Socket(ENDPOINT);   
    socket.on('message-send',function(data){
        console.log(data.message);
        setMessage([data.message]);
    });
},[]);
useEffect(()=>{
    const  socket= Socket(ENDPOINT);   
    socket.on('welcome',function(result){
       setNouveau(result);
    });
},[]);

      function Contact  (props) { 
          Axios.get('http://192.168.4.102:4000/home',{ 
           params:{ props:props,
          }}).then((response)=>{
              setAgent(response.data);
          });
}
const Envoyer =(e)=>{
    e.preventDefault();
    const  socket= Socket(ENDPOINT);
   // console.log(msg);
    socket.emit('chat', {
        message:msg,
        });
    
}
    
    return (
        <div className="wrapper">
            <nav id="sidebar">

            <div className="sidebar-header">
                <h3 >Ali Chahtour</h3>
            </div>

            <ul className="list-unstyled components">
                
              {user.map((val,index)=>{if (val.etat==1){
              
                 return (<li key={index} id={val.id} onClick={()=>Contact(val.id)}><a> {val.nom} {val.prenom} active </a></li> );
              }else{
                return (<li key={index} id={val.id} onClick={()=>Contact(val.id)}><a> {val.nom} {val.prenom} déconnecté </a></li> );
              }
              })}
                
            </ul>
            </nav>

            <div className="content">

                <div className="destinataire">
                {agent.map((val,index)=>{
                    return (
                    <div key={index}>
                        <h3>{val.nom} {val.prenom}</h3>
                        
                        {message.map((val,index)=>{
                            return (<div key={index} >

                                <ul >
                                    <li >{message}</li>
                                </ul>
    
    
                            </div>)
                        })}
                        <input type="text" placeholder="tapez un message" onChange={(e)=>{setMsg(e.target.value)}}/>
                        <input type="submit" value="envoyer"  onClick={Envoyer}/>
                    </div>)
                })  }
                  
                </div>
            </div>

        </div>

    )
}
export default Sidebar