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

    

socket.on('user_connected',function (data){

    socket.usr = data ;


    socketsclient.push(socket) ;

})

        socket.on('chat',function(data){
 const expe= data.id_expe;
 const dest= data.id_dest;
 const message= data.message;

            console.log(expe+' '+dest+' '+message) ;

            db.query("INSERT INTO Message (expe,dest,message) VALUES (?,?,?)",[expe,dest,message],(err,result)=>{
                if (err){
                    console.log ("error");
                }
                else {
                    

                    envoyer(data,dest) ;

                   envoyer(data,expe) ;

                }
            })
         
      
    
        })






    idsocket++ ;


   
});


    const maxAge= 3 * 24 * 60 * 60;
   const createToken=(id)=>{
       return (jwt.sign({id},'hello',{
           expiresIn: maxAge ,
       })
       );}

 


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
    const expe =req.query.id;
    const dest =req.query.props;


        db.query("SELECT concat(nom,' ',prenom) as destinataire , id FROM Utilisateur where id='"+dest+"' ",[expe,dest],(err,result)=>{
        if (err)
        {console.log(err)}
        else {

        db.query("SELECT message,date,expe FROM Message WHERE ( expe=? AND dest=? ) OR (dest=? AND expe=?) ",[expe,dest,expe,dest],
         (err,result2)=>{
             if (err){
                 return(err);
                }   
            else{


                        if(result2.length>0){
                        const    msg="1";
                        res.send({result,result2,msg});
                        console.log({result,result2,msg});

                        }
                        else{

                         const   msg="0";
                            res.send({result,msg,result2});
                            console.log({result,result2,msg});

                        }
                 }
             
         })


            
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
const id=req.query.id;
    db.query("SELECT nom,prenom,id,etat FROM Utilisateur WHERE id!=?",id,(err,result)=>{
    
if(err){
    console.log(err);
}else{
    res.send(result);
   /* io.on('connection', function (socket){
        socket.emit ("welcome",{
            result:result,});
     })*/
   
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

  
/*app.get ('/groupe',(req,res)=>{
    db.query ("SELECT * FROM Groupe"),(err,result)=>{
        if (err){
            return err;
        }
    else {
        console.log (result);
        res.send (result);
        }
    }
}) */
app.get ('/groupe',(req,res)=>{
const id=req.query.id;
db.query("SELECT * FROM affectation_groupe WHERE utilisateur=?",id,(err,result)=>{
if(err)
{ 
    return(err);
}
else
{
    res.send (result);
    db.query("SELECT nom_groupe FROM Groupe WHERE id=?",result.groupe,(err,result2)=>{

        if (err)
        {
            return(err);

        }
        else {
            return (result2);
        }
    })
}

})}) 
  
app.get('/derniermessage',(req,res)=>{

    


const id= req.query.id;


db.query("SELECT expe,dest FROM Message WHERE expe='"+id+"' OR dest='"+id+"' ORDER BY date DESC limit 1",id,(err,result)=>{

    if(err){
        return(err);
    }
    else 
    {
        
        if(result.length>0){


        expe = result[0].expe ;
        dest = result[0].dest  ;

        if(id == result[0].dest ){
            destinataire = result[0].expe ;
        }
        else{
            destinataire = result[0].dest ;
        }
        


        db.query("SELECT concat(nom,' ',prenom) as destinataire , id FROM Utilisateur where id='"+destinataire+"' ",[expe,dest],(err,result3)=>{
            if (err)
            {console.log(err)}
            else {
    
    
            db.query("SELECT message,date,expe FROM Message WHERE ( expe=? AND dest=? ) OR (dest=? AND expe=?) ",[expe,dest,expe,dest],
             (err,result2)=>{
                 if (err){
                     return(err);
                    }   else{

    
    
                            res.send({result3,result2});
                            //console.log({result3,result2});
                     }
                 
             })
    
    
                
            }
    
        })
        


        //

    }
    else{

        res.send('Vous n\'avez aucun message pour le moment .');


    }



    }
})
})

function envoyer(data,to) {
    socketsclient.forEach(socket => {
      
        if(socket.usr == to){
        console.log(socket.usr) ;

        socket.emit('message-send',data) ;

        console.log('message envoyé')

        }


    });
  }

server.listen(4000,()=>{console.log("server started")})