const User = require('../model/user')
const mongoose = require('mongoose');

function findUserByUsername(username){
    return new Promise((reslove,reject) => {
        try {
            reslove(User.findOne({'username': username}))
        } catch {
            reject(false);
        }
    })
}

function registerUser(userInfo){
    return new Promise((resolve, reject) => {
        try {
            resolve(User.create(userInfo))
        } catch {
            reject(false)
        }
    })
}

function updateItems(username, newItems){
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({username: username},{items:newItems}, (err,doc) => {
            if(err) reject(err);
            else resolve(doc);
        })
    })
}

module.exports = {
    findUserByUsername,
    registerUser,
    updateItems
}