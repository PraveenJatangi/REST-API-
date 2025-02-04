const express= require ('express');
const app = express();
const fs = require('fs');
const users=require('./mock-data.json');
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
dfgad
app.

app.get('/api/users',(req,res)=>{
    res.json(users);
     
})
app.get('/users',(req,res)=>{
    const html=`
    <ul>
     ${ users.map(user=>`<li>${user.first_name}</li>`).join(" ")}
    </ul>
    `
     res.send(html);

})

app.get('/api/users/:id',(req,res)=>{
    
    if (!users || users.length === 0) {
        return res.json({message:"no user found"});
    }

      const id= Number(req.params.id);
      const user= users.find(user=>user.id===id);
      if (!user) {
        return res.status(404).json({ message: "User not found" }); // ✅ Check if user exists
    }

      res.json(user);
    
})

app.post('/api/users/',(req,res)=>{
    
   const body = req.body;
   users.push({...body,id:users.length+1});
fs.writeFile('./mock-data.json', JSON.stringify(users), (error, data)=>{
    return res.json({status:"Success",id:users.length})
})

    

})

app.patch('/api/users/:id',(req,res)=>{
  
   

    return res.json({status:"Pending"})
})

app.put('/api/users/:id',(req,res)=>{

    const id =Number(req.params.id);
    const userData= req.body;

    const userIndex= users.findIndex(user=>user.id===id);

    if(userIndex===-1){
        return res.status(404).json({message:"user not found"})
    }
    users[userIndex]={...users[userIndex],...userData};
    
    fs.writeFile('./mock-data.json', JSON.stringify(users), (error, data)=>{
        if(error){
            return res.json({message:"failed to update"})
        } 
        return res.json({message:"successfully updated user"})
    })
    

})

app.delete('/api/users/:id',(req,res)=>{
   
    const id = Number(req.params.id);
    const userIndex= users.findIndex(user=>user.id ===id);
    if(userIndex===-1){
       return res.status(404).json({message:"user not found"})
    }
    users.splice(userIndex,1)
    fs.writeFile('./mock-data.json',JSON.stringify(users,null,2),(error)=>{
        if(error){
            return res.json({message:"failed to delete"})
        } 
        return res.json({message:"successfully deleted user"})

    })


   
})





app.listen(PORT,()=>{console.log("port listening at 8000")});