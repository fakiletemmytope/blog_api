import express from "express"
import { createUser, getUsers, getUser, getBlog, getBlogs, updateUser, deleteUser } from "./crudmethod.mjs"
import {bodyParser} from 'body-parser';
const app = express()
const port = 3000
const parser = bodyParser()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/users',(req, res) =>{ 
  const get = async () =>{
    let result = await getUsers()
    console.log(result)
    res.send(result)
  }
  get()
})

app.get('/user/:id',(req, res) =>{
  let email = "fakiletemitope@yahoo.com"
  const get = async () =>{
    let result = await getUser(email)
    console.log(result)
    res.send(result)
  }
  get()
})


app.post('/user', (req, res) =>{
    const user = {
        'first_name': 'Temitope',
        'last_name': 'Ogunwale',
        'email': 'ogunwale@yahoo.com',
        'password': 'oguns'
    }
    const add = async () =>{
      let v = await createUser(user)
      console.log(v)
      res.send(v)
    }
    add()    
})

app.put('/user/:id', (req, res)=>{
  let updatevalues = {
    $set: {first_name: "Olaoluwa"}
  }
  let email = "fakiletemitope@yahoo.com"
  let password = "oluwaseyi"
  const update = async () =>{
    let result = await updateUser(email,password, updatevalues )
    res.send(result)
  }
  update()
  
})

app.delete('/user/:id', (req, res)=>{
  let email = "fakiletemitope@yahoo.com"
  let password = "oluwaseyi"
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