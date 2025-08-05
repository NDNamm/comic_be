import express from "express";
import {
    getAllComics,
    getComicBySlug,
    addComics,
    updateComics,
    deleteComics
} from "../controllers/Comics.controller.js";
import upload from "../config/cloudinary.js";

const router = express.Router();

router.get("/", getAllComics);
router.get("/:slug", getComicBySlug);
router.post("/", upload.single("img_url"), addComics);
router.put("/:id", upload.single("img_url"), updateComics)
router.delete("/:id", deleteComics)

export default router;