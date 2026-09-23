import React from 'react';

export default function CheckoutSheet({
  cartTotal, discountAmount, grandTotal,
  name, phone, phoneError, onNameChange, onPhoneChange,
  orderType, onOrderTypeChange,
  deliveryLocation, deliveryAddress, onDeliveryAddressChange,
  locationLoading, locationError, onLocateMe,
  payMethod, onPayChange, couponCode, onCouponCodeChange,
  appliedCoupon, couponLoading, onApplyCoupon, onRemoveCoupon,
  submitting, onSubmit, onClose, branchName,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-3xl max-h-[92vh] flex flex-col">
        <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-800 dark:text-white">إتمام الطلب</h2>
          <button onClick={onClose} className="text-2xl text-gray-700 dark:text-gray-200">✕</button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 no-scrollbar space-y-4">
          <div>
            <label className="font-bold text-gray-700 dark:text-gray-200 text-sm block mb-2">نوع الطلب:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onOrderTypeChange('delivery')}
                className={`p-3 rounded-xl border-2 font-bold ${
                  orderType === 'delivery'
                    ? 'bg-teal-700 text-white border-teal-700'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200'
                }`}
              >
                🚗 توصيل
              </button>
              <button
                onClick={() => onOrderTypeChange('pickup')}
                className={`p-3 rounded-xl border-2 font-bold ${
                  orderType === 'pickup'
                    ? 'bg-teal-700 text-white border-teal-700'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200'
                }`}
              >
                🏪 استلام
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 dark:text-gray-200 text-sm block mb-2">الاسم:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="اسمك الكامل"
              className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-teal-600 outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 dark:text-gray-200 text-sm block mb-2">رقم الجوال:</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="05xxxxxxxx"
              dir="ltr"
              className={`w-full p-3 rounded-xl border-2 outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white ${
                phoneError ? 'border-red-400' : 'border-gray-200 dark:border-gray-600 focus:border-teal-600'
              }`}
            />
            {phoneError && <p className="text-red-500 text-xs mt-1 font-bold">⚠️ {phoneError}</p>}
            {!phoneError && phone.length > 0 && (
              <p className="text-green-600 dark:text-green-400 text-xs mt-1 font-bold">✓ رقم صحيح</p>
            )}
          </div>

          {orderType === 'delivery' && (
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-200 text-sm block mb-2">موقع التوصيل:</label>
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">📍</span>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-bold">{branchName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      حدد موقعك الحالي ليتم حساب نطاق ورسوم التوصيل تلقائياً
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onLocateMe}
                  disabled={locationLoading}
                  className="w-full p-3 rounded-xl bg-teal-700 text-white font-bold disabled:opacity-60"
                >
                  {locationLoading ? '⏳ جاري تحديد الموقع...' : deliveryLocation ? '✅ تم تحديد موقعي' : '📍 تحديد موقعي الحالي'}
                </button>

                {deliveryLocation && (
                  <p className="text-xs text-green-700 dark:text-green-300 mt-2 font-bold">
                    تم حفظ الإحداثيات بنجاح
                  </p>
                )}

                {locationError && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-bold">
                    ⚠️ {locationError}
                  </p>
                )}

                <div className="mt-3">
                  <label className="font-bold text-gray-700 dark:text-gray-200 text-xs block mb-2">
                    وصف العنوان:
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => onDeliveryAddressChange(e.target.value)}
                    rows="2"
                    placeholder="الحي، الشارع، رقم المبنى، علامة مميزة..."
                    className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:border-teal-600 resize-none"
                  />
                </div>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
                  رسوم التوصيل والمسافة يتم حسابهما في الخادم اعتماداً على موقعك، وليس على قيمة يحددها العميل.
                </p>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-dashed border-yellow-300 dark:border-yellow-700 rounded-xl p-3">
            <label className="font-bold text-gray-700 dark:text-gray-200 text-sm block mb-2">🎁 كود الخصم</label>
            {!appliedCoupon ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => onCouponCodeChange(e.target.value.toUpperCase())}
                  placeholder="مثال: WELCOME10"
                  className="flex-1 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white outline-none text-sm font-bold"
                />
                <button
                  onClick={onApplyCoupon}
                  disabled={couponLoading}
                  className="bg-teal-700 text-white px-4 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  {couponLoading ? '...' : 'تطبيق'}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/30 p-3 rounded-xl">
                <div>
                  <p className="font-bold text-green-700 dark:text-green-300 text-sm">✅ {couponCode}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    خصم {appliedCoupon.discountAmount} SR
                  </p>
                </div>
                <button onClick={onRemoveCoupon} className="text-red-500 text-sm font-bold">إلغاء</button>
              </div>
            )}
          </div>

          <div>
            <label className="font-bold text-gray-700 dark:text-gray-200 text-sm block mb-2">طريقة الدفع:</label>
            <div className="space-y-2">
              <button
                onClick={() => onPayChange('cash')}
                className={`w-full p-3 rounded-xl border-2 font-bold text-right flex justify-between items-center ${
                  payMethod === 'cash'
                    ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-600 text-teal-800 dark:text-teal-300'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200'
                }`}
              >
                <span>💵 نقداً عند الاستلام</span>
                {payMethod === 'cash' && <span>✓</span>}
              </button>
              <button
                onClick={() => onPayChange('card')}
                className={`w-full p-3 rounded-xl border-2 font-bold text-right flex justify-between items-center ${
                  payMethod === 'card'
                    ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-600 text-teal-800 dark:text-teal-300'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200'
                }`}
              >
                <span>💳 بطاقة (مدى / Apple Pay)</span>
                {payMethod === 'card' && <span>✓</span>}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-2 text-sm text-gray-800 dark:text-gray-200">
            <div className="flex justify-between"><span>المجموع الفرعي:</span><b>{cartTotal} SR</b></div>
            {orderType === 'delivery' && (
              <div className="flex justify-between">
                <span>رسوم التوصيل:</span>
                <b>تحسب تلقائياً</b>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>الخصم:</span><b>-{discountAmount} SR</b>
              </div>
            )}
            <div className="flex justify-between text-lg font-black border-t dark:border-gray-600 pt-2 mt-2">
              <span>الإجمالي:</span>
              <span className="text-teal-700 dark:text-teal-400">{grandTotal} SR + رسوم التوصيل</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="w-full bg-teal-700 text-white py-4 rounded-xl font-black text-lg shadow-lg disabled:opacity-50"
          >
            {submitting ? '⏳ جاري الإرسال...' : 'تأكيد الطلب'}
          </button>
        </div>
      </div>
    </div>
  );
}
