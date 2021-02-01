import React,{useState,useEffect} from 'react';
import Axios from 'axios';
import './sidebar.css';
import Socket from 'socket.io-client';
import { Form,Button,Alert,Container,Row,Col,Card } from 'react-bootstrap';
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Moment from 'moment';

const ENDPOINT="http://192.168.4.102:4000";

const  socket= Socket(ENDPOINT);


const Sidebar=()=> {
    const [user,setUser]=useState([]) ;
    const [agent,setAgent]=useState([]);
    const [message, setMessage]=useState([]);
    const [msg,setMsg]=useState("");
    const [msgH,setMsgH]=useState([]);
    const [groupe,setGroupe]=useState([]);
    const [newg, setNewg]=useState("");
    
   
    const nom=JSON.parse(localStorage.getItem('user'));
    const desti=localStorage.getItem('desti');
    const gro =localStorage.getItem('groupe');
    useEffect(()=>{
        Axios.get('http://192.168.4.102:4000/afficher',{
            params:{
                id:nom.id,
            }

        }).then ((response)=>{            
            setUser(response.data) ;
            
        });
        Axios.all([
            Axios.get('http://192.168.4.102:4000/groupe',{params:{id:nom.id}}),
            Axios.get('http://192.168.4.102:4000/afficher',{params:{id:nom.id}})]).then((response)=>{
                
            setUser(response[1].data);
            
            setGroupe(response[0].data);
            })
  

socket.emit('user_connected', nom.id)
   
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
        
    socket.on('message-send',function(data){
    
         setMessage(prev=>[...prev,data]);

        
    });


Axios.get("http://192.168.4.102:4000/derniermessage",{
    params:{
        id:nom.id,
    }}).then((response)=>{

        if(typeof(response.data.result3) !== 'undefined' ){
            console.log(response.data.groupe);
            if(response.data.groupe!=null ){
            contact_groupe(response.data.result3[0].id) ;
                //console.log(response.data.result3[0].id);
            }
            else{
            Contact(response.data.result3[0].id) ;
            //console.log(response.data.result3[0].id);
            }


        }
        else{
            
            //console.log(response.data);
           //  setMakrem(response.data);
        }
        

    })
    
},[]);
const AjouterGroupe=()=>{
    
Axios.post("http://192.168.4.102:4000/new_groupe",{
nom:newg,

}).then((response)=>{
    console.log(response);
})
}




      function Contact  (props) { 
          Axios.get('http://192.168.4.102:4000/message',{ 
           params:{ props:props,id:nom.id,}}).then((response)=>{

            
            document.querySelector('.envoyer').setAttribute('data-groupe','0') ;

            if(typeof(response.data.result) !== 'undefined' ){

                console.log(response.data);
             setAgent([response.data.result[0]]);
            const l=response.data.result[0].id;
            localStorage.setItem('desti',l);
            
                document.querySelectorAll('.li_new').forEach(function(ele) {                
                    ele.remove();                    
                });
                
             setMsgH([]);
             if(response.data.result2.length>0){
            
            for (var i=0;i<response.data.result2.length;i++){
                
                setMsgH(prev=>[...prev,response.data.result2[i]]);
                
            }
        }
        else{
            console.log(response.data.msgg);
            setMsgH(["aucunmsg"]);
        }
              
            }    
        }
        
        )}


const contact_groupe =(props)=>{
    Axios.get('http://192.168.4.102:4000/message_groupe',{
        params:{props:props}  
    }).then((response)=>{
        document.querySelector('.envoyer').setAttribute('data-groupe','1') ;
        var group=[response.data.result[0].id];
     localStorage.setItem('groupe',group);
        setAgent([response.data.result[0]]);
        setMsgH([]);
        
        if(response.data.result2.length>0){
            for(var i=0;i<response.data.result2.length;i++){
                setMsgH(prev=>[...prev,response.data.result2[i]])
            }
        }
else 
{
    setMsgH(["aucune"]);
}
    })
}


      
        
       
const Envoyer =(e)=>{
    e.preventDefault();
   // e.target.reset();

    if(document.querySelector('.envoyer').getAttribute('data-groupe') == 0){
    
    socket.emit('chat', {
        message:msg,
        id_dest: agent[0].id,
        id_expe: nom.id,
        date:Moment(new Date()).format( 'D-MM-yyyy HH:mm')
        });
    }
    else{
       
        socket.emit('chat_groupe', {
            message:msg,
            groupe: gro ,
            id_expe: nom.id,
            date:Moment(new Date()).format( 'D-MM-yyyy HH:mm')
            });
    }
       
}



    return (
        <div className="wrapper">
            <nav id="sidebar">

            <div className="sidebar-header">
                <input type="text" className="form-control" placeholder="Recherche" />
                <Button variant="light" style={{marginLeft:"10px"}}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></Button>
            </div>

            <ul className="list-unstyled components">
                
              {user.map((val,index)=>{if (val.etat==1){
              
                 return (<li className='users' data-us={val.id} key={index} id={val.id} onClick={()=>Contact(val.id)}><a> <figure className="avatar avatar-state-success"><span className="avatar-title bg-secondary rounded-circle">G</span></figure>   <span className={'usr'+val.id} ></span> 
                                      <div className="users-list-body">
                                          <div><h5 className="">{val.prenom} {val.nom} </h5>
                                          
                                      <p>Text...... </p>
                                      </div>
                                      <div className="users-list-action">
                                          <small className="text-muted">03:41 PM</small>
                                      </div>
                                      </div>
                                      </a></li> );
              }else{
                return (<li className='users' data-us={val.id} key={index} id={val.id} onClick={()=>Contact(val.id)}><a> <figure className="avatar avatar-state-secondary"><span className="avatar-title bg-secondary rounded-circle">G</span></figure> <span className={'usr'+val.id} ></span>  
                                      <div className="users-list-body">
                                          <div><h5 className="">{val.prenom} {val.nom}</h5>
                                      <p>Text...... </p>
                                      </div>
                                      <div className="users-list-action">
                                          <small className="text-muted">03:41 PM</small>
                                      </div>
                                      </div>
                                      </a></li>);
              }
              })}
              {groupe.map((val,index)=>{
                 
                  return(<div key={index}>
                      <li  id= {val.id} onClick={()=>{contact_groupe(val.groupe)}}>{val.nom_groupe}</li></div>)
              })}
                
            </ul>
            </nav>

            <div className="content">

                <div className="chat">
                
                {agent.map((valeur,index)=>{
                    return (
                        <div key={index} className="chat_header">
                            <h3>{valeur.destinataire}</h3>
                     </div>
                    )
                })}
           
                    
                {agent.map((valeur,index)=>{
                    return (
                    <div key={index} className="scrollbar-container">
                    <div key={index} className="chat_body">
                        <div key={index} className="messages">
                        {msgH.map((val,index)=>{
                            if(msgH[0]=="aucunmsg"){
                                return (<div>vous n'avez aucune discussion pour le moment</div>)
                            }else{
                                    if (val.expe===nom.id){
                                            return(<div key={index} className="dest">{val.message} {val.date}</div> )
                                        }
                                        else{
                                            return(<div key={index} className="exp">{val.message}{val.date}</div> ) 
                                            
                                    }




                                }
                       
                                        
                                    
                      })}
                      
                      
                {message.map((val,index)=>{

                    

                            if((desti==val.id_expe)||(desti==val.id_dest)){

                                return(<div key={index} className="dest li_new">{val.message}  <br/>{val.date}</div>)
                            
                            }
                            else if(gro == val.groupe ){
                                
                                return(<div key={index} className="dest li_new">{val.message}  <br/>{val.date}</div>)

                            }
                            
                })}

                    </div></div></div>)
                })}
                
            
          
                 
                        
                       

               

                        <div className="chat_footer">
                        
                        <Form>
                         
                        <Form.Row>
                            
                        <Form.Group as={Col} md="1">
                            <Button variant="light" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg></Button>    
                        </Form.Group>
                            
                        <Form.Group as={Col} md="9" controlId="exampleForm.ControlTextarea1">                            
                            <Form.Control as="textarea" placeholder="Tapez un message..." className="form-control"  onChange={(e)=>{setMsg(e.target.value)}}  required rows={1} style={{width:"100%" }}/>
                        </Form.Group>                       
                        <Form.Group as={Col} md="9" controlId="exampleForm.ControlTextarea1">                            
                            <Form.Control as="textarea" placeholder="Nom de groupe" className="form-control"  onChange={(e)=>{setNewg(e.target.value)}}  required rows={1} style={{width:"100%" }}/>
                        </Form.Group>
                        <button onClick={AjouterGroupe}/>
                        <Form.Group as={Col} md="2">
                        <Button variant="light" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg></Button>
                        <Button variant="primary" type="submit" className="envoyer" data-groupe="" onClick={Envoyer} style={{marginLeft:"10px"}} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </Button>
                        </Form.Group>
                        </Form.Row>

                        
                        </Form>

                        </div>

                  
                </div>
            </div>

        </div>

    )
}
export default Sidebar