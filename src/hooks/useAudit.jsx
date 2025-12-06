import { useState } from "react";
import axios from "axios";

export default function useAudit() {
  const [audit, setAudit] = useState({
    title: "",
    uploader: "",
    dateUpload: "",
    views: [],
    downloads: [],
    receiver: [],
    dateComplete: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const auditDoc = async (id) => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_BASE_URL + `/documents/audit/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
        },
      );

      setAudit({
        name: res.data.title,
        uploader: res.data.uploader.username,
        dateUpload: res.data.createdAt,
        views: res.data.logs.views,
        downloads: res.data.logs.downloads,
        receiver: res.data.receiver.data,
        dateComplete: res.data.dateComplete,
      });
      setIsModalOpen(true);
    } catch (err) {
      alert(
        `Gagal dalam melakukan audit dokumen. ${err.response?.data?.message}`,
      );
    }
  };

  return {
    audit,
    isModalOpen,
    setIsModalOpen,
    auditDoc,
  };
}
