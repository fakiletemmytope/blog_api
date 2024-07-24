import express from "express"
import { userLogin } from "../midddlewares/customMiddlewares.mjs"
import { generateAccessToken } from "../midddlewares/jwt.mjs"
import { postUserValidation } from "../midddlewares/customMiddlewares.mjs"
import UserModel from "../schemas/user.mjs"
import bcrypt from "bcrypt";



//Home
const userRouter = express.Router()
const saltRounds = 10;

userRouter.get('/', (req, res) => {
    res.send('Hello World!')
})

//userLogin
userRouter.post('/login', userLogin, async (req, res)=>{
  
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


//Create a new user
userRouter.post('/user', postUserValidation, async (req, res) =>{

    const check = await isUser({'email':req.body.email})
    // console.log(check)
    // res.send(check)

    if(!check){
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(req.body.password, salt); 
        const user = {
            'first_name': req.body.first_name,
            'last_name': req.body.last_name,
            'email': req.body.email,
            'password': hash
        }   
        const User = new UserModel(user);
        try {
            const result = await User.save();
            if (result ){
              res.status(200).json({        
                  message: "User created",
                  id: result._id
              });
            }
            
          } catch (error) {
            res.status(500).send(error);
          }
    }else{
        res.status(200).json(
            {message: "user exists"}
        )
    } 
})

async function isUser(email) {
    const result = await UserModel.findOne(email)
    if(result){
        //console.log(result.email)
        return true
    }
    console.log("not found")
}


export default userRouter



