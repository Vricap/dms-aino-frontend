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
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError("");
      } else {
        setError("Hanya file PDF yang diperbolehkan");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file || !type || !division || !description) {
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
    <main className=" container mx-auto py-6 px-4 md:px-6 min-h-screen">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Upload Dokumen</h1>
          <p className="text-muted-foreground">
            Unggah dan kelola dokumen Anda dengan mudah
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden mx-auto max-w-4xl w-full">
          <div className="bg-gradient-to-r px-8 py-6 bg-black dark:bg-white">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-white dark:text-black">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Form Upload Dokumen
            </h2>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-800 dark:text-red-300 font-medium">
                  {error}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  File Dokumen <span className="text-red-500">*</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
                    dragActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                      : file
                        ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                        : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-zinc-950 hover:border-gray-400 dark:hover:border-gray-600"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                  />
                  <div className="text-center pointer-events-none">
                    <svg
                      className={`mx-auto h-12 w-12 mb-3 ${
                        file
                          ? "text-green-500"
                          : "text-gray-400 dark:text-gray-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    {file ? (
                      <div>
                        <p className="text-green-700 dark:text-green-400 font-semibold">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          Tarik dan lepas file PDF di sini
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          atau klik untuk memilih file
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tipe Dokumen <span className="text-red-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  className="block w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Pilih Tipe Dokumen</option>
                  {Object.keys(types).map((key) => (
                    <option key={key} value={key}>
                      {`${key} - ${types[key]}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Division */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Divisi <span className="text-red-500">*</span>
                </label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  required
                  className="block w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Pilih Divisi</option>
                  {Object.keys(divisions).map((key) => (
                    <option key={key} value={key}>
                      {`${key} - ${divisions[key]}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="4"
                  className="block w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder="Masukkan deskripsi dokumen secara detail..."
                ></textarea>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {description.length} karakter
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 ${
                    isLoading
                      ? "opacity-75 cursor-not-allowed"
                      : "hover:from-blue-700 hover:to-indigo-700"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Mengupload...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      Upload Dokumen
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-semibold mb-1">Tips Upload Dokumen:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
                <li>Pastikan file dalam format PDF</li>
                <li>Pilih tipe dokumen dan divisi dengan benar</li>
                <li>Berikan deskripsi yang jelas dan detail</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Upload;
