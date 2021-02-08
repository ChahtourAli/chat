import React,{useState,useEffect} from 'react';
import Axios from "axios";
import DataTable from 'react-data-table-component';
import Nav from '../home/Navbar';

import { Form,Button,Alert,Container,Row,Col,Card,Modal } from 'react-bootstrap';

import { faUserEdit,faUserTimes,faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



const Gerer = () => {

    
    
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
    
    
    const columns = [
        {
          name: 'Nom',
          selector: 'nom',
          sortable: true,
        },
        {
          name: 'Prénom',
          selector: 'prenom',
          sortable: true,
        },
        {
          name: 'Login',
          selector: 'login',
          sortable: true,
        },
        {
          name: 'Etat',
          selector: 'etat',
          sortable: true,
        },
        {
          name: 'Action',
          selector: 'nom',
          sortable: false,
          right: true,
          cell: record => { 
             
            return (
                <div>
                    <button className="btn btn-primary btn-sm" onClick={()=>handleShow3(record.id)} ><FontAwesomeIcon icon={faUserEdit} /></button>&nbsp;
                    <button className="btn btn-danger btn-sm" onClick={()=>handleShow2(record.id)} ><FontAwesomeIcon icon={faUserTimes} /></button>
                </div>
            );
        }
        },
      ];
    
    
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
    
    <div className="div_user">
        <h4>Gestion des utilisateurs</h4>  
        <button onClick={handleShow} className="btn btn-secondary nv_user"><FontAwesomeIcon icon={faUserPlus} /></button>
    </div> 
          
          
    <DataTable columns={columns} data={userr} pagination={true} />
    
    
    <Modal id="new_user" show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-secondary text-white">
          <Modal.Title>Nouveau Utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group as={Col} md="12" id="create-form" >                            
                <Form.Control as="textarea" placeholder="Nom " className="form-control"   onChange={(e)=>{setNomm(e.target.value)}} required rows={1} style={{width:"100%" }}/>
            </Form.Group>
            <Form.Group as={Col} md="12" >                            
                <Form.Control as="textarea" placeholder="Prenom" className="form-control"    onChange={(e)=>{setPrenom(e.target.value)}} required rows={1} style={{width:"100%" }}/>
            </Form.Group>
            <Form.Group as={Col} md="12" >                            
                <Form.Control as="textarea" placeholder="Login" className="form-control"  onChange={(e)=>{setLogin(e.target.value)}}  required rows={1} style={{width:"100%" }}/>
            </Form.Group>
            <Form.Group as={Col} md="12" >                            
                <Form.Control as="textarea" placeholder="Mot de passe" className="form-control"   onChange={(e)=>{setMdp(e.target.value)}}  required rows={1} style={{width:"100%" }}/>
            </Form.Group>                                      
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Fermer</Button>
          <Button variant="primary" onClick={Ajout}>Confirmer</Button>
        </Modal.Footer>
      </Modal>
    

      <Modal id="update_user" show={show3} onHide={handleClose3} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-secondary text-white">
          <Modal.Title>Modifier Utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group as={Col} md="12" >                            
                <Form.Control as="textarea" placeholder="Nom " className="form-control"   onChange={(e)=>{setNomm(e.target.value)}} required rows={1} style={{width:"100%" }}/>
            </Form.Group>
            <Form.Group as={Col} md="12" >                            
                <Form.Control as="textarea" placeholder="Prenom" className="form-control"    onChange={(e)=>{setPrenom(e.target.value)}} required rows={1} style={{width:"100%" }}/>
            </Form.Group>                       
            <Form.Group as={Col} md="12" >                            
            <Form.Control as="textarea" placeholder="Mot de passe" className="form-control"   onChange={(e)=>{setMdp(e.target.value)}}  required rows={1} style={{width:"100%" }}/>
            </Form.Group>                               
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose3}>Fermer</Button>
          <Button variant="primary" onClick={update}>Confirmer</Button>
        </Modal.Footer>
      </Modal>
    

      <Modal id="supp_user" show={show2} onHide={handleClose2} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-secondary text-white">
          <Modal.Title>Suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>            
                                  
            <Form.Group as={Col} md="12" >                            
            <Form.Label>Etes-vous sur de vouloir supprimer ?</Form.Label>
            </Form.Group>                               
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>Fermer</Button>
          <Button variant="primary" onClick={supprimer}>Confirmer</Button>
        </Modal.Footer>
      </Modal>

        </div>
      )
        };
export default Gerer ;