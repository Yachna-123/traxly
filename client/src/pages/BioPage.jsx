import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ExternalLink, BarChart2, Link2 } from "lucide-react";
import API from "../api/axios";

export default function BioPage() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchBioPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBioPage = async () => {
    try {
      const res = await API.get(`/links/bio/${username}`);
      setData(res.data);
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6E56CF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center">
          <Link2 size={48} className="text-[#1E1E2E] mx-auto mb-4" />
          <h1 className="text-white text-2xl font-bold mb-2">Page not found</h1>
          <p className="text-[#888899]">@{username} does not exist on Traxly</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-16 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#6E56CF] opacity-10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md mx-auto relative">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#6E56CF] to-[#00D4AA] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">
              {data.user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-white text-2xl font-bold">{data.user.name}</h1>
          <p className="text-[#888899] text-sm mt-1">@{data.user.username}</p>
        </div>

        {data.links.length === 0 ? (
          <div className="text-center py-12 bg-[#111118] border border-[#1E1E2E] rounded-2xl">
            <p className="text-[#888899]">No links yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.links.map((link) => (
              <a
                key={link.id}
                href={`http://localhost:5000/${link.shortCode}`}
                target="_blank"
                rel="noreferrer"
                className="block bg-[#111118] border border-[#1E1E2E] hover:border-[#6E56CF]/50 rounded-2xl p-4 transition-all hover:bg-[#111118]/80 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[#6E56CF] font-mono text-sm font-medium">
                      traxly.site/{link.shortCode}
                    </p>
                    <p className="text-[#888899] text-xs truncate mt-0.5">
                      {link.originalUrl}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <span className="flex items-center gap-1 text-xs text-[#444455]">
                      <BarChart2 size={11} />
                      {link.clicks}
                    </span>
                    <ExternalLink
                      size={15}
                      className="text-[#444455] group-hover:text-[#6E56CF] transition-colors"
                    />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[#444455] hover:text-[#888899] transition-colors text-sm"
          >
            Powered by{" "}
            <span className="font-bold text-white">
              Trax<span className="text-[#6E56CF]">ly</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}


