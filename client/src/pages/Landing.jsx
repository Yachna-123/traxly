import { Link } from "react-router-dom";
import {
  Link2, BarChart2, QrCode, Shield, Zap, ArrowRight,
  MapPin, Tag, Download, Lock, RefreshCw, Key
} from "lucide-react";

const features = [
  {
    icon: <Link2 size={20} className="text-[#6E56CF]" />,
    title: "Smart Short Links",
    desc: "Turn long URLs into clean, memorable links with custom aliases and expiry dates.",
  },
  {
    icon: <BarChart2 size={20} className="text-[#6E56CF]" />,
    title: "Real-time Analytics",
    desc: "Track clicks by device, browser, country and referrer with beautiful charts.",
  },
  {
    icon: <MapPin size={20} className="text-[#00D4AA]" />,
    title: "Geo Analytics",
    desc: "See exactly which countries your audience is clicking from with progress bars.",
  },
  {
    icon: <Tag size={20} className="text-[#FFD93D]" />,
    title: "UTM & Campaign Tracking",
    desc: "Track utm_source, utm_medium and utm_campaign â€” just like Google Analytics.",
  },
  {
    icon: <RefreshCw size={20} className="text-[#FF6B6B]" />,
    title: "A/B Link Testing",
    desc: "Split traffic between two URLs and see which one performs better.",
  },
  {
    icon: <QrCode size={20} className="text-[#6E56CF]" />,
    title: "QR Code Generation",
    desc: "Every link gets a downloadable QR code instantly â€” perfect for print campaigns.",
  },
  {
    icon: <Shield size={20} className="text-[#6E56CF]" />,
    title: "Password Protection",
    desc: "Secure sensitive links with password protection and automatic expiry.",
  },
  {
    icon: <Download size={20} className="text-[#00D4AA]" />,
    title: "CSV Export",
    desc: "Download all your link analytics as a CSV file for reporting and analysis.",
  },
  {
    icon: <Key size={20} className="text-[#FFD93D]" />,
    title: "Developer API",
    desc: "Integrate Traxly into your workflow with personal API keys and REST endpoints.",
  },
  {
    icon: <Zap size={20} className="text-[#6E56CF]" />,
    title: "Redis Caching",
    desc: "Lightning fast redirects powered by Redis â€” sub-millisecond response times.",
  },
  {
    icon: <Lock size={20} className="text-[#FF6B6B]" />,
    title: "Rate Limiting",
    desc: "Built-in rate limiting protects your links from spam and abuse.",
  },
  {
    icon: <Link2 size={20} className="text-[#6E56CF]" />,
    title: "Link-in-Bio Pages",
    desc: "Create a beautiful Linktree-style page with all your links in one place.",
  },
];

const stats = [
  { value: "10x", label: "Faster redirects with Redis" },
  { value: "100%", label: "Free to use" },
  { value: "12+", label: "Analytics data points" },
  { value: "âˆž", label: "Links you can create" },
];

const useCases = [
  {
    role: "Marketers",
    desc: "Track UTM campaigns, measure click-through rates by country and device, export CSV reports for stakeholders.",
    color: "text-[#6E56CF]",
    bg: "bg-[#6E56CF]/10 border-[#6E56CF]/20",
  },
  {
    role: "Developers",
    desc: "Use our REST API with personal API keys to shorten links programmatically in your apps and workflows.",
    color: "text-[#00D4AA]",
    bg: "bg-[#00D4AA]/10 border-[#00D4AA]/20",
  },
  {
    role: "Consultants",
    desc: "A/B test campaign links, track client campaign performance and share bio pages with all key resources.",
    color: "text-[#FFD93D]",
    bg: "bg-[#FFD93D]/10 border-[#FFD93D]/20",
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
            <Link to="/login" className="text-[#888899] hover:text-white transition-colors text-sm">Sign in</Link>
            <Link to="/register" className="bg-[#6E56CF] hover:bg-[#5A42B0] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#6E56CF] opacity-10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 py-28 text-center relative">
          <div className="inline-flex items-center gap-2 bg-[#111118] border border-[#1E1E2E] rounded-full px-4 py-1.5 text-xs text-[#888899] mb-8">
            <span className="w-1.5 h-1.5 bg-[#00D4AA] rounded-full animate-pulse" />
            Marketing analytics platform â€” built for growth
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
            Shorten, track and
            <br />
            <span className="text-[#6E56CF]">grow your links</span>
          </h1>
          <p className="text-[#888899] text-lg max-w-2xl mx-auto mb-10">
            Traxly gives you powerful link management with UTM campaign tracking, geo-analytics,
            A/B testing, QR codes, password protection, and a REST API â€” all in one place.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="flex items-center gap-2 bg-[#6E56CF] hover:bg-[#5A42B0] text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Start for free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="text-[#888899] hover:text-white transition-colors px-6 py-3">
              Sign in â†’
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-[#888899] text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Built for every role</h2>
          <p className="text-[#888899]">Whether you are a marketer, developer or consultant â€” Traxly works for you</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {useCases.map((u, i) => (
            <div key={i} className={`border rounded-2xl p-6 ${u.bg}`}>
              <h3 className={`text-lg font-bold mb-3 ${u.color}`}>{u.role}</h3>
              <p className="text-[#888899] text-sm leading-relaxed">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-4">Everything you need</h2>
          <p className="text-[#888899]">12 powerful features to manage, track and grow your links</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 hover:border-[#6E56CF]/30 transition-colors">
              <div className="w-10 h-10 bg-[#6E56CF]/10 rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-[#888899] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">How it works</h2>
          <p className="text-[#888899]">Get started in 3 simple steps</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Create an account", desc: "Sign up free in under 30 seconds. No credit card required." },
            { step: "02", title: "Shorten your links", desc: "Paste your long URL, add a custom alias, set expiry and campaign tags." },
            { step: "03", title: "Track and grow", desc: "Watch real-time analytics â€” clicks, countries, devices, UTM campaigns and more." },
          ].map((s, i) => (
            <div key={i} className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 relative">
              <span className="text-5xl font-bold text-[#1E1E2E] absolute top-4 right-6">{s.step}</span>
              <h3 className="text-white font-semibold mb-2 mt-2">{s.title}</h3>
              <p className="text-[#888899] text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-3xl p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#6E56CF] opacity-10 blur-[80px] rounded-full pointer-events-none" />
          <h2 className="text-3xl font-bold text-white mb-4 relative">Ready to grow your links?</h2>
          <p className="text-[#888899] mb-8 relative max-w-md mx-auto">
            Join and start managing your links smarter today. Free forever.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-[#6E56CF] hover:bg-[#5A42B0] text-white px-8 py-3 rounded-lg font-medium transition-colors relative">
            Create free account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E1E2E] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-lg font-bold text-white">Trax<span className="text-[#6E56CF]">ly</span></h1>
          <div className="flex items-center gap-6 text-sm text-[#444455]">
            <Link to="/login" className="hover:text-[#888899] transition-colors">Sign in</Link>
            <Link to="/register" className="hover:text-[#888899] transition-colors">Sign up</Link>
          </div>
          <p className="text-[#444455] text-sm">Â© 2026 Traxly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}