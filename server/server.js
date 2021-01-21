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

  socketsclient = [];
  idsocket=0 ;
  io.on('connection', function (socket){

    socket.name = 'cl'+idsocket ;
    socketsclient.push(socket) ;


        socket.on('chat',function(data){
 const expe= data.id_expe;
 const dest= data.id_dest;
 const message= data.message;


            db.query("INSERT INTO Message (expe,dest,message) VALUES (?,?,?)",[expe,dest,message],(err,result)=>{
                if (err){
                    console.log ("error");
                }
                else {
                    console.log("message envoyé");
                }
            })
            socket.broadcast.emit('message-send',data);
            
      
    
        })


//console.log('new client connected '+socket.name);


//broadcast('data','cl3')



    idsocket++ ;


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

 
 /* const verifyToken=(req,res,next)=>{
      const token=req.headers;
      if (!token)
      {
          res.send(' yo u need a token , please try to connect ');
      }
      else 
      {
        jwt.verify(token, "")
      }
  }*/

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
           res.send({result,token});
           console.log(result);
           db.query ("UPDATE Utilisateur SET etat=1 WHERE login=?",username);

           io.sockets.emit('connected',{

            id:result[0].id,
            etat:1
           })
        
           }
        else{
            message ="Login ou mot de passe incorrecte .";
            console.log(message);
            res.send(message);
        }
         }
        })
    
    }),
   
app.get('/message',(req,res)=>{
    const expe =req.body.id_expe;
    const dest =req.body.id_dest;


    db.query("SELECT message,date FROM Message WHERE expe=? AND dest=?",[expe,dest],(err,result)=>{
   // db.query("SELECT message,date FROM Message ",(err,result)=>{
        if (err)
        {console.log(err)}
        else {
            res.send(result);
            //console.log(result);
            
        }

    })
    })


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
app.get ('/deconnexion',(req,res)=>{
    id=req.body.id;
    db.query("UPDATE Utilisateur SET etat=0 WHERE id=?",id,
    (err,result)=>{
        if (err){
            console.log ("utilisateur deja déco" );
        }else{
io.sockets.emit('disconnected',{

    id:result[0].id,
    etat:0
   }) 
        }
        }
    
)})

    app.get('/connecter',(req,res)=>{
        db.query("SELECT id FROM Utilisateur WHERE etat=1",(err,result)=>{
            if(err)
            {
                console.log(err);
            }
            else{
                res.send(result);
                console.log(result);
            }
        })

    })

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
            
           }
})

})

  
  
  


function broadcast(data,to) {
    sockets.forEach(socket => {
      
        if(socket.name == to){
        console.log(socket.name) ;

        }


    });
  }

server.listen(4000,()=>{console.log("server started")})