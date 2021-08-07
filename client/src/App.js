import EditorComponent from './components/Editor';
import UploadForm from './components/UploadForm';

function App() {
  return (
    <>
      <h2>사진첩</h2>
      <UploadForm />
      <hr />
      <EditorComponent />
    </>
  );
}

export default App;
