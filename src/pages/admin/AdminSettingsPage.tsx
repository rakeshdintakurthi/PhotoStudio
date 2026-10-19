import React, { useState } from 'react';
import { 
  Save, 
  Check, 
  HardDrive, 
  ShieldCheck, 
  Camera, 
  Layers, 
  Database,
  Cloud
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const AdminSettingsPage: React.FC = () => {
  const [saved, setSaved] = useState(false);

  // Studio Settings State
  const [studioName, setStudioName] = useState('Lumina Studios');
  const [tagline, setTagline] = useState('Every Moment. Beautifully Captured.');
  const [supportEmail, setSupportEmail] = useState('hello@luminastudios.com');
  const [phone, setPhone] = useState('+91 (022) 8920-4300');

  // Storage & Cloudflare Settings
  const [r2Bucket, setR2Bucket] = useState('lumina-studios-photos');
  const [r2AccountId, setR2AccountId] = useState('cf_acc_902482098234');
  const [publicCdnDomain, setPublicCdnDomain] = useState('https://cdn.luminastudios.com');
  const [d1DatabaseId, setD1DatabaseId] = useState('d1_db_lumina_production');

  // Preferences
  const [enableWatermark, setEnableWatermark] = useState(false);
  const [watermarkText, setWatermarkText] = useState('© LUMINA STUDIOS');
  const [allowPublicZipDownloads, setAllowPublicZipDownloads] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <AdminHeader
        title="Studio & System Settings"
        subtitle="Manage brand identity, Cloudflare R2 object storage connections, and customer download policies."
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-4xl">
        {saved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings updated and deployed to Cloudflare Workers successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Studio Profile */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E8E3] shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0F0EB]">
              <Camera className="w-4 h-4 text-indigo-600" />
              <h3 className="font-editorial text-lg font-bold text-[#171717]">
                Studio Identity & Contact Info
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Brand Name</label>
                <input
                  type="text"
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Office Telephone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                />
              </div>
            </div>
          </div>

          {/* Cloudflare Workers, R2 & D1 Architecture Configuration */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E8E3] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F0EB]">
              <div className="flex items-center gap-2.5">
                <Cloud className="w-4 h-4 text-indigo-600" />
                <h3 className="font-editorial text-lg font-bold text-[#171717]">
                  Cloudflare R2 & D1 Infrastructure
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Connected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Cloudflare Account ID</label>
                <input
                  type="text"
                  value={r2AccountId}
                  onChange={(e) => setR2AccountId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D5D5CF] font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">R2 Bucket Name</label>
                <input
                  type="text"
                  value={r2Bucket}
                  onChange={(e) => setR2Bucket(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D5D5CF] font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Custom CDN Domain</label>
                <input
                  type="text"
                  value={publicCdnDomain}
                  onChange={(e) => setPublicCdnDomain(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D5D5CF]"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">D1 Database Binding</label>
                <input
                  type="text"
                  value={d1DatabaseId}
                  onChange={(e) => setD1DatabaseId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D5D5CF] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Download & Watermark Policies */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E8E3] shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0F0EB]">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <h3 className="font-editorial text-lg font-bold text-[#171717]">
                Watermarking & Download Permissions
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-stone-50 border border-[#E5E5DE]">
                <div>
                  <span className="font-semibold text-stone-900 block">Enable Full Album One-Click ZIP Downloads</span>
                  <span className="text-[#737373]">Allow students and wedding guests to download entire galleries as a zipped bundle.</span>
                </div>
                <input
                  type="checkbox"
                  checked={allowPublicZipDownloads}
                  onChange={(e) => setAllowPublicZipDownloads(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-stone-50 border border-[#E5E5DE]">
                <div>
                  <span className="font-semibold text-stone-900 block">Apply Studio Watermark to Web Previews</span>
                  <span className="text-[#737373]">Adds studio copyright signature overlay on browser images while keeping downloads uncompressed.</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableWatermark}
                  onChange={(e) => setEnableWatermark(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </label>

              {enableWatermark && (
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Watermark Overlay Text</label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5D5CF]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#171717] hover:bg-[#333] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4 text-indigo-400" />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
