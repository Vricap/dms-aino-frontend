import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
        <p className="text-muted-foreground mt-1">
          Update informasi akun dan hak akses user.
        </p>
      </div>

      {/* Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-3xl rounded-2xl border bg-background shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col divide-y">
            {/* === BASIC INFO === */}
            <section className="p-6">
              <h2 className="text-lg font-semibold mb-4">Informasi Dasar</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-primary dark:text-black"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-primary dark:text-black"
                  />
                </div>
              </div>
            </section>

            {/* === ACCESS CONTROL === */}
            <section className="p-6">
              <h2 className="text-lg font-semibold mb-4">Hak Akses</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <select
                    name="role"
                    value={userData.role}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-primary dark:text-black"
                  >
                    <option value="">Pilih Role</option>
                    <option value="admin">ADMIN</option>
                    <option value="user">USER</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Divisi</label>
                  <select
                    name="division"
                    value={userData.division}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-primary dark:text-black"
                  >
                    <option value="">Pilih Divisi</option>
                    {Object.keys(divisions).map((key) => (
                      <option key={key} value={key}>
                        {`${key} (${divisions[key]})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* === SECURITY === */}
            <section className="p-6 bg-muted/30">
              <h2 className="text-lg font-semibold mb-1">Keamanan</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Kosongkan jika tidak ingin mengganti password.
              </p>

              <div className="max-w-sm">
                <label className="text-sm font-medium">Password Baru</label>
                <input
                  type="password"
                  name="newPassword"
                  value={userData.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-destructive dark:text-black"
                />
              </div>
            </section>

            {/* === ACTIONS === */}
            <div className="flex justify-end gap-3 p-6 bg-background">
              <button
                type="button"
                onClick={() => navigate("/users")}
                className="rounded-md border px-4 py-2 text-sm hover:bg-muted transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90 transition dark:text-black"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
