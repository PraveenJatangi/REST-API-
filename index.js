const express= require ('express');
const mongoose = require ('mongoose');
const app = express();
const fs = require('fs');

// const users=require('./mock-data.json');
const PORT = 8000;


//connection with the mongodb
mongoose.connect("mongodb://127.0.0.1:27017/youtube")
    .then(()=>console.log("Mongo connected"))
    .catch(err=>console.log("mongo error",err));

 //user schema 

   const userSchema= new mongoose.Schema({
    firstName:{
       type:String,
       required:true
   },

   lastName:{
       type:String,
   },

   email:{
        type:String,
         required:true,
         unique:true
   },

   gender:{
         type:String,
   },

   position:{
       type:String
   }

},{timestamps:true});

//user model

const User = mongoose.model("user",userSchema);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

//custom middleware
app.use((req,res,next)=>{
 console.log("hello from middleware 1");
  
  next();
});

app.use((req,res,next)=>{
    console.log("hello from middleware 2");
      
     next();
   });  

app.get('/api/users', async (req,res)=>{
    const allDbUsers= await User.find({});
    res.json(allDbUsers);
     
})
app.get('/users', async (req,res)=>{
    const allDbUsers= await User.find({}); 
    const html=`
    <ul>
     ${ allDbUsers.map(user=>`<li>${user.firstName}</li>`).join(" ")}
    </ul>
    `
     res.send(html);

})

app.get('/api/users/:id', async (req,res)=>{
    
    
    // if (!user || user.length === 0) {
    //     return res.json({message:"no user found"});
    // }

      const user= await User.findById (req.params.id);
    //   const user= User.find(user=>user.id===id);
      if (!user) {
        return res.status(404).json({ message: "User not found" }); // ✅ Check if user exists
    }

      res.json(user);
    
})

 app.post ('/api/users/', async (req,res)=>{
    
   const body = req.body;
   if(!body.first_Name||
    !body.last_Name||
    !body.email||
    !body.gender||
    !body.position
   ){
   return res.status(400).json({massage:"all fields are qreuired"});
   }
   const result = await User.create({
    firstName:body.first_Name,
    lastName:body.last_Name,
    email:body.email,
    gender:body.gender,
    position:body.position
   })
   console.log("resutl",result);
   return res.status(201).json({message:"success"})
//    users.push({...body,id:users.length+1});
// fs.writeFile('./mock-data.json', JSON.stringify(users), (error, data)=>{
//     return res.json({status:"Success",id:users.length})
})


app.patch('/api/users/:id',async (req,res)=>{
    try{
        const updatedUser= await User.findByIdAndUpdate(req.params.id,{$set:req.body},{ new:true});
        if(!updatedUser){
            return res.status(404).json({message:"user not found"})
        }
        console.log(updatedUser);
        res.status(200).json(updatedUser);
       }
       catch(error){
        res.status(500).json({error:error.message})
       }
   

    
})

app.put('/api/users/:id',async (req,res)=>{

    // const id =Number(req.params.id);
    // const userData= req.body;

    // const userIndex= User.findIndex(user=>user.id===id);

    // if(userIndex===-1){
    //     return res.status(404).json({message:"user not found"})
    // }
    // User[userIndex]={...User[userIndex],...userData};
    
    // fs.writeFile('./mock-data.json', JSON.stringify(users), (error, data)=>{
    //     if(error){
    //         return res.json({message:"failed to update"})
    //     } 
    //     return res.json({message:"successfully updated user"})
    // })
   try{
    const updatedUser=await User.findById(req.params.id);
    if(!updatedUser){
        return res.status(404).json({message:"user not found"})
    }
    updatedUser.overwrite(req.body);
    await updatedUser.save();

    res.status(200).json(updatedUser);
   }
   catch(error){
    res.status(500).json({error:error.message})
   }
    

})

app.delete('/api/users/:id',async (req,res)=>{
   
    // const id = Number(req.params.id);
    // const userIndex= users.findIndex(user=>user.id ===id);
    // if(userIndex===-1){
    //    return res.status(404).json({message:"user not found"})
    // }
    // users.splice(userIndex,1)
    // fs.writeFile('./mock-data.json',JSON.stringify(users,null,2),(error)=>{
    //     if(error){
    //         return res.json({message:"failed to delete"})
    //     } 
    //     return res.json({message:"successfully deleted user"})

    // })
    try{
        const deletedUser= await User.findByIdAndDelete(req.params.id);
        if(!deletedUser){
            return res.status(404).json({message:"user not found"})
        }
        res.status(200).json({message:"user deleted successfully"});
        console.log(deletedUser);
    }
    catch(error){
        res.status(500).json({error:error.message});
    }


   
})



app.listen(PORT,()=>{console.log("port listening at 8000")});