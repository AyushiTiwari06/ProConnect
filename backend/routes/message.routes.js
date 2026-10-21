import express from "express"
import {sendMessage,getMessages} from "../controllers/message.controllers.js"
import isAuth from "../middlewares/isAuth.js"

const messageRouter=express.Router()

messageRouter.post("/send",isAuth,sendMessage)
messageRouter.get("/:userId",isAuth,getMessages)

export default messageRouter