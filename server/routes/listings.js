const ParamsMapper = require('../../utils/params-mapper')
const express = require('express')
const _ = require('lodash')
const router = express.Router()

router.get('/favoritos', (req, res) => {
  return res.locals.app.render(req, res, '/meu-perfil', req.query)
})

router.get('/:id(\\d+)', (req, res) => {
  const actualPage = '/listings/show'
  const queryParams = {id: req.params.id, ...req.query}
  res.locals.app.render(req, res, actualPage, queryParams)
})

router.get(
  '/:state/:city/:neighborhood/:street/:listingId(id-\d+)',
  (req, res) => {
    const actualPage = '/listings/show'
    res.locals.app.render(req, res, actualPage, req.query)
  }
)

router.get(
  '/:state/:city/:neighborhood/:streetwithId([a-z\\d\\-]*id-\\d+)',
  (req, res) => {
    const actualPage = '/listings/show'
    res.locals.app.render(req, res, actualPage, req.query)
  }
)

router.get('/:state/:city/:rest([0-9a-z-]*)', (req, res) => {
  const actualPage = '/listings'
  const params = ParamsMapper.mapUrlToParams(req.params)
  req.params = params
  res.locals.app.render(req, res, actualPage, req.query)
})

router.get('/:id(\\d+)/editar', (req, res) => {
  const actualPage = '/listings/edit'
  const queryParams = {id: req.params.id}
  res.locals.app.render(req, res, actualPage, queryParams)
})

router.get(['/', '/:state', '/:state/:city'], (req, res) => {
  const actualPage = '/listings'
  req.params = ParamsMapper.mapUrlToParams(req.params)
  res.locals.app.render(req, res, actualPage, req.query)
})

module.exports = router
