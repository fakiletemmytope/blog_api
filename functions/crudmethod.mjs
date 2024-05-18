import { connect } from '../conn.mjs'
import { client } from '../conn.mjs'

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

export const getUser = async (query) =>{
    let con = await connect()
    let result = ""
    if(con){
        result = await client.db("blog").collection("users").findOne(query)
    }
    else{
        result = "error in connection"
    }
    await client.close();
    return result
}

export const updateUser = async (query, set) =>{
    let con = await connect()
    let result = ""
    //let query = {email: email, password: password}
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

export const deleteUser = async (query) =>{
    let con = await connect()
    let result = ""
    // let query = {email: email, password: password}
    
    if(con){
        //await client.db(<database name>).collection(<table name>).deletOne(query)
        result = await client.db("blog").collection("users").deleteOne(query)
        await client.close();
        return result
    }
    else{
        await client.close();
        return "error in connection"
    }  
   // return result
}

export const createBlog = async (blog_post) =>{
    let con = await connect()
    let result =""
    if(con){
        result = await client.db("blog").collection("blog").insertOne(blog_post)
        console.log(result)
    }
    else{
        result ="error"
    }      
    await client.close();
    return result
}

export const getBlog = async (query) =>{
    const con = await connect()
    if(con){
        const result = await client.db("blog").collection("blog").findOne(query)
        await client.close();
        return result
    }else{
        await client.close();
        return "error"   
    }
    
}

export const getBlogs = async (query="") =>{
    const con = await connect()
    let result=""
    if(con){
        if(!query){
            result = await client.db("blog").collection("blog").find().toArray()    
            await client.close();
            return result   
        }else{
            result = await client.db("blog").collection("blog").find(query).toArray()
            //console.log(result)
            return result
        }           
    }
    else{
        await client.close()
        return "error"
    }
    
    
}

export const updateBlog = async (query, set) =>{
    const con = await connect()
    if(con){
        let option = {}
        const result = await client.db("blog").collection("blog").updateOne(query, set, option)
        await client.close()
        return result
    }else{
        await client.close()
        return "error in connection"
    }
}

export const deleteBlog = async (query) =>{
    const con = await connect()
    if (con){
        const result = await client.db("blog").collection("blog").deleteOne(query)
        await client.close()
        return result
    }{
        await client.close();
        return "Error in Connection"
    }
    
}