import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

const cookieOptions={
  httpOnly:true,
  maxAge:7*24*60*60*1000,
  sameSite:"None",
  secure:true
}

export const signUp=async(req,res)=>{
  try{
    const {firstName,lastName,userName,email,password}=req.body

    if(!firstName || !lastName || !userName || !email || !password){
      return res.status(400).json({
        message:"All fields are required"
      })
    }

    if(password.length<8){
      return res.status(400).json({
        message:"password must be at least 8 characters"
      })
    }

    let existEmail=await User.findOne({
      email:email.trim().toLowerCase()
    })

    if(existEmail){
      return res.status(400).json({
        message:"email already exist !"
      })
    }

    let existUsername=await User.findOne({
      userName:userName.trim()
    })

    if(existUsername){
      return res.status(400).json({
        message:"userName already exist !"
      })
    }

    let hassedPassword=await bcrypt.hash(password,10)

    const user=await User.create({
      firstName:firstName.trim(),
      lastName:lastName.trim(),
      userName:userName.trim(),
      email:email.trim().toLowerCase(),
      password:hassedPassword
    })

    let token=await genToken(user._id)

    res.cookie("token",token,cookieOptions)

    return res.status(201).json(user)

  }catch(error){
    console.log("signUp error:",error)

    return res.status(500).json({
      message:error.message
    })
  }
}

export const login=async(req,res)=>{
  try{
    const {email,password}=req.body

    if(!email || !password){
      return res.status(400).json({
        message:"Email and password are required"
      })
    }

    let user=await User.findOne({
      email:email.trim().toLowerCase()
    })

    if(!user){
      return res.status(400).json({
        message:"user does not exist !"
      })
    }

    const isMatch=await bcrypt.compare(
      password,
      user.password
    )

    if(!isMatch){
      return res.status(400).json({
        message:"Email or password is invalid"
      })
    }

    let token=await genToken(user._id)

    res.cookie("token",token,cookieOptions)

    return res.status(200).json(user)

  }catch(error){
    console.log("login error:",error)

    return res.status(500).json({
      message:error.message
    })
  }
}

export const logOut=async(req,res)=>{
  try{
    res.clearCookie("token",{
      httpOnly:true,
      sameSite:"None",
      secure:true
    })

    return res.status(200).json({
      message:"log out successfully"
    })

  }catch(error){
    console.log("logOut error:",error)

    return res.status(500).json({
      message:error.message
    })
  }
}