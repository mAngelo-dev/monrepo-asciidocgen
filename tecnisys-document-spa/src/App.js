import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
  let [zipFile, setZipFile] = useState(null);
  let [progress, setProgress] = useState({ started: false, percentage: 0 });

  async function uploadFile() {
    if (!zipFile) {
      return alert("Selecione um arquivo");
    }
    const fd = new FormData();
    fd.append("file", zipFile);
    try {
      const response = await axios.post("http://localhost:3001/file", fd, {
        onUploadProgress: (progressEvent) => {
          const uploadPercentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
          );
          setProgress({ started: true, percentage: uploadPercentage });
        },
      });

      setProgress({ started: false, percentage: 0 });
      alert("Upload feito com sucesso");

      // Once the upload is done, you can trigger the download of the PDF
      downloadPDF(response.data); // Assuming the API returns the PDF file directly

    } catch (error) {
      alert("Erro ao fazer upload");
      console.log(error);
    }
  }

  function downloadPDF(pdfData) {
    // Create a Blob from the PDF data
    const blob = new Blob([pdfData], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary <a> element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.pdf"; // You can change the filename here
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  return (
      <div className="appContainer">
        <div className="imageContainer">
          <img
              src={require("./images/logo1.png")}
              width={"75%"}
              height={"75%"}
              alt="logo"
          />
        </div>
        <h1> Gerador de Documentação </h1>
        <form>
          <div className="inputContainer">
            <input
                onChange={(e) => {
                  setZipFile(e.target.files[0]);
                }}
                type="file"
                id="file"
                accept=".zip"
            />
          </div>
        </form>
        <div className="buttonContainer">
          <button onClick={(e) => uploadFile(e)} id="uploadButton">
            Upload
          </button>
        </div>
        {progress.started ? (
            <progress max={100} value={progress.percentage} />
        ) : null}
      </div>
  );
}

export default App;
