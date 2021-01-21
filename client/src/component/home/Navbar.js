import React from 'react'
import {Navbar,Nav,NavDropdown} from 'react-bootstrap';
import Axios from 'axios';
import History  from  '../../history';

 const Navbarr =()=> {
    const changeUrl =()=>{
        History.push("/home"); 
      
    }
const deconnexion =()=>{
    Axios.get('http://192.168.4.102:4000/deconnexion',{
       id:16,
    }).then(()=>{
        changeUrl();
    })
}



    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="#home">Logo</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                <Nav>
                <Nav.Link to={"/home"}>Accueil</Nav.Link>
                <Nav.Link href={"/signup"}>Gestion utilisateurs</Nav.Link>      
                <Nav.Link href={"/"} onClick={deconnexion}>Déconnexion</Nav.Link> 
                 
                
                </Nav>
               
            </Navbar.Collapse>
        </Navbar>
    )
}
export default Navbarr