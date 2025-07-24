const { Router } = require('express')
const authRouter = require('./authRouters')

const router = Router()

router.use('/auth', authRouter)

module.exports = router
