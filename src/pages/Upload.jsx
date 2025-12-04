import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const types = {
  ADD: "ADDENDUM",
  BA: "BERITA ACARA",
  SKU: "SURAT KUASA",
  JO: "JOB ORDER",
  KK: "KONTRAK KERJA",
  KW: "KWITANSI",
  MOM: "MINUTES OF MEETING",
  MOU: "MEMORANDUM OF UNDERSTANDING",
  NC: "NOTA CAPAIAN",
  ND: "NOTA DINAS",
  PENG: "PENGADUAN",
  PEM: "PEMBERITAHUAN",
  PB: "PENERIMAAN BARANG",
  PM: "PERMOHONAN",
  PN: "PENOLAKAN",
  NDA: "PERJANJIAN KERAHASIAAN",
  PKS: "PERJANJIAN KERJA SAMA",
  PR: "PERKENALAN",
  PNW: "PENERANGAN",
  PO: "PURCHASE ORDER",
  PT: "PENGANTAR",
  SK: "SURAT KEPUTUSAN",
  SKT: "SURAT KETERANGAN",
  SP: "SURAT PERINGATAN",
  SPI: "SURAT PEMBERIAN IZIN",
  SPK: "SURAT PERINTAH KERJA",
  SPR: "SURAT PERNYATAAN",
  SR: "SURAT REKOMENDASI",
  SE: "SURAT EDARAN",
  PNG: "PENUGASAN",
  SERT: "SERTIFIKAT",
  TAG: "TAGIHAN",
  U: "UNDANGAN",
  ST: "SURAT TEGURAN",
  PQ: "MATERIAL REQUEST",
  PJ: "PERSETUJUAN",
  CL: "CONFIRMATION LETTER",
};

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

const Upload = () => {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");
  const [division, setDivision] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file || !type || !description) {
      setError("Tolong isi semua kolom!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("division", division);
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
      setError(`Upload failed: ${err.response?.data?.message}`);
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

      <div className="max-w-md mx-auto mt-10 p-6 bg-background rounded-lg shadow-lg border-t-ring">
        <h2 className="text-2xl font-bold mb-4">Form Upload</h2>

        {error && (
          <div className="mb-4 text-red-600 border border-red-400 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* File */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Pilih File: <em>(.pdf)</em>
            </label>
            <input
              type="file"
              accept=".pdf" // TODO: what file types do we support?
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="block w-full border rounded px-3 py-2"
            />
          </div>

          {/* Document Type */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Tipe Dokumen:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="block w-full border rounded px-3 py-2 bg-background"
            >
              <option value="">Pilih Tipe</option>
              {Object.keys(types).map((key) => (
                <option key={key} value={key}>
                  {/* {key.charAt(0).toUpperCase() + key.slice(1)}*/}
                  {`${key} (${types[key]})`}
                </option>
              ))}
            </select>
          </div>

          {/* Division */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Division</label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              required
              className="block w-full border rounded px-3 py-2 bg-background"
            >
              <option value="">Pilih Division</option>
              {Object.keys(divisions).map((key) => (
                <option key={key} value={key}>
                  {/* {key.charAt(0).toUpperCase() + key.slice(1)}*/}
                  {`${key} (${divisions[key]})`}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Deskripsi:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="block w-full border rounded px-3 py-2 bg-background"
              placeholder="Masukan deskripsi dokumen..."
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-black text-white px-4 py-2 rounded hover:bg-black border border-t-green-300 ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Uploading..." : "Upload Dokumen"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Upload;
