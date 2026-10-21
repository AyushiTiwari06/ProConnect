import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const isAuth=async(req,res,next)=>{
  try{
    let {token}=req.cookies

    if(!token){
      return res.status(401).json({
        message:"User is not authenticated"
      })
    }

    let verifyToken=jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    if(!verifyToken?.userId){
      return res.status(401).json({
        message:"Invalid token"
      })
    }

    req.userId=verifyToken.userId

    next()

  }catch(error){
    console.log("isAuth error:",error.message)

    return res.status(401).json({
      message:"Invalid or expired token"
    })
  }
}

export default isAuth