import React from "react";
import { FileUploadArea } from "../components/file-upload-area.tsx";
const Documents: React.FC = () => {
  return (
    <div className="documents-page">
      <h1>Documents</h1>
      <FileUploadArea />
    </div>
  );
};

export default Documents;
