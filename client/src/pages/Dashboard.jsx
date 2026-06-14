import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import StatsModal from "../components/StatsModal";
import QRModal from "../components/QRModal";
import EditModal from "../components/EditModal";
import { Link2, Copy, Trash2, ToggleLeft, ToggleRight, LogOut, Plus, ExternalLink, BarChart2, QrCode, Pencil, Search, MousePointerClick, Activity, User } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ originalUrl: "", customAlias: "" });
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [qrLink, setQrLink] = useState(null);
  const [editLink, setEditLink] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchLinks(); }, []);

  const fetchLinks = async () => {
    try {
      const { data } = await API.get("/links");
      setLinks(data.links);
    } catch (err) { toast.error("Failed to fetch links"); }
    finally { setLoading(false); }
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await API.post("/links/shorten", { originalUrl: form.originalUrl, customAlias: form.customAlias || undefined });
      setLinks([data.link, ...links]);
      setForm({ originalUrl: "", customAlias: "" });
      setShowForm(false);
      toast.success("Link created!");
    } catch (err) { toast.error(err.response?.data?.message || "Failed to create link"); }
    finally { setCreating(false); }
  };

  const handleCopy = (shortUrl) => { navigator.clipboard.writeText(shortUrl); toast.success("Copied!"); };
  const handleDelete = async (id) => {
    try { await API.delete(`/links/${id}`); setLinks(links.filter((l) => l._id !== id)); toast.success("Deleted"); }
    catch (err) { toast.error("Failed to delete"); }
  };
  const handleToggle = async (id) => {
    try { const { data } = await API.put(`/links/${id}/toggle`); setLinks(links.map((l) => l._id === id ? { ...l, isActive: data.isActive } : l)); toast.success(data.message); }
    catch (err) { toast.error("Failed to toggle"); }
  };
  const handleUpdate = (updatedLink) => { setLinks(links.map((l) => (l._id === updatedLink._id ? { ...l, ...updatedLink } : l))); };
  const handleLogout = () => { logout(); navigate("/login"); };
  const truncate = (str, n) => str.length > n ? str.substring(0, n) + "..." : str;
  const filteredLinks = links.filter((l) => l.shortCode.toLowerCase().includes(search.toLowerCase()) || l.originalUrl.toLowerCase().includes(search.toLowerCase()));
  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);
  const activeLinks = links.filter((l) => l.isActive).length;

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <nav className="border-b border-[#1E1E2E] bg-[#111118] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-white tracking-tight shrink-0">Trax<span className="text-[#6E56CF]">ly</span></h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-[#888899] text-sm hidden sm:block">Hey, {user?.name?.split(" ")[0]} 👋</span>
            <a href={`/u/${user?.username}`} target="_blank" rel="noreferrer" className="text-[#888899] hover:text-[#6E56CF] transition-colors text-sm whitespace-nowrap">Bio Page 🔗</a>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-[#888899] hover:text-white transition-colors text-sm">
              <LogOut size={15} /><span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2"><Link2 size={14} className="text-[#6E56CF]" /><span className="text-[#888899] text-xs">Total Links</span></div>
            <p className="text-white text-2xl font-bold">{links.length}</p>
          </div>
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2"><MousePointerClick size={14} className="text-[#00D4AA]" /><span className="text-[#888899] text-xs">Total Clicks</span></div>
            <p className="text-white text-2xl font-bold">{totalClicks}</p>
          </div>
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2"><Activity size={14} className="text-[#6E56CF]" /><span className="text-[#888899] text-xs">Active</span></div>
            <p className="text-white text-2xl font-bold">{activeLinks}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Your Links</h2>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-[#6E56CF] hover:bg-[#5A42B0] text-white px-3 sm:px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} /><span className="hidden sm:block">New Link</span>
          </button>
        </div>

        <div className="relative mb-6">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444455]" />
          <input type="text" placeholder="Search links..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111118] border border-[#1E1E2E] rounded-lg pl-9 pr-4 py-2.5 text-[#EEEEEE] placeholder-[#444455] focus:outline-none focus:border-[#6E56CF] transition-colors text-sm" />
        </div>

        {showForm && (
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 sm:p-6 mb-6">
            <h3 className="text-white font-medium mb-4">Create a new link</h3>
            <form onSubmit={handleShorten} className="flex flex-col gap-3">
              <input type="url" placeholder="https://your-long-url.com" value={form.originalUrl} onChange={(e) => setForm({ ...form, originalUrl: e.target.value })} required
                className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-4 py-2.5 text-[#EEEEEE] placeholder-[#444455] focus:outline-none focus:border-[#6E56CF] transition-colors text-sm" />
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="text" placeholder="Custom alias (optional)" value={form.customAlias} onChange={(e) => setForm({ ...form, customAlias: e.target.value })}
                  className="flex-1 bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-4 py-2.5 text-[#EEEEEE] placeholder-[#444455] focus:outline-none focus:border-[#6E56CF] transition-colors text-sm" />
                <button type="submit" disabled={creating} className="bg-[#6E56CF] hover:bg-[#5A42B0] disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  {creating ? "Creating..." : "Shorten"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20"><div className="w-8 h-8 border-2 border-[#6E56CF] border-t-transparent rounded-full animate-spin mx-auto" /><p className="text-[#888899] mt-4 text-sm">Loading...</p></div>
        ) : filteredLinks.length === 0 ? (
          <div className="text-center py-20 bg-[#111118] border border-[#1E1E2E] rounded-2xl">
            <Link2 size={40} className="text-[#1E1E2E] mx-auto mb-4" />
            <p className="text-white font-medium">{search ? "No links match your search" : "No links yet"}</p>
            <p className="text-[#888899] text-sm mt-1">{search ? "Try a different term" : "Click + New Link to get started"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLinks.map((link) => (
              <div key={link._id} className={`bg-[#111118] border rounded-xl p-4 sm:p-5 transition-all ${link.isActive ? "border-[#1E1E2E] hover:border-[#6E56CF]/30" : "border-[#1E1E2E] opacity-50"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[#6E56CF] font-mono text-sm font-medium">traxly.site/{link.shortCode}</span>
                      {!link.isActive && <span className="text-xs bg-[#1E1E2E] text-[#888899] px-2 py-0.5 rounded-full">Inactive</span>}
                    </div>
                    <p className="text-[#888899] text-xs truncate">{truncate(link.originalUrl, 50)}</p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <button onClick={() => setSelectedLink(link)} className="flex items-center gap-1.5 text-xs text-[#888899] hover:text-[#6E56CF] transition-colors">
                        <BarChart2 size={12} />{link.clicks} clicks
                      </button>
                      <span className="text-xs text-[#444455]">{new Date(link.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                    <button onClick={() => handleCopy(`https://traxly-api.onrender.com/${link.shortCode}`)} className="p-1.5 sm:p-2 text-[#888899] hover:text-white hover:bg-[#1E1E2E] rounded-lg transition-colors" title="Copy"><Copy size={14} /></button>
                    <a href={link.originalUrl} target="_blank" rel="noreferrer" className="p-1.5 sm:p-2 text-[#888899] hover:text-white hover:bg-[#1E1E2E] rounded-lg transition-colors" title="Visit"><ExternalLink size={14} /></a>
                    <button onClick={() => setQrLink(link)} className="p-1.5 sm:p-2 text-[#888899] hover:text-white hover:bg-[#1E1E2E] rounded-lg transition-colors" title="QR"><QrCode size={14} /></button>
                    <button onClick={() => setEditLink(link)} className="p-1.5 sm:p-2 text-[#888899] hover:text-[#6E56CF] hover:bg-[#1E1E2E] rounded-lg transition-colors" title="Edit"><Pencil size={14} /></button>
                    <button onClick={() => handleToggle(link._id)} className="p-1.5 sm:p-2 text-[#888899] hover:text-white hover:bg-[#1E1E2E] rounded-lg transition-colors" title="Toggle">
                      {link.isActive ? <ToggleRight size={14} className="text-[#00D4AA]" /> : <ToggleLeft size={14} />}
                    </button>
                    <button onClick={() => handleDelete(link._id)} className="p-1.5 sm:p-2 text-[#888899] hover:text-red-400 hover:bg-[#1E1E2E] rounded-lg transition-colors" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {links.length > 0 && (
          <div className="mt-8 bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#6E56CF] to-[#00D4AA] rounded-full flex items-center justify-center shrink-0"><User size={16} className="text-white" /></div>
              <div>
                <p className="text-white text-sm font-medium">Your Bio Page</p>
                <p className="text-[#888899] text-xs">traxly.site/u/{user?.username}</p>
              </div>
            </div>
            <a href={`/u/${user?.username}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#6E56CF]/10 hover:bg-[#6E56CF]/20 text-[#6E56CF] border border-[#6E56CF]/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">View Page 🔗</a>
          </div>
        )}
      </div>

      {selectedLink && <StatsModal link={selectedLink} onClose={() => setSelectedLink(null)} />}
      {qrLink && <QRModal link={qrLink} onClose={() => setQrLink(null)} />}
      {editLink && <EditModal link={editLink} onClose={() => setEditLink(null)} onUpdate={handleUpdate} />}
    </div>
  );
}
