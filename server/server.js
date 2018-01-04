const express = require('express')
const app = express()
const fs = require('fs')

fs.readFile('traefik-test.json', 'utf8',(err, data)=>{
    let json = JSON.parse(data)
    console.log(err)
    console.log(json)
})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))