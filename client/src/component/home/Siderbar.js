import React,{useState,useEffect} from 'react';
import Axios from 'axios';
import './sidebar.css';
import Socket from 'socket.io-client';
import { Form,Button,Alert,Container,Row,Col,Card } from 'react-bootstrap';


const ENDPOINT="http://192.168.4.102:4000";

const  socket= Socket(ENDPOINT);


const Sidebar=()=> {
    const [user,setUser]=useState([]) ;
    const [agent,setAgent]=useState([]);
    const [message, setMessage]=useState([]);
    const [msg,setMsg]=useState("");
    const [msgH,setMsgH]=useState([])
    
      
  
   
    useEffect(()=>{
        Axios.get('http://192.168.4.102:4000/afficher',{
            params:{
                id:nom.id,
            }

        }).then ((response)=>{            
            setUser(response.data) ;
            
        });
        
    },[]);
    const nom=JSON.parse(localStorage.getItem('user'));
    const desti=localStorage.getItem('desti');
useEffect(()=>{
socket.emit('user_connected', nom.id
)

},[])
    
    
    useEffect(()=>{
         
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
      
    socket.on('message-send',function(data){
        
        
         setMessage(prev=>[...prev,data.message]);

        
    });
},[]);



      function Contact  (props) { 
          Axios.get('http://192.168.4.102:4000/message',{ 
           params:{ props:props,
            id:nom.id,
          }}).then((response)=>{
            
             setAgent([response.data.result[0]]);
             var desti=response.data.result[0].id;
             localStorage.setItem('desti',desti);
            
               document.querySelectorAll('.li_new').forEach(function(ele) {
                
                    ele.remove();
                    
                });


             
             setMsgH([]);

            for (var i=0;i<response.data.result2.length;i++){

                setMsgH(prev=>[...prev,response.data.result2[i].message]);
             
            } 
        
        });

        }


      
        console.log(desti);
       
const Envoyer =(e)=>{
    e.preventDefault();
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
                    <ul>
                {agent.map((valeur,index)=>{
                    return (
                    <div key={index}>
                        <h3>{valeur.destinataire}</h3>
                        {msgH.map((val,index)=>{
                            return(
                                    <div key={index}>
                                            
                                        <li>{val}</li> 
                                    </div>)
                        })}
                    </div>)
                                            })
                }
            
          
                 
                   {message.map((val,index)=>{
                       return(
                        <div key={index}>
                                            
                        <li className='li_new' >{val}</li> 
                        </div>
                              )        
                           })}

                 


                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Control as="textarea" placeholder="Tapez un message"  onChange={(e)=>{setMsg(e.target.value)}}  required rows={3} />
                        </Form.Group>


                        <Form.Group >
                        <Button variant="primary" type="submit" onClick={Envoyer} >
                            Envoyer
                        </Button>
                        </Form.Group>


</ul>
                  
                </div>
            </div>

        </div>

    )
}
export default Sidebar