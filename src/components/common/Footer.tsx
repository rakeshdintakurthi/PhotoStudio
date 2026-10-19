import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Mail, Phone, MapPin, Globe, Share2, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#171717] text-[#A3A3A3] pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Camera className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-2xl font-bold tracking-tight text-white">
                  Lumina Studios
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-neutral-400 -mt-1">
                  Creative Visual Platform
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400 max-w-sm">
              Capturing momentous university festivals, convocation ceremonies, regal weddings, and celebratory private events with editorial mastery and instant customer downloads.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors" title="Global Coverage">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors" title="Social Channels">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="mailto:hello@luminastudios.com" className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors" title="Email Studio">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-white">Galleries</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/discover" className="hover:text-white transition-colors">
                  All Public Events
                </Link>
              </li>
              <li>
                <Link to="/colleges" className="hover:text-white transition-colors">
                  Partner Colleges
                </Link>
              </li>
              <li>
                <Link to="/discover?category=college_fest" className="hover:text-white transition-colors">
                  College Festivals
                </Link>
              </li>
              <li>
                <Link to="/discover?category=convocation" className="hover:text-white transition-colors">
                  Convocations
                </Link>
              </li>
              <li>
                <Link to="/discover?category=wedding" className="hover:text-white transition-colors">
                  Weddings & Receptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-white">Client Access</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/private-access" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Private Event Login
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Book Event Coverage
                </Link>
              </li>
              <li>
                <Link to="/about#pricing" className="hover:text-white transition-colors">
                  Coverage Packages
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-white">Studio HQ</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Lumina Creative Atelier, 4th Floor, Worli Sea Face, Mumbai 400030</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href="mailto:hello@luminastudios.com" className="hover:text-white">
                  hello@luminastudios.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+91 (022) 8920-4300</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Lumina Studios Platform. All photographs copyrighted by respective authors.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Cloudflare R2 Storage Active
            </span>
            <Link to="/admin/login" className="hover:text-neutral-300">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
