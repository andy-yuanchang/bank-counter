const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

const allowCors = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
}

const renderApp = (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.sendFile(path.resolve('./index.html'))
}

const getConfig = (req, res) => {
    const path = "./src/json/app.config.json"

    if (fs.existsSync(path)) {
        try {
            const config = fs.readFileSync(path)
            res.json(JSON.parse(config))
        } catch (error) {
            res.status(500).send(error)
        }
    }
}

let customerInfoObj

const getCustomersInfo = (req, res) => {
    const { name } = req.params

}

const postCustomersInfo = (req, res) => {

}

const modifyCustomerInfo = (req, res) => {

}

app
    .use(allowCors)
    .get('/config', getConfig)
    .get('/customers', getCustomersInfo)
    .put('/customer/:name', modifyCustomerInfo)
    // .use('/', renderApp)


const PORT = 5888

app.listen(PORT, () => {
    console.log("Listening on port 5888")
})