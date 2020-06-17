const routes = require('express').Router();

const User = require('../controller/user')
const Auth = require('../authorization/auth')
const userr = require('../model/user')

routes.post('/register', async (req, res) => {

    const foundUser = await User.findUserByUsername(req.body.username)
    
    if(!foundUser){
        res.send(await User.registerUser(req.body))
    } else {
        res.status(403)
    }
})
  
routes.get('/login', Auth.createToken)

module.exports = routes