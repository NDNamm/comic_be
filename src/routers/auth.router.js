import express from "express";
import {
    login,
    register,
    refresh,
    logout
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", login);
router.post("/", register);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;