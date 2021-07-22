import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './UploadForm.css';
import ProgressBar from './ProgressBar';

export default function UploadForm() {
  const defaultFileName = '이미지 파일을 업로드 해주세요.';
  const [file, setFile] = useState(null); // 이미지 파일 정보
  const [imgSrc, setImgSrc] = useState(null); // 미리보기 이미지 주소
  const [fileName, setFileName] = useState(defaultFileName); // 업로든 된 파일 이름
  const [percent, setPercent] = useState(0); // 업로드 진행 상황

  const imageSelectHandler = (event) => {
    const imageFile = event.target.files[0];
    setFile(imageFile);
    setFileName(imageFile.name);

    //? 이미지 미리보기 설정
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile);
    fileReader.onload = (e) => setImgSrc(e.target.result);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return alert('이미지를 올려주세요.');
    }

    const formDate = new FormData();
    formDate.append('image', file);
    try {
      const res = await axios.post('/upload', formDate, {
        headers: { 'Content-Type': 'multipart/form-data' },
        //? 프로그래스바 설정
        onUploadProgress: (e) => {
          setPercent(Math.round(100 * (e.loaded / e.total)));
        },
      });

      console.log({ res });
      toast.success('이미지 업로드 성공!');
      setTimeout(() => {
        setPercent(0);
        setFileName(defaultFileName);
        setImgSrc(null);
      }, 3000);
    } catch (error) {
      console.error(error);
      setPercent(0);
      setFileName(defaultFileName);
      setImgSrc(null);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <img
        src={imgSrc}
        className={`image-preview ${imgSrc && 'image-preview-show'}`}
        alt="미리보기"
      />

      <ProgressBar percent={percent} />

      <div className="file-dropper">
        <label htmlFor="image">{fileName}</label>
        <input id="image" type="file" accept="image/*" onChange={imageSelectHandler} />
      </div>

      <button type="submit" className="file-button">
        제출
      </button>
    </form>
  );
}
