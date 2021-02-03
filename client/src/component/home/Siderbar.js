import React,{useState,useEffect} from 'react';
import Axios from 'axios';
import './sidebar.css';
import Socket from 'socket.io-client';
import { Form,Button,Alert,Container,Row,Col,Card,Modal } from 'react-bootstrap';
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import img1 from './aucunmsg.png';

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
    const [help, setHelp]=useState("");
    const [affect, setAffect]=useState([]);
    const [nomG,setNomG]=useState("");
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => {
        mod();
        setShow2(true);
    }
    
   
    
   
   
   const nom=JSON.parse(localStorage.getItem('user'));
    const desti=localStorage.getItem('desti');
    const gro =localStorage.getItem('groupe');



     
    const  handleChange =(e)=> {
        var options = e.target.options;
        var valeurs = [];
        for (var i = 0, l = options.length; i < l; i++) {
          if (options[i].selected) {
            valeurs.push(options[i].value);
          }
        }
        setAffect( valeurs);
      }
    
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
    



    socket.on('notif',function(data){
       
        const arr_ids = [];
        const arr_nbr = [];

        for(var i=0 ; i<data.length ; i++){

            arr_ids.push(data[i].expe) ;
            arr_nbr.push(data[i].nbr) ;


        }

          document.querySelectorAll('.users').forEach(function(el) {

              if( arr_ids.includes(parseInt(el.getAttribute("data-us")) ) ){

                var idx = arr_ids.indexOf(parseInt(el.getAttribute("data-us"))) 

                  document.querySelector('.nbr'+parseInt(el.getAttribute("data-us"))).innerHTML = arr_nbr[idx] ;


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
affectation:affect,
id_connected:nom.id,

}).then((response)=>{
    
    setHelp(response.data);
   
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
const contact_global =()=>{

    

    Axios.get('http://192.168.4.102:4000/message_global',{
         
    }).then((response)=>{

        console.log(response);
        
        
        setAgent([response.data.result[0]]);

        setMsgH([]);
        
        if(response.data.result2.length>0){

            for (var i=0;i<response.data.result2.length;i++){
                
                setMsgH(prev=>[...prev,response.data.result2[i]]);
                
            }
            
        }
        else 
        {
            setMsgH(["aucune"]);
        }
        })
}


      
socket.emit('chat_global', {
    message:msg,
    groupe: gro ,
    id_expe: nom.id,
    date:Moment(new Date()).format( 'DD-MM-yyyy HH:mm')
    });
       
const Envoyer =(e)=>{
if(document.querySelector('.envoyer').getAttribute('data-groupe') == 0){
    
    socket.emit('chat', {
        message:msg,
        id_dest: agent[0].id,
        id_expe: nom.id,
        date:Moment(new Date()).format( 'DD-MM-yyyy HH:mm')
        });
    }
    else{
       
        socket.emit('chat_groupe', {
            message:msg,
            groupe: gro ,
            id_expe: nom.id,
            date:Moment(new Date()).format( 'DD-MM-yyyy HH:mm')
            });
    }
       
}

const mod =()=>{
Axios.get('http://192.168.4.102:4000/modifiergroupe',{
    
    params:{id:gro,
}}).then((response)=>{
    setNomG(response.data[0].nom_groupe);
    
    
    var element = document.getElementById("user_groupe_edit");

    var dnd = document.querySelector('#user_groupe_edit');

    var users_groupe = [] ;

    for(var i=0 ; i<response.data.length;i++){

        users_groupe.push(response.data[i].utilisateur) ; 

    //console.log();
    }




    Array.from(dnd.options).forEach(function (option) {

        // If the option's value is in the selected array, select it
        // Otherwise, deselect it
        var selected = Array.from(dnd.options).filter(function (option) {
            
            return option.selected;

        });

        


           if( users_groupe.includes(parseInt(option.value)) == true ){

            option.selected = true;
           
           } else {
            option.selected = false;
           }
                

            //console.log();
        


        
            
    
    });


    
    

})}
console.log(nomG);
const update =()=>{
Axios.post('http://192.168.4.102:4000/updategroupe',{
  nom:nomG,
    id:gro,
    affectation:affect,
    id_connected:nom.id,
}).then((response)=>{
    console.log(response.data);
    if(response.data=="groupe modifié"){
        alert('modification réussite');
        handleClose2 ();
    }
})

}


    return (
        <div className="wrapper">
            <nav id="sidebar">

            <div className="sidebar-header">
                <h3 style={{marginBottom: 0,lineHeight: 2}}>{nom.prenom} {nom.nom}</h3>
                <Button variant="light" style={{marginLeft:"10px"}} onClick={handleShow}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></Button>
            </div>

            <ul className="list-unstyled components">
                
              {user.map((val,index)=>{
                  
                  
                  
                  if (val.etat==1){
              
                 return (<li className='users' data-us={val.id} key={index} id={val.id} onClick={()=>Contact(val.id)}><a> <figure className="avatar avatar-state-success"><span className="avatar-title bg-secondary rounded-circle">{val.prenom.substring(0,1)}</span></figure>   <span className={'usr'+val.id} > <span className={'nbr'+val.id} >0</span></span> 
                                      <div className="users-list-body">
                                          <div><h5 className="">{val.prenom} {val.nom} </h5>
                                          
                                      <p>{val.derniermsg}</p>
                                      </div>
                                      <div className="users-list-action">
                                          <small className="text-muted">{val.derniere_date}</small>
                                      </div>
                                      </div>
                                      </a></li> );
              }else{
                return (<li className='users' data-us={val.id} key={index} id={val.id} onClick={()=>Contact(val.id)}><a> <figure className="avatar avatar-state-secondary"><span className="avatar-title bg-secondary rounded-circle">{val.prenom.substring(0,1)}</span></figure> <span className={'usr'+val.id}  > <span className={'nbr'+val.id} >0</span></span>  
                                      <div className="users-list-body">
                                          <div><h5 className="">{val.prenom} {val.nom} </h5>
                                      <p>{val.derniermsg}</p>
                                      </div>
                                      <div className="users-list-action">
                                          <small className="text-muted">{val.derniere_date}</small>
                                      </div>
                                      </div>
                                      </a></li>);
              }
              })}
              {groupe.map((val,index)=>{
                 
                  return(
                         
                         <li className='users' id= {val.id} onClick={()=>{contact_groupe(val.groupe)}}><a> <figure className="avatar avatar-state-secondary"><span className="avatar-title bg-secondary rounded-circle">{val.nom_groupe.substring(0,1)}</span></figure> <span className={'usr'+val.id} ></span>  
                                      <div className="users-list-body">
                                          <div><h5 className="">{val.nom_groupe}</h5>
                                      <p>Text...... </p>
                                      </div>
                                      <div className="users-list-action">
                                          <small className="text-muted">03:41 PM</small>
                                      </div>
                                      </div>
                                      </a></li>
                         
                         
                         )
              })}

                
            </ul>
            </nav>

            <div className="content">

                <div className="chat">
                
                {agent.map((valeur,index)=>{
                    
                    if((valeur.destinataire).includes('Groupe de discussion :') == true){
                        return (
                            <div key={index} className="chat_header">
                                <h3>{valeur.destinataire} <a href="#" onClick={handleShow2}>modifier</a></h3>
                         </div>
                        )

                    }
                    else{

                        return (
                            <div key={index} className="chat_header">
                                <h3>{valeur.destinataire}</h3>
                        </div>
                        )

                    }

                })}
           
                    
                {agent.map((valeur,index)=>{
                    return (
                    <div key={index} className="scrollbar-container">
                    <div  className="chat_body">
                        <div  className="messages">
                        {msgH.map((val,index)=>{
                            if(msgH[0]=="aucunmsg"){
                                return (<div style={{textAlign:"center"}}>
                                        <img src={img1} width="50%"></img>                                        
                                        <div style={{textAlign:"center",color:"#2d353e",fontSize:"14px"}}>Vous n'avez aucune discussion pour le moment.</div></div>)
                            }else{
                                    if (val.expe===nom.id){
                                            return(
                                                <div key={index} className="message-item2">                                                    
                                                <div  className="dest">{val.message} </div>
                                                <div  className="message-avatar2">
                                                <div ><div  className="time">{val.date}</div>
                                                </div>
                                                </div>
                                                </div> 
                                            )
                                        }
                                        else{
                                            return(
                                                <div key={index} className="message-item">                                                    
                                                <div  className="exp">{val.message} </div>
                                                <div  className="message-avatar">
                                                <div ><div className="time">{val.date}</div>
                                                </div>
                                                </div>
                                                </div>  ) 
                                            
                                    }




                                }
                       
                                        
                                    
                      })}
                      {help}
                      
                      
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
                            
                        <Form.Group as={Col} md="1" style={{display:"none"}}>
                            <Button variant="light">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg></Button>    
                        </Form.Group>
                            
                        <Form.Group as={Col} md="10">                            
                            <Form.Control as="textarea" placeholder="Tapez un message..." className="form-control"  onChange={(e)=>{setMsg(e.target.value)}}  required rows={1} style={{width:"100%" }} />
                        </Form.Group>                       
                        
                        <Form.Group as={Col} md="2">
                        <Button variant="light" style={{display:"none"}} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg></Button>
                        <Button variant="primary" type="submit" className="envoyer" data-groupe="" onClick={Envoyer} style={{marginLeft:"10px"}} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </Button>
                        </Form.Group>
                        </Form.Row>

                        
                        </Form>

                        </div>
                           
                           
                           <>
      

      <Modal
        id="new_groupe"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Nouveau Groupe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
              <Form.Group as={Col} md="9" >                            
                            <Form.Control as="textarea" placeholder="Nom de groupe" className="form-control"  onChange={(e)=>{setNewg(e.target.value)}}  required rows={1} style={{width:"100%" }}/>
                        </Form.Group>
                                      
              
        
        <Form.Group >
            <Form.Label>Affecter les agents dans votre groupe</Form.Label>
            <Form.Control as="select" htmlSize={3} custom multiple onChange={handleChange} >
            {user.map((val)=>{
               
                return(
                
                    <option key={val.id} value={val.id}> {val.prenom}   {val.nom}</option>
                )
            
            })}
           
            
            </Form.Control>
        </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={AjouterGroupe}>Confirmer</Button>
        </Modal.Footer>
      </Modal>




      <Modal
        id="update_groupe"
        show={show2}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modifier Groupe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group as={Col} md="9" >                            
                            <Form.Control id="nom_groupe_edit" value={nomG} as="textarea" placeholder="Nom de groupe" className="form-control"  onChange={(e)=>{setNomG(e.target.value)}}  required rows={1} style={{width:"100%" }}/>
                        </Form.Group>
                                      
              
        
        <Form.Group >
            <Form.Label>Select with three visible options</Form.Label>
            <Form.Control as="select" id="user_groupe_edit" htmlSize={3} custom multiple onChange={handleChange} >
            {user.map((val)=>{
               
                return(
                
                    <option key={val.id} value={val.id} > {val.prenom}   {val.nom}</option>
                )
            
            })}
           
            
            </Form.Control>
        </Form.Group>
              
        </Modal.Body>
            
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Fermer
          </Button>
          <Button variant="primary" onClick={update}>Confirmer</Button>
        </Modal.Footer>
      </Modal>


    </>

                  
                </div>
            </div>

        </div>

    )
}
export default Sidebar
