import express from "express";
import {
    getAllComics,
    getComicBySlug,
    addComics,
    updateComics,
    deleteComics
} from "../controllers/comics.controller.js";
import upload from "../config/cloudinary.js";
import {
    authorization,
    authentication
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllComics);
router.get("/:slug", getComicBySlug);
router.post("/", authentication, authorization, upload.single("img_url"), addComics);
router.put("/:id", authentication, authorization, upload.single("img_url"), updateComics);
router.delete("/:id", authentication, authorization, deleteComics);


export default router;