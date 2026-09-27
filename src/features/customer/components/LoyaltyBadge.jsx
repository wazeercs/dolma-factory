import React, { useEffect, useMemo, useState } from 'react';
import {
  getLoyaltyInfo,
  TIER_LABELS,
  TIER_COLORS,
} from '../../../services/supabase/loyalty';

export default function LoyaltyBadge({
  phone,
  cartTotal,
  couponDiscount = 0,
  selectedPoints = 0,
  onPointsChange,
}) {
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!phone || phone.length < 10) {
      setLoyalty(null);
      onPointsChange?.(0);
      return;
    }

    setLoading(true);

    getLoyaltyInfo(phone)
      .then((data) => setLoyalty(data))
      .catch(() => setLoyalty(null))
      .finally(() => setLoading(false));
  }, [phone, onPointsChange]);

  const maxByCart = useMemo(() => {
    const remaining =
      Math.max(
        0,
        Number(cartTotal || 0) -
        Number(couponDiscount || 0)
      );

    return Math.floor((remaining * 10) / 50) * 50;
  }, [cartTotal, couponDiscount]);

  const maxUsable = Math.min(
    Math.floor(Number(loyalty?.points || 0) / 50) * 50,
    maxByCart
  );

  const selected = Math.min(
    Number(selectedPoints || 0),
    maxUsable
  );

  useEffect(() => {
    if (selectedPoints !== selected) {
      onPointsChange?.(selected);
    }
  }, [selectedPoints, selected, onPointsChange]);

  if (loading) {
    return (
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 text-center text-xs text-purple-700 dark:text-purple-300">
        ⏳ جاري التحقق من نقاطك...
      </div>
    );
  }

  if (!loyalty || !loyalty.exists) {
    return null;
  }

  const canUse = maxUsable >= 50;

  return (
    <div className="bg-gradient-to-l from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-3">

      <div className="flex justify-between items-center mb-2">

        <div className="flex items-center gap-2">
          <span className="text-2xl">🎁</span>

          <div>
            <p className="font-black text-sm text-gray-800 dark:text-white">
              نقاط الولاء
            </p>

            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                TIER_COLORS[loyalty.tier] ||
                TIER_COLORS.bronze
              }`}
            >
              {TIER_LABELS[loyalty.tier] ||
                TIER_LABELS.bronze}
            </span>
          </div>
        </div>

        <div className="text-left">
          <p className="text-2xl font-black text-purple-700 dark:text-purple-300 num-ltr">
            {loyalty.points}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            نقطة
          </p>
        </div>

      </div>

      {canUse ? (
        <button
          type="button"
          onClick={() =>
            onPointsChange?.(
              selected === maxUsable
                ? 0
                : maxUsable
            )
          }
          className={`w-full py-2.5 rounded-lg font-bold text-sm transition-transform active:scale-95 ${
            selected > 0
              ? 'bg-green-600 text-white'
              : 'bg-purple-700 hover:bg-purple-800 text-white'
          }`}
        >
          {selected > 0
            ? `✅ تم اختيار ${selected} نقطة (خصم ${selected / 10} ريال)`
            : `🎉 استخدم ${maxUsable} نقطة (خصم ${maxUsable / 10} ريال)`}
        </button>
      ) : (
        <p className="text-xs text-center text-purple-600 dark:text-purple-400 font-bold">
          💡 تحتاج 50 نقطة على الأقل لاستخدام النقاط
        </p>
      )}

    </div>
  );
}
