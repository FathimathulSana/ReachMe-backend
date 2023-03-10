import express from "express";
import { authMiddleWare, isActiveMiddleware } from "../MiddleWare/authMiddleWare.js";
import multer from "multer";
import sharp from 'sharp';
const router = express.Router()

const imageStorage = multer.memoryStorage();
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/videos");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const imageUpload = multer({ storage: imageStorage });
const videoUpload = multer({ storage: videoStorage })

router.use(authMiddleWare, isActiveMiddleware);
router.post('/', imageUpload.single("file"), async (req, res) => {
  try {
    const path = `public/images/${req.body.name}`;
    await sharp(req.file.buffer).toFile(path);
    return res.status(200).json("File Uploaded Successfully")
  } catch (error) {
    return res.status(500).json("something went wrong!")
  }
})

router.post('/video', videoUpload.single("file"), (req, res) => {
  try {
    return res.status(200).json("video uploaded successfully")
  } catch (error) {
    return res.status(500).json("something went wrong!")
  }
})

export default router