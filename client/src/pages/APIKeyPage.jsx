import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { Key, Copy, Trash2, LogOut, RefreshCw } from "lucide-react";

export default function APIKeyPage() {
  const { logout } = useAuth();
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => { fetchKey(); }, []);

  const fetchKey = async () => {
    try {
      const { data } = await API.get("/apikeys");
      setApiKey(data.apiKey);
    } catch (err) { toast.error("Failed to fetch API key"); }
    finally { setLoading(false); }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data } = await API.post("/apikeys");
      setApiKey(data.apiKey);
      setShowKey(true);
      toast.success("API key generated!");
    } catch (err) { toast.error("Failed to generate key"); }
    finally { setGenerating(false); }
  };

  const handleDelete = async () => {
    try {
      await API.delete("/apikeys");
      setApiKey(null);
      toast.success("API key deleted");
    } catch (err) { toast.error("Failed to delete key"); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey.key);
    toast.success("API key copied!");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <nav className="border-b border-[#1E1E2E] bg-[#111118] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-white tracking-tight">Trax<span className="text-[#6E56CF]">ly</span></h1>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-[#888899] hover:text-white text-sm transition-colors">Dashboard</Link>
            <Link to="/abtests" className="text-[#888899] hover:text-white text-sm transition-colors">A/B Tests</Link>
            <button onClick={() => logout()} className="flex items-center gap-1.5 text-[#888899] hover:text-white transition-colors text-sm"><LogOut size={15} /></button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Key size={22} className="text-[#FFD93D]" /> API Keys
          </h2>
          <p className="text-[#888899] text-sm mt-1">Use your API key to shorten links programmatically</p>
        </div>

        {loading ? (
          <div className="text-center py-20"><div className="w-8 h-8 border-2 border-[#6E56CF] border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Your API Key</h3>
                {!apiKey ? (
                  <button onClick={handleGenerate} disabled={generating} className="flex items-center gap-2 bg-[#6E56CF] hover:bg-[#5A42B0] disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Key size={14} />{generating ? "Generating..." : "Generate Key"}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={handleGenerate} disabled={generating} className="flex items-center gap-2 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                      <RefreshCw size={12} /> Regenerate
                    </button>
                    <button onClick={handleDelete} className="flex items-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>

              {apiKey ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-4 py-3">
                    <code className="text-[#6E56CF] text-sm flex-1 font-mono truncate">
                      {showKey ? apiKey.key : apiKey.key.slice(0, 8) + "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"}
                    </code>
                    <button onClick={() => setShowKey(!showKey)} className="text-[#444455] hover:text-[#888899] text-xs whitespace-nowrap">
                      {showKey ? "Hide" : "Show"}
                    </button>
                    <button onClick={handleCopy} className="p-1 text-[#444455] hover:text-white"><Copy size={14} /></button>
                  </div>
                  {apiKey.lastUsed && (
                    <p className="text-[#444455] text-xs">Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}</p>
                  )}
                  <p className="text-[#444455] text-xs">Created: {new Date(apiKey.createdAt).toLocaleDateString()}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Key size={32} className="text-[#1E1E2E] mx-auto mb-3" />
                  <p className="text-[#888899] text-sm">No API key yet â€” generate one to get started</p>
                </div>
              )}
            </div>

            <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6">
              <h3 className="text-white font-medium mb-4">How to use the API</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[#888899] text-xs mb-2">Shorten a URL:</p>
                  <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-4">
                    <code className="text-[#00D4AA] text-xs">
                      {`curl -X POST https://traxly-api.onrender.com/api/links/shorten \\`}<br />
                      {`  -H "Authorization: Bearer YOUR_API_KEY" \\`}<br />
                      {`  -H "Content-Type: application/json" \\`}<br />
                      {`  -d '{"originalUrl": "https://your-long-url.com"}'`}
                    </code>
                  </div>
                </div>
                <div>
                  <p className="text-[#888899] text-xs mb-2">Get all your links:</p>
                  <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-4">
                    <code className="text-[#00D4AA] text-xs">
                      {`curl https://traxly-api.onrender.com/api/links \\`}<br />
                      {`  -H "Authorization: Bearer YOUR_API_KEY"`}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}