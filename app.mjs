import dotenv from 'dotenv';
import express from "express"
import bodyParser from 'body-parser';
import session from 'express-session';
import connectDB from './conn.mjs';
import userRouter from './routes/users_routes.mjs';
import blogRouter from './routes/blog_routes.mjs';


dotenv.config();
const app = express()
const port = 3000


// Body-parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));

app.use(userRouter)
app.use(blogRouter)




//get all users(must have admin privilege)
// app.get('/users', async (req, res) =>{ 
//     let result = await getUsers()
//     //console.log(result)
//     res.send(result)
  
// })

// //Yet to figure out if this is necessary
// app.get('/user/:id', getUserValidation, async (req, res) =>{
//   let email = req.body.email  
//   let result = await getUser(email)
//   console.log(result)
//   res.send(result)
// })



//For updating a user details
// app.put('/user/', userAuth, (req, res)=>{
//   const updatevalues = {
//     $set: {first_name: "Olaoluwa"}
//   }
//   const query = {
//     _id: new ObjectId(req.session.user.userId) 
//   }  
//   const update = async () =>{
//     let result = await updateUser(query, updatevalues )
//     res.send(result)
//   }  
//   update()  
// })

// //delete a user
// app.delete('/user/', userAuth, (req, res)=>{
//   //console.log(req.session.user.userId)
//   const query ={
//     _id: new ObjectId(req.session.user.userId)
//   }
//   const deleteuser = async () =>{
//       let result = await deleteUser(query)
//       //console.log(result)
//       if(result.deletedCount === 1){
//         res.send("user deleted")
//       }
//       else{
//         res.send("unsuccessful")
//       }
//   }
//   deleteuser()  
// })


connectDB()

app.listen(port, () => {
  console.log(`Blog app listening on port ${port}`)
})