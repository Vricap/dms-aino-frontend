import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const divisions = {
  MKT: "MARKETING & SALES",
  FIN: "FINANCE",
  CHC: "CORP & HUMAN CAPITAL",
  PROD: "PRODUCT & ENGINEERING",
  OPS: "OPERATION",
  ITINFRA: "IT INFRA & SECURITY",
  LGL: "LEGAL",
  DIR: "DIREKSI",
  ADMIN: "ADMIN",
};

export default function Profile() {
  const [signatureFile, setSignatureFile] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [userData, setUserData] = useState({
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
    division: localStorage.getItem("division"),
    newPassword: "",
  });
  const navigate = useNavigate();

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
    } catch (err) {
      // alert(`Terjadi error: ${err.response?.data?.message}`);
    }
  };

  useEffect(() => {
    fetchUserSignature();
  }, []);

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
      alert("Upload tanda tangan berhasil!");
      await fetchUserSignature();
    } catch (err) {
      alert(`Upload signature failed: ${err.response?.data?.message}`);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "division") {
      setUserData({
        ...userData,
        [e.target.name]: e.target.value.split(" ")[0],
      });
    } else {
      setUserData({
        ...userData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        process.env.REACT_APP_BASE_URL + `/users/${localStorage.getItem("id")}`,
        {
          data: userData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
        },
      );
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("division", response.data.division);
      alert("Update sukses!");
      navigate("/dashboard");
    } catch (err) {
      alert(`Update gagal. ${err.response?.data?.message}`);
    }
  };

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

      {/* <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">*/}
      <div className="w-full rounded-lg shadow-md mt-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Username */}
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Masukan username baru"
              value={userData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Masukan email baru"
              readOnly
              disabled
              value={userData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block font-medium mb-1">Role</label>
            <input
              type="text"
              name="role"
              placeholder="Masukan role baru"
              readOnly
              disabled
              value={userData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>

          {/* Division */}
          <div>
            <label className="block font-medium mb-1">Division</label>
            <input
              type="text"
              name="division"
              value={`${userData.division} (${divisions[userData.division]})`}
              readOnly
              disabled
              placeholder="Masukan division baru"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block font-medium mb-1">New Password</label>
            <input
              type="text"
              name="newPassword"
              value={userData.newPassword}
              placeholder="Masukan password baru"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 px-4 rounded-md hover:bg-indigo-700 transition col-span-full"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
      {/* </div>*/}
    </main>
  );
}
