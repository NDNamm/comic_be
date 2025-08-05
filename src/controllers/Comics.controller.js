import {
    getAllComic,
    getComicSlug,
    addComic,
    updateComic,
    findComicById,
    deleteComic
} from "../models/Comics.model.js";
import { findGenreById } from "../models/Genres.model.js";
import { extractPublicId } from '../utils/extractPublicId.js';
import deleteImage from '../utils/deleteImage.js';
import slugify from "../utils/slug.js";
import dayjs from 'dayjs';

export const getAllComics = async (req, res) => {
    try {
        const comics = await getAllComic();
        res.json(comics);
    } catch (error) {
        console.error("Error fetching comics:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getComicBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const comics = await getComicSlug(slug);
        res.json(comics);
    } catch (error) {
        console.error("Error fetching comics:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addComics = async (req, res) => {
    try {
        const { name, description, author, status, genreIds } = req.body;
        const slug = slugify(name);
        const created_at = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const coverUrl = file.path || file.url;
        const newComic = await addComic(name, slug, description, coverUrl, author, status, created_at, genreIds);
        res.status(201).json({ message: "Comic added successfully", comicId: newComic });
    } catch (error) {
        console.error("Error adding comic:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateComics = async (req, res) => {
    try {
        const { id } = req.params;
        const findComic = await findComicById(id);
        if (!findComic) {
            return res.status(400).json({ message: "Comic not found" });
        }
        const { name, description, author, status, genreIds } = req.body;
        const slug = slugify(name);
        const updated_at = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const file = req.file;
        let newComic;
        if (!file) {
            newComic = await updateComic(id, name, slug, description, findComic.img_url, author, status, updated_at, genreIds);
        }
        else {
            const publicId = await extractPublicId(findComic.img_url);
            if (publicId) {
                await deleteImage(publicId);
            }
            const coverUrl = file.path || file.url;
            newComic = await updateComic(id, name, slug, description, coverUrl, author, status, updated_at);
        }
        res.status(201).json({ message: "Comic update successfully", comicId: newComic });
    } catch (error) {
        console.error("Error update comic:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteComics = async (req, res) => {
    try {
        const { id } = req.params;
        const findComic = await findComicById(id);
        if (!findComic) {
            return res.status(400).json({ message: "Comic not found" });
        }
        const publicId = extractPublicId(findComic.img_url);
        if (publicId) {
            await deleteImage(publicId);
        }
        await deleteComic(id);
        res.status(200).json({ message: "Comic delete successfully" });
    }
    catch (error) {
        console.error("Error delete comic:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}
