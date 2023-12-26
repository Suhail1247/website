import connect from './database/connect.js'
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './router/route.js';

const app=express()


app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())


const port=8080

app.get('/',(req,res)=>{
    res.json('hello world')
})

app.use('/api',router)




connect().then(()=>{
    try{
        app.listen(port,()=>{
            console.log('connected to the port');
        })
    }catch{
        console.log('cannot connect to the server')
    }
}).catch(err=>{
    console.log('invalid connection')
})

