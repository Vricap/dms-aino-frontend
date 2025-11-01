import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const divisions = [
  "MKT",
  "FIN",
  "CHC",
  "PROD",
  "OPS",
  "ITINFRA",
  "LGL",
  "DIR",
  "ADMIN",
];

export default function Profile() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    role: "",
    division: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  const { id } = useParams();

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_BASE_URL + `/users/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
        },
      );

      const userObj = {
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
        division: response.data.division,
        newPassword: "",
      };

      setUserData(userObj);
    } catch (err) {
      alert(`Gagal mendapatkan user. ${err.response?.data?.message}`);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        process.env.REACT_APP_BASE_URL + `/users/${id}`,
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
      alert("Update sukses!");
      navigate("/users");
    } catch (err) {
      alert(`Update gagal. ${err.response?.data?.message}`);
    }
  };

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
      <p className="text-muted-foreground mb-4">
        Update username, email, role, divisi atau password dari User.
      </p>

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
              required
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
              required
              value={userData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block font-medium mb-1">Role</label>
            <select
              name="role"
              required
              value={userData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            >
              <option value="">Pilih Role</option>
              <option key="admin" value="admin">
                ADMIN
              </option>

              <option key="user" value="user">
                USER
              </option>
            </select>
          </div>

          {/* Division */}
          <div>
            <label className="block font-medium mb-1">Division</label>
            <select
              name="division"
              value={userData.division}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              required
            >
              <option value="">Pilih Divisi</option>
              {divisions.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
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
