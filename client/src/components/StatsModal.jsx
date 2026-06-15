import { useState, useEffect } from "react";
import { X, Monitor, Globe, TrendingUp, BarChart2, MapPin, Tag } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import API from "../api/axios";

const COLORS = ["#6E56CF", "#00D4AA", "#FF6B6B", "#FFD93D", "#4ECDC4"];

export default function StatsModal({ link, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get(`/links/${link._id}/stats`);
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#1E1E2E]">
          <div>
            <h2 className="text-white font-semibold text-lg">Link Analytics</h2>
            <p className="text-[#6E56CF] font-mono text-sm mt-0.5">traxly.site/{link.shortCode}</p>
          </div>
          <button onClick={onClose} className="p-2 text-[#888899] hover:text-white hover:bg-[#1E1E2E] rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#6E56CF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : stats ? (
          <div className="p-6 space-y-6">

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4">
                <p className="text-[#888899] text-xs mb-1">Total Clicks</p>
                <p className="text-white text-2xl font-bold">{stats.totalClicks}</p>
              </div>
              <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4">
                <p className="text-[#888899] text-xs mb-1">Status</p>
                <p className={`text-lg font-semibold ${stats.isActive ? "text-[#00D4AA]" : "text-red-400"}`}>
                  {stats.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4">
                <p className="text-[#888899] text-xs mb-1">Created</p>
                <p className="text-white text-sm font-medium">
                  {new Date(stats.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-[#6E56CF]" />
                <h3 className="text-white text-sm font-medium">Clicks — Last 7 Days</h3>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={stats.clicksByDate}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6E56CF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6E56CF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: "#888899", fontSize: 11 }} tickLine={false} axisLine={false}
                    tickFormatter={(val) => new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
                  <YAxis tick={{ fill: "#888899", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "#111118", border: "1px solid #1E1E2E", borderRadius: "8px", color: "#EEEEEE", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="clicks" stroke="#6E56CF" strokeWidth={2} fill="url(#colorClicks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Monitor size={16} className="text-[#6E56CF]" />
                  <h3 className="text-white text-sm font-medium">Devices</h3>
                </div>
                {stats.clicksByDevice.length === 0 ? (
                  <p className="text-[#888899] text-xs text-center py-8">No data yet</p>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={120}>
                      <PieChart>
                        <Pie data={stats.clicksByDevice} dataKey="count" nameKey="device" cx="50%" cy="50%" outerRadius={50} strokeWidth={0}>
                          {stats.clicksByDevice.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: "#111118", border: "1px solid #1E1E2E", borderRadius: "8px", color: "#EEEEEE", fontSize: "12px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1 mt-2">
                      {stats.clicksByDevice.map((d, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                            <span className="text-[#888899] text-xs capitalize">{d.device}</span>
                          </div>
                          <span className="text-white text-xs font-medium">{d.count}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={16} className="text-[#6E56CF]" />
                  <h3 className="text-white text-sm font-medium">Browsers</h3>
                </div>
                {stats.clicksByBrowser.length === 0 ? (
                  <p className="text-[#888899] text-xs text-center py-8">No data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={stats.clicksByBrowser} layout="vertical">
                      <XAxis type="number" tick={{ fill: "#888899", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <YAxis type="category" dataKey="browser" tick={{ fill: "#888899", fontSize: 10 }} tickLine={false} axisLine={false} width={60} />
                      <Tooltip contentStyle={{ background: "#111118", border: "1px solid #1E1E2E", borderRadius: "8px", color: "#EEEEEE", fontSize: "12px" }} />
                      <Bar dataKey="count" fill="#6E56CF" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {stats.clicksByCountry && stats.clicksByCountry.length > 0 && (
              <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={16} className="text-[#00D4AA]" />
                  <h3 className="text-white text-sm font-medium">Top Countries</h3>
                </div>
                <div className="space-y-3">
                  {stats.clicksByCountry.slice(0, 5).map((c, i) => {
                    const percentage = Math.round((c.count / stats.totalClicks) * 100);
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[#888899] text-xs">{c.country}</span>
                          <span className="text-white text-xs font-medium">{c.count} clicks ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-[#1E1E2E] rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${percentage}%`, background: COLORS[i % COLORS.length] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {stats.clicksByReferrer && stats.clicksByReferrer.length > 0 && (
              <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 size={16} className="text-[#6E56CF]" />
                  <h3 className="text-white text-sm font-medium">Referrers</h3>
                </div>
                <div className="space-y-2">
                  {stats.clicksByReferrer.map((r, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[#888899] text-xs truncate max-w-[80%]">{r.referrer}</span>
                      <span className="text-white text-xs font-medium">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.clicksByUTM && stats.clicksByUTM.length > 0 && (
              <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={16} className="text-[#FFD93D]" />
                  <h3 className="text-white text-sm font-medium">UTM Campaigns</h3>
                </div>
                <div className="space-y-2">
                  {stats.clicksByUTM.map((u, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#111118] rounded-lg px-3 py-2">
                      <div>
                        <span className="text-white text-xs font-medium">{u.campaign}</span>
                        <span className="text-[#444455] text-xs ml-2">via {u.source} / {u.medium}</span>
                      </div>
                      <span className="text-[#FFD93D] text-xs font-medium">{u.count} clicks</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <p className="text-[#888899] text-center py-20">Failed to load stats</p>
        )}
      </div>
    </div>
  );
}