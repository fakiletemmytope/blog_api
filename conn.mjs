import { MongoClient } from "mongodb"
const URI = process.env.DATABASE_CONNECT

export const client = new MongoClient(URI)


export const connect = async () => {
    try {
        await client.connect()
        //console.log("connected")
        return true
    } catch (error) {
       // console.log(error)
        return false
    }
    
}

