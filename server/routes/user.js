const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  return res.locals.app.render(req, res, '/user/profile', req.query)
})

router.get('/favoritos/mapa', (req, res) => {
  return res.locals.app.render(req, res, '/user/favorites/map', req.query)
})

router.get('/favoritos', (req, res) => {
  return res.locals.app.render(req, res, '/user/favorites', req.query)
})

module.exports = router
