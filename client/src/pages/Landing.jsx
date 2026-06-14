import { Link } from "react-router-dom";
import {
  Link2,
  BarChart2,
  QrCode,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: <Link2 size={20} className="text-[#6E56CF]" />,
    title: "Smart Short Links",
    desc: "Turn long URLs into clean, memorable links with custom aliases.",
  },
  {
    icon: <BarChart2 size={20} className="text-[#6E56CF]" />,
    title: "Real-time Analytics",
    desc: "Track clicks, devices, browsers, and referrers with beautiful charts.",
  },
  {
    icon: <QrCode size={20} className="text-[#6E56CF]" />,
    title: "QR Code Generation",
    desc: "Every link gets a downloadable QR code instantly.",
  },
  {
    icon: <Shield size={20} className="text-[#6E56CF]" />,
    title: "Password Protection",
    desc: "Secure sensitive links with password protection and expiry dates.",
  },
  {
    icon: <Zap size={20} className="text-[#6E56CF]" />,
    title: "Redis Caching",
    desc: "Lightning fast redirects powered by Redis caching layer.",
  },
  {
    icon: <Link2 size={20} className="text-[#6E56CF]" />,
    title: "Link-in-Bio Pages",
    desc: "Create a beautiful page with all your links in one place.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#EEEEEE]">
      {/* Navbar */}
      <nav className="border-b border-[#1E1E2E] bg-[#111118]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Trax<span className="text-[#6E56CF]">ly</span>
          </h1>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-[#888899] hover:text-white transition-colors text-sm"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-[#6E56CF] hover:bg-[#5A42B0] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#6E56CF] opacity-10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 py-28 text-center relative">
          <div className="inline-flex items-center gap-2 bg-[#111118] border border-[#1E1E2E] rounded-full px-4 py-1.5 text-xs text-[#888899] mb-8">
            <span className="w-1.5 h-1.5 bg-[#00D4AA] rounded-full" />
            Link management & analytics platform
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Shorten, track and
            <br />
            <span className="text-[#6E56CF]">grow your links</span>
          </h1>
          <p className="text-[#888899] text-lg max-w-xl mx-auto mb-10">
            Traxly gives you powerful link management with real-time analytics,
            QR codes, password protection, and a link-in-bio page builder.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 bg-[#6E56CF] hover:bg-[#5A42B0] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start for free
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="text-[#888899] hover:text-white transition-colors px-6 py-3"
            >
              Sign in →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-4">
            Everything you need
          </h2>
          <p className="text-[#888899]">
            Powerful features to manage and grow your links
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 hover:border-[#6E56CF]/30 transition-colors"
            >
              <div className="w-10 h-10 bg-[#6E56CF]/10 rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-[#888899] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-3xl p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#6E56CF] opacity-10 blur-[80px] rounded-full pointer-events-none" />
          <h2 className="text-3xl font-bold text-white mb-4 relative">
            Ready to get started?
          </h2>
          <p className="text-[#888899] mb-8 relative">
            Join and start managing your links smarter today.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-[#6E56CF] hover:bg-[#5A42B0] text-white px-8 py-3 rounded-lg font-medium transition-colors relative"
          >
            Create free account
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E1E2E] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">
            Trax<span className="text-[#6E56CF]">ly</span>
          </h1>
          <p className="text-[#444455] text-sm">© 2026 Traxly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}