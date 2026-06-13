import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import {
  Link2,
  Copy,
  Trash2,
  ToggleLeft,
  ToggleRight,
  LogOut,
  Plus,
  ExternalLink,
  BarChart2,
} from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ originalUrl: "", customAlias: "" });
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data } = await API.get("/links");
      setLinks(data.links);
    } catch (err) {
      toast.error("Failed to fetch links");
    } finally {
      setLoading(false);
    }
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await API.post("/links/shorten", {
        originalUrl: form.originalUrl,
        customAlias: form.customAlias || undefined,
      });
      setLinks([data.link, ...links]);
      setForm({ originalUrl: "", customAlias: "" });
      setShowForm(false);
      toast.success("Link created!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create link");
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard!");
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/links/${id}`);
      setLinks(links.filter((l) => l._id !== id));
      toast.success("Link deleted");
    } catch (err) {
      toast.error("Failed to delete link");
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await API.put(`/links/${id}/toggle`);
      setLinks(
        links.map((l) =>
          l._id === id ? { ...l, isActive: data.isActive } : l
        )
      );
      toast.success(data.message);
    } catch (err) {
      toast.error("Failed to toggle link");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const truncate = (str, n) =>
    str.length > n ? str.substring(0, n) + "..." : str;

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <nav className="border-b border-[#1E1E2E] bg-[#111118] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Trax<span className="text-[#6E56CF]">ly</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-[#888899] text-sm">
              Hey, {user?.name?.split(" ")[0]} 👋
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#888899] hover:text-white transition-colors text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-white">Your Links</h2>
            <p className="text-[#888899] text-sm mt-1">
              {links.length} link{links.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[#6E56CF] hover:bg-[#5A42B0] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            New Link
          </button>
        </div>

        {showForm && (
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 mb-6">
            <h3 className="text-white font-medium mb-4">Create a new link</h3>
            <form onSubmit={handleShorten} className="flex flex-col gap-3">
              <input
                type="url"
                placeholder="https://your-long-url.com"
                value={form.originalUrl}
                onChange={(e) =>
                  setForm({ ...form, originalUrl: e.target.value })
                }
                required
                className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-4 py-2.5 text-[#EEEEEE] placeholder-[#444455] focus:outline-none focus:border-[#6E56CF] transition-colors text-sm"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Custom alias (optional)"
                  value={form.customAlias}
                  onChange={(e) =>
                    setForm({ ...form, customAlias: e.target.value })
                  }
                  className="flex-1 bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-4 py-2.5 text-[#EEEEEE] placeholder-[#444455] focus:outline-none focus:border-[#6E56CF] transition-colors text-sm"
                />
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-[#6E56CF] hover:bg-[#5A42B0] disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {creating ? "Creating..." : "Shorten"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[#6E56CF] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[#888899] mt-4 text-sm">Loading links...</p>
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-20 bg-[#111118] border border-[#1E1E2E] rounded-2xl">
            <Link2 size={40} className="text-[#1E1E2E] mx-auto mb-4" />
            <p className="text-white font-medium">No links yet</p>
            <p className="text-[#888899] text-sm mt-1">
              Create your first short link above
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <div
                key={link._id}
                className={`bg-[#111118] border rounded-xl p-5 transition-all ${
                  link.isActive
                    ? "border-[#1E1E2E] hover:border-[#6E56CF]/30"
                    : "border-[#1E1E2E] opacity-50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#6E56CF] font-mono text-sm font-medium">
                        traxly.site/{link.shortCode}
                      </span>
                      {!link.isActive && (
                        <span className="text-xs bg-[#1E1E2E] text-[#888899] px-2 py-0.5 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-[#888899] text-xs truncate">
                      {truncate(link.originalUrl, 60)}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1.5 text-xs text-[#888899]">
                        <BarChart2 size={12} />
                        {link.clicks} clicks
                      </span>
                      <span className="text-xs text-[#444455]">
                        {new Date(link.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() =>
                        handleCopy(`http://localhost:5000/${link.shortCode}`)
                      }
                      className="p-2 text-[#888899] hover:text-white hover:bg-[#1E1E2E] rounded-lg transition-colors"
                      title="Copy"
                    >
                      <Copy size={15} />
                    </button>
                    <a
                      href={link.originalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-[#888899] hover:text-white hover:bg-[#1E1E2E] rounded-lg transition-colors"
                      title="Visit"
                    >
                      <ExternalLink size={15} />
                    </a>
                    <button
                      onClick={() => handleToggle(link._id)}
                      className="p-2 text-[#888899] hover:text-white hover:bg-[#1E1E2E] rounded-lg transition-colors"
                      title="Toggle"
                    >
                      {link.isActive ? (
                        <ToggleRight size={15} className="text-[#00D4AA]" />
                      ) : (
                        <ToggleLeft size={15} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(link._id)}
                      className="p-2 text-[#888899] hover:text-red-400 hover:bg-[#1E1E2E] rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

