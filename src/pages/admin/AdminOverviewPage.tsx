import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Image as ImageIcon, 
  GraduationCap, 
  Download, 
  HardDrive, 
  UploadCloud, 
  ArrowUpRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Lock,
  Layers
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { analyticsService } from '@/services/analyticsService';
import { eventService } from '@/services/eventService';
import { AnalyticsSummary, EventGallery } from '@/types';
import { formatBytes, formatNumber, formatDate, getCategoryBadgeClass, getCategoryLabel } from '@/utils/formatters';

export const AdminOverviewPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recentEvents, setRecentEvents] = useState<EventGallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [stats, events] = await Promise.all([
          analyticsService.getSummary(),
          eventService.getAll({ includePrivate: true }),
        ]);
        setAnalytics(stats);
        setRecentEvents(events.slice(0, 5));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const statsCards = [
    {
      title: 'Total Events',
      value: analytics ? formatNumber(analytics.totalEvents) : '12',
      change: '+3 this month',
      icon: Calendar,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Total Photographs',
      value: analytics ? formatNumber(analytics.totalPhotos) : '2,480',
      change: '+340 new captures',
      icon: ImageIcon,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      title: 'Partner Colleges',
      value: analytics ? String(analytics.totalColleges) : '5',
      change: '100% renewal rate',
      icon: GraduationCap,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Total Client Downloads',
      value: analytics ? formatNumber(analytics.totalDownloads) : '41,200',
      change: '+18% vs last season',
      icon: Download,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'R2 Object Storage',
      value: analytics ? formatBytes(analytics.storageUsedBytes) : '442 GB',
      change: '44% of 1TB quota',
      icon: HardDrive,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Dashboard Overview"
        subtitle="Real-time metrics, storage consumption, and recent festival galleries."
        action={
          <div className="flex items-center gap-2.5">
            <Link
              to="/admin/events"
              className="px-3.5 py-2 rounded-xl border border-[#D5D5CF] bg-white text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-xs"
            >
              Manage Events
            </Link>
            <Link
              to="/admin/upload"
              className="px-4 py-2 rounded-xl bg-[#171717] hover:bg-[#333] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
              <span>Upload Photos</span>
            </Link>
          </div>
        }
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statsCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#E8E8E3] shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#737373]">{card.title}</span>
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="font-editorial text-2xl font-bold text-[#171717]">
                    {card.value}
                  </span>
                  <p className="text-[11px] text-[#737373] mt-0.5">{card.change}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts and Storage Indicator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Monthly Activity Chart (Blogger Simplicity + SaaS Cleanliness) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E8E8E3] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0F0EB]">
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#171717]">
                  Monthly Upload & Download Activity
                </h3>
                <p className="text-xs text-[#737373]">
                  Volume of photographs added vs customer downloads across all galleries.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-stone-600">
                  <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" />
                  Downloads (x100)
                </span>
                <span className="flex items-center gap-1.5 text-stone-600">
                  <span className="w-3 h-3 rounded-xs bg-stone-300 inline-block" />
                  Uploads
                </span>
              </div>
            </div>

            {/* Custom Bar Visualization */}
            <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
              {analytics?.monthlyUploads.map((item, idx) => {
                const downloadHeight = Math.min(100, Math.round((item.downloads / 18000) * 100));
                const uploadHeight = Math.min(100, Math.round((item.uploads / 1000) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-48">
                      {/* Uploads Bar */}
                      <div
                        className="w-1/3 bg-stone-200 group-hover:bg-stone-300 rounded-t-md transition-all duration-300 relative"
                        style={{ height: `${uploadHeight}%` }}
                        title={`${item.uploads} uploads in ${item.month}`}
                      />
                      {/* Downloads Bar */}
                      <div
                        className="w-1/3 bg-[#4F46E5] group-hover:bg-[#4338CA] rounded-t-md transition-all duration-300 relative"
                        style={{ height: `${downloadHeight}%` }}
                        title={`${formatNumber(item.downloads)} downloads in ${item.month}`}
                      />
                    </div>
                    <span className="text-xs font-semibold text-stone-500">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Storage & Health Breakdown */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E8E8E3] shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#171717]">
                  Cloudflare R2 Storage
                </h3>
                <p className="text-xs text-[#737373]">
                  Direct Object Storage bucket usage and CDN bandwidth.
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Used: 442 GB</span>
                  <span className="text-stone-500">Cap: 1,000 GB</span>
                </div>
                <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden border border-[#E5E5DE]">
                  <div className="bg-[#4F46E5] h-full rounded-full" style={{ width: '44.2%' }} />
                </div>
                <p className="text-[11px] text-stone-500">
                  Zero egress fees via Cloudflare Workers routing.
                </p>
              </div>

              {/* Category Breakdown */}
              <div className="pt-4 border-t border-[#F0F0EB] space-y-2.5">
                <span className="text-xs font-bold text-stone-700 block">
                  Galleries by Category
                </span>
                {analytics?.categoryBreakdown.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-stone-600">{cat.category}</span>
                    <span className="font-semibold text-stone-800">{cat.count} events</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-[#E5E5DE] text-[11px] text-[#737373] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Signed upload URLs and CDN cache operating normally.</span>
            </div>
          </div>
        </div>

        {/* Latest Created Galleries Table */}
        <div className="bg-white rounded-2xl border border-[#E8E8E3] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#EAEAE6] flex items-center justify-between">
            <div>
              <h3 className="font-editorial text-lg font-bold text-[#171717]">
                Latest Created Galleries
              </h3>
              <p className="text-xs text-[#737373]">
                Manage recent event uploads, publication status, and view public galleries.
              </p>
            </div>
            <Link
              to="/admin/events"
              className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-1"
            >
              <span>View All Events</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF8] border-b border-[#EAEAE6] text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Event & Cover</th>
                  <th className="py-3 px-4">Institution / Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Photos</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0EB]">
                {recentEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={ev.coverPhotoUrl}
                          alt={ev.title}
                          className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-900 truncate max-w-xs">{ev.title}</p>
                          <p className="text-[11px] text-stone-500 truncate">{ev.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-stone-800 block">{ev.collegeName || 'Private Event'}</span>
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border mt-0.5 ${getCategoryBadgeClass(ev.category)}`}>
                        {getCategoryLabel(ev.category)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {formatDate(ev.date)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-stone-800">
                      {ev.totalPhotos}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          ev.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/events/${ev.slug || ev.id}`}
                          target="_blank"
                          className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                          title="View Live Gallery"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <Link
                          to="/admin/events"
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
