import User from "../models/user.js";

export const getUser =  async (req, res) => {
    try {
        const foundUser = await User.findById(req.params.id);
        console.log("hahaha")
        res.status(200).json(foundUser);
    } catch (err) {
        res.status(500).json(err);
    }
}

export const getAllUsers = async (req,res,next) =>{
    console.log("Hi I am a getall route")
    try{
        const Users = await User.find()
        res.status(200).json(Users)
    }catch{
        res.status(500).json(err)
    }
}

export const updateUser = async (req,res) =>{
    console.log("Hi I am a update route")
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        res.status(200).json(updatedUser)
    }catch{
        res.status(500).json(err)
    }
}