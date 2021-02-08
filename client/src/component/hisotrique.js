import React,{useState,useEffect} from 'react';
import Axios from "axios";
import DataTable from 'react-data-table-component';
import Nav from './home/Navbar'

const columns = [
  {
    name: 'Expéditeur',
    selector: 'expediteur',
    sortable: true,
  },
  {
    name: 'Destinataire',
    selector: 'destinataire',
    sortable: true,
  },
  {
    name: 'Message',
    selector: 'message',
    sortable: true,
  },
  {
    name: 'Date et heure',
    selector: 'date',
    sortable: true,
  },
];

const Historique =()=> {
    const [mess, setMess] = useState([]);
    useEffect(() => {
        Axios.get("http://192.168.4.102:4000/getallmessage").then((response) => {
          setMess(response.data);
          console.log(response.data);
          
        });
      }, []);
    return (
    <div>
      <Nav/>
    <div className="div_user">
        <h4>Historique</h4>  
    </div> 
      <DataTable columns={columns} data={mess} pagination={true} />            
    </div>
    )
    
    };



export default Historique;