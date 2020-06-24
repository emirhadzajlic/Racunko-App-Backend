const routes = require('express').Router();
const bcrypt = require('bcrypt')

const User = require('../controller/user')
const Auth = require('../authorization/auth')
const user = require('../model/user')

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
  
routes.post('/login', Auth.createToken)

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

routes.get('/diagram', async (req, res) => {

    let foundUser = await user.find({username:req.body.username})

    let totalAmount=0
    let dataForDiagram=[]
    let totalAmountPrihod=0
    let totalAmountRashod=0

    for (let i=0;i<foundUser[0].items.length;i++){
        if(foundUser[0].items[i].property==="prihod") {
            totalAmountPrihod+=foundUser[0].items[i].amount
        }else {
            totalAmountRashod+=foundUser[0].items[i].amount
        }
    }
    for (let i=0;i<foundUser[0].items.length;i++){
        if(foundUser[0].items[i].property==="prihod") {
            dataForDiagram.push({
                "property": "prihod",
                "category": foundUser[0].items[i].category,
                "percentage": foundUser[0].items[i].amount/totalAmountPrihod
            })
        }else {
            dataForDiagram.push({
                "property": "rashod",
                "category": foundUser[0].items[i].category,
                "percentage": foundUser[0].items[i].amount/totalAmountRashod
            })
        }
    }
    res.send(dataForDiagram)
})

module.exports = routes