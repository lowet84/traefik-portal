import express from 'express'
import asyncHandler from 'express-async-handler'
import axios from 'axios'
import fs from 'fs'

const app = express()
app.use(express.json());

var hosts = process.env.TRAEFIK === undefined
    ? "traefik,public"
    : process.env.TRAEFIK
hosts = hosts.split(',')
app.get('/api/', asyncHandler(async (req, res, next) => {
    var data = []
    await hosts.forEach(async function (host) {
        let url = 'http://' + host + ':8080/api'
        let result = await axios.get(url)
        data.push(result)
    })

    res.send(prepareData(data.data))
}))

app.get('/dummy/', asyncHandler(async (req, res, next) => {
    let file = JSON.parse(await fs.readFileSync('./traefik-test.json', 'utf8'))
    res.send(await prepareData(file))
}))

var prepareData = async function (data) {
    let images = JSON.parse(await fs.readFileSync('./images.json', 'utf8'))
    var ret = []
    data.forEach(d => Object.values(Object.values(d)[0].frontends).forEach(e => ret.push(e)))
    ret = ret
        .filter(d => Object.values(d.routes)[0].rule.startsWith('Host:'))
        .map(d => {
            return {
                name: d.backend,
                url: Object.values(d.routes)[0].rule.replace('Host:', ''),
                image: images[d.backend]
            }
        })
    return ret
}

app.post('/download', asyncHandler(async (req, res) => {
    console.log(req.body)
    let images = JSON.parse(await fs.readFileSync('./images.json', 'utf8'))
    images[req.body.id] = req.body.url
    await fs.writeFileSync('./images.json',JSON.stringify(images))
}))

app.use(express.static('static'))
app.listen(3000, () => console.log('Example app listening on port 3000!'))
