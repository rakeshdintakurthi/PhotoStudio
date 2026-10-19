import React from 'react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="bg-white border-b border-[#E8E8E3] px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-20">
      <div>
        <h1 className="font-editorial text-2xl font-bold text-[#171717] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-[#737373] mt-0.5 font-normal">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
};
