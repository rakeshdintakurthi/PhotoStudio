import React, { useState } from 'react';
import { Mail, Phone, Calendar, MapPin, CheckCircle2, Clock, Users, ArrowUpRight } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { formatDate } from '@/utils/formatters';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  venue: string;
  date: string;
  status: 'new' | 'contacted' | 'quoted' | 'booked';
  notes: string;
}

const INITIAL_LEADS: Lead[] = [
  {
    id: 'ld-1',
    name: 'Aditya Mehta (Cultural Secy)',
    email: 'aditya.mehta@stxaviers.edu',
    phone: '+91 98201 44810',
    eventType: 'College Fest (Malhar 2025)',
    venue: "St. Xavier's College, Mumbai",
    date: '2025-08-15',
    status: 'new',
    notes: 'Requested dual crew team for pro-nites and 24h turnaround for media press release photos.',
  },
  {
    id: 'ld-2',
    name: 'Ananya & Rohan Deshmukh',
    email: 'ananya.deshmukh@gmail.com',
    phone: '+91 99302 11940',
    eventType: 'Heritage Palace Wedding',
    venue: 'Taj Lake Palace, Udaipur',
    date: '2025-02-18',
    status: 'quoted',
    notes: '3-day celebration covering Mehendi, Sangeet, and Sunset Pheras. Requires private protected album for 300 guests.',
  },
  {
    id: 'ld-3',
    name: 'Prof. S. Ranganathan (Dean)',
    email: 'dean.acad@iitb.ac.in',
    phone: '+91 (022) 2576-7000',
    eventType: 'Convocation Ceremony Class of 2025',
    venue: 'Convocation Hall, IIT Bombay',
    date: '2025-09-02',
    status: 'booked',
    notes: 'Official institutional contract renewed for class of 2025 graduates.',
  },
];

export const AdminCustomersPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);

  const updateStatus = (id: string, newStatus: Lead['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
  };

  return (
    <div>
      <AdminHeader
        title="Customers & Inquiries"
        subtitle="Manage booking inquiries from college cultural committees, wedding planners, and private hosts."
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="bg-white rounded-2xl border border-[#E8E8E3] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#EAEAE6]">
            <h3 className="font-editorial text-lg font-bold text-[#171717]">
              Recent Booking Inquiries ({leads.length})
            </h3>
            <p className="text-xs text-[#737373]">
              Review upcoming event coverage requests and track quotation status.
            </p>
          </div>

          <div className="divide-y divide-[#F0F0EB]">
            {leads.map((lead) => (
              <div key={lead.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-stone-900 text-sm">{lead.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        lead.status === 'booked'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : lead.status === 'quoted'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-indigo-600">{lead.eventType}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#737373] pt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>{lead.phone}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{lead.venue}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{formatDate(lead.date)}</span>
                    </span>
                  </div>

                  <p className="text-xs text-[#666] pt-1 bg-stone-50 p-2.5 rounded-lg border border-[#EAEAE6]">
                    <strong>Note:</strong> {lead.notes}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value as Lead['status'])}
                    className="p-2 text-xs rounded-lg border border-[#D5D5CF] bg-white font-semibold text-stone-800"
                  >
                    <option value="new">Mark New</option>
                    <option value="contacted">Mark Contacted</option>
                    <option value="quoted">Mark Quoted</option>
                    <option value="booked">Mark Booked</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
