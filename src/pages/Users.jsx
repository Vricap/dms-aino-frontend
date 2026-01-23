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
    const confirmed = window.confirm(
      "Yakin ingin menonaktifkan user ini?\nUser tidak akan bisa login kembali.",
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/users/${id}`, {
        headers: { "x-access-token": localStorage.getItem("token") },
      });
      await fetchUsers();
      alert("User berhasil dinonaktifkan.");
    } catch (err) {
      alert(`Gagal menonaktifkan user: ${err.response?.data?.message}`);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto py-6 px-4 md:px-6 min-h-screen">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="h-8 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
          </div>

          {/* Search bar */}
          <div className="flex gap-3 max-w-lg">
            <div className="h-10 flex-1 bg-muted rounded animate-pulse" />
            <div className="h-10 w-10 bg-muted rounded animate-pulse" />
          </div>

          {/* Table skeleton */}
          <div className="rounded-md border overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-7 gap-4 px-4 py-3 border-b bg-muted/30">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-20 bg-muted rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <main className="container mx-auto py-8 px-4 md:px-6 min-h-screen">
      <div className="rounded-2xl bg-background shadow-sm border p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Manajemen User
            </h1>
            <p className="text-muted-foreground">
              Buat, Edit atau Non-aktifkan User.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Total User</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Admin</p>
              <p className="text-2xl font-bold">
                {users.filter((u) => u.roleId.name === "admin").length}
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">User Biasa</p>
              <p className="text-2xl font-bold">
                {users.filter((u) => u.roleId.name === "user").length}
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Divisi</p>
              <p className="text-2xl font-bold">
                {Object.keys(divisions).length}
              </p>
            </div>
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
            <Button
              onClick={handleOpenModal}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Tambah User
            </Button>
          </div>

          <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
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
                  <TableRow
                    key={user._id}
                    className="hover:bg-muted/50 transition"
                  >
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
                    <TableCell>
                      <span className="px-2 py-1 rounded bg-muted text-xs font-medium">
                        {user.division}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-semibold
                          ${
                            user.roleId.name === "admin"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        `}
                      >
                        {user.roleId.name}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <button
                        onClick={() => handleEdit(user._id)}
                        className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-medium
                                      text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition"
                      >
                        🖋️
                        <span>Edit</span>
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleNonaktif(user._id)}
                        className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-medium
                                       text-red-600 hover:bg-red-50 hover:border-red-300 transition"
                      >
                        🗑️
                        <span>Nonaktif</span>
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
              <div className="border-b pb-3 mb-4">
                <h2 className="text-xl font-semibold">Buat User Baru</h2>
                <p className="text-sm text-muted-foreground">
                  User akan langsung aktif setelah dibuat
                </p>
              </div>
              <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
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
      </div>
    </main>
  );
}
