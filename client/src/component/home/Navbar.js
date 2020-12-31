import React from 'react'
import {Navbar,Nav,NavDropdown, Form,FormControl,Button} from 'react-bootstrap';

 const Navbarr =()=> {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="#home">Logo</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="#features">Accueil</Nav.Link>
                <Nav.Link href="#Signup">Gestion utilisateurs</Nav.Link>      
                </Nav>
                <Nav>
                <NavDropdown title="Ali Chahtour" id="collasible-nav-dropdown ">
                    <NavDropdown.Item href="#action/3.1">Mon profil</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Configuration</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Se déconnecter</NavDropdown.Item>
                </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
export default Navbarr