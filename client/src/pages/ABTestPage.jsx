import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { RefreshCw, Plus, Trash2, LogOut, BarChart2, ExternalLink } from "lucide-react";

export default function ABTestPage() {
  const { logout } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", urlA: "", urlB: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => { fetchTests(); }, []);

  const fetchTests = async () => {
    try {
      const { data } = await API.get("/abtests");
      setTests(data.tests);
    } catch (err) { toast.error("Failed to fetch tests"); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await API.post("/abtests", form);
      setTests([data.test, ...tests]);
      setForm({ name: "", urlA: "", urlB: "" });
      setShowForm(false);
      toast.success("A/B test created!");
    } catch (err) { toast.error(err.response?.data?.message || "Failed to create test"); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/abtests/${id}`);
      setTests(tests.filter((t) => t._id !== id));
      toast.success("Test deleted");
    } catch (err) { toast.error("Failed to delete"); }
  };

  const getWinner = (test) => {
    const total = test.clicksA + test.clicksB;
    if (total === 0) return null;
    const rateA = test.clicksA / total;
    const rateB = test.clicksB / total;
    if (rateA > rateB) return "A";
    if (rateB > rateA) return "B";
    return "Tie";
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <nav className="border-b border-[#1E1E2E] bg-[#111118] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-white tracking-tight">Trax<span className="text-[#6E56CF]">ly</span></h1>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-[#888899] hover:text-white text-sm transition-colors">Dashboard</Link>
            <Link to="/apikeys" className="text-[#888899] hover:text-white text-sm transition-colors">API Keys</Link>
            <button onClick={() => { logout(); }} className="flex items-center gap-1.5 text-[#888899] hover:text-white transition-colors text-sm">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <RefreshCw size={22} className="text-[#FF6B6B]" /> A/B Link Testing
            </h2>
            <p className="text-[#888899] text-sm mt-1">Split traffic between two URLs and see which performs better</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-[#6E56CF] hover:bg-[#5A42B0] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} /> New Test
          </button>
        </div>

        {showForm && (
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 mb-6">
            <h3 className="text-white font-medium mb-4">Create A/B Test</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input type="text" placeholder="Test name (e.g. Homepage CTA Test)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-4 py-2.5 text-[#EEEEEE] placeholder-[#444455] focus:outline-none focus:border-[#6E56CF] transition-colors text-sm" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#888899] mb-1.5">URL A (Variant A)</label>
                  <input type="url" placeholder="https://landing-page-v1.com" value={form.urlA} onChange={(e) => setForm({ ...form, urlA: e.target.value })} required
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-4 py-2.5 text-[#EEEEEE] placeholder-[#444455] focus:outline-none focus:border-[#6E56CF] transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-[#888899] mb-1.5">URL B (Variant B)</label>
                  <input type="url" placeholder="https://landing-page-v2.com" value={form.urlB} onChange={(e) => setForm({ ...form, urlB: e.target.value })} required
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-4 py-2.5 text-[#EEEEEE] placeholder-[#444455] focus:outline-none focus:border-[#6E56CF] transition-colors text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={creating} className="bg-[#6E56CF] hover:bg-[#5A42B0] disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  {creating ? "Creating..." : "Create Test"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20"><div className="w-8 h-8 border-2 border-[#6E56CF] border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : tests.length === 0 ? (
          <div className="text-center py-20 bg-[#111118] border border-[#1E1E2E] rounded-2xl">
            <RefreshCw size={40} className="text-[#1E1E2E] mx-auto mb-4" />
            <p className="text-white font-medium">No A/B tests yet</p>
            <p className="text-[#888899] text-sm mt-1">Create your first test to start splitting traffic</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => {
              const total = test.clicksA + test.clicksB;
              const pctA = total > 0 ? Math.round((test.clicksA / total) * 100) : 50;
              const pctB = total > 0 ? Math.round((test.clicksB / total) * 100) : 50;
              const winner = getWinner(test);
              return (
                <div key={test._id} className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-white font-medium">{test.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[#6E56CF] font-mono text-xs">traxly-api.onrender.com/ab/{test.shortCode}</span>
                        <a href={`https://traxly-api.onrender.com/ab/${test.shortCode}`} target="_blank" rel="noreferrer" className="text-[#444455] hover:text-[#888899]"><ExternalLink size={11} /></a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {winner && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${winner === "Tie" ? "bg-[#1E1E2E] text-[#888899]" : "bg-[#00D4AA]/10 text-[#00D4AA]"}`}>
                          {winner === "Tie" ? "Tied" : `Variant ${winner} winning`}
                        </span>
                      )}
                      <button onClick={() => handleDelete(test._id)} className="p-1.5 text-[#888899] hover:text-red-400 hover:bg-[#1E1E2E] rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#0A0A0F] rounded-xl p-4 border border-[#1E1E2E]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[#6E56CF]">Variant A</span>
                        <span className="text-white text-sm font-bold">{test.clicksA} clicks</span>
                      </div>
                      <p className="text-[#888899] text-xs truncate mb-2">{test.urlA}</p>
                      <div className="w-full bg-[#1E1E2E] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-[#6E56CF]" style={{ width: `${pctA}%` }} />
                      </div>
                      <p className="text-[#888899] text-xs mt-1">{pctA}% of traffic</p>
                    </div>
                    <div className="bg-[#0A0A0F] rounded-xl p-4 border border-[#1E1E2E]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[#00D4AA]">Variant B</span>
                        <span className="text-white text-sm font-bold">{test.clicksB} clicks</span>
                      </div>
                      <p className="text-[#888899] text-xs truncate mb-2">{test.urlB}</p>
                      <div className="w-full bg-[#1E1E2E] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-[#00D4AA]" style={{ width: `${pctB}%` }} />
                      </div>
                      <p className="text-[#888899] text-xs mt-1">{pctB}% of traffic</p>
                    </div>
                  </div>

                  <p className="text-[#444455] text-xs flex items-center gap-1">
                    <BarChart2 size={11} /> {total} total clicks Ã¢â‚¬â€ Created {new Date(test.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

