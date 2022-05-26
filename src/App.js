import { useState } from "react";
import { PDFViewer } from "./components/PDFViewer";

function App() {
  const [files, setFiles] = useState([]);

  const handleChangeFile = ({ target: { files } }) => {
    setFiles(files);
  };

  return (
    <div>
      <input type="file" onChange={handleChangeFile} />
      {files[0] && <PDFViewer file={files[0]} />}
    </div>
  );
}

export default App;
