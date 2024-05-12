import dotenv from 'dotenv';
import express from "express"
import { createUser, getUsers, getUser, getBlog, getBlogs, updateUser, deleteUser } from "./crudmethod.mjs"
import bodyParser from 'body-parser';
import { postUserValidation, deleteUserValidation, updateUserValidation } from './midddlewares/customMiddlewares.mjs';
import { getUserValidation } from './midddlewares/customMiddlewares.mjs';

dotenv.config();
const app = express()
const port = 3000

// Body-parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/users', (req, res) =>{ 
  const get = async () =>{
    let result = await getUsers()
    console.log(result)
    res.send(result)
  }
  get()
})

app.get('/user/:id', getUserValidation, (req, res) =>{
  let email = req.body.email
  const get = async () =>{
    let result = await getUser(email)
    console.log(result)
    res.send(result)
  }
  get()
})


app.post('/user', postUserValidation, (req, res) =>{
  //console.log(req.body)
    let email = req.body.email
    let checkemail = null
    const get = async () =>{
      let result = await getUser(email)
      checkemail = result.email
    }
    get()

    if(checkemail === null){
      const user = {
        'first_name': req.body.first_name,
        'last_name': req.body.last_name,
        'email': req.body.email,
        'password': req.body.password
      }
      const add = async () =>{
        let v = await createUser(user)
        console.log(v)
        res.send(v)
      }
      //res.send(req.body)
      add()
    }else{
      res.send("User already exists")
    }
        
})

app.put('/user/:id', updateUserValidation,  (req, res)=>{
  let updatevalues = {
    $set: {first_name: "Olaoluwa"}
  }
  let email = req.body.email
  let password = req.body.password
  const update = async () =>{
    let result = await updateUser(email,password, updatevalues )
    res.send(result)
  }
  update()
  
})

app.delete('/user/:id', deleteUserValidation, (req, res)=>{
  let email = req.body.email
  let password = req.body.password
  const deleteuser = async () =>{
      let result = await deleteUser(email, password)
      res.send(result)
  }
  //res.send("delete user")
  deleteuser()
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})