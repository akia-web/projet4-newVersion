import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpg") {
    cb(null, true);
  }
};

const upload = multer({ storage: storage, FileFilter: fileFilter });
export const imgUpload = upload.single("image");
