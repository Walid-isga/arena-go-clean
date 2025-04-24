import expres from "express";
import Field from "../models/field.js"
import {createField, updateField, deleteField, getAllFields,getField} from "../controllers/field.js"

const router = expres.Router()


// create
router.post("/", createField)
//update
router.put("/:id", updateField)
//delete
router.delete("/:id", deleteField);
//get
router.get("/:id", getField);
//get all
router.get("/", getAllFields);
export default router 