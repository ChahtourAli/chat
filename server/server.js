const express = require("express");
const app =express();
const http=require("http");
const server = http.createServer(app);
const mysql = require("mysql");
const cors =require("cors");
const socket = require("socket.io")
const cookieParser = require ("cookie-parser")
const jwt = require("jsonwebtoken")
const io = socket(server,{
    cors :{
        origin:'*',
    }
})
app.use(cookieParser());
app.use(cors());
app.use(express.json());

var db = mysql.createConnection({
    host: "localhost",
    database:"Chat",
    user: "root",
    password: "data2020"
  });
  db.connect();
  
  io.on('connection', function (socket){
      socket.on('chat',function(data){
        socket.broadcast.emit('message-send',data);
         console.log(data.message);
      
    console.log('new client connected '+socket.id);
})
   /* io.to(socket.id).emit('msg', 'salut '+socket.id) ; 

    socket.on('disconnect',()=>{
        console.log('user had left');
    })*/

  });
  const maxAge= 3 * 24 * 60 * 60;
   const createToken=(id)=>{
       return (jwt.sign({id},'hello',{
           expiresIn: maxAge ,
       })
       );}

  /*app.get('/set',(req,res)=>{
      res.cookie('newUser',true);
      res.send('hi');
  })
  app.get('/read-cookie',(req,res)=>{
      const cookies =req.cookies;
      console.log(cookies);
      res.json(cookies);
  })*/
  const verifyToken=(id)=>{
      
  }

app.post('/login' ,(req,res)=>{
const username =req.body.username;
const password =req.body.password;


db.query("SELECT * FROM Utilisateur WHERE login =? AND password =?" ,[username, password] ,
(err,result)=>{
    if (err)
    {
        console.log(err);
    }else{
        if(result.length>0){
           const token= createToken(result[0].id);
           res.cookie('jwt',token,{maxAge:maxAge * 1000}); 
           console.log(token);
           res.send(result);
           console.log(result);
           db.query ("UPDATE Utilisateur SET etat=1 WHERE login=?",username);
        
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

    db.query("SELECT nom,prenom,id,etat FROM Utilisateur",(err,result)=>{
    
if(err){
    console.log(err);
}else{
    res.send(result);
    console.log (result)
    io.on('connection', function (socket){
        socket.emit ("welcome",{
            result:result,});
     })
   
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
            io.on('connection', function (socket){
                socket.emit ("new user",result);
             })
           }
})})
server.listen(4000,()=>{console.log("server started")})