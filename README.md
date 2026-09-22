# 🌿 دولمه فاكتوري — نظام الطلبات والتوصيل

نظام ويب متكامل (PWA) لإدارة الطلبات والتوصيل لمطعم دولمه فاكتوري.

## 🔗 الروابط

| الخدمة | الرابط |
|--------|--------|
| 🌐 الموقع | https://dolma-factory-3fo2.vercel.app |
| 📄 الوثيقة التجارية | https://dolma-factory-3fo2.vercel.app/proposal.html |
| 💾 GitHub | https://github.com/wazeercs/dolma-factory |
| 🗄️ Supabase | https://supabase.com/dashboard/project/rwxdrkvrpnlzujbbatlx |

## 👥 حسابات النظام

| الدور | Email | Password |
|-------|-------|----------|
| 👑 الإدارة | admin@dolma.com | Admin@2026 |
| 🖥️ الكاشير | cashier@dolma.com | Cashier@2026 |
| 🛵 المندوب | driver@dolma.com | Driver@2026 |

## 🎯 الواجهات

- `/` — واجهة الزبون (عامة)
- `/login` — تسجيل دخول
- `/cashier` — شاشة الكاشير (يحتاج cashier أو أعلى)
- `/admin` — لوحة الإدارة (يحتاج admin أو أعلى)
- `/driver` — شاشة المناديب (يحتاج driver)

## 🛠️ الحزمة التقنية

- React 18.3.1 + Vite 5.3.1 + Tailwind CSS 3.4.4
- Supabase (PostgreSQL + PostGIS + Realtime + Auth)
- Vercel (نشر تلقائي من GitHub)

## 🚀 التشغيل المحلي

```bash
npm install
npm run dev
