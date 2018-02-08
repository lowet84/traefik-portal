const express = require('express')
const app = express()
const fs = require('fs')
const http = require('http')

app.get('/api/:target', (req, res) => {
    res.send(req.params)
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))