import { Button } from "./ui/button";
import { X } from "lucide-react";

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

const statuses = ["saved", "sent", "complete"];

export default function FilterModal({
  open,
  onClose,
  handleFilter,

  selectedTypes,
  selectedDiv,
  selectedStat,

  handleSelectType,
  handleSelectDiv,
  handleSelectStat,
  showStatus,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-background rounded-xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Filter Dokumen</h2>
            <p className="text-sm text-muted-foreground">
              Pilih tipe dan divisi dokumen
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Document Types */}
          <div>
            <h3 className="font-semibold mb-3">Tipe Dokumen</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {Object.keys(types).map((key) => {
                const active = selectedTypes.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectType(key)}
                    className={`flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition
                        ${
                          active
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "hover:bg-muted"
                        }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divisions */}
          <div>
            <h3 className="font-semibold mb-3">Divisi</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {Object.keys(divisions).map((key) => {
                const active = selectedDiv.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectDiv(key)}
                    className={`flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition
                        ${
                          active
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "hover:bg-muted"
                        }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          {showStatus && (
            <div>
              <h3 className="font-semibold mb-3">Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {statuses.map((key) => {
                  const active = selectedStat.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectStat(key)}
                      className={`flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition
                        ${
                          active
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "hover:bg-muted"
                        }`}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TODO: date range is not implemented yet because it will get complexs, date range in draft or in completed will be different kind of date*/}
          {/* <h4 className="font-semibold mb-2 mt-4">Tanggal</h4>
          <div className="grid grid-cols-2 gap-x-2">
            <div>
              <p className="text-sm text-gray-600">Tanggal Mulai</p>
              <DatePicker
                mode="single"
                selected={selectedStartDate}
                onSelect={setSelectedStartDate}
                placeHolder="Masukan Tanggal Mulai"
                className="rounded-md border bg-inherit p-1 w-full"
                classNames={{
                  day_selected: "bg-blue-600 text-white",
                  day_today: "text-blue-600 font-bold",
                  day: "hover:bg-blue-100 rounded",
                }}
              />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tanggal Akhir</p>
              <DatePicker
                mode="single"
                selected={selectedEndDate}
                onSelect={setSelectedEndDate}
                placeHolder="Masukan Tanggal Akhir"
                className="rounded-md border bg-inherit p-1 w-full"
                classNames={{
                  day_selected: "bg-blue-600 text-white",
                  day_today: "text-blue-600 font-bold",
                  day: "hover:bg-blue-100 rounded",
                }}
              />
            </div>
          </div>*/}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {showStatus
              ? selectedTypes.length +
                selectedDiv.length +
                selectedStat.length +
                " "
              : selectedTypes.length + selectedDiv.length + " "}
            filter dipilih
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button onClick={handleFilter}>Terapkan Filter</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
