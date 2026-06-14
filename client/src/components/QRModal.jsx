import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import API from "../api/axios";

export default function QRModal({ link, onClose }) {
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQR();
  }, []);

  const fetchQR = async () => {
    try {
      const { data } = await API.get(`/links/${link._id}/qr`);
      setQr(data.qr);
    } catch (err) {
      console.error("Failed to fetch QR");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = qr;
    a.download = `traxly-${link.shortCode}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-6 border-b border-[#1E1E2E]">
          <div>
            <h2 className="text-white font-semibold">QR Code</h2>
            <p className="text-[#6E56CF] font-mono text-sm mt-0.5">
              traxly.site/{link.shortCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#888899] hover:text-white hover:bg-[#1E1E2E] rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#6E56CF] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : qr ? (
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-xl">
                <img src={qr} alt="QR Code" className="w-48 h-48" />
              </div>
              <p className="text-[#888899] text-xs text-center">
                Scan to visit{" "}
                <span className="text-[#6E56CF]">traxly.site/{link.shortCode}</span>
              </p>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-[#6E56CF] hover:bg-[#5A42B0] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors w-full justify-center"
              >
                <Download size={16} />
                Download QR Code
              </button>
            </div>
          ) : (
            <p className="text-[#888899] text-center py-8">Failed to load QR code</p>
          )}
        </div>
      </div>
    </div>
  );
}

