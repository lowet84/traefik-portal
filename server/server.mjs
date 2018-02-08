import express from 'express'
import asyncHandler from 'express-async-handler'
import axios from 'axios'
const app = express()

app.get('/api/:target', asyncHandler(async (req, res, next) => {
    let url = req.params.target+':8080/api'
    console.log(url)
    let data = await axios.get(url)
    res.send(data)
}))

app.listen(3000, () => console.log('Example app listening on port 3000!'))