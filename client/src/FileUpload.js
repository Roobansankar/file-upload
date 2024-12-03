// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./FileUpload.css";

// const FileUpload = () => {
//   const [files, setFiles] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);

//   useEffect(() => {
//     fetchFiles();
//   }, []);

//   const fetchFiles = async () => {
//     try {
//       const { data } = await axios.get("http://localhost:5000/api/files/files");
//       setFiles(data);
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return;

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       await axios.post("http://localhost:5000/api/files/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       fetchFiles();
//       setSelectedFile(null);
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/files/delete/${id}`);
//       fetchFiles();
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   return (
//     <div className="container">
//       <h1>File Uploader</h1>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>
//       <div>
//         <h2>Uploaded Files</h2>
//         {files.map((file) => (
//           <div key={file._id} className="file-item">
//             <p>{file.name}</p>
//             <a
//               href={file.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="view-btn"
//             >
//               View
//             </a>
//             <button
//               onClick={() => handleDelete(file._id)}
//               className="delete-btn"
//             >
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FileUpload;



import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]; // Allowed file types
  const maxSize = 10 * 1024 * 1024; // 10MB max file size

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/files/files");
      setFiles(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Only JPG,PNG and PDF files are allowed.");
        return;
      }
      // Validate file size
      if (file.size > maxSize) {
        alert("File size exceeds the limit of 10MB.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post("http://localhost:5000/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchFiles();
      setSelectedFile(null);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error(error.message);
      alert("File upload failed. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/files/delete/${id}`);
      fetchFiles();
      alert("File deleted successfully!");
    } catch (error) {
      console.error(error.message);
      alert("Failed to delete the file. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>File Uploader</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <div>
        <h2>Uploaded Files</h2>
        {files.map((file) => (
          <div key={file._id} className="file-item">
            <p>{file.name}</p>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="view-btn"
            >
              View
            </a>
            <button
              onClick={() => handleDelete(file._id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
