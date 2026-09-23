# 🌿 دولمه فاكتوري — نظام الطلبات والتوصيل

نظام ويب متكامل (PWA) لإدارة طلبات وتوصيل مطعم دولمه فاكتوري.

## 🔗 روابط الإنتاج

| الخدمة | الرابط |
|--------|--------|
| 🌐 الموقع | https://dolma-factory-3fo2.vercel.app |
| 💾 GitHub | https://github.com/wazeercs/dolma-factory |
| 🗄️ Supabase | supabase.com/dashboard/project/rwxdrkvrpnlzujbbatlx |

## 👥 الحسابات

| الدور | Email | Password |
|-------|-------|----------|
| 👑 الإدارة | admin@dolma.com | Admin@2026 |
| 🖥️ الكاشير | cashier@dolma.com | Cashier@2026 |
| 🛵 المندوب | driver@dolma.com | Driver@2026 |

## 🎯 الواجهات

- `/` — واجهة الزبون (public PWA)
- `/login` — تسجيل دخول
- `/cashier` — شاشة الكاشير (cashier+)
- `/admin` — لوحة الإدارة (admin+)
- `/driver` — شاشة المناديب (driver)

## 🛠️ التقنيات

- **Frontend**: React 18 + Vite + Tailwind CSS + React Router v6
- **Backend**: Supabase (PostgreSQL + PostGIS + Realtime + Auth + Storage)
- **Hosting**: Vercel
- **PWA**: Service Worker (نظيف، لا يعترض fetch)

## 📦 الميزات

### 🛒 الزبون
- تصفح المنيو + نكهات + أحجام
- بحث + تصفية بالتصنيف
- سلة + كوبونات
- نقاط ولاء (1 نقطة / 10 ريال)
- تتبع الطلب (7 مراحل)
- WhatsApp share
- PWA قابل للتثبيت

### 🖥️ الكاشير
- استقبال فوري (Realtime)
- تنبيه صوتي مستمر
- Swipe يمين للتأكيد
- طباعة فواتير
- مقفل على فرعه

### 🛵 المندوب
- Auth حقيقي (user_id)
- يرى طلباته فقط
- Google Maps + اتصال مباشر

### 📊 الإدارة (10 تبويبات)
- إحصائيات + تقارير (هجري/ميلادي)
- CRUD منتجات + رفع صور
- الطلبات + الفروع + المناديب
- ساعات عمل + مناطق توصيل
- عملاء الولاء + المستخدمين

## 🔐 الأمان

- RLS على كل الجداول
- Rate Limiting (5 طلبات/10 دقائق لكل رقم)
- Idempotency (منع التكرار)
- Audit Log شامل
- Coupon Atomic (FOR UPDATE)
- Business Hours check
- PostGIS للتحقق من نطاق التوصيل

## ⚡ الأداء

- **PageSpeed**: 88 (Mobile) / 98 (Desktop)
- **Bundle**: 6 chunks (react-vendor, supabase, router, ...)
- **Lazy Loading**: كل واجهة تُحمّل عند الحاجة
- **Cache Headers**: assets + icons

## 📝 التطوير

```bash
npm install
npm run dev
