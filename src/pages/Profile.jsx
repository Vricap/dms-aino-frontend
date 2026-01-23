import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { Button } from "../components/ui/button";

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
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
          {userData.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {userData.username}
          </h1>
          <p className="text-muted-foreground">
            {divisions[userData.division]} • {userData.role}
          </p>
        </div>
      </div>

      {/* Signature */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Tanda Tangan Digital</CardTitle>
            <p className="text-sm text-muted-foreground">
              Digunakan untuk menandatangani dokumen secara elektronik
            </p>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            {/* Preview */}
            <div className="flex items-center justify-center border rounded-lg bg-muted min-h-[160px]">
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt="Signature"
                  className="max-h-32 object-contain bg-white p-2 rounded"
                />
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  Belum ada tanda tangan <br /> Silakan upload
                </p>
              )}
            </div>

            {/* Upload */}
            <form onSubmit={handleSignatureSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Upload Tanda Tangan
                </label>
                <input
                  type="file"
                  accept=".jpg,.png"
                  onChange={(e) => setSignatureFile(e.target.files[0])}
                  className="block w-full text-sm border rounded-md file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0
                             file:bg-muted file:text-foreground
                             hover:file:bg-accent"
                />
              </div>

              <Button type="submit" className="w-full">
                Upload Tanda Tangan
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Account + Security */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Akun</CardTitle>
              <p className="text-sm text-muted-foreground">
                Informasi dasar akun pengguna
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md dark:text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  className="w-full px-4 py-2 border rounded-md bg-muted"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    value={userData.role}
                    disabled
                    className="w-full px-4 py-2 border rounded-md bg-muted"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Division
                  </label>
                  <input
                    value={`${userData.division} (${divisions[userData.division]})`}
                    disabled
                    className="w-full px-4 py-2 border rounded-md bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keamanan</CardTitle>
              <p className="text-sm text-muted-foreground">
                Kelola keamanan akun Anda
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password Baru
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={userData.newPassword}
                  onChange={handleChange}
                  placeholder="Masukkan password baru"
                  className="w-full px-4 py-2 border rounded-md dark:text-black"
                />
              </div>

              <Button type="submit" className="w-full">
                Simpan Perubahan
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </main>
  );
}
