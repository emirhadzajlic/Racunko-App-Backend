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

routes.post('/update', (req,res) => {
    User.updateItems(req.body.username,req.body.items)
    .then(e => {
        console.log("Updated");
        res.send("Updated");
    })
    .catch(e => {
        console.log("Failed to update items");
        res.send("Failed to update")
    })
})

module.exports = routes