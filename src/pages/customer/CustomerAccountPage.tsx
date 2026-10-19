import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  Heart, 
  Download, 
  Lock, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  Camera,
  Archive,
  Layers
} from 'lucide-react';
import { useCustomerStore } from '@/store/customerStore';
import { photoService } from '@/services/photoService';
import { privateGalleryService } from '@/services/privateGalleryService';
import { Photo, PrivateGalleryAccess } from '@/types';
import { PhotoCard } from '@/components/public/PhotoCard';
import { formatDate } from '@/utils/formatters';
import { downloadPhotosAsZip } from '@/utils/zipDownloader';

export const CustomerAccountPage: React.FC = () => {
  const { customer, logoutCustomer, isCustomerAuthenticated } = useCustomerStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'favorites' | 'shared' | 'downloads'>('favorites');
  const [favoritePhotos, setFavoritePhotos] = useState<Photo[]>([]);
  const [sharedGalleries, setSharedGalleries] = useState<PrivateGalleryAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [isZipping, setIsZipping] = useState(false);

  useEffect(() => {
    if (!isCustomerAuthenticated || !customer) {
      navigate('/login');
      return;
    }

    async function loadCustomerData() {
      setLoading(true);
      try {
        // Load favorite photos
        const allPhotos = await photoService.getByEventId('ev-1');
        const userSavedSet = new Set(customer?.savedPhotoIds || ['ph-101', 'ph-301', 'ph-801']);
        setFavoritePhotos(allPhotos.filter((p) => userSavedSet.has(p.id)));

        // Load shared private galleries
        const privates = await privateGalleryService.getAll();
        setSharedGalleries(privates);
      } finally {
        setLoading(false);
      }
    }

    loadCustomerData();
  }, [customer, isCustomerAuthenticated, navigate]);

  const handleLogout = () => {
    logoutCustomer();
    navigate('/');
  };

  const handleDownloadAllFavorites = async () => {
    if (favoritePhotos.length === 0) return;
    setIsZipping(true);
    try {
      await downloadPhotosAsZip(favoritePhotos, `${customer?.name || 'Customer'}_Saved_Favorites.zip`);
    } finally {
      setIsZipping(false);
    }
  };

  if (!customer) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-editorial text-2xl font-bold shadow-xs">
            {customer.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#171717]">
                {customer.name}
              </h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Lumina Customer
              </span>
            </div>
            <p className="text-xs text-[#737373] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span>{customer.email}</span>
              {customer.phone && <span>• {customer.phone}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Link
            to="/discover"
            className="px-4 py-2 rounded-xl border border-[#D5D5CF] bg-white text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-xs"
          >
            Explore Public Events
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#EAEAE6] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'favorites'
              ? 'bg-[#171717] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>My Saved Photographs ({favoritePhotos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shared')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'shared'
              ? 'bg-[#171717] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Shared Private Galleries ({sharedGalleries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('downloads')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'downloads'
              ? 'bg-[#171717] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download History</span>
        </button>
      </div>

      {/* Tab 1: Saved Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-editorial text-xl font-bold text-[#171717]">
                Saved Photographs
              </h2>
              <p className="text-xs text-[#737373]">
                Photographs you favorited while browsing campus festivals and wedding albums.
              </p>
            </div>

            {favoritePhotos.length > 0 && (
              <button
                onClick={handleDownloadAllFavorites}
                disabled={isZipping}
                className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-transform active:scale-95 disabled:opacity-50"
              >
                <Archive className="w-4 h-4" />
                <span>{isZipping ? 'Compressing ZIP...' : 'Download All Favorites (ZIP)'}</span>
              </button>
            )}
          </div>

          {favoritePhotos.length > 0 ? (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {favoritePhotos.map((photo, index) => (
                <div key={photo.id} className="break-inside-avoid">
                  <PhotoCard
                    photo={photo}
                    index={index}
                    allPhotos={favoritePhotos}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E8E3] p-8 space-y-3">
              <Heart className="w-10 h-10 text-stone-300 mx-auto stroke-1" />
              <h3 className="font-editorial text-lg font-bold text-[#171717]">No saved favorites yet</h3>
              <p className="text-xs text-[#737373] max-w-sm mx-auto">
                Click the heart icon on any photo while viewing an event gallery to save it to your personal collection.
              </p>
              <Link
                to="/discover"
                className="inline-block mt-2 px-4 py-2 rounded-xl bg-[#171717] text-white text-xs font-semibold"
              >
                Browse Events Now
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Shared Private Galleries */}
      {activeTab === 'shared' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-editorial text-xl font-bold text-[#171717]">
              Shared Private Galleries
            </h2>
            <p className="text-xs text-[#737373]">
              Private family and wedding albums linked to your invitation credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sharedGalleries.map((gal) => (
              <div
                key={gal.id}
                className="bg-white rounded-2xl border border-[#E8E8E3] p-5 shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Unlocked Client Portal</span>
                  </div>
                  <h3 className="font-editorial text-lg font-bold text-[#171717] line-clamp-2">
                    {gal.eventTitle}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Client: <strong className="text-stone-800">{gal.clientName}</strong>
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Passcode: <span className="font-mono font-bold text-stone-700">{gal.accessCode}</span>
                  </p>
                </div>

                <Link
                  to={`/private-access?code=${gal.accessCode}`}
                  className="w-full py-2 px-3 rounded-xl bg-[#171717] hover:bg-[#333] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>Open Private Album</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Download History */}
      {activeTab === 'downloads' && (
        <div className="bg-white rounded-2xl border border-[#E8E8E3] shadow-xs p-6 space-y-4">
          <div>
            <h2 className="font-editorial text-xl font-bold text-[#171717]">
              Recent Downloads
            </h2>
            <p className="text-xs text-[#737373]">
              Logs of full ZIP album bundles and high-resolution photo exports.
            </p>
          </div>

          <div className="divide-y divide-[#F0F0EB] text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-900">VIVA 2026 — Annual Cultural Festival (Selected Photos ZIP)</p>
                <p className="text-[11px] text-stone-500">24 photographs • 115 MB</p>
              </div>
              <span className="text-stone-500">Feb 16, 2026</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-900">Sai Teja & Yamini Wedding Reception (Full Album ZIP)</p>
                <p className="text-[11px] text-stone-500">22 photographs • 128 MB</p>
              </div>
              <span className="text-stone-500">Jan 22, 2026</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-900">VRSEC Convocation Class of 2026 (Cap Toss High-Res JPG)</p>
                <p className="text-[11px] text-stone-500">1 photograph • 4.6 MB</p>
              </div>
              <span className="text-stone-500">Jan 31, 2026</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
