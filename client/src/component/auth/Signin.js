import React,{useState, useEffect} from 'react';
import Axios from 'axios';
import socketClient from 'socket.io-client';
import {ToastContainer ,toast , Zoom} from 'react-toastify'
import { Form,Button,Alert,Container,Row,Col,Card } from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import History  from  '../../history';
import './signin.css'

import img1 from './3350441.jpg';


const ENDPOINT="http://192.168.4.102:4000";

    
    const Signin =()=> {
        
        
     const    [message, setMessage]=useState("");
     const    [username,setUsername]=useState("");
     const    [password,setPassword]=useState("");
     const    [show, setShow] = useState(false);
    useEffect(() => {
       const  socket= socketClient(ENDPOINT);
        console.log(socket);
        socket.on('msg',(msg)=>{
       console.log(msg);
        })
    }, [])
   
     const errorToast =()=>{
        toast("wrong username or password ",{
            className:"custom-toast",
            draggable: true,
            position : toast.POSITION.BUTTON_CENTER
        });


        

     };
     const changeUrl =()=>{
         History.push("/home"); 
         //<Redirect to={{pathname:'/home'}} />
     }
     

     
     const Join =()=>{
     Axios.post('http://192.168.4.102:4000/login',{
    username: username,
    password:password,
 
     }).then (res=>{



      if (res.data ==="succes")
      {
          console.log  (res.data);
          changeUrl();
          //setIsValid(true);
          
      }
      else {
          //res.("username or password wrong");
          //setIsValid(true);
          setMessage(res.data);
          setShow(true); 
             }
    })};
     const handleSubmit =(e)=>{
        e.preventDefault();
        console.log(username,password);
        setPassword(e.target.reset());
 }
    return ( 



        <Container fluid="xl">
        
        
        <Row className="mak">
        <Col className="mak">
                <h1 className="display-4">Se connecter<br></br><small className="text-muted">Bienvenue</small></h1>
                <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Identifiant</Form.Label>
                    <Form.Control type="Identifiant" placeholder="Identifiant"  onChange={(e)=>{setUsername(e.target.value)}} required />                    
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Mot de passe </Form.Label>
                    <Form.Control type="password" placeholder="Mot de passe"  onChange={(e)=>{setPassword(e.target.value)}}  required/>
                </Form.Group>
                <Alert show={show} variant="danger">
                    <Alert.Heading>{message}</Alert.Heading>
                </Alert>
                <Form.Group className="text-center">
                <Button variant="primary" type="submit" onClick={Join} >
                    Se connecter
                </Button>
                </Form.Group>
                </Form>
          
        </Col>
        <Col>
            <img src={img1} width="100%"></img>
        </Col>
        </Row>
            

            </Container>
    )
}
export default Signin