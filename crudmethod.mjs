import { connect } from './conn.mjs'
import { client } from './conn.mjs'

export const createUser = async (userDetails) =>{
    let con = await connect()
    let result =""
    if(con){
        result = await client.db("blog").collection("users").insertOne(userDetails)
        console.log(result)
    }
    else{
        //console.log("error")
        result ="error"
    }      
    await client.close();
    return result
}

export const getUsers = async () =>{
    let con = await connect()
    let result = ""
    if(con){
        result = await client.db("blog").collection("users").find().toArray()
    }
    else{
        result = "error in connection"
    }
    await client.close();
    return result
}

export const getUser = async (email) =>{
    let con = await connect()
    let result = ""
    let query = {email: email}
    if(con){
        result = await client.db("blog").collection("users").findOne(query)
    }
    else{
        result = "error in connection"
    }
    await client.close();
    return result
}

export const updateUser = async (email, password, set) =>{
    let con = await connect()
    let result = ""
    let query = {email: email, password: password}
    let option = {}
    if(con){
        //await client.db(<database name>).collection(<table name>).updateOne(query, updatevalues, options)
        result = await client.db("blog").collection("users").updateOne(query, set, option)
    }
    else{
        result = "error in connection"
    }
    client.close()
    return result
}

export const deleteUser = async (email, password) =>{
    let con = await connect()
    let result = ""
    let query = {email: email, password: password}
    
    if(con){
        //await client.db(<database name>).collection(<table name>).deletOne(query)
        result = await client.db("blog").collection("users").deleteOne(query)
    }
    else{
        result = "error in connection"
    }
    await client.close();
    return result

}

export const createBlog = async () =>{
    await client.close();
}

export const getBlog = async () =>{
    await client.close();
}

export const getBlogs = async () =>{
    await client.close();
}

export const updateBlog = async () =>{
    await client.close();
}

export const deleteBlog = async () =>{
    await client.close();
}