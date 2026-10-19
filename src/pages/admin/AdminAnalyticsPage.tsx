import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Download, 
  HardDrive, 
  Calendar,
  Layers
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { analyticsService } from '@/services/analyticsService';
import { AnalyticsSummary } from '@/types';
import { formatNumber, formatBytes } from '@/utils/formatters';

export const AdminAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    analyticsService.getSummary().then(setData);
  }, []);

  return (
    <div>
      <AdminHeader
        title="Analytics & Studio Insights"
        subtitle="Performance metrics across university festivals, client downloads, views, and object storage trends."
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#E8E8E3] shadow-xs space-y-2">
            <span className="text-xs font-semibold text-[#737373]">Total Gallery Visits</span>
            <div className="flex items-baseline justify-between">
              <span className="font-editorial text-3xl font-bold text-[#171717]">
                {data ? formatNumber(data.totalViews) : '168,400'}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                +24.8%
              </span>
            </div>
            <p className="text-[11px] text-[#737373]">Across public & private links</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E8E3] shadow-xs space-y-2">
            <span className="text-xs font-semibold text-[#737373]">Total Photo Downloads</span>
            <div className="flex items-baseline justify-between">
              <span className="font-editorial text-3xl font-bold text-[#171717]">
                {data ? formatNumber(data.totalDownloads) : '41,200'}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                +19.2%
              </span>
            </div>
            <p className="text-[11px] text-[#737373]">Single & ZIP album bundles</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E8E3] shadow-xs space-y-2">
            <span className="text-xs font-semibold text-[#737373]">Cloudflare R2 Storage</span>
            <div className="flex items-baseline justify-between">
              <span className="font-editorial text-3xl font-bold text-[#171717]">
                {data ? formatBytes(data.storageUsedBytes) : '442 GB'}
              </span>
              <span className="text-xs font-semibold text-indigo-600">44.2% quota</span>
            </div>
            <p className="text-[11px] text-[#737373]">Zero bandwidth egress fees</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E8E3] shadow-xs space-y-2">
            <span className="text-xs font-semibold text-[#737373]">Active Event Archives</span>
            <div className="flex items-baseline justify-between">
              <span className="font-editorial text-3xl font-bold text-[#171717]">
                {data ? data.totalEvents : '12'}
              </span>
              <span className="text-xs font-semibold text-stone-500">100% online</span>
            </div>
            <p className="text-[11px] text-[#737373]">5 Colleges & 3 Private Galas</p>
          </div>
        </div>

        {/* Most Viewed Events Table */}
        <div className="bg-white rounded-2xl border border-[#E8E8E3] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#EAEAE6]">
            <h3 className="font-editorial text-lg font-bold text-[#171717]">
              Most Popular Events & Downloads Ranking
            </h3>
            <p className="text-xs text-[#737373]">
              Top ranked festivals and wedding albums based on visitor traffic and download requests.
            </p>
          </div>

          <div className="p-5 space-y-4">
            {data?.topEvents.map((item, idx) => {
              const maxViews = 40000;
              const viewPercentage = Math.round((item.views / maxViews) * 100);
              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900 flex items-center gap-2">
                      <span className="w-5 text-stone-400 font-mono">0{idx + 1}.</span>
                      {item.title}
                    </span>
                    <div className="flex items-center gap-4 text-stone-600">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-stone-400" />
                        {formatNumber(item.views)} views
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-indigo-600">
                        <Download className="w-3.5 h-3.5" />
                        {formatNumber(item.downloads)} downloads
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${viewPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Storage Trends & CDN Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-[#E8E8E3] shadow-xs space-y-4">
            <h3 className="font-editorial text-lg font-bold text-[#171717]">
              CDN Cache Hit Ratio
            </h3>
            <p className="text-xs text-[#737373]">
              Cloudflare edge caches 98.4% of thumbnail requests, keeping latency under 45ms worldwide.
            </p>

            <div className="p-4 rounded-xl bg-stone-50 border border-[#E5E5DE] flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-500 block">Edge Hits</span>
                <span className="font-editorial text-xl font-bold text-emerald-600">98.4%</span>
              </div>
              <div>
                <span className="text-stone-500 block">Avg Response</span>
                <span className="font-editorial text-xl font-bold text-stone-900">38 ms</span>
              </div>
              <div>
                <span className="text-stone-500 block">Bandwidth Served</span>
                <span className="font-editorial text-xl font-bold text-stone-900">3.8 TB</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8E8E3] shadow-xs space-y-4">
            <h3 className="font-editorial text-lg font-bold text-[#171717]">
              Client Download Formats
            </h3>
            <p className="text-xs text-[#737373]">
              Breakdown of how guests download their festival and wedding memories.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-600">Batch Album ZIP Download</span>
                <span className="font-bold text-stone-900">68%</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#4F46E5] h-full rounded-full" style={{ width: '68%' }} />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-stone-600">Individual High-Res JPG Download</span>
                <span className="font-bold text-stone-900">32%</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '32%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
