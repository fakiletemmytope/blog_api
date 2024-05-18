import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import express from "express"
import { createUser, getUsers, getUser, getBlog, getBlogs, updateUser, deleteUser, createBlog, deleteBlog, updateBlog } from "./functions/crudmethod.mjs"
import bodyParser from 'body-parser';
import { postUserValidation, blogPostValidation, userLogin, userAuth, verifyUserToken } from './midddlewares/customMiddlewares.mjs';
import { getUserValidation } from './midddlewares/customMiddlewares.mjs';
import session from 'express-session';
import bcrypt from "bcrypt";
import { generateAccessToken, verifyAccessToken } from './midddlewares/jwt.mjs';
import { reading_time } from './functions/word_count.mjs';


const saltRounds = 10;
dotenv.config();
export const app = express()
const port = 3000


// Body-parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));

//home
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//User login
app.post('/login', userLogin, async (req, res)=>{
  
    req.session.user = {
      isAuth: true,
      userId: req.userId,
      username: req.username,
      email: req.email
    }
    const user = {
      id: req.userId,
      email: req.email,
      username: req.username
    }

    const token = await generateAccessToken(user)
    res.status(201).json({
      token: token
    });
  
} )

//get all users(must have admin privilege)
app.get('/users', async (req, res) =>{ 
    let result = await getUsers()
    //console.log(result)
    res.send(result)
  
})

//Yet to figure out if this is necessary
app.get('/user/:id', getUserValidation, async (req, res) =>{
  let email = req.body.email  
  let result = await getUser(email)
  console.log(result)
  res.send(result)
})

//Register a new user
app.post('/user', postUserValidation, async (req, res) =>{

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(req.body.password, salt);
  const query = {
    email: req.body.email
  }  
  
  let result = await getUser(query)
  
  if(result === null){
    const user = {
      'first_name': req.body.first_name,
      'last_name': req.body.last_name,
      'email': req.body.email,
      'password': hash
    }    
    let v = await createUser(user)
    //console.log(v)
    if(v.acknowledged){
      res.send(v.insertedId)
    }else{
      res.send("error occur while saving")
    }        
    
  }else{
    res.send("User already exists")
  }     
})

//For updating a user details
app.put('/user/', userAuth, (req, res)=>{
  const updatevalues = {
    $set: {first_name: "Olaoluwa"}
  }
  const query = {
    _id: new ObjectId(req.session.user.userId) 
  }  
  const update = async () =>{
    let result = await updateUser(query, updatevalues )
    res.send(result)
  }  
  update()  
})

//delete a user
app.delete('/user/', userAuth, (req, res)=>{
  //console.log(req.session.user.userId)
  const query ={
    _id: new ObjectId(req.session.user.userId)
  }
  const deleteuser = async () =>{
      let result = await deleteUser(query)
      //console.log(result)
      if(result.deletedCount === 1){
        res.send("user deleted")
      }
      else{
        res.send("unsuccessful")
      }
  }
  deleteuser()  
})


//get all blog post(any user)
app.get('/blogs/', async (req, res) =>{  
    const results = await getBlogs()

    const list = []
    results.map((result)=>{
      const value = {
        title: result.title,
        body: result.body,
        author: result.author
      }
      list.push(value)
    })

    res.status(200).json(list)
})

//get all blogs of a particular user
app.get('/myblogs/', verifyUserToken, async (req, res) =>{
  const query ={
    author_id: req.user.id
  }  
  const results = await getBlogs(query)
  console.log(results)
  let blogs = []
  if(results.length >= 1){
    if (results.length === 1){
      const blog = {
        id: results.id,
        title: results.title,
        body: results.body,
        author: results.author
      }
      blogs.push(results[0])
      
    }
    else{
        results.map((result) =>{
          const blog = {
            id: result.id,
            title: result.title,
            body: result.body,
            author: result.author
          }
          blogs.push(blog)
      
        })
        

    }
    res.status(200).json({
      data: blogs
    }) 
  }else{
    res.status(200).json({
      data: blogs
    }) 
  }
  

})
//get a single blog post(any user)
app.get('/blog/:id',  async(req, res) =>{  
  const query ={
    _id: new ObjectId(req.params.id) 
  }  
  const result = await getBlog(query)
  const read_count = result.read_count + 1
  console.log(read_count)
  const set = {
    $set: { read_count: read_count, }
  }
  await updateBlog(query, set)
  res.status(200).json({
    id: result.id,
    title: result.title,
    body: result.body,
    author: result.author
  })  
})

//create a blog post
app.post('/blog/', blogPostValidation, verifyUserToken, async(req, res) =>{
  const currentDate = new Date();
  const created_at = currentDate.toDateString()
  const updated_at = created_at  
  const read_count = 0
  const {title, description, body} = req.body
  const read_time = await reading_time(body)
  //console.log(req.session.user)
  let blog_post = {
    title: title,
    description: description,
    author: req.user.username,
    author_id: req.user.id,
    state: "draft",
    read_count: read_count,
    reading_time: `${read_time}min`,
    body: body,
    created_at: created_at,
    updated_at: updated_at
  }

 // console.log(req.session.user.isAuth)   
    let result = await createBlog(blog_post)
    if (result.acknowledged){
      res.send(result.insertedId)
    }else{
      res.send("error")
    }
  
})

//update a blog post by the author
app.put('/blog/:id', verifyUserToken, async (req, res) =>{
  const{body, title, state, description} = req.body
  const query ={_id: new ObjectId(req.params.id)}
  let update = {}
  if (title){
    update.title = title
  }
  if (body){
    const read_time = await reading_time(body)
    update.body= body
    update.reading_time = `${read_time}min`
  }
  if (description){
    update.description= description
  }
  if (state){
    update.state= state
  }

  if (update){
    console.log(update)
    const set = {
      $set: update
    }
    const result = updateBlog(query, set)
    res.send(result)
  }else{
    res.send("no update")
  }
  
  
})

//delete a blog post by the author
app.delete('/blog/:id', verifyUserToken, async (req, res) =>{

  const query ={_id: new ObjectId(req.params.id)}
  const result = await deleteBlog(query)
  if(result.deletedCount === 1){
    res.send("Article deleted sucessfully")
  }else{
    res.json({message: "blog not deleted"})
  }
 
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})