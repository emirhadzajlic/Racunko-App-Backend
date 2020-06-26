const routes = require('express').Router();
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const User = require('../controller/user');
const Auth = require('../authorization/auth');
const userModel = require('../model/user')
const Token = require('../model/token')

routes.post('/register',(req, res) => {
    userModel.findOne({ email: req.body.email }, async (err, user) => {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
        
        user = new userModel({ username: req.body.username, password: req.body.password, email: req.body.email});
        user.save(function () {
     
            var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            
            token.save(function () {
     
                var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: "emirhadzajlic001@gmail.com", pass: "emirsnoopy123" } });
                var mailOptions = { from: 'emirhadzajlic001@gmail.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
                transporter.sendMail(mailOptions, function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    res.status(200).send('A verification email has been sent to ' + user.email + '.');
                });
            });
        });
      });
})
  
routes.post('/login', Auth.createToken)

routes.post('/add', (req,res) => {
    User.findUserByUsername(req.body.username)
    .then(user => {
        var newItems = user.items
        newItems.push(req.body.item);
        return newItems;
    })
    .then(itemsToUpdate => {
        User.updateItems(req.body.username,itemsToUpdate)
        .then(e => {
            console.log("Updated");
            res.send(e.items[e.items.length-1]);
        })
        .catch(e => {
            console.log("Failed to update items");
            res.send(e)
        })
    })
    .catch(e => {
        console.log("Failed to update items");
        res.send(e)
    })
})

routes.get('/diagram', async (req, res) => {

    let foundUser = await userModel.find({username:req.body.username})

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

routes.post('/confirmation', User.confirmationPost);

module.exports = routes