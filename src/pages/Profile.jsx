import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [signatureFile, setSignatureFile] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const navigate = useNavigate();

  const handleSignatureSubmit = async (e) => {
    e.preventDefault();

    if (!signatureFile) {
      alert("Please fill in all fields");
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
      alert(`Upload signature failed: ${err.response?.data?.message}`);
    }
  };

  useEffect(() => {
    const fetchUserSignature = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_BASE_URL +
            `/signature/${localStorage.getItem("id")}`,
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
            responseType: "blob",
          },
        );

        // Create a URL from the blob and display it
        const imgUrl = URL.createObjectURL(res.data);
        setImgUrl(imgUrl);
        // const img = document.createElement("img");
        // img.src = imgUrl;
        // document.body.appendChild(img);
      } catch (err) {
        // alert(`Terjadi error: ${err.response?.data?.message}`);
      }
    };

    fetchUserSignature();
  }, []);

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      <p className="text-muted-foreground mb-4">Profil mengenai dirimu.</p>
      <h2 className="text-lg font-bold">Tanda tanganmu:</h2>
      <div className="flex flex-col md:flex-row gap-6 items-start mx-auto mb-4">
        {imgUrl ? (
          <img
            alt="user signature"
            src={imgUrl}
            className="bg-white p-2 rounded"
          ></img>
        ) : (
          <span>
            <em>
              Gambar tanda tangan tidak ditemukan. Coba upload gambar tanda
              tanganmu.
            </em>
          </span>
        )}
        <form onSubmit={handleSignatureSubmit} className="flex-1">
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Upload gambar tanda tangan (jpg, png):
            </label>
            <input
              type="file"
              accept=".jpg,.png"
              onChange={(e) => setSignatureFile(e.target.files[0])}
              required
              className="block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Upload
          </button>
        </form>
      </div>
    </main>
  );
}
