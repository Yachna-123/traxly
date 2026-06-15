import { useState } from "react";
import { X, Lock, Eye, EyeOff, Clock, Tag } from "lucide-react";
import { toast } from "react-hot-toast";
import API from "../api/axios";

export default function EditModal({ link, onClose, onUpdate }) {
  const [form, setForm] = useState({
    originalUrl: link.originalUrl,
    customAlias: link.customAlias || "",
    expiresAt: link.expiresAt ? new Date(link.expiresAt).toISOString().slice(0, 16) : "",
    campaign: link.campaign || "",
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settingPassword, setSettingPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.put(`/links/${link._id}`, {
        originalUrl: form.originalUrl,
        customAlias: form.customAlias || undefined,
        expiresAt: form.expiresAt || undefined,
        campaign: form.campaign || undefined,
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

  const handleSetPassword = async () => {
    setSettingPassword(true);
    try {
      await API.put(`/links/${link._id}/password`, { password: password || null });
      toast.success(password ? "Password set!" : "Password removed!");
      setPassword("");
    } catch (err) {
      toast.error("Failed to set password");
    } finally {
      setSettingPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#1E1E2E]">
          <div>
            <h2 className="text-white font-semibold">Edit Link</h2>
            <p className="text-[#6E56CF] font-mono text-sm mt-0.5">traxly.site/{link.shortCode}</p>
          </div>
          <button onClick={onClose} className="p-2 text-[#888899] hover:text-white hover:bg-[#1E1E2E] rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#888899] mb-1.5">Original URL</label>
              <input type="url" value={form.originalUrl} onChange={(e) => setForm({ ...form, originalUrl: e.target.value })} required
                className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-4 py-2.5 text-[#EEEEEE] placeholder-[#444455] focus:outline-none focus:border-[#6E56CF] transition-colors text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#888899] mb-1.5">Custom Alias</label>
              <div className="flex items-center gap-2">
                <span className="text-[#888899] text-sm whitespace-nowrap">traxly.site/</span>
                <input type="text" value={form.customAlias} onChange={(e) => setForm({ ...form, customAlias: e.target.value })} placeholder={link.shortCode}
                  className="flex-1 bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-4 py-2.5 text-[#EEEEEE] placeholder-[#444455] focus:outline-none focus:border-[#6E56CF] transition-colors text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#888899] mb-1.5">
                <div className="flex items-center gap-1.5"><Clock size={13} />Expiry Date (optional)</div>
              </label>
              <input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-4 py-2.5 text-[#EEEEEE] placeholder-[#444455] focus:outline-none focus:border-[#6E56CF] transition-colors text-sm" />
              {form.expiresAt && (
                <button type="button" onClick={() => setForm({ ...form, expiresAt: "" })} className="text-xs text-red-400 hover:text-red-300 mt-1">
                  Remove expiry
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#888899] mb-1.5">
                <div className="flex items-center gap-1.5"><Tag size={13} />Campaign Tag (optional)</div>
              </label>
              <input type="text" value={form.campaign} onChange={(e) => setForm({ ...form, campaign: e.target.value })}
                placeholder="e.g. product-hunt, newsletter, twitter"
                className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-4 py-2.5 text-[#EEEEEE] placeholder-[#444455] focus:outline-none focus:border-[#6E56CF] transition-colors text-sm" />
              <p className="text-[#444455] text-xs mt-1">Group links by campaign to filter them on your dashboard</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="flex-1 bg-[#6E56CF] hover:bg-[#5A42B0] disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          <div className="border-t border-[#1E1E2E] pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Lock size={14} className="text-[#6E56CF]" />
              <h3 className="text-white text-sm font-medium">Password Protection</h3>
              {link.password && <span className="text-xs bg-[#6E56CF]/20 text-[#6E56CF] px-2 py-0.5 rounded-full">Active</span>}
            </div>
            <p className="text-[#888899] text-xs mb-3">
              {link.password ? "This link is password protected. Set a new password or leave empty to remove." : "Add a password to protect this link."}
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder={link.password ? "New password (empty to remove)" : "Enter password"}
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-4 py-2.5 text-[#EEEEEE] placeholder-[#444455] focus:outline-none focus:border-[#6E56CF] transition-colors text-sm pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444455] hover:text-[#888899]">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button onClick={handleSetPassword} disabled={settingPassword}
                className="bg-[#6E56CF] hover:bg-[#5A42B0] disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                {settingPassword ? "..." : link.password ? "Update" : "Set"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}