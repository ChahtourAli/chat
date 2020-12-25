const express = require("express");
const app =express();
const http=require("http");
const server = http.createServer(app);
const mysql = require("mysql");
const cors =require("cors");
const socket = require("socket.io")
const io = socket(server,{
    cors :{
        origin:'',
    }
})
app.use(cors());
app.use(express.json());

var db = mysql.createConnection({
    host: "localhost",
    database:"Chat",
    user: "root",
    password: "data2020"
  });
  db.connect();

app.post('/login' ,(req,res)=>{
const username =req.body.username ;
const password =req.body.password;


db.query("SELECT * FROM Utilisateur WHERE login =? AND password =? " ,[username, password] ,
(err,result)=>{
    
    if (err)
    {
        console.log(err);
    }else{

        if(result.length>0){
            message = "succes";
            console.log(message);
           
        }
        else{
            message ="Login ou mot de passe incorrecte .";
            console.log(message);
        }
         }
         io.on("connection",(socket)=>{
      
        
        },
         getApiAndEmit = socket => {
            const response = message;
         
            socket.emit("chat_message", response);
         })
        
        
        
        },
          )})

app.post('/create',(req,res)=>{
const nom=req.body.nom;
const prenom=req.body.prenom;
const login=req.body.login;
const mdp=req.body.mdp;

db.query("INSERT INTO Utilisateur (nom,prenom,login,password) VALUES (?,?,?,?)",[nom,prenom,login,mdp],
(err,result)=>{
if(err){
    console.log (err)
}
else{
console.log("ajout terminé")
}
})

})





console.log ("hello")



server.listen(4000,()=>{console.log("server started")})