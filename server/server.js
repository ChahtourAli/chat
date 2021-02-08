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


    
    socket.on('msg_lu',function (data){
        destinataire=
        
        db.query("UPDATE")
    
    })


socket.on('user_connected',function (data){

    socket.usr = data ;


    socketsclient.push(socket) ;

})
socket.on('chat_groupe',function (data){
    //console.log(data);
const expe=data.id_expe;
const groupe=data.groupe;
const message=data.message;
const date=data.date;
//console.log (data);


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


                    envoyer(1,'message-send',data,result1[i].utilisateur) ;


            }
            
        
        }

        

    })


    }
})

})


socket.on('chat_global',function(data){

    
})



        socket.on('chat',function(data){
 const expe= data.id_expe;
 const dest= data.id_dest;
 const message= data.message;
 const date= data.date;

            //console.log(date) ;

            db.query("INSERT INTO Message (expe,dest,message,date) VALUES (?,?,?,?) ",[expe,dest,message,date],(err,result)=>{
                if (err){
                    console.log ("error");
                }
                else {
                    

                    envoyer(0,'message-send',data,dest) ;

                    envoyer(0,'message-send',data,expe) ;

                }
            })
         
      
    
        })






    idsocket++ ;


   
});
app.get("/afficheruser",(req,res)=>{
    const id=req.query.id;
    db.query("SELECT * FROM Utilisateur where id!='"+id+"'",(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.send(result);
        }
    })
})



    const maxAge= 3 * 24 * 60 * 60;
   const createToken=(id)=>{
       return (jwt.sign({id},'hello',{
           expiresIn: maxAge ,
       })
       );}

 
app.put("/delet",(req,res)=>{

const id=req.body.params.id;

db.query("DELETE FROM Utilisateur where id=?",id,(err,result)=>{
if(err)
{
    console.log(err);
}
else{
    
    console.log("suppression effectué");
    res.send('Suppression effectuée avec succès .');
}

})
})
app.get("/getallmessage",(req,res)=>{
    db.query("SELECT t1.* , (SELECT concat(t2.nom,' ',t2.prenom) FROM Utilisateur as t2 where t1.expe = t2.id  ) as expediteur , (SELECT concat(t3.nom,' ',t3.prenom) FROM Utilisateur as t3 where t1.dest = t3.id  ) as destinataire  FROM Message as t1 WHERE t1.dest IS NOT NULL",(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    })
})


app.get("/message_global",(req,res)=>{
    const id=req.query.id;

    db.query("SELECT  'Discussion globale' as destinataire,id FROM Groupe ",(err,result)=>{
        if (err)
        {console.log(err)}
        else {


            res.send({result,result2});


        }
    })
})



app.get("/getallmessagegroupe",(req,res)=>{
    db.query("SELECT t1.* , (SELECT concat(t2.nom,' ',t2.prenom) FROM Utilisateur as t2 where t1.expe = t2.id  ) as expediteur , (SELECT t3.nom_groupe FROM Groupe as t3 where t1.groupe = t3.id  ) as destinataire  FROM Message as t1 WHERE t1.groupe IS NOT NULL",(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    })
})

app.post ("/updateUserr",(req,res)=>{
  
    const id=req.body.params.id;
    const nom=req.body.params.nom;
    const prenom=req.body.params.prenom;
    const mdp=req.body.params.mdp;
   
    db.query("UPDATE Utilisateur SET nom='"+nom+"',prenom='"+prenom+"',password='"+mdp+"'  WHERE id='"+id+"' " ,(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("update done");
        }
    } )
})

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
           //console.log(token);
           res.send({result,token});
           //console.log(result);
           db.query ("UPDATE Utilisateur SET etat=1 WHERE login=?",username);

           io.sockets.emit('connected',{

            id:result[0].id,
            etat:1
           })


           setInterval(function(){

            

            db.query("SELECT count(*) as nbr,expe FROM Message where dest='"+result[0].id+"' AND lu = 0 AND groupe IS NULL GROUP BY expe ",(err,result_msg)=>{
                if (err)
                {console.log(err)}
                else {
    
                    envoyer(0,'notif',result_msg,result[0].id) ;

                }
    
            });
    
            
    
    
    
            },1000) ;




        
           }
            else{
                message ="Login ou mot de passe incorrecte .";
                //console.log(message);
                res.send(message);
            }
         }
        })



        

    
    }),


    
    app.get('/update_lu',(req,res)=>{

    const exp_id =req.query.exp_id;
    const dest_id =req.query.dest_id;

            console.log(exp_id+' ------ '+dest_id);

        db.query("UPDATE Message SET lu = 1 WHERE   expe ='"+exp_id+"'  AND dest ='"+dest_id+"'  ",(err,result1)=>{
            if (err)
            {console.log(err)}
            else {


            }

        });



    });


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


                    db.query("UPDATE Message SET lu = 1 WHERE dest ='"+expe+"'  AND expe ='"+dest+"'  ",(err,result1)=>{
                        if (err)
                        {console.log(err)}
                        else {


                        }

                    });
                        var    msgg='succes';
                        res.send({result,result2,msgg});



                   


                        
                 }
                 else {
                     var msgg='echec';
                     res.send({result,result2,msgg});
                  
                 }
             
         }})


            
        }

    })


    
    })
app.get('/modifiergroupe',(req,res)=>{
    const id=req.query.id;
    
    
    db.query("SELECT * FROM affectation_groupe INNER JOIN Groupe ON(affectation_groupe.groupe=Groupe.id) where Groupe.id='"+id+"'",id,(err,result)=>{
        if (err)
        {
            console.log(err);
        }
        else
        {
            res.send(result);

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
    
console.log("ajout terminé");
db.query("SELECT id FROM Utilisateur where login='"+login+"' ", (err,result1)=>{
    if(err)
    {
        console.log(err)
    }
    else{
        let id=result1;
        
        db.query("INSERT INTO affectation_groupe (utilisateur,groupe) VALUES (?,'131') ",id[0].id,(err,result2)=>{
            if(err)
            {console.log(err);}
            else {
                //console.log(result2);
            }
        })
    }
})
}
})

}),

app.get ('/deconnexion',(req,res)=>{
    //console.log(req.query.id);
    const  id=req.query.id;
    
    db.query("UPDATE Utilisateur SET etat=0 WHERE id='"+id+"'",
    (err,result)=>{
        if (err){
            console.log (err);
        }else{
io.sockets.emit('disconnected',{

    id:id,
    etat:0
   }) 
        }
        }
    
)})






app.get('/afficher',(req,res)=>{
const id=req.query.id;
    db.query("SELECT nom,prenom,id,etat,(SELECT count(*)  FROM Message where dest='"+id+"' AND expe = t1.id AND lu = 0 AND groupe IS NULL ) as nbr , (SELECT t2.message  FROM Message t2 WHERE ( t2.dest = '"+id+"' OR t2.expe = '"+id+"') AND  ( t2.dest = t1.id OR t2.expe = t1.id)  AND t2.message IS NOT NULL AND t2.message != '' AND groupe IS NULL ORDER BY t2.id DESC LIMIT 1  ) as derniermsg ,  (SELECT t2.date  FROM Message t2 WHERE ( t2.dest = '"+id+"' OR t2.expe = '"+id+"'  ) AND  ( t2.dest = t1.id OR t2.expe = t1.id)  AND t2.message IS NOT NULL AND t2.message != '' AND groupe IS NULL ORDER BY t2.id DESC LIMIT 1  ) as derniere_date FROM Utilisateur t1 WHERE id!=?",id,(err,result)=>{
    
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
             //console.log(result);
            
           }
})

})

  

app.get ('/groupe',(req,res)=>{
const id =req.query.id;

    db.query("SELECT groupe , nom_groupe ,(SELECT count(*) FROM Message WHERE Message.groupe = t1.id AND Message.expe != '"+id+"' AND lu = 0 ) as nbr , (SELECT date FROM Message WHERE Message.groupe = t1.id AND Message.expe != '"+id+"' ORDER BY id DESC LIMIT 1 ) as derniere_date , (SELECT message FROM Message WHERE Message.groupe = t1.id AND Message.expe != '"+id+"' ORDER BY id DESC LIMIT 1 ) as derniermsg  FROM affectation_groupe INNER JOIN Groupe as t1 on (affectation_groupe.groupe = t1.id) WHERE utilisateur=? ",id,(err,result1)=>{
       
if(err)
{
    console.log(err);
}
else
{
    res.send(result1);

}




    })

})
app.post('/new_groupe',(req,res)=>{
    const nom_groupe =req.body.nom ;
    const affectation =req.body.affectation;
    const id_connected = req.body.id_connected;

    db.query("SELECT * FROM Groupe WHERE nom_groupe=? ",nom_groupe,(err,result)=>{
       if(err)
       {
           console.log(err);
       }
       else{
           if(result.length==0){

                db.query("INSERT INTO Groupe (nom_groupe) VALUES (?) ",nom_groupe,(err,result1)=>{

                    affectation.push(id_connected);

                    //console.log(affectation);
                    

                    affectation.forEach(function(usr){

                        db.query("SELECT * FROM affectation_groupe where groupe = "+result1.insertId+" AND utilisateur = "+usr+" ",[result1.insertId , usr],(err,result_existance)=>{

                            if(result_existance.length == 0 ){


                            db.query("INSERT INTO affectation_groupe (groupe,utilisateur) VALUES (?,?) ",[result1.insertId , usr],(err,result1)=>{
                                if(err)
                                {
                                   
                                }
                                else{

                                    

                                }
                            
                                
                                
                            });

                            }

                        });

                    })

                    


                    
                });
                res.send("Action effectuée avec succès");
                
             }else
            {
            res.send("nom du groupe déjà utilisé");
            }

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
                        //console.log({result,result2});
                    

                        db.query("UPDATE Message set lu = 1 where groupe = '"+id_groupe+"'  ",(err,result)=>{
                            if (err)
                            {console.log(err)}
                            else {


                            }

                        });



                        
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
 

app.post('/updategroupe',(req,res)=>{
const id=req.body.id;
const nom=req.body.nom;
const affectation =req.body.affectation;
const id_connected = req.body.id_connected;

//console.log(id);
db.query("UPDATE  Groupe SET nom_groupe=? where id=?",[nom,id],(err,result)=>{
        if (err)
        {
            console.log(err);
        }
        else
        {
            db.query("DELETE FROM affectation_groupe where groupe=?",id,(err,result1)=>{
                if (err){
                    console.log(err);
                }
                else{

                    affectation.push(id_connected);

                    //console.log(affectation);
                    

                    affectation.forEach(function(usr){

                        db.query("SELECT * FROM affectation_groupe where groupe = "+id+" AND utilisateur = "+usr+" ",[id , usr],(err,result_existance)=>{

                            if(result_existance.length == 0 ){


                            db.query("INSERT INTO affectation_groupe (groupe,utilisateur) VALUES (?,?) ",[id , usr],(err,result1)=>{
                                if(err)
                                {
                                    console.log(err);
                                }
                                else{

                                       

                                }
                            
                                
                                
                            });

                            }

                        });

                    })

                res.send("groupe modifié");
                }
            })
        }
})
})
app.delete('/deletegroupe',(req,res)=>{
    const id=req.body.id;
    db.query("DELETE FROM affectation_groupe where groupe=?",id,(err,result)=>{
        if (err){
            console.log(err);
        }
        else{
            db.query("DELETE FROM Groupe where id=?",id,(err,result1)=>{
                if (err)
                {
                    console.log(err);
                }
                else{
                    res.send("le groupe a été supprimé");
                }
            })
        }
    })

})



function envoyer(multiple,objet,data,to) {
    socketsclient.forEach(socket => {
      
        if(socket.usr == to){
    
        
      
        socket.emit(objet,data) ;
        



        }


    });
  }

server.listen(4000,()=>{console.log("server started")})