const express = require("express");
const app =express();
const http=require("http");
const server = http.createServer(app);
const mysql = require("mysql");
const cors =require("cors");
const socket = require("socket.io")
const io = socket(server,{
    cors :{
        origin:'*',
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
  
  io.on('connection', function (socket)  {
      socket.on('chat',function(data){
        io.emit('chat',data);
         console.log(data.message);
      
    console.log('new client connected '+socket.id);
    
     })
    

   /* io.to(socket.id).emit('msg', 'salut '+socket.id) ; 

    socket.on('disconnect',()=>{
        console.log('user had left');
    })*/

  });

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
           res.send(message);
        }
        else{
            message ="Login ou mot de passe incorrecte .";
            console.log(message);
            res.send(message);
        }
         }
        })}),

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

}),
app.put('/delet',(req,res)=>{
    const prenom=req.body.prenom;
  
    
    db.query("DELETE FROM Utilisateur WHERE prenom=?",prenom,
    (err,result)=>{
    if(err){
        console.log (err)
    }
    else{
    console.log("suppression effectuer")
    }
    })
    
    }),

app.get('/afficher',(req,res)=>{

    db.query("SELECT nom,prenom,id FROM Utilisateur",(err,result)=>{
    
if(err){
    console.log(err);
}else{
    res.send(result);
    console.log (result)
}

    })
})
app.get('/home',(req,res)=>{
    
   id=req.query.props;
    
    db.query("SELECT * FROM Utilisateur WHERE id=?",id,(err,result)=>{
           if(err){
               console.log (err);
           }
           else{
              res.send(result);
              console.log(result);

           }

})})







server.listen(4000,()=>{console.log("server started")})