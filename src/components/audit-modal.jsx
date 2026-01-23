import { Button } from "./ui/button";
import {
  FileText,
  User,
  Send,
  Eye,
  Download,
  PenLine,
  CheckCircle,
  X,
} from "lucide-react";
import { formatRelativeTime } from "./../lib/time";

export default function AuditModal({ audit, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-background rounded-xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Audit Dokumen
            </h2>
            <p className="text-sm text-muted-foreground">{audit.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Summary */}
          <section className="rounded-lg border p-4 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Informasi Dokumen
            </h3>

            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Pembuat</span>
              </div>
              <span className="font-medium text-right">{audit.uploader}</span>

              <span>Tanggal Dibuat</span>
              <span className="text-right">{audit.dateUpload}</span>

              <span>Status Complete</span>
              <span className="text-right">{audit.dateComplete || "-"}</span>
            </div>
          </section>

          {/* Activity Timeline */}
          <section className="space-y-4">
            <h3 className="font-semibold">Aktivitas</h3>

            {/* Sent */}
            <ActivityBlock
              icon={Send}
              title="Dikirim ke"
              items={audit.receiver.map((el) => ({
                label: `${el.user?.username || "Tidak ada"} (#${el.urutan})`,
                date: el.dateSent,
              }))}
            />

            {/* Signed */}
            <ActivityBlock
              icon={PenLine}
              title="Ditandatangani oleh"
              items={audit.receiver
                .filter((el) => el.signed)
                .map((el) => ({
                  label: `${el.user?.username || "Tidak ada"} (#${el.urutan})`,
                  date: el.dateSigned,
                }))}
              emptyText="Belum ada tanda tangan"
            />

            {/* Viewed */}
            <ActivityBlock
              icon={Eye}
              title="Dilihat oleh"
              items={audit.views.map((el) => ({
                label: el.user?.username || "Tidak ada",
                date: el.dateView,
              }))}
            />

            {/* Downloaded */}
            <ActivityBlock
              icon={Download}
              title="Didownload oleh"
              items={audit.downloads.map((el) => ({
                label: el.user?.username || "Tidak ada",
                date: el.dateDownload,
              }))}
            />
          </section>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end">
          <Button onClick={onClose}>Tutup</Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- helper ---------------- */

function ActivityBlock({ icon: Icon, title, items, emptyText }) {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <h4 className="flex items-center gap-2 font-medium">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {title}
      </h4>

      {items.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex justify-between gap-4 rounded-md bg-muted/50 px-3 py-2"
            >
              <span className="font-medium">{item.label}</span>
              <span className="text-muted-foreground">
                {formatRelativeTime(item.date)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          {emptyText || "Tidak ada data"}
        </p>
      )}
    </div>
  );
}
