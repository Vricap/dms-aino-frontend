import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { User, Plus } from "lucide-react";

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

export default function Documents() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    division: "",
    role: "",
    password: "",
  });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/users`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        },
      );
      setUsers(response.data.rows);
    } catch (err) {
      setError(`Gagal dalam load user. ${err.response?.data?.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewUser({ username: "", email: "", division: "", roleId: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/users`, newUser, {
        headers: { "x-access-token": localStorage.getItem("token") },
      });
      await fetchUsers();
      handleCloseModal();
    } catch (err) {
      alert(`Gagal untuk membuat user: ${err.response?.data?.message}`);
    }
  };

  const handleEdit = (id) => {
    navigate(`/users/${id}`);
  };

  const handleNonaktif = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/users/${id}`, {
        headers: { "x-access-token": localStorage.getItem("token") },
      });
      await fetchUsers();
      alert("Nonaktif user berhasil!");
    } catch (err) {
      alert(`Gagal menonaktifkan user: ${err.response?.data?.message}`);
    }
  };

  if (loading) {
    return <p className="p-4">Loading users...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <main className="container mx-auto py-6 px-4 md:px-6 min-h-screen">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Manajemen User</h1>
          <p className="text-muted-foreground">
            Buat, Edit atau Non-aktifkan User.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {/* <div className="flex w-full md:w-1/2 items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari user..."
                className="w-full pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>*/}
          <Button onClick={handleOpenModal} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Tambah User
          </Button>
        </div>

        <span className="text-muted-foreground -mb-5 pl-1">
          Jumlah: {users.length}
        </span>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Divisi</TableHead>
                <TableHead>Role</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <span className="font-medium">{user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.division}</TableCell>
                  <TableCell>{user.roleId.name}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleEdit(user._id)}
                      className="bg-blue-600 text-white font-bold cursor-pointer rounded p-2 hover:bg-indigo-700 transition"
                    >
                      🖋️ EDIT
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleNonaktif(user._id)}
                      className="bg-red-600 text-white font-bold cursor-pointer rounded p-2 hover:bg-amber-700 transition"
                    >
                      🗑️ NONAKTIF
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="p-6 bg-background rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Buat User Baru</h2>
            <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
              <Input
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                placeholder="Username"
                required
              />
              <Input
                name="email"
                type="email"
                value={newUser.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
              <div>
                <select
                  name="division"
                  value={newUser.division}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                >
                  <option value="">Pilih Divisi</option>
                  {Object.keys(divisions).map((key) => (
                    <option key={key} value={key}>
                      {/* {key.charAt(0).toUpperCase() + key.slice(1)}*/}
                      {`${key} (${divisions[key]})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
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

              <Input
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Batal
                </Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
