import express from 'express'
const app = express()

app.get('/api/:target', (req, res) => {
    let options = {
        host: req.params.target + ':8080',
        path: '/api'
    };
    http.get(options, function (data) {
        res.send(data)
    })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))