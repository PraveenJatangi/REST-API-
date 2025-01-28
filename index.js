const express= require ('express');
const app = express();
const fs = require('fs');
const users=require('./mock-data.json');
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));


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
        return res.send("<p>No users found.</p>");
    }
      const id= Number(req.params.id);
      const user= users.find(user=>user.id===id);
      res.json(user);
})

app.post('/api/users/',(req,res)=>{
    
   const body = req.body;
   users.push({...body,id:users.length+1});
fs.writeFile('./mock-data.json', JSON.stringify(users), (error, data)=>{
    return res.json({status:"Pending"})
})

    

})

app.patch('/api/users/:id',(req,res)=>{
  
    //edit the content

    return res.json({status:"Pending"})
})

app.delete('/api/users/:id',(req,res)=>{

    return res.json({status:"Pending"})
})





app.listen(PORT,()=>{console.log("port listening at 8000")});