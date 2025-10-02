import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [signatureFile, setSignatureFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignatureSubmit = async (e) => {
    e.preventDefault();

    if (!signatureFile) {
      setError("Please fill in all fields");
      return;
    }
    const formData = new FormData();
    formData.append("signature", signatureFile);

    try {
      await axios.post(
        process.env.REACT_APP_BASE_URL + "/signature",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": localStorage.getItem("token"),
          },
        },
      );

      navigate("/profile");
    } catch (err) {
      setError(`Upload signature failed: ${err}`);
    }
  };

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      {error && (
        <div className="mb-4 text-red-600 border border-red-400 bg-red-100 p-2 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSignatureSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Select Signature Image
          </label>
          <input
            type="file"
            accept=".jpg,.png"
            onChange={(e) => setSignatureFile(e.target.files[0])}
            required
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button type="submit">OK</button>
      </form>
    </main>
  );
}
