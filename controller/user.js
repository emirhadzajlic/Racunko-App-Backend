const User = require('../model/user')

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

module.exports = {
    findUserByUsername,
    registerUser
}