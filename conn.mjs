import { MongoClient } from "mongodb"
const uri = 'mongodb+srv://fakiletemitope2:*.Oluwaseyi88.*@cluster0.to8n4fl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

export const client = new MongoClient(uri)


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

