var express = require('express')
var bodyparser= require('body-parser') // npm install -s body-parser --> esto para recibir valores del sevidor
const { Server } = require('http')
const { Socket } = require('engine.io')
var app= express()
var http= require('http').Server(app)
var io= require('socket.io')(http) // npm install -s socket.io --> manejar nuevos mensajes
app.use(express.static(__dirname))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false }))
var mongoose = require('mongoose')
var dbURL= '--'

var Message= mongoose.model('Message',{
    name: String,
    message:String
})


var messages=[
    {name:'tim',message:'hi'},
    {name:'jane', message:'bay'}
]

app.get('/messages',(req,res)=>{
    Message.find({},(err,messages)=>{
        res.send(messages)
    })
})


app.post('/messages',(req,res)=>{
   // console.log(req.body)
   //mandar en informacion al servidor
   var message= new Message(req.body)
   message.save((err)=>{
    if (err)
        sendStatus(500)

    Message.findOne({message:'badword'},(err,censored)=>{
        if (censored){
            console.log('censord word', censored)
            Message.deleteOne({_id:censored.id},(err)=>{
                console.log('removed')
            })
        }
    })
    io.emit('message',req.body)
    res.sendStatus(200)
   })

   //jasmine para pruebas

})
io.on('connection',(Socket)=>{
    console.log("Nuevo usuario")
})

mongoose.connect(dbURL,(er)=>{console.log("we have an error",er)})

var server = http.listen(3000,()=>{
    console.log("servir is on port",server.address().port)
})
// mlab mongodb gratis
//mongoose npm instal -s mongoose
