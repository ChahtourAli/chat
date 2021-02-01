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
socket.on('chat_groupe',function (data){
const expe=data.id_expe;
const groupe=data.groupe;
const message=data.message;
const date=data.date;
console.log (data);


db.query("INSERT INTO Message (expe,message,date,groupe) VALUES (?,?,?,?) ",[expe,message,date,groupe],(err,result)=>{
    if (err){
        console.log ("error");
    }
    else {
        

    console.log("succes");


    db.query("SELECT * FROM affectation_groupe  WHERE groupe=? ",groupe,(err,result1)=>{
       
        if(err)
        {
            console.log(err);
        }
        else{
        
            for(i=0;i<result1.length;i++){


                    envoyer(1,data,result1[i].utilisateur) ;


            }
            
        
        }

        

    })


    }
})

})

        socket.on('chat',function(data){
 const expe= data.id_expe;
 const dest= data.id_dest;
 const message= data.message;
 const date= data.date;

            console.log(date) ;

            db.query("INSERT INTO Message (expe,dest,message,date) VALUES (?,?,?,?) ",[expe,dest,message,date],(err,result)=>{
                if (err){
                    console.log ("error");
                }
                else {
                    

                    envoyer(0,data,dest) ;

                    envoyer(0,data,expe) ;

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


        db.query("SELECT concat(prenom,' ',nom) as destinataire , id FROM Utilisateur where id='"+dest+"' ",dest,(err,result)=>{
        if (err)
        {console.log(err)}
        else {

        db.query("SELECT message,date,expe FROM Message WHERE ( ( expe=? AND dest=? ) OR (dest=? AND expe=?) ) AND groupe IS NULL ",[expe,dest,expe,dest],
         (err,result2)=>{
             if (err){
                console.log(err);
                }   
            else{
                if(result2.length>0){
             var    msgg='succes';
                        res.send({result,result2,msgg});
                        //console.log({result,result2});
                        
                 }
                 else {
                     var msgg='echec';
                     res.send({result,result2,msgg});
                        //console.log({result,result2});
                 }
             
         }})


            
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



app.get('/afficher',(req,res)=>{
const id=req.query.id;
    db.query("SELECT nom,prenom,id,etat FROM Utilisateur WHERE id!=?",id,(err,result)=>{
    
if(err){
    console.log(err);
}else{
    res.send(result);
   
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

  

app.get ('/groupe',(req,res)=>{
const id =req.query.id;

    db.query("SELECT groupe , nom_groupe  FROM affectation_groupe INNER JOIN Groupe on (affectation_groupe.groupe = Groupe.id) WHERE utilisateur=? ",id,(err,result1)=>{
       
if(err)
{
    console.log(err);
}
else{

    //console.log(result);

    res.send(result1);

}

//res.send({table});


    })

})
app.post('/new_groupe',(req,res)=>{
    const nom_groupe =req.body.nom ;
   // const id =req.body.id;
    db.query("INSERT INTO Groupe (nom_groupe) VALUES (?) ",nom_groupe,(err,result)=>{
        if (err){
            console.log(err);
        }
        else{
          db.query("SELECT * FROM Groupe WHERE nom_groupe=? ",nom_groupe,(err,result1)=>{
            if(err)
            {
                console.log(err);

            }
            else{
                db.query("INSERT INTO affectation_groupe (utilisateur,groupe) VALUES (?,?)",[nom_groupe,id],(err,result2)=>{
                        res.send({result1,result2});
                })
            }
          })
            res.send(result);
        }
    })
})
  
app.get('/derniermessage',(req,res)=>{

const id= req.query.id;
db.query("SELECT expe,dest,groupe FROM Message WHERE expe='"+id+"' OR dest='"+id+"' ORDER BY date DESC limit 1",id,(err,result)=>{

    if(err){
        return(err);
    }
    else 
    {
        
        if(result.length>0){


        expe = result[0].expe ;
        dest = result[0].dest ;
        groupe=result[0].groupe;

        if(id == result[0].dest ){
            destinataire = result[0].expe ;
        }
        else{
            destinataire = result[0].dest ;
        }
        
    

        if(dest==null && groupe!=null){


            db.query("SELECT nom_groupe as destinataire , id FROM Groupe where id='"+groupe+"' ",(err,result3)=>{
                if (err)
                {
                    console.log(err)
                }
                else {
                

                db.query("SELECT message,date,expe FROM Message INNER JOIN Groupe  ON ( Message.groupe = Groupe.id ) WHERE groupe='"+groupe+"' ",
                 (err,result2)=>{
                     if (err){
                         return(err);
                        }   else{
    
                                res.send({result3,result2,groupe});
    
                         }
                     
                 })
        
        
                    
                }
        
            })


        }
        else{
        db.query("SELECT concat(nom,' ',prenom) as destinataire , id FROM Utilisateur where id='"+destinataire+"' ",[expe,dest],(err,result3)=>{
            if (err)
            {console.log(err)}
            else {
    
             db.query("SELECT message,date,expe FROM Message WHERE ( ( expe=? AND dest=? ) OR (dest=? AND expe=?) ) AND groupe IS NULL ",[expe,dest,expe,dest],
             (err,result2)=>{
                 if (err){
                     return(err);
                    }   else{
                            
                            res.send({result3,result2,groupe});
                            
                     }
                 
             })
    
    
                
            }
    
        })


    }
        


        

    }
    else{

        res.send('Vous n\'avez aucun message pour le moment .');


    }



    }
})
})
app.get('/message_groupe',(req,res)=>{
    const id_groupe =req.query.props;
    


        db.query("SELECT  concat('Groupe de discussion : ',nom_groupe) as destinataire,id FROM Groupe where id='"+id_groupe+"' ",id_groupe,(err,result)=>{
        if (err)
        {console.log(err)}
        else {

        db.query("SELECT message,date,expe,groupe  FROM Message WHERE groupe =? ",id_groupe,
         (err,result2)=>{
             if (err){
                console.log(err);
                }   
            else{
                if(result2.length>0){
             var    msgg='succes';
                        res.send({result,result2,msgg});
                        console.log({result,result2});
                        
                 }
                 else {
                     var msgg='echec';
                     res.send({result,result2,msgg});
                        console.log({result,result2});
                 }
             
         }})


            
        }

    })


    
    })

function envoyer(multiple,data,to) {
    socketsclient.forEach(socket => {
      
        if(socket.usr == to){
        console.log(socket.usr) ;
        
      
        socket.emit('message-send',data) ;
        

        console.log('message envoyé')

        }


    });
  }

server.listen(4000,()=>{console.log("server started")})