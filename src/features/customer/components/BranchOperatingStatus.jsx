import React from 'react';

const STATUS_TEXT = {
  OPEN: 'المطعم مفتوح',
  BUSY: 'المطعم يشهد ضغطًا مرتفعًا',
  VERY_BUSY: 'المطعم يشهد ضغطًا مرتفعًا جدًا',
  CLOSED: 'المطعم مغلق حاليًا',
  PAUSED: 'استقبال الطلبات متوقف مؤقتًا',
};

export default function BranchOperatingStatus({ branch }) {
  if (!branch) return null;

  const status = branch.operating_status || 'OPEN';

  const hasNotice =
    status !== 'OPEN' ||
    branch.preparation_time_min > 15 ||
    !branch.delivery_enabled ||
    !branch.pickup_enabled ||
    !branch.promotions_enabled;

  if (!hasNotice) return null;

  const time =
    branch.preparation_time_min != null &&
    branch.preparation_time_max != null
      ? `${branch.preparation_time_min}–${branch.preparation_time_max} دقيقة`
      : null;

  return (
    <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 p-4">
      <p className="font-black text-amber-900 dark:text-amber-200">
        {STATUS_TEXT[status] || 'حالة المطعم'}
      </p>

      {time && status !== 'CLOSED' && (
        <p className="text-sm mt-1 text-amber-800 dark:text-amber-300">
          وقت التجهيز المتوقع: {time}
        </p>
      )}

      {branch.pause_reason && (status === 'PAUSED' || status === 'CLOSED') && (
        <p className="text-sm mt-1 text-amber-800 dark:text-amber-300">
          {branch.pause_reason}
        </p>
      )}

      {!branch.delivery_enabled && (
        <p className="text-sm mt-2">التوصيل غير متاح حاليًا.</p>
      )}

      {!branch.pickup_enabled && (
        <p className="text-sm">الاستلام من الفرع غير متاح حاليًا.</p>
      )}

      {branch.resume_at && (status === 'PAUSED' || status === 'CLOSED') && (
        <p className="text-sm mt-1">
          العودة المتوقعة:{' '}
          {new Date(branch.resume_at).toLocaleString('ar-SA')}
        </p>
      )}
    </div>
  );
}
