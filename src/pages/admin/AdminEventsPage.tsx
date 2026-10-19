import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Calendar, 
  Image as ImageIcon,
  Check,
  AlertTriangle
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { EventModal } from '@/components/admin/EventModal';
import { eventService } from '@/services/eventService';
import { collegeService } from '@/services/collegeService';
import { EventGallery, College } from '@/types';
import { formatDate, getCategoryLabel, getCategoryBadgeClass, formatNumber } from '@/utils/formatters';

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventGallery[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventGallery | null>(null);

  // Delete confirm state
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [evList, colList] = await Promise.all([
        eventService.getAll({ includePrivate: true }),
        collegeService.getAll(),
      ]);
      setEvents(evList);
      setColleges(colList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (ev: EventGallery) => {
    setEditingEvent(ev);
    setModalOpen(true);
  };

  const handleSaveEvent = async (formData: any) => {
    const col = colleges.find((c) => c.id === formData.collegeId);
    const collegeName = col ? col.name : undefined;

    if (editingEvent) {
      await eventService.update(editingEvent.id, {
        ...formData,
        collegeName,
        year: new Date(formData.date).getFullYear(),
      });
    } else {
      await eventService.create({
        ...formData,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        collegeName,
        year: new Date(formData.date).getFullYear(),
        totalPhotos: 16,
      });
    }
    await loadData();
  };

  const handleTogglePublish = async (ev: EventGallery) => {
    const nextStatus = ev.status === 'published' ? 'draft' : 'published';
    await eventService.update(ev.id, { status: nextStatus });
    await loadData();
  };

  const handleDelete = async (id: string) => {
    await eventService.delete(id);
    setDeleteEventId(null);
    await loadData();
  };

  const filteredEvents = events.filter((ev) => {
    const matchSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.collegeName?.toLowerCase().includes(search.toLowerCase()) ||
      ev.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'all' || ev.category === selectedCategory;
    const matchStatus = statusFilter === 'all' || ev.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div>
      <AdminHeader
        title="Event Galleries Management"
        subtitle="Create, configure, publish, and manage college festival and private albums."
        action={
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-[#333] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Create New Event</span>
          </button>
        }
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8E8E3] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by event title, college, or location..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
            />
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 rounded-xl border border-[#D5D5CF] bg-white text-xs"
            >
              <option value="all">All Categories</option>
              <option value="college_fest">College Fest</option>
              <option value="convocation">Convocation</option>
              <option value="cultural_event">Cultural Gala</option>
              <option value="wedding">Wedding</option>
              <option value="anniversary">Anniversary</option>
              <option value="birthday">Birthday</option>
              <option value="private_event">Private Event</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 rounded-xl border border-[#D5D5CF] bg-white text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-2xl border border-[#E8E8E3] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF8] border-b border-[#EAEAE6] text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Cover & Event Title</th>
                  <th className="py-3.5 px-4">Campus / Category</th>
                  <th className="py-3.5 px-4">Event Date</th>
                  <th className="py-3.5 px-4">Photos</th>
                  <th className="py-3.5 px-4">Views & Downloads</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0EB]">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-stone-50/50 transition-colors">
                    {/* Title */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={ev.coverPhotoUrl}
                          alt={ev.title}
                          className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-stone-900 truncate">{ev.title}</p>
                          <p className="text-[11px] text-stone-500 truncate">{ev.location}</p>
                          {ev.isPrivate && (
                            <span className="text-[10px] text-amber-700 font-semibold font-mono">
                              PASSCODE: {ev.privateAccessCode || 'PROTECTED'}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* College & Category */}
                    <td className="py-4 px-4">
                      <span className="font-semibold text-stone-800 block">
                        {ev.collegeName || 'Private Event'}
                      </span>
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border mt-1 ${getCategoryBadgeClass(ev.category)}`}>
                        {getCategoryLabel(ev.category)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-stone-600">
                      {formatDate(ev.date)}
                    </td>

                    {/* Photos Count */}
                    <td className="py-4 px-4 font-mono font-medium text-stone-800">
                      {ev.totalPhotos} photos
                    </td>

                    {/* Views & Downloads */}
                    <td className="py-4 px-4 text-stone-600">
                      <div>{formatNumber(ev.viewCount)} views</div>
                      <div className="text-[11px] text-stone-500">{formatNumber(ev.downloadCount)} downloads</div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleTogglePublish(ev)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all border ${
                          ev.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                        }`}
                        title="Click to toggle published / draft status"
                      >
                        {ev.status === 'published' ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-stone-500" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/events/${ev.slug || ev.id}`}
                          target="_blank"
                          className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                          title="Open Live Public Gallery"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(ev)}
                          className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteEventId(ev.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Delete Event"
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

      {/* Event Create / Edit Modal */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        initialData={editingEvent}
        colleges={colleges}
      />

      {/* Delete Confirmation Alert */}
      {deleteEventId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl border border-[#E8E8E3]">
            <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
            <h3 className="font-editorial text-lg font-bold text-[#171717]">
              Delete Event Gallery?
            </h3>
            <p className="text-xs text-[#737373]">
              Are you sure you want to delete this event and its photo references? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteEventId(null)}
                className="px-4 py-2 rounded-xl border border-[#D5D5CF] text-xs font-semibold text-stone-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteEventId)}
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
