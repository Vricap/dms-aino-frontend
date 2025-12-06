import { Button } from "./ui/button";

export default function AuditModal({ audit, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="p-6 bg-background rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Audit</h2>
        <p className="mb-4">Dokumen {audit.name}</p>

        <div className="max-h-[60vh] overflow-y-auto space-y-2 border-t mb-4">
          <div className="flex flex-col gap-2 mb-4">
            <h3 className="text-x font-semibold mt-4">History</h3>
            <div className="flex justify-between">
              <p>Pembuat Dokumen:</p>
              <p>{audit.uploader}</p>
            </div>
            <div className="flex justify-between">
              <p>Tanggal Dibuat:</p>
              <p>{audit.dateUpload}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <h3 className="text-x font-semibold mt-4">Log Aktivitas</h3>
            <div className="mb-4">
              <p>Dikirim Ke:</p>
              {audit.receiver.map((el, i) => (
                <div className="flex justify-between">
                  <p>
                    {el.user.username} #{i + 1}
                  </p>
                  <p>{el.dateSent}</p>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <p>Ditandatangani Oleh:</p>
              {audit.receiver.map(
                (el, i) =>
                  el.signed && (
                    <div className="flex justify-between">
                      <p>
                        {el.user.username} #{i + 1}
                      </p>
                      <p>{el.dateSigned}</p>
                    </div>
                  ),
              )}
            </div>

            <div className="mb-4">
              <p>Dilihat Oleh:</p>
              {audit.views.map((el) => (
                <div className="flex justify-between">
                  <p>{el.user.username}</p>
                  <p>{el.dateView}</p>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <p>Didownload Oleh:</p>
              {audit.downloads.map((el) => (
                <div className="flex justify-between">
                  <p>{el.user.username}</p>
                  <p>{el.dateDownload}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-4">
              <p>Tanggal Dokumen Complete:</p>
              <p>{audit.dateComplete}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Ok</Button>
        </div>
      </div>
    </div>
  );
}
