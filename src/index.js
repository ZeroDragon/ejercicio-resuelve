import express from 'express'
import { worker } from './worker'
import { prepareResponse } from './prepareResponse'

const app = express()

app.set('views', `${__dirname}/views`)

app.get('/', (req, res) => {
  res.render('index.pug')
})

app.get('/invoices/:id/:start/:finish', async (req, res) => {
  const {id, start, finish} = req.params
  const init = +new Date()
  const results = await worker('facturas', id, start, finish)
  const end = +new Date()
  results.elapsedMs = end - init
  const response = prepareResponse(results)
  res.json(response)
})

app.listen(process.env.PORT, () => {
  console.log(`Server online in port ${process.env.PORT}`)
})
