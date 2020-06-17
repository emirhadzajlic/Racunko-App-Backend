const routes = require('express').Router();
const bcrypt = require('bcrypt')

const User = require('../controller/user')
const Auth = require('../authorization/auth')

routes.post('/register', async (req, res) => {

    const foundUser = await User.findUserByUsername(req.body.username)
    
    const salt = await bcrypt.genSalt(10)
    req.body.password = await bcrypt.hash(req.body.password, salt)

    if(!foundUser){
        res.send(await User.registerUser(req.body))
    } else {
        res.status(403)
    }
})
  
routes.get('/login', Auth.createToken)

module.exports = routes