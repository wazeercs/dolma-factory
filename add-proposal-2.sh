#!/data/data/com.termux/files/usr/bin/bash

cat >> public/proposal.html << 'PART2EOF'

<div class="page">
  <div class="page-header">
    <span class="page-header-brand">دولمه فاكتوري — العرض التجاري والفني</span>
    <span>القسم 01</span>
  </div>
  <span class="section-number">القسم 01</span>
  <h1 class="section-title">الملخص التنفيذي</h1>
  <p class="section-subtitle">نظام رقمي متكامل يمنح المطعم ملكية كاملة لمنظومة الطلبات والتوصيل.</p>
  <p>يهدف المشروع إلى تطوير نظام طلبات وتوصيل رقمي مخصص من الصفر لمطعم دولمه فاكتوري، بحيث يكون النظام ملكاً للمطعم وقابلاً للتوسع مستقبلاً مع زيادة عدد الفروع والطلبات.</p>
  <p>سيتم بناء النظام كتطبيق ويب تقدمي PWA – Progressive Web App يعمل مباشرة من المتصفح على الجوال والكمبيوتر والتابلت، دون الحاجة في المرحلة الأولى إلى تطوير تطبيقات Android وiOS منفصلة.</p>
  <p>النظام المقترح سيغطي دورة الطلب من لحظة دخول العميل إلى قائمة الطعام وحتى استلام الطلب من مندوب التوصيل، مع توفير لوحة تحكم للإدارة ونظام تشغيل للفروع ونظام خاص بالمندوبين.</p>
  <p>كما سيتم تصميم البنية التقنية بحيث تتحمل الحمل الطبيعي للمطعم، مع إمكانية التعامل مع الارتفاع المفاجئ في عدد الزوار والطلبات الناتج عن الحملات الإعلانية، مثل حملات Snapchat.</p>
  <h2 class="sub-title">نظرة سريعة على المشروع</h2>
  <div class="grid-4">
    <div class="stat"><div class="stat-value">2</div><div class="stat-label">فرعان</div></div>
    <div class="stat"><div class="stat-value">≈70</div><div class="stat-label">طلب يومي</div></div>
    <div class="stat"><div class="stat-value">4</div><div class="stat-label">واجهات رئيسية</div></div>
    <div class="stat"><div class="stat-value">PWA</div><div class="stat-label">تقنية البناء</div></div>
  </div>
  <h2 class="sub-title">مسار الطلب</h2>
  <div class="flow">
    <div class="flow-step dark">Customer</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step primary">PWA</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step accent">Payment</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step">Branch</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step">SnaPOS</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step">Preparation</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step primary">Driver</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step success">Delivery</div>
  </div>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 3</span></div>
</div>

<div class="page">
  <div class="page-header">
    <span class="page-header-brand">دولمه فاكتوري — العرض التجاري والفني</span>
    <span>القسم 02</span>
  </div>
  <span class="section-number">القسم 02</span>
  <h1 class="section-title">الوضع التشغيلي المستهدف</h1>
  <p class="section-subtitle">فهم دقيق لحجم العمل الحالي والمتطلبات التشغيلية.</p>
  <h2 class="sub-title">الوضع الحالي</h2>
  <p>المطعم يعمل حالياً من خلال:</p>
  <ul>
    <li>فرعين.</li>
    <li>مندوب توصيل خاص بكل فرع.</li>
    <li>متوسط تقريبي يصل إلى حوالي 35 طلباً يومياً لكل فرع.</li>
    <li>إجمالي تقريبي يصل إلى حوالي 70 طلباً يومياً حالياً.</li>
    <li>وجود نظام نقاط بيع SnaPOS داخل المطعم.</li>
    <li>الحاجة إلى استقبال الطلبات الإلكترونية على أجهزة Tablet داخل الفروع.</li>
    <li>الحاجة إلى توجيه الطلب إلى الفرع المناسب ثم إلى مندوب الفرع.</li>
  </ul>
  <h2 class="sub-title">آلية العمل المقترحة</h2>
  <div class="flow-inline">
    <div class="flow-step">العميل</div><span class="flow-arrow">←</span>
    <div class="flow-step">الموقع / PWA</div><span class="flow-arrow">←</span>
    <div class="flow-step">الطلب</div><span class="flow-arrow">←</span>
    <div class="flow-step">الدفع</div><span class="flow-arrow">←</span>
    <div class="flow-step">الفرع</div>
  </div>
  <div class="flow-inline">
    <div class="flow-step">إدخال الطلب في SnaPOS</div><span class="flow-arrow">←</span>
    <div class="flow-step">تجهيز الطلب</div><span class="flow-arrow">←</span>
    <div class="flow-step">المندوب</div><span class="flow-arrow">←</span>
    <div class="flow-step">التوصيل</div><span class="flow-arrow">←</span>
    <div class="flow-step success">إغلاق الطلب</div>
  </div>
  <div class="callout callout-info">
    <div class="callout-title">ملاحظة</div>
    النظام مصمم ليتكامل مع الوضع الحالي للمطعم، مع الحفاظ على استمرارية العمل اليومي دون تعطيل المبيعات.
  </div>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 4</span></div>
</div>

<div class="page">
  <div class="page-header">
    <span class="page-header-brand">دولمه فاكتوري — العرض التجاري والفني</span>
    <span>القسم 03</span>
  </div>
  <span class="section-number">القسم 03</span>
  <h1 class="section-title">لماذا PWA بدلاً من التطبيقات التقليدية؟</h1>
  <p class="section-subtitle">تجربة قريبة من التطبيقات التقليدية بتكلفة أقل وسرعة تطوير أعلى.</p>
  <p>سيتم استخدام تقنية PWA لأنها توفر تجربة قريبة من التطبيقات التقليدية مع تقليل تكلفة التطوير والتشغيل.</p>
  <h2 class="sub-title">المزايا</h2>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تعمل على Android و iPhone والكمبيوتر والتابلت.</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">لا تحتاج إلى تحميل من Google Play أو App Store.</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">يمكن إضافة اختصار إلى الشاشة الرئيسية.</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تحديث النظام يتم مركزياً دون مطالبة العميل بتحديث التطبيق.</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">سرعة تطوير أعلى.</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تكلفة أقل من بناء تطبيقين Native منفصلين.</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">مناسبة جداً لنظام الطلبات والمطاعم.</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">يمكن تطوير تطبيقات Native مستقبلاً إذا أصبح ذلك مطلوباً.</div></div>
  </div>
  <h2 class="sub-title">One Codebase → Multiple Devices</h2>
  <div class="arch">
    <div class="arch-box primary" style="min-width: 200px;">One Codebase</div>
    <div class="arch-arrow">↓</div>
    <div class="arch-row">
      <div class="arch-box">Android</div>
      <div class="arch-box">iPhone</div>
      <div class="arch-box">Tablet</div>
      <div class="arch-box">Desktop</div>
    </div>
  </div>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 5</span></div>
</div>

<div class="page">
  <div class="page-header">
    <span class="page-header-brand">دولمه فاكتوري — العرض التجاري والفني</span>
    <span>القسم 04</span>
  </div>
  <span class="section-number">القسم 04</span>
  <h1 class="section-title">مكونات النظام</h1>
  <p class="section-subtitle">يتكون النظام من أربع واجهات رئيسية.</p>
  <div class="grid-2">
    <div class="card card-primary">
      <div class="card-title">🛒 Customer PWA</div>
      <p style="font-size: 10pt; margin: 0;">واجهة العميل — لعملاء المطعم. تجربة الطلب الكاملة من التصفح إلى التتبع.</p>
    </div>
    <div class="card card-primary">
      <div class="card-title">🖥️ Branch / Tablet</div>
      <p style="font-size: 10pt; margin: 0;">واجهة الفرع — لاستقبال الطلبات وتشغيلها داخل الفرع على جهاز Tablet.</p>
    </div>
    <div class="card card-primary">
      <div class="card-title">📊 Admin Dashboard</div>
      <p style="font-size: 10pt; margin: 0;">لوحة الإدارة — لإدارة النظام والفروع والمنتجات والطلبات والتقارير.</p>
    </div>
    <div class="card card-primary">
      <div class="card-title">🛵 Driver PWA</div>
      <p style="font-size: 10pt; margin: 0;">واجهة المندوب — للمندوبين واستلام الطلبات وتنفيذ عمليات التوصيل.</p>
    </div>
  </div>
  <div class="callout callout-info">
    <div class="callout-title">نظرة عامة</div>
    الواجهات الأربع متكاملة وتعمل بمزامنة فورية عبر Realtime.
  </div>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 6</span></div>
</div>

<div class="page">
  <div class="page-header">
    <span class="page-header-brand">دولمه فاكتوري — العرض التجاري والفني</span>
    <span>القسم 05</span>
  </div>
  <span class="section-number">القسم 05</span>
  <h1 class="section-title">واجهة العميل — Customer PWA</h1>
  <p class="section-subtitle">تجربة طلب سلسة من التصفح إلى التتبع.</p>
  <h2 class="sub-title">تصفح المنتجات</h2>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الصفحة الرئيسية</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">اختيار الفرع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">عرض الأقسام</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">عرض المنتجات</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">صور المنتجات</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تفاصيل المنتج</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الإضافات والخيارات</div></div>
  </div>
  <h2 class="sub-title">الطلب</h2>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">سلة المشتريات</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تحديد عنوان التوصيل</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تحديد الموقع عند الحاجة</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">حساب قيمة الطلب</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">رسوم التوصيل</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إدخال بيانات العميل</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">اختيار طريقة الدفع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الدفع الإلكتروني</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الدفع عند الاستلام حسب إعدادات المطعم</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تأكيد الطلب</div></div>
  </div>
  <h2 class="sub-title">بعد الطلب</h2>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">رقم الطلب</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">متابعة حالة الطلب</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">التواصل أو الانتقال إلى الخرائط عند الحاجة</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إشعارات حالة الطلب</div></div>
  </div>
  <h2 class="sub-title">بيانات العميل الأساسية</h2>
  <ul>
    <li>الاسم.</li>
    <li>رقم الجوال.</li>
    <li>العنوان.</li>
    <li>الموقع الجغرافي عند الحاجة.</li>
    <li>ملاحظات الطلب.</li>
  </ul>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 7</span></div>
</div>

<div class="page">
  <div class="page-header">
    <span class="page-header-brand">دولمه فاكتوري — العرض التجاري والفني</span>
    <span>القسم 06</span>
  </div>
  <span class="section-number">القسم 06</span>
  <h1 class="section-title">واجهة الفرع — Branch Tablet</h1>
  <p class="section-subtitle">تشغيل الطلبات داخل الفرع على جهاز Tablet.</p>
  <p>يتم تشغيل الواجهة على جهاز Tablet داخل كل فرع.</p>
  <h2 class="sub-title">عند وصول طلب جديد</h2>
  <ol>
    <li>يظهر الطلب مباشرة.</li>
    <li>يصدر تنبيه صوتي ومرئي.</li>
    <li>تظهر بيانات العميل.</li>
    <li>تظهر المنتجات والكميات والإضافات.</li>
    <li>تظهر طريقة الدفع.</li>
    <li>تظهر قيمة الطلب.</li>
    <li>يظهر عنوان التوصيل.</li>
    <li>يقوم موظف الفرع باستلام الطلب.</li>
    <li>يتم إدخال الطلب في SnaPOS يدوياً في المرحلة الأولى.</li>
    <li>يتم تحديد أن الطلب تم إدخاله في نظام المطعم.</li>
    <li>يبدأ تجهيز الطلب.</li>
    <li>عند الجاهزية يتم تحويله إلى المندوب.</li>
  </ol>
  <h2 class="sub-title">SnaPOS Integration</h2>
  <div class="callout callout-warn">
    <div class="callout-title">ملاحظة مهمة حول SnaPOS</div>
    تكامل النظام مع SnaPOS بشكل آلي لا يدخل ضمن نطاق التنفيذ الأساسي إلا في حال توفير API رسمي وموثق وقابل للاستخدام من SnaPOS.
    <br/><br/>
    <strong>في حالة عدم وجود API رسمي، ستكون الآلية:</strong>
    <div class="flow-inline" style="margin-top: 10px;">
      <div class="flow-step">النظام الإلكتروني</div>
      <span class="flow-arrow">←</span>
      <div class="flow-step">موظف الفرع</div>
      <span class="flow-arrow">←</span>
      <div class="flow-step">إدخال الطلب في SnaPOS</div>
    </div>
    <br/>
    وفي حال توفر API رسمي مستقبلاً يمكن تطوير التكامل الآلي كمرحلة مستقلة.
  </div>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 8</span></div>
</div>

<div class="page">
  <div class="page-header">
    <span class="page-header-brand">دولمه فاكتوري — العرض التجاري والفني</span>
    <span>القسم 07</span>
  </div>
  <span class="section-number">القسم 07</span>
  <h1 class="section-title">واجهة المندوب — Driver PWA</h1>
  <p class="section-subtitle">واجهة مخصصة للمندوبين لاستلام وتنفيذ عمليات التوصيل.</p>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تسجيل الدخول</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">عرض الطلبات المسندة</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">بيانات العميل</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">رقم الجوال</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">عنوان العميل</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تفاصيل الطلب</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">قيمة الطلب</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">طريقة الدفع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">فتح الموقع في Google Maps</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">بدء التوصيل</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تغيير حالة الطلب</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تأكيد التسليم</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تسجيل فشل التسليم عند الحاجة</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">معرفة الطلبات السابقة</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">حالة المندوب</div></div>
  </div>
  <h2 class="sub-title">التتبع الجغرافي GPS</h2>
  <p>في الباقة التي تشمل GPS يمكن استخدام GPS الموجود في هاتف المندوب نفسه دون الحاجة إلى جهاز تتبع مستقل.</p>
  <div class="arch">
    <div class="arch-row">
      <div class="arch-box">Driver Phone</div><div class="arch-arrow">→</div>
      <div class="arch-box primary">GPS</div><div class="arch-arrow">→</div>
      <div class="arch-box">Order</div><div class="arch-arrow">→</div>
      <div class="arch-box accent">Map</div><div class="arch-arrow">→</div>
      <div class="arch-box dark">Customer</div>
    </div>
  </div>
  <h3 class="mini-title">يبدأ التتبع عند:</h3>
  <div class="flow-inline">
    <div class="flow-step primary">OUT_FOR_DELIVERY</div>
    <span class="flow-arrow">←</span>
    <div class="flow-step">خرج للتوصيل</div>
  </div>
  <h3 class="mini-title">ويتوقف عند:</h3>
  <div class="flow-inline">
    <div class="flow-step success">DELIVERED</div>
    <span class="flow-arrow">←</span>
    <div class="flow-step">تم التسليم</div>
  </div>
  <p>ولا يتم تشغيل التتبع طوال اليوم دون حاجة، لتقليل استهلاك البطارية والبيانات وحماية الخصوصية.</p>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 9</span></div>
</div>

<div class="page">
  <div class="page-header">
    <span class="page-header-brand">دولمه فاكتوري — العرض التجاري والفني</span>
    <span>القسم 08</span>
  </div>
  <span class="section-number">القسم 08</span>
  <h1 class="section-title">لوحة الإدارة — Admin Dashboard</h1>
  <p class="section-subtitle">التحكم الكامل في النظام من خلال لوحة مركزية.</p>
  <h2 class="sub-title">لوحة المعلومات الرئيسية</h2>
  <div class="grid-4">
    <div class="stat"><div class="stat-value">—</div><div class="stat-label">طلبات اليوم</div></div>
    <div class="stat"><div class="stat-value">—</div><div class="stat-label">المبيعات</div></div>
    <div class="stat"><div class="stat-value">—</div><div class="stat-label">جديد</div></div>
    <div class="stat"><div class="stat-value">—</div><div class="stat-label">قيد التجهيز</div></div>
    <div class="stat"><div class="stat-value">—</div><div class="stat-label">جاهز</div></div>
    <div class="stat"><div class="stat-value">—</div><div class="stat-label">خرج للتوصيل</div></div>
    <div class="stat"><div class="stat-value">—</div><div class="stat-label">مكتمل</div></div>
    <div class="stat"><div class="stat-value">—</div><div class="stat-label">ملغي</div></div>
  </div>
  <p style="font-size: 9pt; color: var(--muted); margin-top: 8px;">* الأرقام المعروضة Placeholder لأغراض التوضيح البصري فقط.</p>
  <h2 class="sub-title">إدارة الفروع</h2>
  <ul>
    <li>إضافة فرع.</li>
    <li>تعديل الفرع.</li>
    <li>تحديد ساعات العمل.</li>
    <li>تحديد منطقة الخدمة.</li>
    <li>ربط الموظفين بالفرع.</li>
    <li>ربط المندوب بالفرع.</li>
  </ul>
  <h2 class="sub-title">إدارة المنتجات</h2>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الأقسام</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">المنتجات</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الأسعار</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الصور</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الإضافات</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">الخيارات</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">حالة المنتج</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">إخفاء / إظهار المنتج</div></div>
  </div>
  <h2 class="sub-title">إدارة مناطق التوصيل</h2>
  <ul>
    <li>مناطق التوصيل.</li>
    <li>رسوم التوصيل.</li>
    <li>الحد الأدنى للطلب.</li>
    <li>إمكانية تحديد المناطق حسب الفرع.</li>
  </ul>
  <h2 class="sub-title">إدارة المستخدمين والصلاحيات</h2>
  <table>
    <thead><tr><th>الدور</th><th>الصلاحيات</th></tr></thead>
    <tbody>
      <tr><td><strong>Super Admin</strong></td><td>جميع الصلاحيات</td></tr>
      <tr><td><strong>Branch Manager</strong></td><td>إدارة الفرع والطلبات</td></tr>
      <tr><td><strong>Branch Employee</strong></td><td>تشغيل الطلبات</td></tr>
      <tr><td><strong>Driver</strong></td><td>الطلبات المسندة والتوصيل</td></tr>
      <tr><td><strong>Viewer / Accountant</strong></td><td>التقارير والمشاهدة</td></tr>
    </tbody>
  </table>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 10</span></div>
</div>

<div class="page">
  <div class="page-header">
    <span class="page-header-brand">دولمه فاكتوري — العرض التجاري والفني</span>
    <span>القسم 09</span>
  </div>
  <span class="section-number">القسم 09</span>
  <h1 class="section-title">حالات الطلب</h1>
  <p class="section-subtitle">دورة واضحة ومنطقية لكل طلب من لحظة الإنشاء إلى التسليم.</p>
  <div class="flow">
    <div class="flow-step">NEW</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step">PAYMENT_PENDING</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step">PAID / COD_CONFIRMED</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step">BRANCH_RECEIVED</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step">POS_ENTERED</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step primary">PREPARING</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step primary">READY</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step accent">ASSIGNED_TO_DRIVER</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step accent">OUT_FOR_DELIVERY</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-step success">DELIVERED</div>
  </div>
  <h2 class="sub-title">حالات إضافية</h2>
  <div class="grid-3">
    <div class="card" style="border-right: 4px solid var(--danger);"><div class="card-title">PAYMENT_FAILED</div><p style="margin: 0; font-size: 10pt; color: var(--muted);">فشل الدفع</p></div>
    <div class="card" style="border-right: 4px solid var(--danger);"><div class="card-title">CANCELLED</div><p style="margin: 0; font-size: 10pt; color: var(--muted);">إلغاء الطلب</p></div>
    <div class="card" style="border-right: 4px solid var(--danger);"><div class="card-title">REFUNDED</div><p style="margin: 0; font-size: 10pt; color: var(--muted);">استرداد المبلغ</p></div>
  </div>
  <h2 class="sub-title">Order Status History</h2>
  <div class="callout callout-info">
    <div class="callout-title">سجل تغييرات حالة الطلب</div>
    سيتم حفظ سجل تغييرات حالة الطلب لمراجعة ما حدث للطلب ومتى ومن قام بالتغيير.
    <div class="grid-3" style="margin-top: 12px;">
      <div class="stat"><div class="stat-value" style="font-size: 14pt;">ماذا؟</div><div class="stat-label">الحالة الجديدة</div></div>
      <div class="stat"><div class="stat-value" style="font-size: 14pt;">متى؟</div><div class="stat-label">الوقت والتاريخ</div></div>
      <div class="stat"><div class="stat-value" style="font-size: 14pt;">من؟</div><div class="stat-label">المستخدم</div></div>
    </div>
  </div>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 11</span></div>
</div>

<div class="page">
  <div class="page-header">
    <span class="page-header-brand">دولمه فاكتوري — العرض التجاري والفني</span>
    <span>القسم 10</span>
  </div>
  <span class="section-number">القسم 10</span>
  <h1 class="section-title">الدفع الإلكتروني</h1>
  <p class="section-subtitle">دعم بوابة دفع إلكتروني مناسبة للسوق السعودي.</p>
  <p>يمكن دعم بوابة دفع إلكتروني مناسبة للسوق السعودي، مثل مزودي خدمات الدفع الذين يدعمون الوسائل المطلوبة من المطعم.</p>
  <h2 class="sub-title">وسائل الدفع المدعومة</h2>
  <p>بحسب مزود الخدمة والعقد، يمكن دعم وسائل مثل:</p>
  <div class="grid-5">
    <div class="card" style="text-align: center;"><strong>مدى</strong></div>
    <div class="card" style="text-align: center;"><strong>Visa</strong></div>
    <div class="card" style="text-align: center;"><strong>Mastercard</strong></div>
    <div class="card" style="text-align: center;"><strong>Apple Pay</strong></div>
    <div class="card" style="text-align: center; font-size: 9pt;">وسائل أخرى</div>
  </div>
  <h2 class="sub-title">آلية الدفع</h2>
  <p>لن يتم اعتماد نجاح الدفع بناءً على عودة العميل من صفحة الدفع فقط.</p>
  <p>سيتم استخدام:</p>
  <div class="arch">
    <div class="arch-box dark">Payment Gateway</div>
    <div class="arch-arrow">↓</div>
    <div class="arch-box accent">Verified Webhook</div>
    <div class="arch-arrow">↓</div>
    <div class="arch-box primary">Server</div>
    <div class="arch-arrow">↓</div>
    <div class="arch-box success">تحديث حالة الدفع</div>
  </div>
  <p>وذلك لتقليل مشاكل الدفع المكرر أو الطلبات التي تم إنشاؤها دون نجاح العملية المالية.</p>
  <h2 class="sub-title">الحماية</h2>
  <div class="feature-grid">
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">التحقق من Webhook</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">منع تكرار العملية</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">Idempotency</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">تسجيل عمليات الدفع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">معالجة فشل الدفع</div></div>
    <div class="feature"><div class="feature-check">✓</div><div class="feature-text">دعم الإلغاء والاسترداد حسب إمكانيات بوابة الدفع</div></div>
  </div>
  <div class="callout callout-danger">
    <div class="callout-title">⚠️ حماية بيانات البطاقات</div>
    ولا يتم تخزين بيانات البطاقات البنكية داخل النظام.
  </div>
  <div class="page-footer"><span>دولمه فاكتوري</span><span>صفحة 12</span></div>
</div>
PART2EOF

echo ""
echo "✅ تم إضافة الأقسام 1-10"
ls -lh public/proposal.html
