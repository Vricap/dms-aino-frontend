import { Button } from "./ui/button";

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

export default function FilterModal({
  open,
  onClose,
  handleFilter,

  selectedTypes,
  selectedDiv,

  handleSelectType,
  handleSelectDiv,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="p-6 bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Filter Dokumen</h2>

        <div className="grid grid-cols-3">
          <h4 className="font-semibold mb-2">Tipe Dokumen</h4>
          <p></p>
          <p></p>
          {Object.keys(types).map((key) => (
            <div key={key}>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  class="hidden peer"
                  selected={selectedTypes.includes(key)}
                  checked={selectedTypes.includes(key)}
                  onChange={() => handleSelectType(key)}
                />
                <div class="w-5 h-5 border-2 border-gray-400 rounded peer-checked:bg-primary peer-checked:border-primary"></div>
                <span class="text-gray-700">{key}</span>
              </label>
            </div>
          ))}
          <p></p>
          <p></p>

          <h4 className="font-semibold mb-2 mt-4">Divisi</h4>
          <p></p>
          <p></p>
          {Object.keys(divisions).map((key) => (
            <div key={key}>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  class="hidden peer"
                  selected={selectedDiv.includes(key)}
                  checked={selectedDiv.includes(key)}
                  onChange={() => handleSelectDiv(key)}
                />
                <div class="w-5 h-5 border-2 border-gray-400 rounded peer-checked:bg-primary peer-checked:border-primary"></div>
                <span class="text-gray-700">{key}</span>
              </label>
            </div>
          ))}
        </div>

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

        <div className="flex justify-end gap-2 pt-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" onClick={handleFilter}>
            Filter
          </Button>
        </div>
      </div>
    </div>
  );
}
