var express = require('express')
var asyncHandler = require('express-async-handler')
var axios = require('axios')
var fs = require('fs')

const app = express()
app.use(express.json());

var hosts = process.env.TRAEFIK === undefined
    ? "traefik,public"
    : process.env.TRAEFIK
var imagePath = process.env.IMAGE_PATH === undefined
? "/data"
: process.env.IMAGE_PATH
hosts = hosts.split(',')
app.get('/api/', asyncHandler(async (req, res, next) => {
    var data = []
    for (let index = 0; index < hosts.length; index++) {
        const host = hosts[index];
        let url = 'http://' + host + ':8080/api'
        let result = await axios.get(url)
        data.push(result.data)
    }

    res.send(await prepareData(data));
}))

app.get('/dummy/', asyncHandler(async (req, res, next) => {
    let file = JSON.parse(await fs.readFileSync('./server/traefik-test.json', 'utf8'))
    res.send(await prepareData(file))
}))

var prepareData = async function (data) {
    let images = JSON.parse(await fs.readFileSync(`${imagePath}/images.json`, 'utf8'))
    var ret = []
    console.log(data)
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
    let images = JSON.parse(await fs.readFileSync(`${imagePath}/images.json`, 'utf8'))
    images[req.body.id] = req.body.url
    await fs.writeFileSync(`${imagePath}/images.json`, JSON.stringify(images))
}))

app.use(express.static('static'))
app.listen(3000, () => console.log('Example app listening on port 3000!'))
