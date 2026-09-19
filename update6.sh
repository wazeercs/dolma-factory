#!/data/data/com.termux/files/usr/bin/bash

cat > src/components/CustomerApp.jsx << 'CUSTOMEREOF'
import React, { useState, useEffect } from 'react';
import { useProducts, useBranches, useOrderTracking } from '../hooks/useSupabaseData';
import { createOrder } from '../hooks/useOrdersApi';
import { validateCoupon } from '../hooks/useCoupons';
import { useToast } from './Toast';

const validateSaudiPhone = (phone) => {
  const cleaned = phone.replace(/\s|-/g, '');
  return /^(?:\+9665|9665|05|5)\d{8}$/.test(cleaned);
};

export default function CustomerApp() {
  const toast = useToast();
  const branches = useBranches();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const { products, loading } = useProducts(selectedBranch && selectedBranch.id);

  const [cart, setCart] = useState([]);
  const [sel, setSel] = useState(null);
  const [flavor, setFlavor] = useState(null);
  const [variant, setVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [name, setName] = useState(() => localStorage.getItem('dolma_name') || '');
  const [phone, setPhone] = useState(() => localStorage.getItem('dolma_phone') || '');
  const [payMethod, setPayMethod] = useState('cash');
  const [orderType, setOrderType] = useState('delivery');
  const [distanceKm, setDistanceKm] = useState(3.5);
  const [phoneError, setPhoneError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const trackingOrder = useOrderTracking(trackingOrderId);

  useEffect(() => {
    if (name) localStorage.setItem('dolma_name', name);
    if (phone) localStorage.setItem('dolma_phone', phone);
  }, [name, phone]);

  useEffect(() => {
    if (branches.length > 0 && !selectedBranch) setSelectedBranch(branches[0]);
  }, [branches, selectedBranch]);

  const openProduct = (p) => {
    setSel(p);
    setFlavor(null);
    setVariant(null);
    setQty(1);
  };

  const addToCart = () => {
    if (!variant) return toast.warning('الرجاء اختيار الحجم');
    if (sel.flavors.length > 0 && !flavor) return toast.warning('الرجاء اختيار النكهة');
    setCart([
      ...cart,
      {
        productId: sel.id,
        productName: sel.name,
        flavorName: flavor ? flavor.name : null,
        variantName: variant.name,
        unitPrice: variant.price + (flavor && flavor.extra_price ? flavor.extra_price : 0),
        quantity: qty,
        image: sel.image_url,
      },
    ]);
    setSel(null);
    toast.success('تمت الإضافة إلى السلة 🛒');
  };

  const cartTotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? Math.round(distanceKm * 3) : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, cartTotal + deliveryFee - discountAmount);

  const handlePhoneChange = (v) => {
    setPhone(v);
    if (v.length > 0 && !validateSaudiPhone(v)) setPhoneError('رقم غير صحيح (مثال: 0501234567)');
    else setPhoneError('');
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const result = await validateCoupon(couponCode, cartTotal, selectedBranch && selectedBranch.id);
      if (result.valid) {
        setAppliedCoupon(result);
        toast.success(result.message + ' (-' + result.discountAmount + ' SR)');
      } else {
        setAppliedCoupon(null);
        toast.error(result.message);
      }
    } catch (e) {
      toast.error('تعذّر التحقق من الكوبون');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('تم إلغاء الكوبون');
  };

  const submitOrder = async () => {
    if (!name.trim()) return toast.warning('يرجى إدخال الاسم');
    if (!validateSaudiPhone(phone)) return toast.warning('رقم الجوال غير صحيح');
    if (!selectedBranch) return toast.warning('لا يوجد فرع متاح');

    setSubmitting(true);
    try {
      const idempotencyKey = 'order-' + Date.now() + '-' + Math.random().toString(36).slice(2);
      const order = await createOrder(
        {
          branchId: selectedBranch.id,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          orderType: orderType,
          deliveryLocation: orderType === 'delivery' ? { lat: 24.7136, lng: 46.6753 } : null,
          deliveryAddress: orderType === 'delivery' ? 'الرياض' : null,
          distanceKm: orderType === 'delivery' ? distanceKm : 0,
          subtotal: cartTotal,
          deliveryFee: deliveryFee,
          discount: discountAmount,
          total: grandTotal,
          paymentMethod: payMethod === 'cash' ? 'cash' : 'card',
          idempotencyKey: idempotencyKey,
          couponId: appliedCoupon ? appliedCoupon.couponId : null,
          couponCode: appliedCoupon ? couponCode : null,
        },
        cart
      );
      setTrackingOrderId(order.id);
      setShowCheckout(false);
      setShowTracking(true);
      setCart([]);
      setAppliedCoupon(null);
      setCouponCode('');
      toast.success('تم إرسال طلبك بنجاح! 🎉');
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء إرسال الطلب — تحقق من الإنترنت');
    } finally {
      setSubmitting(false);
    }
  };

  const statusSteps = [
    { key: 'new', label: 'تم الاستلام', icon: '📝' },
    { key: 'preparing', label: 'قيد التحضير', icon: '👨‍🍳' },
    { key: 'ready', label: 'جاهز', icon: '✅' },
    { key: 'on_way', label: 'في الطريق', icon: '🛵' },
    { key: 'delivered', label: 'تم التسليم', icon: '🎉' },
  ];
  const currentStepIdx = trackingOrder ? statusSteps.findIndex((s) => s.key === trackingOrder.status) : -1;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        ⏳ جاري التحميل...
      </div>
    );
  }

  return (
    <div className="pb-28 px-4 max-w-lg mx-auto">
      <div className="text-center py-6">
        <div className="w-20 h-20 mx-auto mb-3 bg-teal-700 rounded-full flex items-center justify-center text-white text-3xl">🌿</div>
        <h1 className="text-3xl font-black text-teal-800 dark:text-teal-400">دولمه فاكتوري</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">أشهى المأكولات الشرقية الطازجة</p>
      </div>

      {selectedBranch && (
        <div className="mb-4 bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-200 dark:border-teal-800 rounded-2xl p-3 flex items-center gap-3">
          <span className="text-2xl">🏬</span>
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">الفرع المختار</p>
            <p className="font-bold text-teal-800 dark:text-teal-300 text-sm">{selectedBranch.name}</p>
          </div>
          <select value={selectedBranch.id} onChange={(e) => { const b = branches.find((x) => x.id === e.target.value); if (b) setSelectedBranch(b); }} className="text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-white border dark:border-gray-600 rounded-lg px-2 py-1 font-bold">
            {branches.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {products.map((p) => (
          <div key={p.id} onClick={() => openProduct(p)} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden cursor-pointer active:scale-95 transition-transform border border-gray-100 dark:border-gray-700">
            <img src={p.image_url} alt={p.name} className="w-full h-28 object-cover" />
            <div className="p-3 text-center">
              <h3 className="font-bold text-gray-800 dark:text-white text-sm">{p.name}</h3>
              <p className="text-sm text-teal-600 dark:text-teal-400 font-bold mt-1">من {p.variants[0] ? p.variants[0].price : 0} SR</p>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <p className="text-4xl mb-2">😔</p>
          <p>لا توجد منتجات متوفرة حالياً</p>
        </div>
      )}

      {cart.length > 0 && (
        <div onClick={() => setShowCart(true)} className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto bg-teal-700 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center cursor-pointer z-30">
          <span className="font-bold">🛒 عرض السلة ({cart.length})</span>
          <span className="font-black text-lg">{cartTotal} SR</span>
        </div>
      )}

      {sel && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setSel(null)}>
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-3xl max-h-[88vh] flex flex-col animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-44">
              <img src={sel.image_url} className="w-full h-full object-cover rounded-t-3xl" />
              <button onClick={() => setSel(null)} className="absolute top-4 left-4 bg-white/95 w-9 h-9 rounded-full shadow-md font-bold text-lg text-black">✕</button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 no-scrollbar">
              <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-4">{sel.name}</h2>
              {sel.flavors.length > 0 && (
                <div className="mb-5">
                  <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-3">اختر النكهة:</h4>
                  <div className="flex flex-wrap gap-2">
                    {sel.flavors.map((f) => (
                      <button key={f.id} onClick={() => setFlavor(f)} className={'px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ' + (flavor && flavor.id === f.id ? 'bg-teal-700 text-white border-teal-700' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600')}>
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="mb-5">
                <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-3">اختر الحجم:</h4>
                <div className="grid grid-cols-2 gap-3">
                  {sel.variants.map((v) => (
                    <button key={v.id} onClick={() => setVariant(v)} className={'p-3 rounded-xl border-2 flex flex-col items-center transition-all ' + (variant && variant.id === v.id ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-600 text-teal-800 dark:text-teal-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200')}>
                      <span className="font-bold">{v.name}</span>
                      <span className="text-sm font-semibold">{v.price} SR</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-gray-700 dark:text-gray-200">الكمية:</span>
                <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-2xl font-bold text-gray-600 dark:text-gray-300 w-8">−</button>
                  <span className="font-black text-lg w-6 text-center text-gray-800 dark:text-white">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="text-2xl font-bold text-teal-700 dark:text-teal-400 w-8">+</button>
                </div>
              </div>
            </div>
            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-3xl">
              <button onClick={addToCart} className="w-full bg-teal-700 text-white py-4 rounded-xl font-black text-lg flex justify-between items-center px-6 shadow-lg active:scale-95 transition-transform">
                <span>إضافة للسلة</span>
                <span>{variant ? (variant.price + (flavor && flavor.extra_price ? flavor.extra_price : 0)) * qty : 0} SR</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showCart && !showCheckout && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={() => setShowCart(false)}>
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-3xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-800 dark:text-white">سلة المشتريات</h2>
              <button onClick={() => setShowCart(false)} className="text-2xl text-gray-700 dark:text-gray-200">✕</button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 no-scrollbar">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-3 mb-4 pb-4 border-b dark:border-gray-700">
                  <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 dark:text-white">{item.productName}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.flavorName && item.flavorName + ' • '}{item.variantName}</p>
                    <p className="text-sm font-bold text-teal-700 dark:text-teal-400 mt-1">{item.quantity} × {item.unitPrice} = {item.unitPrice * item.quantity} SR</p>
                  </div>
                  <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="text-red-500 text-sm font-bold">حذف</button>
                </div>
              ))}
            </div>
            <div className="p-5 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex justify-between font-black text-lg mb-4 text-gray-800 dark:text-white">
                <span>الإجمالي:</span>
                <span className="text-teal-700 dark:text-teal-400">{cartTotal} SR</span>
              </div>
              <button onClick={() => setShowCheckout(true)} className="w-full bg-teal-700 text-white py-4 rounded-xl font-black shadow-lg">متابعة الطلب</button>
            </div>
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-3xl max-h-[92vh] flex flex-col">
            <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-800 dark:text-white">إتمام الطلب</h2>
              <button onClick={() => setShowCheckout(false)} className="text-2xl text-gray-700 dark:text-gray-200">✕</button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 no-scrollbar space-y-4">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-200 text-sm block mb-2">نوع الطلب:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setOrderType('delivery')} className={'p-3 rounded-xl border-2 font-bold ' + (orderType === 'delivery' ? 'bg-teal-700 text-white border-teal-700' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200')}>🚗 توصيل</button>
                  <button onClick={() => setOrderType('pickup')} className={'p-3 rounded-xl border-2 font-bold ' + (orderType === 'pickup' ? 'bg-teal-700 text-white border-teal-700' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200')}>🏪 استلام</button>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-200 text-sm block mb-2">الاسم:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك الكامل" className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-teal-600 outline-none" />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-200 text-sm block mb-2">رقم الجوال:</label>
                <input type="tel" value={phone} onChange={(e) => handlePhoneChange(e.target.value)} placeholder="05xxxxxxxx" dir="ltr" className={'w-full p-3 rounded-xl border-2 outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white ' + (phoneError ? 'border-red-400' : 'border-gray-200 dark:border-gray-600 focus:border-teal-600')} />
                {phoneError && (<p className="text-red-500 text-xs mt-1 font-bold">⚠️ {phoneError}</p>)}
                {!phoneError && phone.length > 0 && (<p className="text-green-600 dark:text-green-400 text-xs mt-1 font-bold">✓ رقم صحيح</p>)}
              </div>

              {orderType === 'delivery' && (
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-200 text-sm block mb-2">موقع التوصيل:</label>
                  <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">📍</span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-bold">{selectedBranch && selectedBranch.name}</p>
                        <p className="text-xs text-gray-400">اضغط هنا لتحديد موقعك (Google Maps لاحقاً)</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">المسافة:</span>
                      <div className="flex items-center gap-2">
                        <input type="range" min="1" max="15" step="0.5" value={distanceKm} onChange={(e) => setDistanceKm(parseFloat(e.target.value))} className="w-24" />
                        <b className="text-teal-700 dark:text-teal-400">{distanceKm} كم</b>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-dashed border-yellow-300 dark:border-yellow-700 rounded-xl p-3">
                <label className="font-bold text-gray-700 dark:text-gray-200 text-sm block mb-2">🎁 كود الخصم</label>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="مثال: WELCOME10" className="flex-1 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white outline-none text-sm font-bold" />
                    <button onClick={handleApplyCoupon} disabled={couponLoading} className="bg-teal-700 text-white px-4 py-3 rounded-xl font-bold text-sm disabled:opacity-50">{couponLoading ? '...' : 'تطبيق'}</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/30 p-3 rounded-xl">
                    <div>
                      <p className="font-bold text-green-700 dark:text-green-300 text-sm">✅ {couponCode}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">خصم {appliedCoupon.discountAmount} SR</p>
                    </div>
                    <button onClick={removeCoupon} className="text-red-500 text-sm font-bold">إلغاء</button>
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-200 text-sm block mb-2">طريقة الدفع:</label>
                <div className="space-y-2">
                  <button onClick={() => setPayMethod('cash')} className={'w-full p-3 rounded-xl border-2 font-bold text-right flex justify-between items-center ' + (payMethod === 'cash' ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-600 text-teal-800 dark:text-teal-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200')}>
                    <span>💵 نقداً عند الاستلام</span>{payMethod === 'cash' && <span>✓</span>}
                  </button>
                  <button onClick={() => setPayMethod('card')} className={'w-full p-3 rounded-xl border-2 font-bold text-right flex justify-between items-center ' + (payMethod === 'card' ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-600 text-teal-800 dark:text-teal-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200')}>
                    <span>💳 بطاقة (مدى / Apple Pay)</span>{payMethod === 'card' && <span>✓</span>}
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-2 text-sm text-gray-800 dark:text-gray-200">
                <div className="flex justify-between"><span>المجموع الفرعي:</span><b>{cartTotal} SR</b></div>
                {orderType === 'delivery' && (<div className="flex justify-between"><span>رسوم التوصيل:</span><b>{deliveryFee} SR</b></div>)}
                {discountAmount > 0 && (<div className="flex justify-between text-green-600 dark:text-green-400"><span>الخصم:</span><b>-{discountAmount} SR</b></div>)}
                <div className="flex justify-between text-lg font-black border-t dark:border-gray-600 pt-2 mt-2"><span>الإجمالي:</span><span className="text-teal-700 dark:text-teal-400">{grandTotal} SR</span></div>
              </div>
            </div>
            <div className="p-4 border-t dark:border-gray-700">
              <button onClick={submitOrder} disabled={submitting} className="w-full bg-teal-700 text-white py-4 rounded-xl font-black text-lg shadow-lg disabled:opacity-50">{submitting ? '⏳ جاري الإرسال...' : 'تأكيد الطلب'}</button>
            </div>
          </div>
        </div>
      )}

      {showTracking && trackingOrder && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-3xl max-h-[92vh] flex flex-col animate-slide-up">
            <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-800 dark:text-white">تتبع الطلب #{trackingOrder.order_number}</h2>
              <button onClick={() => { setShowTracking(false); setTrackingOrderId(null); }} className="text-2xl text-gray-700 dark:text-gray-200">✕</button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 no-scrollbar">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-4xl mb-3">{statusSteps[currentStepIdx] && statusSteps[currentStepIdx].icon}</div>
                <h3 className="text-xl font-black text-gray-800 dark:text-white">{statusSteps[currentStepIdx] && statusSteps[currentStepIdx].label}</h3>
              </div>

              <div className="relative mb-8">
                <div className="absolute top-5 right-5 left-5 h-1 bg-gray-200 dark:bg-gray-700"></div>
                <div className="absolute top-5 right-5 h-1 bg-teal-600 transition-all duration-500" style={{ width: 'calc(' + (currentStepIdx / (statusSteps.length - 1)) * 100 + '% - 0px)' }}></div>
                <div className="relative flex justify-between">
                  {statusSteps.map((step, i) => (
                    <div key={step.key} className="flex flex-col items-center">
                      <div className={'w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all ' + (i <= currentStepIdx ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-400')}>{i < currentStepIdx ? '✓' : step.icon}</div>
                      <span className={'text-xs mt-2 font-bold ' + (i <= currentStepIdx ? 'text-teal-700 dark:text-teal-400' : 'text-gray-400')}>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-4">
                <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-3">تفاصيل الطلب:</h4>
                {(trackingOrder.order_items || []).map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1.5 border-b border-gray-200 dark:border-gray-600 last:border-0 text-gray-800 dark:text-gray-200">
                    <span>{item.product_name} {item.flavor_name && '(' + item.flavor_name + ')'} - {item.variant_name} × {item.quantity}</span>
                    <b>{item.total_price} SR</b>
                  </div>
                ))}
                {trackingOrder.discount > 0 && (
                  <div className="flex justify-between text-sm py-1.5 text-green-600 dark:text-green-400 border-t border-gray-200 dark:border-gray-600">
                    <span>الخصم</span><b>-{trackingOrder.discount} SR</b>
                  </div>
                )}
                <div className="flex justify-between font-black text-lg pt-2 mt-2 border-t dark:border-gray-600 text-gray-800 dark:text-white">
                  <span>الإجمالي</span>
                  <span className="text-teal-700 dark:text-teal-400">{trackingOrder.total} SR</span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3 text-xs text-blue-800 dark:text-blue-200">
                ℹ️ الحالة تُحدَّث تلقائياً من الكاشير لحظة بلحظة.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
CUSTOMEREOF

echo ""
echo "✅ تم تحديث CustomerApp.jsx بنجاح!"
ls -la src/components/CustomerApp.jsx
