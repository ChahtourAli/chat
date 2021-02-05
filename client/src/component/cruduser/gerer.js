import React, { useEffect, useState,  } from "react";
import Axios from "axios";
import Nav from '../home/Navbar';
import { Form,Button,Alert,Container,Row,Col,Card,Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';



const Gerer = () => {




    const columns = [
        {
          name: 'nom',
          selector: 'nom',
          sortable: true,
        },
        {
          name: 'Prenom',
          selector: 'prenom',
          sortable: true,
          right: true,
        },
        {
          name: 'Action',
          selector: 'nom',
          sortable: true,
          right: true,
          cell: record => { 
             
            return (
                <div>
                    <button className="btn btn-primary btn-sm" onClick={()=>handleShow3(record.id)}><i className="fa fa-edit">Modifier</i></button>
                    <button 
                        className="btn btn-danger btn-sm" onClick={()=>handleShow2(record.id)}><i className="fa fa-trash">Supprimer</i></button>
                </div>
            );
        }
        },
      ];
    const nom=JSON.parse(localStorage.getItem('user'));
    const [userr, setUserr] = useState([]);

    
    const upd=localStorage.getItem('up');
    const [nomm,setNomm]= useState("");
    const [prenom,setPrenom]= useState("");
    const [login,setLogin]= useState("");
    const [mdp,setMdp]= useState("");
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show2, setShow2] = useState(false);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = (val) => {
        localStorage.setItem('up',val);
            setShow2(true)};
    
        const [show3, setShow3] = useState(false);

        const handleClose3 = () => setShow3(false);
        const handleShow3 = (val) => {
            localStorage.setItem('up',val);
           supprimer(val);
            setShow3(true);
        
        };

      useEffect(() => {
          
        Axios.get("http://192.168.4.102:4000/afficheruser", {
          params: {
            id: nom.id,
          },
        }).then((response) => {
            
          setUserr(response.data);
          
        });
      }, [userr]);
    
    
      const supprimer = () => {
    
    
        Axios.put("http://192.168.4.102:4000/delet", {
         params:{ id: upd}
        }).then((response) => {
            handleClose2();
            
        });
     
    };
    const update = () => {
        Axios.post("http://192.168.4.102:4000/updateUserr",{
         params:{ 
             id:upd,
            nom:nomm,
            prenom:prenom,
            mdp:mdp   
        }
        }).then((response) => {
                handleClose3();
        });
      };
      const Ajout =()=>{
      
        Axios.post('http://192.168.4.102:4000/create',{
    nom: nomm,
    prenom:prenom,
    login:login,
    mdp:mdp,
        }).then ((response)=>{
            console.log (response.message);
            
      })
        
    };
    
      return (
    <div className="d-user">
          <Nav />
    
    <h2 align="center"> Gérer Utilisateur</h2>
    <button onClick={handleShow}>Ajout Utilisateur </button>
          
          <Modal
        id="new_user"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Nouveau Utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
                      <Form.Group as={Col} md="9" id="create-form" >                            
                            <Form.Control as="textarea" placeholder="Nom " className="form-control"   onChange={(e)=>{setNomm(e.target.value)}} required rows={1} style={{width:"100%" }}/>
                        </Form.Group>
                        <Form.Group as={Col} md="9" >                            
                            <Form.Control as="textarea" placeholder="Prenom" className="form-control"    onChange={(e)=>{setPrenom(e.target.value)}} required rows={1} style={{width:"100%" }}/>
                        </Form.Group>
                        <Form.Group as={Col} md="9" >                            
                            <Form.Control as="textarea" placeholder="Login" className="form-control"  onChange={(e)=>{setLogin(e.target.value)}}  required rows={1} style={{width:"100%" }}/>
                        </Form.Group>
                        <Form.Group as={Col} md="9" >                            
                            <Form.Control as="textarea" placeholder="Mot de passe" className="form-control"   onChange={(e)=>{setMdp(e.target.value)}}  required rows={1} style={{width:"100%" }}/>
                        </Form.Group>
                                      
              
        
        
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={Ajout}>Confirmer</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        id="update_user"
        show={show3}
        onHide={handleClose3}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modifier Utilisateur  </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
                      <Form.Group as={Col} md="9" >                            
                            <Form.Control as="textarea" placeholder="Nom " className="form-control"   onChange={(e)=>{setNomm(e.target.value)}} required rows={1} style={{width:"100%" }}/>
                        </Form.Group>
                        <Form.Group as={Col} md="9" >                            
                            <Form.Control as="textarea" placeholder="Prenom" className="form-control"    onChange={(e)=>{setPrenom(e.target.value)}} required rows={1} style={{width:"100%" }}/>
                        </Form.Group>
                       
                        <Form.Group as={Col} md="9" >                            
                            <Form.Control as="textarea" placeholder="Mot de passe" className="form-control"   onChange={(e)=>{setMdp(e.target.value)}}  required rows={1} style={{width:"100%" }}/>
                        </Form.Group>
                                      
              
        
        
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose3}>
            Fermer
          </Button>
          <Button variant="primary" onClick={update}>Confirmer</Button>
        </Modal.Footer>
      </Modal>


      <Modal
        id="supp_user"
        show={show2}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title> Etes-vous sur de vouloir supprimer ?</Modal.Title>
        </Modal.Header>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Fermer
          </Button>
          <Button variant="primary" onClick={supprimer}>Confirmer</Button>
        </Modal.Footer>
      </Modal>
      <DataTable
        columns={columns}
        data={userr}
        pagination={true}
      />
      
        </div>
      );
        }
export default Gerer ;