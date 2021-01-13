import React from 'react'
import {Navbar,Nav,NavDropdown} from 'react-bootstrap';

 const Navbarr =()=> {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="#home">Logo</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                <Nav>
                <Nav.Link href="/home">Accueil</Nav.Link>
                <Nav.Link href="#Signup">Gestion utilisateurs</Nav.Link>      
                <Nav.Link href="#Signup">Déconnexion</Nav.Link> 
                 
                
                </Nav>
               
            </Navbar.Collapse>
        </Navbar>
    )
}
export default Navbarr