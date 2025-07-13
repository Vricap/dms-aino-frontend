import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const types = [
  "ADD",
  "BA",
  "SKU",
  "JO",
  "KK",
  "KW",
  "MOM",
  "MOU",
  "NC",
  "ND",
  "PENG",
  "PEM",
  "PB",
  "PM",
  "PN",
  "NDA",
  "PKS",
  "PR",
  "PNW",
  "PO",
  "PT",
  "SK",
  "SKT",
  "SP",
  "SPI",
  "SPK",
  "SPR",
  "SR",
  "SE",
  "PNG",
  "SERT",
  "TAG",
  "U",
  "ST",
  "PQ",
  "PJ",
  "CL",
];

// const divisions = ["MKT", "FIN", "CHC", "PROD", "OPS", "ITINFRA", "LGL", "DIR"];

const Upload = () => {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");
  // const [division, setDivision] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file || !type || !description) {
      setError("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    // formData.append("division", division);
    formData.append("content", description);

    setIsLoading(true);

    try {
      await axios.post(
        process.env.REACT_APP_BASE_URL + "/documents",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": localStorage.getItem("token"),
          },
        },
      );

      navigate("/draft");
    } catch (err) {
      setError(`Upload failed: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Upload</h1>
        <p className="text-muted-foreground">Upload dokumenmu.</p>
      </div>

      <div className="max-w-md mx-auto mt-10 p-6 bg-white text-gray-900 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Form Upload</h2>

        {error && (
          <div className="mb-4 text-red-600 border border-red-400 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* File */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Select File</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Document Type */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Document Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="block w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select Type</option>
              {types.map((docType) => (
                <option key={docType} value={docType}>
                  {docType.charAt(0).toUpperCase() + docType.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Division */}
          {/* <div className="mb-4">
            <label className="block mb-1 font-medium">Division</label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              required
              className="block w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select Type</option>
              {divisions.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </div> */}

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="block w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter document description..."
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-black text-white px-4 py-2 rounded hover:bg-black ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Upload;
