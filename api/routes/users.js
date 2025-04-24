import expres from "express";

import { getAllUsers, getUser, updateUser} from "../controllers/users.js";
const router = expres.Router();

// //get
// router.get("/:id", getUser);
//get all
router.get("/", getAllUsers);

router.get("/:id", getUser);

router.patch("/:id", updateUser);

export default router;
