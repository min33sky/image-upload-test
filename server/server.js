const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const { v4: uuid } = require('uuid');
const mime = require('mime-types');

//? Multer Storage 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'), // 저장할 폴더
  filename: (req, file, cb) => cb(null, `${uuid()}.${mime.extension(file.mimetype)}`), // 저장 할 파일 이름
});

/**
 *? Multer Instance 생성
 */
const upload = multer({
  //? 어디에 어떻게 저장
  storage,
  //? 이미지 파일만 저장할 수 있다.
  fileFilter: (req, file, cb) => {
    if (['image/png', 'image/jpeg'].includes(file.mimetype)) cb(null, true);
    else cb(new Error('invalid file type.'), false);
  },
  //? 5메가까지만 받을 수 있다
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const app = express();
const PORT = 8000;

try {
  console.log('*** 업로드 폴더가 있는지 확인 중 ***');
  fs.readdirSync('uploads');
  console.log('*** 폴더가 이미 존재합니다 ***');
} catch (error) {
  console.log('*** 업로드 폴더 생성 ***');
  fs.mkdirSync('uploads');
}

//? 미들웨어 등록
app.use('/', express.static(path.resolve(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//? 이미지 업로드
app.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.send({
    success: true,
    data: req.file,
  });
});

//? 게시물 전송
app.post('/post', (req, res) => {
  console.log('POST: ', req.body);
  res.send({
    success: true,
    data: req.body,
  });
});

app.listen(PORT, () => console.log('Express server listening on PORT: ' + PORT));
