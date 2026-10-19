import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Lock, 
  Copy, 
  Check, 
  KeyRound, 
  Calendar, 
  ShieldCheck, 
  ShieldAlert, 
  ExternalLink, 
  Edit, 
  Trash2,
  RefreshCw
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PrivateGalleryModal } from '@/components/admin/PrivateGalleryModal';
import { privateGalleryService } from '@/services/privateGalleryService';
import { eventService } from '@/services/eventService';
import { PrivateGalleryAccess, EventGallery } from '@/types';
import { formatDate, formatNumber } from '@/utils/formatters';

export const AdminPrivateGalleriesPage: React.FC = () => {
  const [galleries, setGalleries] = useState<PrivateGalleryAccess[]>([]);
  const [events, setEvents] = useState<EventGallery[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PrivateGalleryAccess | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = async () => {
    const [pList, eList] = await Promise.all([
      privateGalleryService.getAll(),
      eventService.getAll({ includePrivate: true }),
    ]);
    setGalleries(pList);
    setEvents(eList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: PrivateGalleryAccess) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSave = async (formData: any) => {
    if (editingItem) {
      await privateGalleryService.update(editingItem.id, formData);
    } else {
      await privateGalleryService.create(formData);
    }
    await loadData();
  };

  const handleToggleActive = async (item: PrivateGalleryAccess) => {
    await privateGalleryService.update(item.id, { isActive: !item.isActive });
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this private gallery link?')) {
      await privateGalleryService.delete(id);
      await loadData();
    }
  };

  const handleCopyLink = (item: PrivateGalleryAccess) => {
    const link = `${window.location.origin}/private-access?code=${item.accessCode}`;
    navigator.clipboard.writeText(link);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div>
      <AdminHeader
        title="Private & Client Galleries"
        subtitle="Generate confidential client portals, manage encryption passcodes, and monitor client download permissions."
        action={
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-[#333] text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Generate Private Link</span>
          </button>
        }
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="bg-white rounded-2xl border border-[#E8E8E3] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#EAEAE6] flex items-center justify-between">
            <div>
              <h3 className="font-editorial text-lg font-bold text-[#171717]">
                Active Client Access Portals ({galleries.length})
              </h3>
              <p className="text-xs text-[#737373]">
                Private albums are hidden from public search and require the assigned passcode to open.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF8] border-b border-[#EAEAE6] text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Client & Event Title</th>
                  <th className="py-3.5 px-4">Passcode</th>
                  <th className="py-3.5 px-4">Expiration</th>
                  <th className="py-3.5 px-4">Activity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0EB]">
                {galleries.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                    {/* Client & Title */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-stone-900">{item.clientName}</p>
                        <p className="text-[11px] text-stone-500">{item.clientEmail}</p>
                        <p className="text-xs text-indigo-600 font-medium mt-1">{item.eventTitle}</p>
                      </div>
                    </td>

                    {/* Passcode */}
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 font-mono font-bold text-stone-800 tracking-wider">
                        <KeyRound className="w-3.5 h-3.5 text-stone-500" />
                        <span>{item.accessCode}</span>
                      </div>
                    </td>

                    {/* Expiration */}
                    <td className="py-4 px-4 text-stone-600">
                      {item.expiresAt ? (
                        <span className="flex items-center gap-1 text-stone-600">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {formatDate(item.expiresAt)}
                        </span>
                      ) : (
                        <span className="text-stone-400">Never expires</span>
                      )}
                    </td>

                    {/* Activity */}
                    <td className="py-4 px-4 text-stone-600">
                      <div>{formatNumber(item.totalViews)} views</div>
                      <div className="text-[11px] text-stone-500">{formatNumber(item.totalDownloads)} downloads</div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                          item.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-rose-50 hover:text-rose-700'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                        title="Click to toggle access permission"
                      >
                        {item.isActive ? (
                          <>
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            <span>Revoked</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCopyLink(item)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center gap-1 transition-colors"
                          title="Copy direct client link"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PrivateGalleryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingItem}
        events={events}
      />
    </div>
  );
};
