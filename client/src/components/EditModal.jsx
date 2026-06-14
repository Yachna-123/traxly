import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import API from "../api/axios";

export default function EditModal({ link, onClose, onUpdate }) {
  const [form, setForm] = useState({
    originalUrl: link.originalUrl,
    customAlias: link.customAlias || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.put(`/links/${link._id}`, {
        originalUrl: form.originalUrl,
        customAlias: form.customAlias || undefined,
      });
      onUpdate(data.link);
      toast.success("Link updated!");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update link");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-[#1E1E2E]">
          <div>
            <h2 className="text-white font-semibold">Edit Link</h2>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#888899] mb-1.5">
                Original URL
              </label>
              <input
                type="url"
                value={form.originalUrl}
                onChange={(e) =>
                  setForm({ ...form, originalUrl: e.target.value })
                }
                required
                className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-4 py-2.5 text-[#EEEEEE] placeholder-[#444455] focus:outline-none focus:border-[#6E56CF] transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#888899] mb-1.5">
                Custom Alias
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[#888899] text-sm whitespace-nowrap">
                  traxly.site/
                </span>
                <input
                  type="text"
                  value={form.customAlias}
                  onChange={(e) =>
                    setForm({ ...form, customAlias: e.target.value })
                  }
                  placeholder={link.shortCode}
                  className="flex-1 bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-4 py-2.5 text-[#EEEEEE] placeholder-[#444455] focus:outline-none focus:border-[#6E56CF] transition-colors text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#6E56CF] hover:bg-[#5A42B0] disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

