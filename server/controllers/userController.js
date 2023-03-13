const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')
const mongoose = require('mongoose')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)

    const userinfo = await User.findOne({ email })

    res.status(200).json({email, userinfo, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// signup a user
const signupUser = async (req, res) => {
  const {email, password, name, address, confirmPW} = req.body
  
  try {
    const user = await User.signup(email, password, name, address, confirmPW)

    // create a token
    const token = createToken(user._id)

    const userinfo = await User.findOne({ email })

    res.status(200).json({email, userinfo, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// user info
const userInfo = async (req, res) => {
  const {_id, name, address, email, password, confirmPW} = req.body

  let emptyFields = []

  if(!name) {
    emptyFields.push('name')
  }
  if(!address) {
    emptyFields.push('address')
  }
  if(!email) {
    emptyFields.push('email')
  }
  if(!password) {
    emptyFields.push('password')
  }
  if(!confirmPW) {
    emptyFields.push('confirmPW')
  }
  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({error: 'No such workout'})
  }

  const salt = await bcrypt.genSalt(10)
  const hash = password ? await bcrypt.hash(password, salt) : ''

  const user = await User.findOneAndUpdate({_id}, {
    name, address, email, password: hash, confirmPW
  })

  if (!user) {
    return res.status(400).json({error: 'No such workout'})
  }

  res.status(200).json(user)
}
module.exports = { signupUser, loginUser, userInfo }