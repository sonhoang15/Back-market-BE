import multer from "multer";

const storage = multer.memoryStorage(); // hoặc diskStorage nếu muốn lưu file

const upload = multer({ storage });

export default upload;
