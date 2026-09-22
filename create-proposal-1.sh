#!/data/data/com.termux/files/usr/bin/bash

mkdir -p public

cat > public/proposal.html << 'PART1EOF'
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>دولمه فاكتوري - العرض التجاري والفني</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
  :root {
    --primary: #0F766E;
    --primary-dark: #115E59;
    --primary-light: #14B8A6;
    --charcoal: #1F2937;
    --accent: #F59E0B;
    --accent-dark: #D97706;
    --bg: #F9FAFB;
    --surface: #FFFFFF;
    --border: #E5E7EB;
    --text: #111827;
    --muted: #6B7280;
    --success: #10B981;
    --danger: #EF4444;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Cairo', sans-serif;
    background: #E5E7EB;
    color: var(--text);
    direction: rtl;
    text-align: right;
    line-height: 1.7;
    font-size: 11pt;
  }
  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 18mm 16mm 20mm 16mm;
    margin: 8mm auto;
    background: var(--surface);
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    position: relative;
    page-break-after: always;
    overflow: hidden;
  }
  .cover {
    background: linear-gradient(135deg, var(--charcoal) 0%, var(--primary-dark) 100%);
    color: white;
    padding: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }
  .cover::before {
    content: '';
    position: absolute;
    top: -100px; left: -100px;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(20,184,166,0.25) 0%, transparent 70%);
  }
  .cover::after {
    content: '';
    position: absolute;
    bottom: -150px; right: -150px;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%);
  }
  .cover-inner {
    padding: 30mm 20mm;
    display: flex;
    flex-direction: column;
    height: 297mm;
    position: relative;
    z-index: 1;
  }
  .cover-badge {
    display: inline-block;
    padding: 6px 16px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 999px;
    font-size: 10pt;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 20px;
    width: fit-content;
  }
  .cover h1 {
    font-size: 30pt;
    font-weight: 900;
    line-height: 1.2;
    margin-bottom: 12px;
  }
  .cover h2 {
    font-size: 16pt;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    margin-bottom: 40px;
  }
  .cover-brand {
    font-size: 22pt;
    font-weight: 700;
    color: var(--accent);
    margin-bottom: 60px;
    padding-bottom: 20px;
    border-bottom: 2px solid rgba(245,158,11,0.3);
  }
  .cover-meta {
    margin-top: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding-top: 30px;
    border-top: 1px solid rgba(255,255,255,0.15);
  }
  .cover-meta-item {
    font-size: 10pt;
    color: rgba(255,255,255,0.7);
  }
  .cover-meta-item strong {
    display: block;
    color: white;
    font-size: 11pt;
    font-weight: 700;
    margin-top: 4px;
  }
  .cover-scope {
    grid-column: 1 / -1;
    padding: 16px;
    background: rgba(255,255,255,0.08);
    border-radius: 12px;
    border-right: 3px solid var(--accent);
  }
  .cover-scope-label {
    font-size: 9pt;
    color: rgba(255,255,255,0.6);
    margin-bottom: 6px;
  }
  .cover-scope-value {
    font-size: 11pt;
    font-weight: 600;
    line-height: 1.6;
  }
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--border);
    margin-bottom: 24px;
    font-size: 9pt;
    color: var(--muted);
  }
  .page-header-brand {
    font-weight: 700;
    color: var(--primary);
  }
  .page-footer {
    position: absolute;
    bottom: 10mm;
    left: 16mm;
    right: 16mm;
    display: flex;
    justify-content: space-between;
    font-size: 8pt;
    color: var(--muted);
    padding-top: 8px;
    border-top: 1px solid var(--border);
  }
  .section-number {
    display: inline-block;
    padding: 4px 12px;
    background: var(--primary);
    color: white;
    border-radius: 6px;
    font-size: 9pt;
    font-weight: 700;
    margin-bottom: 10px;
  }
  h1.section-title {
    font-size: 20pt;
    font-weight: 900;
    color: var(--charcoal);
    margin-bottom: 8px;
    line-height: 1.3;
  }
  .section-subtitle {
    font-size: 11pt;
    color: var(--muted);
    margin-bottom: 24px;
    line-height: 1.6;
  }
  h2.sub-title {
    font-size: 14pt;
    font-weight: 700;
    color: var(--primary-dark);
    margin: 24px 0 12px 0;
    padding-right: 12px;
    border-right: 4px solid var(--accent);
  }
  h3.mini-title {
    font-size: 12pt;
    font-weight: 700;
    color: var(--charcoal);
    margin: 16px 0 10px 0;
  }
  p { margin-bottom: 12px; line-height: 1.8; }
  ul, ol { margin: 12px 24px 12px 0; }
  li { margin-bottom: 6px; }
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 18px;
    margin-bottom: 14px;
  }
  .card-primary {
    background: linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%);
    border-color: var(--primary-light);
  }
  .card-accent {
    background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
    border-color: var(--accent);
  }
  .card-charcoal {
    background: var(--charcoal);
    color: white;
    border: none;
  }
  .card-charcoal h3, .card-charcoal h2, .card-charcoal strong { color: white; }
  .card-title {
    font-size: 12pt;
    font-weight: 800;
    color: var(--charcoal);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
  .stat {
    background: white;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px;
    text-align: center;
  }
  .stat-value {
    font-size: 20pt;
    font-weight: 900;
    color: var(--primary);
    line-height: 1.1;
    margin-bottom: 4px;
  }
  .stat-label {
    font-size: 9pt;
    color: var(--muted);
    font-weight: 600;
  }
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .feature {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px;
    background: var(--bg);
    border-radius: 10px;
    border-right: 3px solid var(--primary);
  }
  .feature-check {
    width: 20px; height: 20px;
    background: var(--success);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10pt;
    font-weight: 900;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .feature-text {
    font-size: 10pt;
    line-height: 1.5;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 10pt;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  thead {
    background: var(--charcoal);
    color: white;
  }
  th {
    padding: 12px 10px;
    text-align: right;
    font-weight: 700;
    font-size: 10pt;
    white-space: nowrap;
  }
  td {
    padding: 10px;
    border-bottom: 1px solid var(--border);
    font-size: 10pt;
    vertical-align: top;
  }
  tbody tr:nth-child(even) { background: #FAFAFA; }
  tbody tr:last-child td { border-bottom: none; }
  .table-check { color: var(--success); font-weight: 900; font-size: 12pt; }
  .table-dash { color: #D1D5DB; font-weight: 900; font-size: 12pt; }
  .table-basic { color: var(--accent-dark); font-weight: 700; font-size: 9pt; }
  .table-advanced { color: var(--primary); font-weight: 700; font-size: 9pt; }
  .flow {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 20px 0;
  }
  .flow-step {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    background: white;
    border: 2px solid var(--primary);
    border-radius: 10px;
    margin: 0 auto;
    min-width: 240px;
    font-weight: 700;
    font-size: 10pt;
    text-align: center;
    justify-content: center;
    position: relative;
  }
  .flow-step.primary { background: var(--primary); color: white; border-color: var(--primary); }
  .flow-step.accent { background: var(--accent); color: white; border-color: var(--accent); }
  .flow-step.dark { background: var(--charcoal); color: white; border-color: var(--charcoal); }
  .flow-step.success { background: var(--success); color: white; border-color: var(--success); }
  .flow-step.danger { background: var(--danger); color: white; border-color: var(--danger); }
  .flow-arrow {
    text-align: center;
    color: var(--primary);
    font-size: 14pt;
    line-height: 1;
    margin: 4px 0;
  }
  .flow-inline {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    margin: 16px 0;
  }
  .flow-inline .flow-step { min-width: auto; margin: 0; padding: 8px 14px; font-size: 9pt; }
  .flow-inline .flow-arrow { margin: 0; }
  .callout {
    padding: 14px 16px;
    border-radius: 10px;
    margin: 14px 0;
    border-right: 4px solid;
    font-size: 10pt;
    line-height: 1.6;
  }
  .callout-info { background: #EFF6FF; border-color: #3B82F6; color: #1E40AF; }
  .callout-warn { background: #FFFBEB; border-color: var(--accent); color: #78350F; }
  .callout-danger { background: #FEF2F2; border-color: var(--danger); color: #7F1D1D; }
  .callout-success { background: #F0FDF4; border-color: var(--success); color: #14532D; }
  .callout-title {
    font-weight: 800;
    margin-bottom: 6px;
    font-size: 11pt;
  }
  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    margin: 20px 0;
  }
  .pricing-card {
    border: 2px solid var(--border);
    border-radius: 12px;
    padding: 16px 10px;
    text-align: center;
    background: white;
    position: relative;
  }
  .pricing-card.featured {
    border-color: var(--accent);
    background: linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 100%);
    transform: scale(1.03);
    box-shadow: 0 8px 20px rgba(245,158,11,0.2);
  }
  .pricing-badge {
    position: absolute;
    top: -10px;
    right: 50%;
    transform: translateX(50%);
    background: var(--accent);
    color: white;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 8pt;
    font-weight: 700;
    white-space: nowrap;
  }
  .pricing-name {
    font-size: 11pt;
    font-weight: 800;
    color: var(--charcoal);
    margin-bottom: 8px;
  }
  .pricing-price {
    font-size: 22pt;
    font-weight: 900;
    color: var(--primary);
    line-height: 1;
    margin-bottom: 4px;
  }
  .pricing-currency {
    font-size: 9pt;
    color: var(--muted);
    margin-bottom: 10px;
  }
  .timeline {
    position: relative;
    padding-right: 32px;
    margin: 20px 0;
  }
  .timeline::before {
    content: '';
    position: absolute;
    right: 14px;
    top: 10px;
    bottom: 10px;
    width: 3px;
    background: linear-gradient(180deg, var(--primary) 0%, var(--accent) 100%);
    border-radius: 2px;
  }
  .timeline-item {
    position: relative;
    margin-bottom: 16px;
    padding: 12px 16px;
    background: white;
    border: 1px solid var(--border);
    border-radius: 10px;
  }
  .timeline-item::before {
    content: '';
    position: absolute;
    right: -22px;
    top: 16px;
    width: 12px;
    height: 12px;
    background: var(--primary);
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 2px var(--primary);
  }
  .timeline-title {
    font-weight: 800;
    color: var(--charcoal);
    font-size: 11pt;
    margin-bottom: 6px;
  }
  .timeline-content {
    font-size: 10pt;
    color: var(--muted);
    line-height: 1.6;
  }
  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 8pt;
    font-weight: 700;
    margin: 2px;
  }
  .badge-primary { background: #CCFBF1; color: var(--primary-dark); }
  .badge-accent { background: #FEF3C7; color: #92400E; }
  .badge-success { background: #D1FAE5; color: #065F46; }
  .badge-danger { background: #FEE2E2; color: #991B1B; }
  .arch {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin: 20px 0;
    padding: 20px;
    background: var(--bg);
    border-radius: 12px;
  }
  .arch-row {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .arch-box {
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 9pt;
    font-weight: 700;
    text-align: center;
    min-width: 100px;
    border: 2px solid var(--border);
    background: white;
  }
  .arch-box.primary { background: var(--primary); color: white; border-color: var(--primary); }
  .arch-box.accent { background: var(--accent); color: white; border-color: var(--accent); }
  .arch-box.dark { background: var(--charcoal); color: white; border-color: var(--charcoal); }
  .arch-box.outline { border: 2px dashed var(--primary); color: var(--primary-dark); background: white; }
  .arch-arrow {
    font-size: 12pt;
    color: var(--primary);
    font-weight: 900;
  }
  .toc-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 20px;
    margin: 20px 0;
  }
  .toc-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-bottom: 1px dashed var(--border);
    font-size: 10pt;
  }
  .toc-num {
    display: inline-block;
    width: 22px;
    height: 22px;
    background: var(--primary);
    color: white;
    border-radius: 5px;
    font-size: 8pt;
    font-weight: 700;
    text-align: center;
    line-height: 22px;
    flex-shrink: 0;
  }
  .toc-text { flex: 1; color: var(--charcoal); }
  .no-break { page-break-inside: avoid; }
  @media print {
    body { background: white; }
    .page { margin: 0; box-shadow: none; width: 210mm; min-height: 297mm; }
    @page { size: A4; margin: 0; }
  }
  @media (max-width: 800px) {
    .page { width: 100%; padding: 20px; }
    .grid-2, .grid-3, .grid-4, .grid-5, .pricing-grid, .toc-list { grid-template-columns: 1fr; }
    .feature-grid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>

<div class="page cover">
  <div class="cover-inner">
    <span class="cover-badge">عرض تجاري وفني — 2026</span>
    <h1>نظام الطلبات والتوصيل<br/>الرقمي المخصص</h1>
    <div class="cover-brand">دولمه فاكتوري — Dolma Factory</div>
    <div class="cover-meta">
      <div class="cover-meta-item">
        مقدم العرض
        <strong>مطور النظام</strong>
      </div>
      <div class="cover-meta-item">
        العميل
        <strong>مطعم دولمه فاكتوري — المملكة العربية السعودية</strong>
      </div>
      <div class="cover-meta-item">
        عدد الفروع الحالي
        <strong>فرعان</strong>
      </div>
      <div class="cover-meta-item">
        نوع الوثيقة
        <strong>عرض B2B تجاري وفني</strong>
      </div>
      <div class="cover-scope">
        <div class="cover-scope-label">النطاق</div>
        <div class="cover-scope-value">الطلبات الإلكترونية — إدارة الفروع — التوصيل — الدفع الإلكتروني — الإدارة والتقارير</div>
      </div>
    </div>
  </div>
</div>

<div class="page">
  <div class="page-header">
    <span class="page-header-brand">دولمه فاكتوري — العرض التجاري والفني</span>
    <span>فهرس المحتويات</span>
  </div>
  <h1 class="section-title">فهرس المحتويات</h1>
  <p class="section-subtitle">50 قسماً يغطي كامل نطاق المشروع من الفكرة إلى التسليم.</p>
  <div class="toc-list">
    <div class="toc-item"><span class="toc-num">1</span><span class="toc-text">الملخص التنفيذي</span></div>
    <div class="toc-item"><span class="toc-num">2</span><span class="toc-text">الوضع التشغيلي المستهدف</span></div>
    <div class="toc-item"><span class="toc-num">3</span><span class="toc-text">لماذا PWA</span></div>
    <div class="toc-item"><span class="toc-num">4</span><span class="toc-text">مكونات النظام</span></div>
    <div class="toc-item"><span class="toc-num">5</span><span class="toc-text">واجهة العميل</span></div>
    <div class="toc-item"><span class="toc-num">6</span><span class="toc-text">واجهة الفرع</span></div>
    <div class="toc-item"><span class="toc-num">7</span><span class="toc-text">واجهة المندوب</span></div>
    <div class="toc-item"><span class="toc-num">8</span><span class="toc-text">لوحة الإدارة</span></div>
    <div class="toc-item"><span class="toc-num">9</span><span class="toc-text">حالات الطلب</span></div>
    <div class="toc-item"><span class="toc-num">10</span><span class="toc-text">الدفع الإلكتروني</span></div>
    <div class="toc-item"><span class="toc-num">11</span><span class="toc-text">Tabby و Tamara</span></div>
    <div class="toc-item"><span class="toc-num">12</span><span class="toc-text">WhatsApp Notifications</span></div>
    <div class="toc-item"><span class="toc-num">13</span><span class="toc-text">الخرائط و Google Maps</span></div>
    <div class="toc-item"><span class="toc-num">14</span><span class="toc-text">نظام GPS والتتبع</span></div>
    <div class="toc-item"><span class="toc-num">15</span><span class="toc-text">نظام الحملات الإعلانية</span></div>
    <div class="toc-item"><span class="toc-num">16</span><span class="toc-text">وضع ضغط الطلبات</span></div>
    <div class="toc-item"><span class="toc-num">17</span><span class="toc-text">البنية التقنية</span></div>
    <div class="toc-item"><span class="toc-num">18</span><span class="toc-text">Cloudflare</span></div>
    <div class="toc-item"><span class="toc-num">19</span><span class="toc-text">تخزين الصور والملفات</span></div>
    <div class="toc-item"><span class="toc-num">20</span><span class="toc-text">قاعدة البيانات</span></div>
    <div class="toc-item"><span class="toc-num">21</span><span class="toc-text">Redis والـ Queue</span></div>
    <div class="toc-item"><span class="toc-num">22</span><span class="toc-text">الحماية والأمان</span></div>
    <div class="toc-item"><span class="toc-num">23</span><span class="toc-text">النسخ الاحتياطي</span></div>
    <div class="toc-item"><span class="toc-num">24</span><span class="toc-text">المراقبة والتنبيه</span></div>
    <div class="toc-item"><span class="toc-num">25</span><span class="toc-text">الأداء وتحمل الضغط</span></div>
    <div class="toc-item"><span class="toc-num">26</span><span class="toc-text">إدارة الطلبات المكررة</span></div>
    <div class="toc-item"><span class="toc-num">27</span><span class="toc-text">الملكية والحسابات</span></div>
    <div class="toc-item"><span class="toc-num">28</span><span class="toc-text">الباقة الأولى — Starter</span></div>
    <div class="toc-item"><span class="toc-num">29</span><span class="toc-text">الباقة الثانية — Basic</span></div>
    <div class="toc-item"><span class="toc-num">30</span><span class="toc-text">الباقة الثالثة — Business</span></div>
    <div class="toc-item"><span class="toc-num">31</span><span class="toc-text">الباقة الرابعة — Professional</span></div>
    <div class="toc-item"><span class="toc-num">32</span><span class="toc-text">الباقة الخامسة — Enterprise</span></div>
    <div class="toc-item"><span class="toc-num">33</span><span class="toc-text">مقارنة الباقات</span></div>
    <div class="toc-item"><span class="toc-num">34</span><span class="toc-text">الباقة المقترحة</span></div>
    <div class="toc-item"><span class="toc-num">35</span><span class="toc-text">إضافة GPS</span></div>
    <div class="toc-item"><span class="toc-num">36</span><span class="toc-text">التكلفة التشغيلية</span></div>
    <div class="toc-item"><span class="toc-num">37</span><span class="toc-text">الاستضافة المقترحة</span></div>
    <div class="toc-item"><span class="toc-num">38</span><span class="toc-text">سياسة التوسع</span></div>
    <div class="toc-item"><span class="toc-num">39</span><span class="toc-text">الضمان</span></div>
    <div class="toc-item"><span class="toc-num">40</span><span class="toc-text">ما لا يشمله سعر التطوير</span></div>
    <div class="toc-item"><span class="toc-num">41</span><span class="toc-text">الخصوصية وحماية البيانات</span></div>
    <div class="toc-item"><span class="toc-num">42</span><span class="toc-text">الفوترة الإلكترونية</span></div>
    <div class="toc-item"><span class="toc-num">43</span><span class="toc-text">مراحل تنفيذ المشروع</span></div>
    <div class="toc-item"><span class="toc-num">44</span><span class="toc-text">الاختبار قبل الإطلاق</span></div>
    <div class="toc-item"><span class="toc-num">45</span><span class="toc-text">التسليم النهائي</span></div>
    <div class="toc-item"><span class="toc-num">46</span><span class="toc-text">سياسة التعديلات</span></div>
    <div class="toc-item"><span class="toc-num">47</span><span class="toc-text">القيمة التجارية</span></div>
    <div class="toc-item"><span class="toc-num">48</span><span class="toc-text">السعر الخاص بالمشروع</span></div>
    <div class="toc-item"><span class="toc-num">49</span><span class="toc-text">ملاحظة تجارية مهمة</span></div>
    <div class="toc-item"><span class="toc-num">50</span><span class="toc-text">الخلاصة</span></div>
  </div>
  <div class="page-footer">
    <span>وثيقة تجارية وفنية</span>
    <span>صفحة 2</span>
  </div>
</div>
PART1EOF

echo ""
echo "✅ تم إنشاء الجزء الأول من proposal.html"
ls -lh public/proposal.html
