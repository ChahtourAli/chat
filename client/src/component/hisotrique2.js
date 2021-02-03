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
    name: 'Groupe',
    selector: 'destinataire',
    sortable: true,
    right: true,
  },
  {
    name: 'Message',
    selector: 'message',
    sortable: true,
    right: true,
  },
  {
    name: 'Date et heure',
    selector: 'date',
    sortable: true,
    right: true,
  },
];

const Historique2 =()=> {
    const [mess, setMess] = useState([]);
    useEffect(() => {
        Axios.get("http://192.168.4.102:4000/getallmessagegroupe").then((response) => {
          setMess(response.data);
          console.log(response.data);
          
        });
      }, []);
    return (<div>
      <Nav />
      <DataTable
        columns={columns}
        data={mess}
        pagination={true}
      />
      </div>
    )
  
};



export default Historique2;