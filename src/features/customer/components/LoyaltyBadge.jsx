import React, { useState, useEffect } from 'react';
import { getLoyaltyInfo, redeemPoints, TIER_LABELS, TIER_COLORS } from '../../../services/supabase/loyalty';
import { useToast } from '../../../components/Toast';

export default function LoyaltyBadge({ phone, cartTotal, onDiscountChange }) {
  const toast = useToast();
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (!phone || phone.length < 10) {
      setLoyalty(null);
      return;
    }

    setLoading(true);
    getLoyaltyInfo(phone)
      .then(setLoyalty)
      .catch(() => setLoyalty(null))
      .finally(() => setLoading(false));
  }, [phone]);

  const handleRedeem = async () => {
    if (!loyalty || loyalty.points < 50) return;

    // أقصى نقاط ممكن استخدامها (مضاعفات 50)
    const maxUsable = Math.min(
      Math.floor(loyalty.points / 50) * 50,
      Math.floor(cartTotal * 10 / 50) * 50 // لا نتجاوز قيمة الطلب
    );

    if (maxUsable < 50) {
      toast.warning('لا يمكن استخدام النقاط على هذا الطلب');
      return;
    }

    setRedeeming(true);
    try {
      const result = await redeemPoints(phone, maxUsable);
      if (result.success) {
        const discount = result.discount_amount;
        toast.success(`تم خصم ${discount} ريال من نقاطك 🎉`);
        setLoyalty({ ...loyalty, points: loyalty.points - maxUsable });
        onDiscountChange(discount);
      }
    } catch (err) {
      toast.error(err.message || 'فشل استخدام النقاط');
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 text-center text-xs text-purple-700 dark:text-purple-300">
        ⏳ جاري التحقق من نقاطك...
      </div>
    );
  }

  if (!loyalty || !loyalty.exists) {
    return null; // لا نعرض شيء للعملاء الجدد
  }

  const canRedeem = loyalty.points >= 50;

  return (
    <div className="bg-gradient-to-l from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎁</span>
          <div>
            <p className="font-black text-sm text-gray-800 dark:text-white">نقاط الولاء</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TIER_COLORS[loyalty.tier] || TIER_COLORS.bronze}`}>
              {TIER_LABELS[loyalty.tier] || TIER_LABELS.bronze}
            </span>
          </div>
        </div>
        <div className="text-left">
          <p className="text-2xl font-black text-purple-700 dark:text-purple-300 num-ltr">
            {loyalty.points}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">نقطة</p>
        </div>
      </div>

      {canRedeem ? (
        <button
          onClick={handleRedeem}
          disabled={redeeming}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2.5 rounded-lg font-bold text-sm active:scale-95 transition-transform disabled:opacity-50"
        >
          {redeeming ? '⏳ جاري...' : `🎉 استخدم ${Math.floor(loyalty.points / 50) * 50} نقطة (خصم ${Math.floor(loyalty.points / 50) * 5} ريال)`}
        </button>
      ) : (
        <p className="text-xs text-center text-purple-600 dark:text-purple-400 font-bold">
          💡 تحتاج {50 - loyalty.points} نقطة إضافية للحصول على خصم 5 ريال
        </p>
      )}
    </div>
  );
}
