import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Sparkles,
  Users
} from 'lucide-react';

const inquirySchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  eventType: z.enum([
    'college_fest',
    'convocation',
    'wedding',
    'anniversary',
    'birthday',
    'private_event',
  ]),
  collegeOrVenue: z.string().min(2, 'Campus or venue name is required'),
  eventDate: z.string().min(1, 'Date is required'),
  guestCount: z.string().optional(),
  message: z.string().min(10, 'Please share a brief note about your event'),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

export const AboutContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      eventType: 'college_fest',
      collegeOrVenue: '',
      eventDate: '',
      guestCount: '500-1000',
      message: '',
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    // Simulated inquiry submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Inquiry submitted:', data);
    setSubmitted(true);
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Studio Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-[#EAEAE6] pb-16">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Editorial Photography & Archival Platform</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl font-bold text-[#171717] tracking-tight leading-[1.12]">
            Crafting Timeless Visual Chronicles Since 2018.
          </h1>

          <p className="text-base sm:text-lg text-[#666] leading-relaxed font-light">
            Lumina Studios is an editorial visual collective founded by senior photographer Rakesh Verma. We specialize in dynamic collegiate festivals, academic graduation galas, regal heritage weddings, and high-profile private celebrations.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#EAEAE6]">
            <div>
              <span className="font-editorial text-3xl font-bold text-[#171717]">120K+</span>
              <p className="text-xs text-[#737373] mt-0.5">Photos Delivered</p>
            </div>
            <div>
              <span className="font-editorial text-3xl font-bold text-[#171717]">50+</span>
              <p className="text-xs text-[#737373] mt-0.5">Universities Covered</p>
            </div>
            <div>
              <span className="font-editorial text-3xl font-bold text-[#171717]">99.8%</span>
              <p className="text-xs text-[#737373] mt-0.5">Client Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Studio Lead Visual */}
        <div className="lg:col-span-5 relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-stone-200 aspect-[4/5] bg-stone-100">
            <img
              src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1000&auto=format&fit=crop&q=85"
              alt="Studio Lead Rakesh Verma"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-[#171717] text-white p-4 rounded-2xl shadow-xl border border-neutral-700">
            <p className="text-xs font-bold">Rakesh Verma</p>
            <p className="text-[10px] text-neutral-400">Founder & Principal Cinematographer</p>
          </div>
        </div>
      </div>

      {/* Equipment & Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl bg-white border border-[#E8E8E3] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Camera className="w-6 h-6 stroke-[1.75]" />
          </div>
          <h3 className="font-editorial text-xl font-bold text-[#171717]">Flagship Gear Suite</h3>
          <p className="text-xs text-[#737373] leading-relaxed">
            Sony Alpha 1 & A7R V flagship bodies paired with G-Master prime lenses (35mm f/1.4, 50mm f/1.2, 85mm f/1.2) for low-light stage brilliance.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-[#E8E8E3] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
          </div>
          <h3 className="font-editorial text-xl font-bold text-[#171717]">Direct Cloudflare R2 Delivery</h3>
          <p className="text-xs text-[#737373] leading-relaxed">
            Ultra-fast lossless downloads powered by Cloudflare edge networks, delivering thousands of simultaneous high-speed downloads without buffering.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-[#E8E8E3] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Award className="w-6 h-6 stroke-[1.75]" />
          </div>
          <h3 className="font-editorial text-xl font-bold text-[#171717]">Dual Crew Multi-Angle Coverage</h3>
          <p className="text-xs text-[#737373] leading-relaxed">
            Full-day dedicated teams capturing stage performances, candid student interactions, crowd emotions, and formal dignitary felicitations.
          </p>
        </div>
      </div>

      {/* Booking Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-3xl border border-[#E8E8E3] p-8 sm:p-12 shadow-xl">
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Book Our Studio
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#171717]">
              Let’s Capture Your Celebration.
            </h2>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
              Fill out the inquiry form to check our studio schedule, request coverage packages, or discuss customized gallery portals for your campus.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#EAEAE6] text-xs">
            <div className="flex items-center gap-3 text-stone-700">
              <Mail className="w-4 h-4 text-indigo-600" />
              <a href="mailto:hello@luminastudios.com" className="font-semibold hover:underline">
                hello@luminastudios.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-stone-700">
              <Phone className="w-4 h-4 text-indigo-600" />
              <span>+91 (022) 8920-4300 / +91 98201 44520</span>
            </div>
            <div className="flex items-start gap-3 text-stone-700">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>Lumina Creative Atelier, 4th Floor, Worli Sea Face, Mumbai 400030</span>
            </div>
          </div>
        </div>

        {/* The Form */}
        <div className="lg:col-span-7">
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-editorial text-2xl font-bold text-emerald-900">
                Inquiry Received!
              </h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out to Lumina Studios. Rakesh Verma and the studio operations team will review your dates and respond within 24 hours with package pricing.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    {...register('fullName')}
                    placeholder="Aditya Mehta"
                    className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-[#171717]"
                  />
                  {errors.fullName && <span className="text-rose-500 mt-1 block">{errors.fullName.message}</span>}
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="aditya@example.com"
                    className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-[#171717]"
                  />
                  {errors.email && <span className="text-rose-500 mt-1 block">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-[#171717]"
                  />
                  {errors.phone && <span className="text-rose-500 mt-1 block">{errors.phone.message}</span>}
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Event Type *</label>
                  <select
                    {...register('eventType')}
                    className="w-full p-2.5 rounded-xl border border-[#D5D5CF] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-[#171717]"
                  >
                    <option value="college_fest">College Cultural Festival</option>
                    <option value="convocation">Graduation & Convocation</option>
                    <option value="wedding">Wedding & Sangeet</option>
                    <option value="anniversary">Anniversary Celebration</option>
                    <option value="birthday">Birthday Milestone</option>
                    <option value="private_event">Private Gala / Family</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-stone-700 block mb-1">College or Venue Location *</label>
                  <input
                    type="text"
                    {...register('collegeOrVenue')}
                    placeholder="e.g. St. Xavier’s College, Mumbai"
                    className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-[#171717]"
                  />
                  {errors.collegeOrVenue && <span className="text-rose-500 mt-1 block">{errors.collegeOrVenue.message}</span>}
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Target Date *</label>
                  <input
                    type="date"
                    {...register('eventDate')}
                    className="w-full p-2.5 rounded-xl border border-[#D5D5CF] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-[#171717]"
                  />
                  {errors.eventDate && <span className="text-rose-500 mt-1 block">{errors.eventDate.message}</span>}
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Event Details & Specific Requirements *</label>
                <textarea
                  rows={4}
                  {...register('message')}
                  placeholder="Tell us about the schedule, expected attendee count, key headliners, and whether you require on-site instant delivery or online gallery hosting..."
                  className="w-full p-2.5 rounded-xl border border-[#D5D5CF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-[#171717]"
                />
                {errors.message && <span className="text-rose-500 mt-1 block">{errors.message.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#171717] hover:bg-[#333] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-indigo-400" />
                <span>{isSubmitting ? 'Sending Inquiry...' : 'Submit Coverage Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
