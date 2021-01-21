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
    const [msgH,setMsgH]=useState([])
    
    
  /*  useEffect(()=>{
        Axios.get('http://192.168.4.102:4000/connecter').then((response)=>{
          setConnected(response.data);
          alert(connected);
        });
    },[]);
    */
   
    useEffect(()=>{
        Axios.get('http://192.168.4.102:4000/afficher').then ((response)=>{            
            setUser(response.data) ;
            
        });
        
    },[]);
    const nom=JSON.parse(localStorage.getItem('user'));
    const destinataire=localStorage.getItem('dest');

    
    useEffect(()=>{
        const  socket= Socket(ENDPOINT);   
        socket.on('connected',function(data){
          console.log(data.id+' '+data.etat);
            var iduser = data.id ;

            var etatuser = '';
            if(data.etat == 0){
                etatuser = 'Déconnecté' ;
            }
            else{
                etatuser = 'Connecté' ;
            }

          document.querySelectorAll('.users').forEach(function(el) {

            if(iduser == el.getAttribute("data-us") ){


                document.querySelector('.usr'+iduser).innerHTML = etatuser ;

            }
      })
    });
    },[]);
    useEffect(()=>{
        const  socket= Socket(ENDPOINT);   
        socket.on('disconnected',function(data){
          console.log(data.id+' '+data.etat);
            var iduser = data.id ;

            var etatuser = '';
            if(data.etat == 0){
                etatuser = 'Déconnecté' ;
            }
            else{
                etatuser = 'Connecté' ;
            }

          document.querySelectorAll('.users').forEach(function(el) {

            if(iduser == el.getAttribute("data-us") ){


                document.querySelector('.usr'+iduser).innerHTML = etatuser ;

            }
      })
    });
    },[]);

    
    

    useEffect(()=>{
    const  socket= Socket(ENDPOINT);   
    socket.on('message-send',function(data){
        //console.log(data.message);
        setMessage(prev=>[...prev,data.message]);
        
    });
},[]);
/*useEffect(()=>{
    const  socket= Socket(ENDPOINT);   
    socket.on('welcome',function(result){
     //  setNouveau(result);
    });
},[]);

*/


      function Contact  (props) { 
          Axios.get('http://192.168.4.102:4000/home',{ 
           params:{ props:props,
          }}).then((response)=>{
              setAgent(response.data);
              var khra=response.data[0];
              var khariya=khra.id;
              localStorage.setItem('dest',khariya);
             
          });
        }


        useEffect(()=>{
            
            Axios.get('http://192.168.4.102:4000/message',{
                id_expe: nom,
                id_dest: destinataire,    
         }).then((response)=>{
                for (var i=0;i<response.data.length;i++)
                
               setMsgH(prev=>[...prev,response.data[i].message]);
            })
         },[]);
       
const Envoyer =(e)=>{
    e.preventDefault();
    
    const  socket= Socket(ENDPOINT);
   // console.log(msg);
    socket.emit('chat', {
        message:msg,
        id_dest: agent[0].id,
        id_expe: nom.id
        });
       
}



    return (
        <div className="wrapper">
            <nav id="sidebar">

            <div className="sidebar-header">
                <h3 >{nom.nom} {nom.prenom}</h3>
            </div>

            <ul className="list-unstyled components">
                
              {user.map((val,index)=>{if (val.etat==1){
              
                 return (<li className='users' data-us={val.id} key={index} id={val.id} onClick={()=>Contact(val.id)}><a> {val.nom} {val.prenom} <span className={'usr'+val.id} >Connecté</span> </a></li> );
              }else{
                return (<li className='users' data-us={val.id} key={index} id={val.id} onClick={()=>Contact(val.id)}><a> {val.nom} {val.prenom} <span className={'usr'+val.id} >Déconnecté</span>  </a></li> );
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
                        {msgH.map((val,index)=>{
                            return(<div key={index}>
                                  <ul>
                                      <li>{val}</li>
                                      </ul>  

                            </div>)
                        })}
                        
                        {message.map((val,index)=>{
                            return (<div key={index} >

                                <ul >
                                    <li >{val}</li>
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