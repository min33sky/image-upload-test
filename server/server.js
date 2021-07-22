const express = require('express');
const multer = require('multer');

const { v4: uuid } = require('uuid');
const mime = require('mime-types');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});

const upload = multer({
  // 어디에 어떻게 저장
  storage,
  // 이미지 파일만 저장할 수 있다.
  fileFilter: (req, file, cb) => {
    if (['image/png', 'image/jpeg'].includes(file.mimetype)) cb(null, true);
    else cb(new Error('invalid file type.'), false);
  },
  // 5메가까지만 받을 수 있다
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const app = express();
const PORT = 8000;

app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.send({
    success: true,
    data: req.file,
  });
});

app.listen(PORT, () => console.log('Express server listening on PORT: ' + PORT));
