import React, { useState, useEffect } from 'react';
import { useProducts, useBranches, useOrderTracking } from '../../hooks/useSupabaseData';
import { createOrder } from '../../hooks/useOrdersApi';
import { validateCoupon } from '../../hooks/useCoupons';
import { useToast } from '../../components/Toast';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { validateSaudiPhone, validateCart } from '../../lib/validation';
import MenuGrid from './components/MenuGrid';
import ProductModal from './components/ProductModal';
import CartSheet from './components/CartSheet';
import CheckoutSheet from './components/CheckoutSheet';
import TrackingSheet from './components/TrackingSheet';

export default function CustomerApp() {
  const toast = useToast();
  const isOnline = useOnlineStatus();
  const branches = useBranches();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const { products, loading, error } = useProducts(selectedBranch?.id);

  const [cart, setCart] = useState([]);
  const [sel, setSel] = useState(null);
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
  const [trackingInfo, setTrackingInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('dolma_last_order');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const trackingOrder = useOrderTracking(
    trackingInfo?.number,
    trackingInfo?.phone
  );

  useEffect(() => {
    if (name) localStorage.setItem('dolma_name', name);
    if (phone) localStorage.setItem('dolma_phone', phone);
  }, [name, phone]);

  useEffect(() => {
    if (branches.length > 0 && !selectedBranch) setSelectedBranch(branches[0]);
  }, [branches, selectedBranch]);

  const handleAddToCart = (product, flavor, variant, qty) => {
    if (!variant) return toast.warning('الرجاء اختيار الحجم');
    if (product.flavors?.length > 0 && !flavor) return toast.warning('الرجاء اختيار النكهة');
    setCart([...cart, {
      productId: product.id,
      variantId: variant.id,
      flavorId: flavor?.id || null,
      productName: product.name,
      flavorName: flavor?.name || null,
      variantName: variant.name,
      unitPrice: variant.price + (flavor?.extra_price || 0),
      quantity: qty,
      image: product.image_url,
    }]);
    setSel(null);
    toast.success('تمت الإضافة إلى السلة 🛒');
  };

  const cartTotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? Math.round(distanceKm * 3) : 0;
  const discountAmount = appliedCoupon?.discountAmount || 0;
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
      const result = await validateCoupon(couponCode, cartTotal, selectedBranch?.id);
      if (result.valid) {
        setAppliedCoupon(result);
        toast.success(result.message + ` (-${result.discountAmount} SR)`);
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

    const cartCheck = validateCart(cart);
    if (!cartCheck.valid) return toast.error(cartCheck.errors[0]);
    if (!isOnline) return toast.error('لا يوجد اتصال بالإنترنت');

    setSubmitting(true);
    try {
      const idempotencyKey = `order-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const order = await createOrder({
        branchId: selectedBranch.id,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        orderType,
        deliveryLocation: orderType === 'delivery' ? { lat: 24.7136, lng: 46.6753 } : null,
        deliveryAddress: orderType === 'delivery' ? 'الرياض' : null,
        distanceKm: orderType === 'delivery' ? distanceKm : 0,
        paymentMethod: payMethod === 'cash' ? 'cash' : 'card',
        idempotencyKey,
        couponCode: appliedCoupon ? couponCode : null,
      }, cart);

      const info = { number: order.order_number, phone: phone.trim() };
      setTrackingInfo(info);
      localStorage.setItem('dolma_last_order', JSON.stringify(info));

      setShowCheckout(false);
      setShowTracking(true);
      setCart([]);
      setAppliedCoupon(null);
      setCouponCode('');
      toast.success('تم إرسال طلبك بنجاح! 🎉');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'حدث خطأ أثناء إرسال الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-28 px-4 max-w-lg mx-auto">
      {!isOnline && (
        <div className="bg-red-500 text-white p-2 rounded-lg text-center text-xs font-bold mb-3 mt-3">
          ⚠️ لا يوجد اتصال بالإنترنت — بعض الميزات معطلة
        </div>
      )}

      <div className="text-center py-6">
        <div className="w-20 h-20 mx-auto mb-3 bg-teal-700 rounded-full flex items-center justify-center text-white text-3xl">
          🌿
        </div>
        <h1 className="text-3xl font-black text-teal-800 dark:text-teal-400">دولمه فاكتوري</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">أشهى المأكولات الشرقية الطازجة</p>
      </div>

      {trackingInfo && !showTracking && (
        <button
          onClick={() => setShowTracking(true)}
          className="w-full mb-4 bg-teal-700 text-white p-4 rounded-2xl font-bold flex justify-between items-center shadow-lg"
        >
          <span>📦 تتبع طلبك #{trackingInfo.number}</span>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">عرض</span>
        </button>
      )}

      {selectedBranch && (
        <div className="mb-4 bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-200 dark:border-teal-800 rounded-2xl p-3 flex items-center gap-3">
          <span className="text-2xl">🏬</span>
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">الفرع المختار</p>
            <p className="font-bold text-teal-800 dark:text-teal-300 text-sm">{selectedBranch.name}</p>
          </div>
          <select
            value={selectedBranch.id}
            onChange={(e) => {
              const b = branches.find((x) => x.id === e.target.value);
              if (b) setSelectedBranch(b);
            }}
            className="text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-white border dark:border-gray-600 rounded-lg px-2 py-1 font-bold"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl p-3 mb-4 text-sm text-red-700 dark:text-red-300 font-bold">
          ⚠️ {error}
        </div>
      )}

      <MenuGrid products={products} onSelect={setSel} loading={loading} />

      {cart.length > 0 && (
        <div
          onClick={() => setShowCart(true)}
          className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto bg-teal-700 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center cursor-pointer z-30"
        >
          <span className="font-bold">🛒 عرض السلة ({cart.length})</span>
          <span className="font-black text-lg">{cartTotal} SR</span>
        </div>
      )}

      <ProductModal product={sel} onClose={() => setSel(null)} onAdd={handleAddToCart} />

      {showCart && !showCheckout && (
        <CartSheet
          cart={cart}
          cartTotal={cartTotal}
          onClose={() => setShowCart(false)}
          onRemove={(i) => setCart(cart.filter((_, idx) => idx !== i))}
          onCheckout={() => setShowCheckout(true)}
        />
      )}

      {showCheckout && (
        <CheckoutSheet
          cartTotal={cartTotal}
          deliveryFee={deliveryFee}
          discountAmount={discountAmount}
          grandTotal={grandTotal}
          name={name}
          phone={phone}
          phoneError={phoneError}
          onNameChange={setName}
          onPhoneChange={handlePhoneChange}
          orderType={orderType}
          onOrderTypeChange={setOrderType}
          distanceKm={distanceKm}
          onDistanceChange={setDistanceKm}
          payMethod={payMethod}
          onPayChange={setPayMethod}
          couponCode={couponCode}
          onCouponCodeChange={setCouponCode}
          appliedCoupon={appliedCoupon}
          couponLoading={couponLoading}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={removeCoupon}
          submitting={submitting}
          onSubmit={submitOrder}
          onClose={() => setShowCheckout(false)}
          branchName={selectedBranch?.name}
        />
      )}

      {showTracking && trackingOrder && (
        <TrackingSheet
          order={trackingOrder}
          onClose={() => setShowTracking(false)}
        />
      )}
    </div>
  );
}
