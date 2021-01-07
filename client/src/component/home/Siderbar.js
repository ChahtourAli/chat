import React,{useState,useEffect} from 'react';
import Axios from 'axios';
import './sidebar.css';
import Socket from 'socket.io-client';

const ENDPOINT="http://192.168.4.102:4000";

const Sidebar=()=> {
    const [user,setUser]=useState([]) ;
    const [agent,setAgent]=useState([]);
    const [message, setMessage]=useState("");
    const [msg,setMsg]=useState("");
    
    useEffect(()=>{
        Axios.get('http://192.168.4.102:4000/afficher').then ((response)=>{            
            setUser(response.data);
        });
    },[]);
    useEffect(()=>{
    const  socket= Socket(ENDPOINT);
    

        
    socket.on('chat',function(data){
        setMessage(data.message);
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
    console.log(msg);
   
    socket.emit('chat', {
        message:msg,
    });
    setMessage("")
}
    
    return (
        <div className="wrapper">
            <nav id="sidebar">

            <div className="sidebar-header">
                <h3 >Ali Chahtour</h3>
            </div>

            <ul className="list-unstyled components">
                
              {user.map((val,index)=>{
              
                 return (<li key={index} id={val.id} onClick={()=>Contact(val.id)}><a> {val.nom} {val.prenom} </a></li> );

              })}
                
            </ul>
            </nav>

            <div className="content">

                <div className="destinataire">
                {agent.map((val,index)=>{
                    return (
                    <div key={index}>
                        <h3>{val.nom} {val.prenom}</h3>
                        <p>{message}</p>
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