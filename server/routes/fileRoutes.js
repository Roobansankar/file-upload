const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");
const File = require("../models/File");
const router = express.Router();

// Multer config for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and PDF files are allowed."));
    }
    cb(null, true);
  },
});

// File Upload Route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: "raw", // Explicitly set the resource type to 'raw' for PDFs and other non-image files
      },
      (err, cloudinaryResult) => {
        if (err) return res.status(500).json({ error: err.message });

        const newFile = new File({
          name: req.file.originalname,
          url: cloudinaryResult.secure_url,
          type: req.file.mimetype,
          size: req.file.size,
        });

        newFile
          .save()
          .then(() =>
            res
              .status(200)
              .json({ message: "File uploaded successfully", file: newFile })
          )
          .catch((dbError) => res.status(500).json({ error: dbError.message }));
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch Files
router.get("/files", async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete File
router.delete("/delete/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    const publicId = file.url.split("/").pop().split(".")[0]; // Extract public ID
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

    await File.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
