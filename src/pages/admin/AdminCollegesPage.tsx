import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  GraduationCap, 
  MapPin, 
  ExternalLink,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CollegeModal } from '@/components/admin/CollegeModal';
import { collegeService } from '@/services/collegeService';
import { eventService } from '@/services/eventService';
import { College, EventGallery } from '@/types';

export const AdminCollegesPage: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [events, setEvents] = useState<EventGallery[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [colList, evList] = await Promise.all([
        collegeService.getAll(),
        eventService.getAll({ includePrivate: true }),
      ]);
      setColleges(colList);
      setEvents(evList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingCollege(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (col: College) => {
    setEditingCollege(col);
    setModalOpen(true);
  };

  const handleSave = async (formData: any) => {
    if (editingCollege) {
      await collegeService.update(editingCollege.id, formData);
    } else {
      await collegeService.create(formData);
    }
    await loadData();
  };

  const handleDelete = async (id: string) => {
    await collegeService.delete(id);
    setDeleteId(null);
    await loadData();
  };

  const filtered = colleges.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <AdminHeader
        title="College & University Directory"
        subtitle="Manage academic institutions, campuses, and view all covered festivals."
        action={
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-[#333] text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Add New College</span>
          </button>
        }
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8E8E3] shadow-xs max-w-md">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search partner universities by name or city..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
            />
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Colleges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((col) => {
            const colEvents = events.filter((e) => e.collegeId === col.id);
            return (
              <div
                key={col.id}
                className="bg-white rounded-2xl border border-[#E8E8E3] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Banner */}
                  <div className="relative h-32 overflow-hidden bg-stone-100">
                    <img src={col.bannerUrl} alt={col.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-3">
                      <img
                        src={col.logoUrl}
                        alt={col.name}
                        className="w-10 h-10 rounded-lg object-cover bg-white p-0.5 border border-white/80 shadow-md"
                      />
                      <span className="text-white text-xs font-bold font-editorial">{col.name}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#737373]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        {col.location}
                      </span>
                      <span>Est. {col.establishedYear}</span>
                    </div>

                    <p className="text-xs text-[#666] line-clamp-2 leading-relaxed">
                      {col.description}
                    </p>

                    {/* Associated Events List */}
                    <div className="pt-2 border-t border-[#F0F0EB] space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                        Associated Events ({colEvents.length}):
                      </span>
                      {colEvents.length > 0 ? (
                        <div className="space-y-1">
                          {colEvents.slice(0, 2).map((ev) => (
                            <Link
                              key={ev.id}
                              to={`/events/${ev.slug || ev.id}`}
                              target="_blank"
                              className="text-xs text-indigo-600 hover:underline truncate block"
                            >
                              • {ev.title}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-stone-400">No events linked yet</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-stone-50 border-t border-[#EAEAE6] flex items-center justify-between">
                  <Link
                    to={`/colleges`}
                    target="_blank"
                    className="text-xs font-semibold text-stone-700 hover:text-black flex items-center gap-1"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(col)}
                      className="p-1.5 text-stone-600 hover:text-black rounded-lg hover:bg-stone-200"
                      title="Edit College"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(col.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Delete College"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* College Modal */}
      <CollegeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingCollege}
      />

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl border border-[#E8E8E3]">
            <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
            <h3 className="font-editorial text-lg font-bold text-[#171717]">
              Delete College Partner?
            </h3>
            <p className="text-xs text-[#737373]">
              Are you sure you want to remove this institution? Associated events will have their college set to unassigned.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl border border-[#D5D5CF] text-xs font-semibold text-stone-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
