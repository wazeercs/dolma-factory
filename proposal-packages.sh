#!/data/data/com.termux/files/usr/bin/bash

cat >> public/proposal.html << 'PKGEOF'

<div class="page">
  <div class="page-header"><span class="page-header-brand">دولمه فاكتوري</span><span>القسم 26</span></div>
  <span class="section-number">القسم 26</span>
  <h1 class="section-title">إدارة الطلبات المكررة</h1>
  <p class="section-subtitle">منع إنشاء نفس الطلب أكثر من مرة.</p>
  <p>سيتم استخدام آليات لمنع إنشاء نفس الطلب أكثر من مرة نتيجة:</p>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الضغط على زر الدفع عدة مرات</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إعادة تحميل الصفحة</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إعادة إرسال Webhook</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">ضعف الإنترنت</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إعادة المحاولة</div></div>
  </div>
  <h3 class="mini-title">ومن ضمن الحلول:</h3>
  <div class="arch">
    <div class="arch-box primary">Idempotency Keys</div>
    <div class="arch-arrow">+</div>
    <div class="arch-box accent">Webhook Verification</div>
    <div class="arch-arrow">+</div>
    <div class="arch-box dark">Transaction Handling</div>
  </div>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 28</span></div>
</div>

<div class="page">
  <div class="page-header"><span class="page-header-brand">دولمه فاكتوري</span><span>القسم 27</span></div>
  <span class="section-number">القسم 27</span>
  <h1 class="section-title">الملكية والحسابات</h1>
  <p class="section-subtitle">استقلالية كاملة للمطعم عن المطور.</p>
  <p>من المهم أن تكون الحسابات التشغيلية الأساسية باسم العميل وليس باسم المطور.</p>
  <h2 class="sub-title">الحسابات التي تكون ملكاً لدولمه فاكتوري</h2>
  <div class="grid-2">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Domain</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Cloudflare</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">VPS / Hosting</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Payment Gateway</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Google Cloud / Maps</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">WhatsApp Business</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Tabby</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Tamara</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">البريد الرسمي</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">أي خدمات خارجية أخرى</div></div>
  </div>
  <p>ويتم منح المطور صلاحيات تقنية مناسبة لإدارة النظام.</p>
  <h2 class="sub-title">الفائدة</h2>
  <p>في حال تغير المطور مستقبلاً تبقى:</p>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">البيانات</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">النطاق</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الخادم</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الحسابات</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">بوابات الدفع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الخدمات الخارجية</div></div>
  </div>
  <p>ملكاً للمطعم.</p>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 29</span></div>
</div>

<div class="page">
  <div class="page-header"><span class="page-header-brand">دولمه فاكتوري</span><span>القسم 28</span></div>
  <span class="section-number">القسم 28</span>
  <h1 class="section-title">الباقة الأولى — Starter</h1>
  <p class="section-subtitle">قيمة تنفيذ وتطوير النظام: <strong>750 ريال سعودي</strong></p>
  <h3 class="mini-title">تشمل:</h3>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">PWA للعميل</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">عرض القائمة</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الأقسام</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">المنتجات</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">السلة</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إنشاء الطلب</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الدفع عند الاستلام</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تحديد الفرع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">نظام أساسي لحالات الطلب</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">واجهة استقبال الطلبات للفرع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تشغيل النظام على Tablet</div></div>
  </div>
  <div class="callout callout-info">
    <div class="callout-title">عدد الواجهات الرئيسية: 2</div>
    <ol><li>Customer PWA</li><li>Branch / Employee</li></ol>
  </div>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 30</span></div>
</div>

<div class="page">
  <div class="page-header"><span class="page-header-brand">دولمه فاكتوري</span><span>القسم 29</span></div>
  <span class="section-number">القسم 29</span>
  <h1 class="section-title">الباقة الثانية — Basic</h1>
  <p class="section-subtitle">قيمة تنفيذ وتطوير النظام: <strong>1,250 ريال سعودي</strong></p>
  <p>تشمل جميع خصائص Starter بالإضافة إلى:</p>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">لوحة تحكم الإدارة</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إدارة المنتجات</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إدارة الأقسام</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إدارة الفروع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إدارة مناطق التوصيل</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إدارة الموظفين</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الصلاحيات الأساسية</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الكوبونات</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">التقارير الأساسية</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إعدادات النظام</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إدارة حالات الطلب</div></div>
  </div>
  <div class="callout callout-info">
    <div class="callout-title">عدد الواجهات الرئيسية: 3</div>
    <ol><li>Customer</li><li>Branch</li><li>Admin</li></ol>
  </div>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 31</span></div>
</div>

<div class="page">
  <div class="page-header"><span class="page-header-brand">دولمه فاكتوري</span><span>القسم 30</span></div>
  <span class="section-number">القسم 30</span>
  <h1 class="section-title">الباقة الثالثة — Business</h1>
  <p class="section-subtitle">قيمة تنفيذ وتطوير النظام: <strong>2,500 ريال سعودي</strong></p>
  <p>تشمل جميع خصائص Basic بالإضافة إلى:</p>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">بوابة الدفع الإلكتروني</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">دعم Mada حسب مزود الدفع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Apple Pay حسب مزود الدفع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Webhooks للدفع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">التحقق من عمليات الدفع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">منع الدفع المكرر</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إدارة الطلبات حسب الفرع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Driver PWA</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إسناد الطلب للمندوب</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إدارة حالة المندوب</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">فتح موقع العميل في الخرائط</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Campaign Mode</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Rate Limiting</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تحسين الأداء أثناء الحملات</div></div>
  </div>
  <div class="callout callout-info">
    <div class="callout-title">عدد الواجهات الرئيسية: 4</div>
    <ol><li>Customer PWA</li><li>Branch Tablet</li><li>Admin Dashboard</li><li>Driver PWA</li></ol>
  </div>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 32</span></div>
</div>

<div class="page">
  <div class="page-header"><span class="page-header-brand">دولمه فاكتوري</span><span>القسم 31</span></div>
  <span class="section-number">القسم 31</span>
  <h1 class="section-title">الباقة الرابعة — Professional</h1>
  <p class="section-subtitle">قيمة تنفيذ وتطوير النظام: <strong>3,500 ريال سعودي</strong></p>
  <p>تشمل جميع خصائص Business بالإضافة إلى:</p>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تكامل Tabby</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تكامل Tamara</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">GPS للمندوب</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تتبع المندوب أثناء التوصيل</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">عرض المندوب على الخريطة</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">ربط GPS بالطلب</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Customer Order Tracking</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">حالات توصيل متقدمة</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">WhatsApp Notifications</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Audit Logs</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">سجل عمليات أكثر تفصيلاً</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تقارير متقدمة</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تحسينات إضافية لإدارة عمليات التوصيل</div></div>
  </div>
  <div class="callout callout-info">
    <div class="callout-title">عدد الواجهات الرئيسية: 4</div>
    <p>مع إضافة وظائف التتبع والعمليات المتقدمة داخل لوحة الإدارة.</p>
  </div>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 33</span></div>
</div>

<div class="page">
  <div class="page-header"><span class="page-header-brand">دولمه فاكتوري</span><span>القسم 32</span></div>
  <span class="section-number">القسم 32</span>
  <h1 class="section-title">الباقة الخامسة — Enterprise</h1>
  <p class="section-subtitle">قيمة تنفيذ وتطوير النظام: <strong>5,000 ريال سعودي</strong></p>
  <p>تشمل جميع خصائص Professional بالإضافة إلى:</p>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">بنية متعددة الفروع قابلة للتوسع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">صلاحيات متقدمة</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تقارير إدارية متقدمة</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إدارة متقدمة لمناطق التوصيل</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إدارة متقدمة للكوبونات</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Dashboard إداري موسع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Campaign Mode متقدم</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تحسينات أداء إضافية</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">استراتيجية Backup أكثر شمولاً</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Monitoring</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تجهيز أفضل للتوسع المستقبلي</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">عدد محدود من ساعات التطوير المخصصة للتعديلات الصغيرة</div></div>
  </div>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 34</span></div>
</div>

<div class="page">
  <div class="page-header"><span class="page-header-brand">دولمه فاكتوري</span><span>القسم 33</span></div>
  <span class="section-number">القسم 33</span>
  <h1 class="section-title">مقارنة الباقات</h1>
  <p class="section-subtitle">مقارنة تفصيلية لجميع الخصائص.</p>
  <table style="font-size: 8pt;">
    <thead>
      <tr>
        <th>الخاصية</th>
        <th style="text-align:center;">Starter</th>
        <th style="text-align:center;">Basic</th>
        <th style="text-align:center;">Business</th>
        <th style="text-align:center;">Professional</th>
        <th style="text-align:center;">Enterprise</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Customer PWA</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td></tr>
      <tr><td>Branch Tablet</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td></tr>
      <tr><td>Admin Dashboard</td><td class="table-dash" style="text-align:center;">—</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td></tr>
      <tr><td>إدارة المنتجات</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td></tr>
      <tr><td>إدارة الفروع</td><td class="table-basic" style="text-align:center;">أساسي</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-advanced" style="text-align:center;">متقدم</td></tr>
      <tr><td>مناطق التوصيل</td><td class="table-dash" style="text-align:center;">—</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-advanced" style="text-align:center;">متقدم</td></tr>
      <tr><td>الدفع عند الاستلام</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td></tr>
      <tr><td>الدفع الإلكتروني</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td></tr>
      <tr><td>Mada / Apple Pay</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td></tr>
      <tr><td>Driver PWA</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td></tr>
      <tr><td>Driver Assignment</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td></tr>
      <tr><td>Campaign Mode</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-advanced" style="text-align:center;">متقدم</td></tr>
      <tr><td>GPS</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td></tr>
      <tr><td>تتبع العميل</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td></tr>
      <tr><td>WhatsApp</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td></tr>
      <tr><td>Tabby</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td></tr>
      <tr><td>Tamara</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td></tr>
      <tr><td>Audit Logs</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-basic" style="text-align:center;">أساسي</td><td class="table-check" style="text-align:center;">✓</td><td class="table-advanced" style="text-align:center;">متقدم</td></tr>
      <tr><td>تقارير متقدمة</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td></tr>
      <tr><td>بنية متعددة الفروع</td><td class="table-dash" style="text-align:center;">—</td><td class="table-dash" style="text-align:center;">—</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td></tr>
      <tr><td>Monitoring / Backup</td><td class="table-basic" style="text-align:center;">أساسي</td><td class="table-basic" style="text-align:center;">أساسي</td><td class="table-check" style="text-align:center;">✓</td><td class="table-check" style="text-align:center;">✓</td><td class="table-advanced" style="text-align:center;">متقدم</td></tr>
    </tbody>
  </table>
  <p style="font-size: 9pt; color: var(--muted); margin-top: 12px;">* حسب مزود بوابة الدفع والعقد التجاري الخاص بالمطعم.</p>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 35</span></div>
</div>

<div class="page">
  <div class="page-header"><span class="page-header-brand">دولمه فاكتوري</span><span>القسم 34</span></div>
  <span class="section-number">القسم 34</span>
  <h1 class="section-title">الباقة المقترحة للمشروع</h1>
  <p class="section-subtitle">Business — الخيار المتوازن للبدء.</p>
  <div class="card card-accent" style="text-align: center; padding: 30px;">
    <div style="font-size: 12pt; color: var(--accent-dark); font-weight: 700; margin-bottom: 10px;">الباقة المقترحة</div>
    <div style="font-size: 28pt; font-weight: 900; color: var(--primary); margin-bottom: 6px;">Business</div>
    <div style="font-size: 20pt; font-weight: 900; color: var(--charcoal);">2,500 ريال سعودي</div>
  </div>
  <p>من الناحية العملية، يمكن البدء بباقة Business – 2,500 ريال، لأنها توفر الأساس التشغيلي المتكامل:</p>
  <div class="grid-3">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Customer PWA</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Branch Tablet</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Admin Dashboard</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Driver PWA</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الدفع الإلكتروني</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إدارة الفروع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إسناد الطلبات</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Campaign Mode</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">حماية وتحسين الأداء</div></div>
  </div>
  <div class="callout callout-info">
    <div class="callout-title">الترقية المستقبلية</div>
    ثم يمكن إضافة GPS + التتبع + WhatsApp + Tabby + Tamara عند الحاجة من خلال الانتقال إلى Professional.
    <br/><br/>
    وبذلك يمكن للمطعم البدء بتكلفة تطوير منخفضة وعدم دفع مقابل خصائص لن يستخدمها منذ اليوم الأول.
  </div>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 36</span></div>
</div>

<div class="page">
  <div class="page-header"><span class="page-header-brand">دولمه فاكتوري</span><span>القسم 35</span></div>
  <span class="section-number">القسم 35</span>
  <h1 class="section-title">إضافة GPS بشكل منفصل</h1>
  <p class="section-subtitle">Add-on اختياري للباقة Business.</p>
  <p>في حال اختيار Business والرغبة في إضافة GPS لاحقاً، يمكن تنفيذ:</p>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تتبع المندوب</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">آخر موقع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">خريطة الإدارة</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">ربط المندوب بالطلب</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Customer Tracking</div></div>
  </div>
  <div class="callout callout-info">
    <div class="callout-title">السعر</div>
    كسعر تطوير إضافي يتم الاتفاق عليه قبل التنفيذ.
  </div>
  <div class="callout callout-success">
    <div class="callout-title">✓ لا يحتاج جهاز GPS مستقل</div>
    ولا يحتاج المطعم إلى شراء جهاز GPS منفصل؛ يتم استخدام GPS الموجود في هاتف المندوب.
  </div>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 37</span></div>
</div>

<div class="page">
  <div class="page-header"><span class="page-header-brand">دولمه فاكتوري</span><span>القسم 36</span></div>
  <span class="section-number">القسم 36</span>
  <h1 class="section-title">التكلفة التشغيلية</h1>
  <p class="section-subtitle">فصل واضح بين التطوير والتشغيل.</p>
  <p>يجب التفريق بين:</p>
  <div class="grid-2">
    <div class="card card-primary">
      <div class="card-title">أولاً: قيمة تنفيذ وتطوير النظام</div>
      <p style="margin-bottom: 8px;">وهي المبالغ المذكورة في الباقات:</p>
      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
        <span class="badge badge-primary">750</span>
        <span class="badge badge-primary">1,250</span>
        <span class="badge badge-primary">2,500</span>
        <span class="badge badge-primary">3,500</span>
        <span class="badge badge-primary">5,000</span>
        <span style="font-size: 10pt;">ريال</span>
      </div>
      <p style="margin-top: 10px; font-size: 10pt;">وتدفع مقابل تنفيذ وتطوير النظام وفق نطاق الباقة المختارة.</p>
    </div>
    <div class="card card-accent">
      <div class="card-title">ثانياً: الخدمات الخارجية والتشغيلية</div>
      <p style="font-size: 10pt;">هذه ليست أتعاب تطوير، وإنما رسوم خدمات يتم دفعها لمزودي الخدمات أنفسهم.</p>
      <p style="font-size: 10pt; margin-top: 8px;"><strong>ولا يتم وضع رقم شهري ثابت غير مؤكد لها.</strong></p>
    </div>
  </div>
  <h2 class="sub-title">الخدمات المحتملة</h2>
  <table>
    <thead><tr><th>الخدمة</th><th>طريقة التكلفة</th></tr></thead>
    <tbody>
      <tr><td>VPS / Hosting</td><td>حسب الخطة وفترة الاشتراك</td></tr>
      <tr><td>Domain</td><td>رسوم سنوية حسب الامتداد والمسجل</td></tr>
      <tr><td>Cloudflare</td><td>يمكن البدء بالخطة المجانية، والترقية عند الحاجة</td></tr>
      <tr><td>PostgreSQL</td><td>ضمن الخادم في البنية المقترحة مبدئياً</td></tr>
      <tr><td>Backup</td><td>حسب المزود وحجم البيانات</td></tr>
      <tr><td>Payment Gateway</td><td>حسب العقد والعمليات المالية</td></tr>
      <tr><td>Tabby</td><td>حسب اتفاق المطعم مع Tabby</td></tr>
      <tr><td>Tamara</td><td>حسب اتفاق المطعم مع Tamara</td></tr>
      <tr><td>WhatsApp</td><td>حسب الاستخدام ونوع الرسائل</td></tr>
      <tr><td>Google Maps</td><td>حسب الخدمات والاستخدام</td></tr>
      <tr><td>Email</td><td>حسب المزود وحجم الاستخدام</td></tr>
      <tr><td>SMS إن استخدم</td><td>حسب المزود وعدد الرسائل</td></tr>
    </tbody>
  </table>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 38</span></div>
</div>

<div class="page">
  <div class="page-header"><span class="page-header-brand">دولمه فاكتوري</span><span>القسم 36 (تابع)</span></div>
  <span class="section-number">القسم 36 (تابع)</span>
  <h1 class="section-title">نقطة مهمة</h1>
  <div class="callout callout-warn">
    <div class="callout-title">مهم: لا توجد تكلفة تشغيل شهرية ثابتة واحدة للنظام بالكامل</div>
    <p>لا يوجد رقم واحد ثابت يمكن اعتباره "التكلفة التشغيلية الشهرية النهائية"؛ لأن جزءاً من التكلفة ثابت أو شبه ثابت، بينما جزءاً آخر يتغير حسب:</p>
  </div>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">عدد الطلبات</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">عدد رسائل WhatsApp</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">عمليات الدفع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">استخدام الخرائط</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">حجم البيانات</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">حجم النسخ الاحتياطية</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الخدمات الإضافية المستخدمة</div></div>
  </div>
  <div class="callout callout-info">
    وبالتالي يتم احتساب هذه الخدمات مباشرة على حساب المطعم لدى مزود الخدمة، وتكون مستقلة عن قيمة تطوير النظام.
  </div>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 39</span></div>
</div>

<div class="page">
  <div class="page-header"><span class="page-header-brand">دولمه فاكتوري</span><span>القسم 37</span></div>
  <span class="section-number">القسم 37</span>
  <h1 class="section-title">الاستضافة المقترحة</h1>
  <p class="section-subtitle">بنية مبدئية قابلة للنمو.</p>
  <div class="arch">
    <div class="arch-box accent" style="min-width: 200px;">Cloudflare</div>
    <div class="arch-arrow">+</div>
    <div class="arch-box dark" style="min-width: 200px;">Hostinger VPS</div>
    <div class="arch-arrow">+</div>
    <div class="arch-box primary" style="min-width: 200px;">PostgreSQL</div>
  </div>
  <p>ويتم اختيار حجم الخادم بناءً على الحمل الفعلي.</p>
  <p>يمكن البدء بخادم مناسب لحجم العمل الحالي، ثم الترقية عند زيادة عدد الطلبات أو الفروع.</p>
  <p>ولا يلزم شراء خادم ضخم منذ البداية.</p>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 40</span></div>
</div>

<div class="page">
  <div class="page-header"><span class="page-header-brand">دولمه فاكتوري</span><span>القسم 38</span></div>
  <span class="section-number">القسم 38</span>
  <h1 class="section-title">سياسة التوسع</h1>
  <p class="section-subtitle">التوسع التدريجي حسب الحاجة.</p>
  <p>النظام سيكون قابلاً للتوسع تدريجياً.</p>
  <p>عند زيادة عدد الطلبات:</p>
  <div class="flow">
    <div class="flow-step primary">زيادة موارد VPS</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step accent">Redis / Queue</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step dark">Managed Database / Load Balancing / Multiple Application Instances</div>
  </div>
  <p>وبالتالي لا يتم تحميل المطعم تكلفة البنية الكبيرة منذ اليوم الأول.</p>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 41</span></div>
</div>

<div class="page">
  <div class="page-header"><span class="page-header-brand">دولمه فاكتوري</span><span>القسم 39</span></div>
  <span class="section-number">القسم 39</span>
  <h1 class="section-title">الضمان</h1>
  <p class="section-subtitle">ضمان مجاني لمدة 90 يوماً.</p>
  <div class="card card-primary" style="text-align: center; padding: 24px;">
    <div style="font-size: 32pt; font-weight: 900; color: var(--primary); line-height: 1;">90</div>
    <div style="font-size: 12pt; font-weight: 700; color: var(--charcoal); margin-top: 8px;">يوم ضمان مجاني</div>
  </div>
  <h3 class="mini-title">يشمل:</h3>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إصلاح الأخطاء البرمجية الناتجة عن نطاق المشروع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">معالجة المشاكل التي تمنع الخصائص المتفق عليها من العمل</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">معالجة مشاكل الاستقرار المتعلقة بالنظام المطور</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الدعم الأساسي خلال فترة الضمان</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">متابعة تشغيل النظام بعد الإطلاق</div></div>
  </div>
  <div class="callout callout-success">
    <div class="callout-title">✓ لا توجد صيانة شهرية إلزامية</div>
    <p>بعد انتهاء فترة الضمان: لا توجد رسوم اشتراك شهرية إجبارية على المطعم.</p>
  </div>
  <p>وفي حال طلب ميزة جديدة أو تعديل كبير أو تكامل جديد أو تغيير في آلية العمل أو تطبيق Native أو تكامل API جديد أو تطوير إضافي — يتم تقديم سعر مستقل قبل التنفيذ.</p>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 42</span></div>
</div>

<div class="page">
  <div class="page-header"><span class="page-header-brand">دولمه فاكتوري</span><span>القسم 40</span></div>
  <span class="section-number">القسم 40</span>
  <h1 class="section-title">ما لا يشمله سعر التطوير</h1>
  <p class="section-subtitle">غير مشمول ضمن قيمة الباقة.</p>
  <table>
    <thead><tr><th style="width: 70%;">البند</th><th>الحالة</th></tr></thead>
    <tbody>
      <tr><td>رسوم الدومين</td><td>غير مشمول</td></tr>
      <tr><td>رسوم الاستضافة</td><td>غير مشمول</td></tr>
      <tr><td>رسوم بوابة الدفع</td><td>غير مشمول</td></tr>
      <tr><td>عمولات عمليات الدفع</td><td>غير مشمول</td></tr>
      <tr><td>رسوم Tabby</td><td>غير مشمول</td></tr>
      <tr><td>رسوم Tamara</td><td>غير مشمول</td></tr>
      <tr><td>رسوم WhatsApp</td><td>غير مشمول</td></tr>
      <tr><td>رسوم Google Maps</td><td>غير مشمول</td></tr>
      <tr><td>رسوم SMS</td><td>غير مشمول</td></tr>
      <tr><td>رسوم خدمات خارجية</td><td>غير مشمول</td></tr>
      <tr><td>أجهزة Tablet</td><td>غير مشمول</td></tr>
      <tr><td>أجهزة هواتف المندوبين</td><td>غير مشمول</td></tr>
      <tr><td>باقات الإنترنت</td><td>غير مشمول</td></tr>
      <tr><td>أجهزة GPS مستقلة</td><td>غير مشمول</td></tr>
      <tr><td>أي API مدفوعة من طرف ثالث</td><td>غير مشمول</td></tr>
      <tr><td>تكامل SnaPOS ما لم يتم توفير API رسمي وموثق</td><td>غير مشمول</td></tr>
      <tr><td>تطبيقات Native مستقلة Android / iOS ما لم يتم الاتفاق عليها</td><td>غير مشمول</td></tr>
      <tr><td>أي تطوير جديد خارج نطاق الباقة</td><td>غير مشمول</td></tr>
    </tbody>
  </table>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 43</span></div>
</div>
PKGEOF

echo ""
echo "✅ تم إضافة الأقسام 26-40"
ls -lh public/proposal.html
