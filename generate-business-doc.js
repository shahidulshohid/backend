const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <title>Project Overview & Business Logic Documentation</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

        @page {
            size: A4;
            margin: 18mm 15mm 20mm 15mm;
            @bottom-right {
                content: "Page " counter(page) " of " counter(pages);
                font-family: 'Hind Siliguri', sans-serif;
                font-size: 10px;
                color: #64748b;
            }
        }

        body {
            font-family: 'Hind Siliguri', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1e293b;
            line-height: 1.6;
            font-size: 13px;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }

        .header-container {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #ffffff;
            padding: 28px 30px;
            border-radius: 12px;
            margin-bottom: 24px;
            box-shadow: 0 4px 14px rgba(15, 23, 42, 0.15);
        }

        .header-title {
            font-size: 26px;
            font-weight: 700;
            margin: 0 0 6px 0;
            color: #38bdf8;
            letter-spacing: -0.5px;
        }

        .header-subtitle {
            font-size: 15px;
            font-weight: 400;
            color: #94a3b8;
            margin: 0 0 18px 0;
        }

        .header-meta {
            display: flex;
            gap: 20px;
            background: rgba(255, 255, 255, 0.08);
            padding: 10px 18px;
            border-radius: 8px;
            font-size: 12px;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .meta-label {
            color: #94a3b8;
            font-weight: 500;
        }

        .meta-value {
            color: #f8fafc;
            font-weight: 600;
            font-family: 'JetBrains Mono', monospace;
        }

        .section-header {
            background-color: #0f172a;
            color: #ffffff;
            padding: 10px 16px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 700;
            margin-top: 28px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            page-break-after: avoid;
        }

        .card-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #0284c7;
            border-radius: 8px;
            padding: 16px 20px;
            margin-bottom: 20px;
            page-break-inside: avoid;
        }

        .card-box h3 {
            margin: 0 0 10px 0;
            color: #0369a1;
            font-size: 16px;
            font-weight: 700;
        }

        .card-box p {
            margin: 0 0 10px 0;
            color: #334155;
        }

        .feature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-bottom: 20px;
        }

        .feature-card {
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 14px 16px;
            background: #ffffff;
            page-break-inside: avoid;
        }

        .feature-card h4 {
            margin: 0 0 8px 0;
            font-size: 14px;
            color: #0f172a;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .role-badge {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 4px;
            color: #ffffff;
            display: inline-block;
            margin-right: 6px;
        }

        .role-superadmin { background-color: #991b1b; }
        .role-admin { background-color: #ea580c; }
        .role-psychologist { background-color: #9333ea; }
        .role-user { background-color: #2563eb; }

        ul.styled-list {
            margin: 0;
            padding-left: 20px;
        }

        ul.styled-list li {
            margin-bottom: 6px;
            color: #334155;
        }

        .flow-step {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px dashed #e2e8f0;
        }

        .flow-step:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .step-number {
            background-color: #0284c7;
            color: #ffffff;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            flex-shrink: 0;
        }

        .step-content {
            flex-grow: 1;
        }

        .step-title {
            font-weight: 700;
            color: #0f172a;
            font-size: 13.5px;
            margin-bottom: 3px;
        }

        .code-box {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            background-color: #0f172a;
            color: #38bdf8;
            padding: 10px 12px;
            border-radius: 6px;
            margin-top: 8px;
            white-space: pre-wrap;
        }

        table.logic-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12.5px;
            margin-top: 10px;
            margin-bottom: 16px;
        }

        table.logic-table th, table.logic-table td {
            border: 1px solid #cbd5e1;
            padding: 8px 12px;
            text-align: left;
        }

        table.logic-table th {
            background-color: #f1f5f9;
            color: #0f172a;
            font-weight: 700;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 14px;
        }
    </style>
</head>
<body>

    <!-- Header Section -->
    <div class="header-container">
        <div class="header-title">Project Overview & Business Logic Documentation</div>
        <div class="header-subtitle">অনলাইন সাইকোলজি কনসালটেশন ও ই-কমার্স প্ল্যাটফর্মের মূল উদ্দেশ্য এবং বিজনেস লজিক নির্দেশিকা</div>
        <div class="header-meta">
            <div class="meta-item"><span class="meta-label">System Type:</span> <span class="meta-value">Healthcare Consultation & E-Commerce</span></div>
            <div class="meta-item"><span class="meta-label">Backend Architecture:</span> <span class="meta-value">Node.js + Express + TypeScript</span></div>
            <div class="meta-item"><span class="meta-label">ORM & Database:</span> <span class="meta-value">Prisma ORM + PostgreSQL</span></div>
        </div>
    </div>

    <!-- 1. PROJECT PURPOSE -->
    <div class="section-header">🎯 ১. প্রজেক্টের মূল উদ্দেশ্য (Project Purpose & System Concept)</div>

    <div class="card-box">
        <h3>সারসংক্ষেপ (Executive Summary)</h3>
        <p>এই ব্যাকএন্ড সিস্টেমটি একটি আধুনিক **অনলাইন মানসিক স্বাস্থ্য সেবা (Psychological Consultation)** এবং **হেলথ অ্যান্ড ওয়েলনেস ই-কমার্স (E-Commerce Marketplace)** প্ল্যাটফর্ম হিসেবে ডিজাইন করা হয়েছে।</p>
        <p>সিস্টেমটির মূল উদ্দেশ্য হলো ইউজারদের সহজে দক্ষ ও অনুমোদিত সাইকোলজিস্টদের সাথে রিয়েলটাইম ভয়েস/ভিডিও কলের মাধ্যমে পরামর্শ নেওয়ার সুযোগ তৈরি করা এবং পাশাপাশি মানসিক স্বাস্থ্য সংক্রান্ত দরকারি প্রোডাক্ট ও বই কেনাকাটার সুবিধা প্রদান করা।</p>
    </div>

    <div class="feature-grid">
        <div class="feature-card">
            <h4>🧠 ১. সাইকোলজিস্ট কনসালটেশন</h4>
            <p>ইউজাররা প্ল্যাটফর্মে যুক্ত ভেরিফাইড সাইকোলজিস্টদের তালিকা দেখতে পারেন এবং পার-মিনিট রেটে সরাসরি কল সেশন শুরু করতে পারেন।</p>
        </div>
        <div class="feature-card">
            <h4>🛍️ ২. ই-কমার্স শপিং সিস্টেম</h4>
            <p>সার্ভিস ক্যাটাগরির পাশাপাশি প্রোডাক্ট ক্যাটাগরিতে শপিং কার্ট ও চেকআউটের মাধ্যমে শারীরিক ও মানসিক স্বাস্থ্য বিষয়ক পণ্য কেনাকাটার ব্যবস্থা।</p>
        </div>
        <div class="feature-card">
            <h4>👛 ৩. ইন্টিগ্রেটেড ওয়ালেট ও পেমেন্ট</h4>
            <p>প্রতিটি ইউজারের অটোমেটিক ওয়ালেট থাকবে। Stripe Gateway দিয়ে ব্যালেন্স রিচার্জ ও সেশন এবং অর্ডারের টাকা স্বয়ংক্রিয়ভাবে কাটিং হবে।</p>
        </div>
        <div class="feature-card">
            <h4>🌐 ৪. সামাজিক মিথস্ক্রিয়া (Social Engagement)</h4>
            <p>২৪ ঘণ্টার স্টোরি শেয়ার, ফলো-আনফলো নেটওয়ার্ক, ক্ষতিকর ইউজার ব্লক ও রেফারাল বোনাস রিওয়ার্ড সিস্টেম।</p>
        </div>
    </div>

    <!-- 2. USER ROLES -->
    <div class="section-header">👥 ২. ইউজার রোল ও অ্যাক্সেস কন্ট্রোল (Role-Based Access Control - RBAC)</div>

    <table class="logic-table">
        <thead>
            <tr>
                <th>রোল (Role)</th>
                <th>বিবরণ (Description)</th>
                <th>প্রধান অধিকারসমূহ (Key Permissions)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><span class="role-badge role-superadmin">SUPER_ADMIN</span></td>
                <td>সিস্টেমের সর্বোচ্চ ক্ষমতাধর অ্যাডমিন</td>
                <td>অন্যান্য অ্যাডমিন তৈরি, যেকোনো ইউজার ডিলিট করা, ক্যাটাগরি মুছে ফেলা এবং প্ল্যাটফর্ম সেটিংস ওভাররাইড করা।</td>
            </tr>
            <tr>
                <td><span class="role-badge role-admin">ADMIN</span></td>
                <td>প্ল্যাটফর্ম পরিচালনাকারী অ্যাডমিন</td>
                <td>সাইকোলজিস্টদের আবেদন পর্যবেক্ষণ ও অনুমোদন/বাতিল করা, ইউজার ব্লক করা, ম্যানুয়াল ওয়ালেট ট্রানজ্যাকশন এবং ডেলিভারি স্ট্যাটাস আপডেট।</td>
            </tr>
            <tr>
                <td><span class="role-badge role-psychologist">PSYCHOLOGIST</span></td>
                <td>অনুমোদিত সাইকোলজিস্ট / থেরাপিস্ট</td>
                <td>অনলাইন স্ট্যাটাস পরিবর্তন (online/offline/busy), প্রতি মিনিটের কল রেট নির্ধারণ, কল রিসিভ করা ও ব্যাংক/কার্ডে পেআউট রিকুয়েস্ট পাঠানো।</td>
            </tr>
            <tr>
                <td><span class="role-badge role-user">USER</span></td>
                <td>সাধারণ সুবিধাভোগী ইউজার</td>
                <td>সাইকোলজিস্টদের সাথে কল করা, ওয়ালেট রিচার্জ করা, শপিং কার্টে আইটেম কিনে অর্ডার প্লেস করা, স্টোরি দেওয়া ও রিভিউ প্রদান করা।</td>
            </tr>
        </tbody>
    </table>

    <!-- 3. BUSINESS LOGIC & WORKFLOWS -->
    <div class="section-header">⚡ ৩. মূল বিজনেস লজিক ও প্রসেস ফ্লো (Core Business Logic)</div>

    <!-- 3.1 Authentication & Onboarding -->
    <div class="card-box">
        <h3>১. অনবোর্ডিং ও সাইকোলজিস্ট ভেরিফিকেশন লজিক (Authentication & Onboarding)</h3>
        
        <div class="flow-step">
            <div class="step-number">১</div>
            <div class="step-content">
                <div class="step-title">ইউজার রেজিস্ট্রেশন ও OTP যাচাই:</div>
                <p>রেজিস্ট্রেশনের পর ইউজারের ইমেইলে স্বয়ংক্রিয়ভাবে ৬ ডিজিটের OTP পাঠানো হয়। অ্যাকাউন্ট সম্পূর্ণ সক্রিয় হতে OTP ভেরিফাই করা বাধ্যতামূলক।</p>
            </div>
        </div>

        <div class="flow-step">
            <div class="step-number">২</div>
            <div class="step-content">
                <div class="step-title">সাইকোলজিস্ট আবেদন প্রক্রিয়া (Psychologist Approval Workflow):</div>
                <p>যেকোনো ইউজার তার প্রফেশনাল তথ্য (যেমন: অভিজ্ঞতা, রেজিস্ট্রেশন নম্বর, অভিজ্ঞতার ক্ষেত্র) জমা দিয়ে সাইকোলজিস্ট হওয়ার আবেদন করতে পারেন। আবেদনের পর তার স্ট্যাটাস থাকে <code>PENDING_APPROVAL</code>।</p>
                <p>অ্যাডমিন ডাটা যাচাই করে আবেদনপত্র অনুমোদন (<code>APPROVED</code>) দিলে ইউজারটি সাইকোলজিস্ট হিসেবে কাজ করতে পারেন। রিজেক্ট হলে নির্দিষ্ট কারণসহ <code>REJECTED</code> স্ট্যাটাসে চলে যায়।</p>
            </div>
        </div>
    </div>

    <!-- 3.2 Realtime Call & Billing -->
    <div class="card-box">
        <h3>২. কল সেশন ও অটোমেটিক ওয়ালেট বিলিং লজিক (Call Session & Revenue Split)</h3>
        <p>সিস্টেমের অন্যতম গুরুত্বপূর্ণ লজিক হলো রিয়েলটাইম সেশনের পার-মিনিট হিসাব ও টাকা ভাগ করা।</p>

        <div class="flow-step">
            <div class="step-number">১</div>
            <div class="step-content">
                <div class="step-title">সেশন ইনিশিয়েট ও চ্যানেল তৈরি:</div>
                <p>ইউজার কল ইনিশিয়েট করলে একটি ইউনিক <code>channelName</code> তৈরি হয় এবং <code>CallSession</code> স্ট্যাটাস <code>INITIATED</code> হয়।</p>
            </div>
        </div>

        <div class="flow-step">
            <div class="step-number">২</div>
            <div class="step-content">
                <div class="step-title">সেশন শেষ ও ওয়ালেট বিলিং ক্যালকুলেশন (Billing Logic):</div>
                <p>কল শেষ করার সময় সেকেন্ড/মিনিট ট্র্যাকিং অনুযায়ী ইউজারের ওয়ালেট থেকে মোট টাকার পরিমাণ হিসাব করা হয়:</p>
                <div class="code-box">Total Amount = (durationInSeconds / 60) * psychologistCallRate</div>
                <p>অতঃপর গ্লোবাল সেশন সেটিংস অনুযায়ী প্ল্যাটফর্ম ফী এবং সাইকোলজিস্টের আর্নিং বন্টন করা হয়:</p>
                <div class="code-box">Psychologist Earning = Total Amount * (psychologistPercentage / 100)  // উদাহরণ: ৭০%
Admin Revenue (Platform Fee) = Total Amount * (adminPercentage / 100)       // উদাহরণ: ৩০%</div>
            </div>
        </div>

        <div class="flow-step">
            <div class="step-number">৩</div>
            <div class="step-content">
                <div class="step-title">অটোমেটিক ওয়ালেট ট্রান্সফার ও ট্রানজ্যাকশন ক্রিয়েশন:</div>
                <p>ইউজারের ওয়ালেট থেকে টাকা ডেবিট করা হয় এবং সাইকোলজিস্টের ওয়ালেটে নেট আর্নিং সরাসরি ক্রেডিট করে দুটি ট্রানজ্যাকশন রেকর্ড তৈরি করা হয়।</p>
            </div>
        </div>
    </div>

    <!-- 3.3 Wallet & Payment -->
    <div class="card-box">
        <h3>৩. ওয়ালেট ম্যানেজমেন্ট ও স্ট্রাইপ পেমেন্ট লজিক (Wallet & Payout Engine)</h3>
        
        <ul class="styled-list">
            <li><strong>অটোমেটিক ওয়ালেট ক্রিয়েশন:</strong> প্রতিটি ইউজার বা সাইকোলজিস্টের অ্যাকাউন্ট তৈরির সাথে সাথে ০.০০ ব্যালেন্সের একটি <code>Wallet</code> যুক্ত হয়।</li>
            <li><strong>TopUp (ব্যালেন্স রিচার্জ):</strong> ইউজার Stripe Payment Intent তৈরি করে কার্ডের মাধ্যমে ওয়ালেটে ব্যালেন্স টপ-আপ করতে পারেন।</li>
            <li><strong>Payout Request (উত্তোলন নিয়মাবলী):</strong> সাইকোলজিস্ট তার অর্জিত টাকা উত্তোলন রিকুয়েস্ট পাঠাতে পারেন। তবে শর্ত থাকে:
                <br>১. সর্বনিম্ন পেআউট পরিমাণ (যেমন: €১০) পূরণ হতে হবে।
                <br>২. সেটিংস অনুযায়ী নির্ধারিত পেআউট ডে (<code>payoutReleaseDay</code>) অনুযায়ী প্রসেস করা হবে।</li>
            <li><strong>Admin Manual Transaction:</strong> কোনো টেকনিক্যাল ইস্যু হলে অ্যাডমিন ম্যানুয়ালি টাকা ক্রেডিট বা ডেবিট করতে পারেন (রেফারাল বোনাস, রিফান্ড বা টপআপ টাইপে)।</li>
        </ul>
    </div>

    <!-- 3.4 E-Commerce & Order System -->
    <div class="card-box">
        <h3>৪. ই-কমার্স কার্ট ও অর্ডারিং লজিক (E-Commerce & Order Workflow)</h3>
        
        <div class="flow-step">
            <div class="step-number">১</div>
            <div class="step-content">
                <div class="step-title">কার্ট ও প্রাইস স্ন্যাপশট:</div>
                <p>কার্টে প্রোডাক্ট যোগ করার সময় বর্তমান দাম ও ডিসকাউন্টের উপর ভিত্তি করে <code>priceSnapshot</code> রাখা হয়, যাতে পরবর্তীতে প্রোডাক্টের দাম চেঞ্জ হলেও ইউজারের আগের কার্ট প্রাইস একই থাকে।</p>
            </div>
        </div>

        <div class="flow-step">
            <div class="step-number">২</div>
            <div class="step-content">
                <div class="step-title">ওয়ালেট থেকে অটো-ডেবিট চেকআউট:</div>
                <p>অর্ডার প্লেস করার সময় সিস্টেম ইউজারের ওয়ালেট ব্যালেন্স চেক করে। ব্যালেন্স মোট অর্ডারের সমান বা বেশি থাকলে স্বয়ংক্রিয়ভাবে টাকা কেটে অর্ডার স্ট্যাটাস <code>PAID</code> করা হয় এবং কার্ট খালি করা হয়।</p>
            </div>
        </div>

        <div class="flow-step">
            <div class="step-number">৩</div>
            <div class="step-content">
                <div class="step-title">অর্ডার ডেলিভারি লাইফসাইকেল:</div>
                <p>অর্ডারের ট্র্যাকিং আইডি জেনারেট হয়। অ্যাডমিন স্ট্যাটাস ধাপে ধাপে পরিবর্তন করে: <code>PENDING</code> ➔ <code>PROCESSING</code> ➔ <code>SHIPPED</code> ➔ <code>COMPLETED</code>।</p>
            </div>
        </div>
    </div>

    <!-- 3.5 Social & Engagement Logic -->
    <div class="card-box">
        <h3>৫. সোশ্যাল ইন্টারঅ্যাকশন ও রেফারাল সিস্টেম (Social & Referral Mechanics)</h3>
        
        <ul class="styled-list">
            <li><strong>Story System:</strong> ইউজার ছবি বা কন্টেন্ট দিয়ে স্টোরি দিতে পারেন (Public বা Private)। অন্য ইউজার স্টোরি দেখলে <code>StorySeen</code> এবং রিঅ্যাক্ট দিলে <code>StoryReact</code> আপডেট হয়।</li>
            <li><strong>Follow & Block System:</strong> যেকেউ অন্য ইউজারকে ফলো করতে পারেন। আবার কোনো ক্ষতিকর আচরণের শিকার হলে ইউজারকে ব্লক করতে পারেন, ফলে ব্লক করা ইউজার কল বা মেসেজ দিতে পারে না।</li>
            <li><strong>Referral Program:</strong> প্রতিটি ইউজারের নিজস্ব ইউনিক রেফারাল কোড থাকে। নতুন ইউজার উক্ত রেফারাল কোড ক্লেইম করলে উভয় ইউজারের ওয়ালেটে <code>REFERRAL_REWARD</code> হিসেবে স্বয়ংক্রিয় রিওয়ার্ড ফান্ড যুক্ত হয়।</li>
            <li><strong>Reviews & Ratings:</strong> কল সেশন সফলভাবে শেষ হওয়ার পর ইউজার ১ থেকে ৫ স্টার রেটিং এবং মতামত জমা দিতে পারে, যা সাইকোলজিস্টের পাবলিক প্রোফাইলে এভারেজ রেটিং বাড়ায়।</li>
        </ul>
    </div>

    <!-- 4. SYSTEM ARCHITECTURE & CODE QUALITY -->
    <div class="section-header">🛠️ ৪. টেকনিক্যাল আর্কিটেকচার ও সিকিউরিটি মানদণ্ড (Architecture & Quality)</div>

    <div class="card-box">
        <h3>সফটওয়্যার আর্কিটেকচারিক ফিচারসমূহ</h3>
        <ul class="styled-list">
            <li><strong>Modular Directory Structure:</strong> প্রতি মডিউলের জন্য আলাদা <code>routes</code>, <code>controller</code>, <code>service</code>, <code>validation</code> এবং <code>types</code> ফাইল রয়েছে, যা প্রজেক্টের স্কেলেবিলিটি বৃদ্ধি করে।</li>
            <li><strong>Zod Input Validation Middleware:</strong> প্রতিটি ইনকামিং API রিকোয়েস্টের বডি, কিউয়েরি এবং প্যারামিটার টাইপ-সেফ Zod Schema দ্বারা ফিল্টার করা হয়।</li>
            <li><strong>Global Error Handling & Async Wrapper:</strong> ট্রাই-ক্যাচ রিপিটেশন দূর করতে <code>asyncHandler</code> ব্যবহার করা হয়েছে এবং যেকোনো আনহ্যান্ডেল্ড এরর গ্লোবাল এরর মিডলওয়্যারে ক্যাচ হয়ে স্ট্যান্ডার্ড JSON রেসপন্স পাঠায়।</li>
            <li><strong>Security Best Practices:</strong> HTTP হেডার সিকিউরিটির জন্য <code>Helmet</code>, ক্রস অরিজিন রিসোর্স শেয়ারিং এর জন্য <code>Cors</code>, এবং রিকোয়েস্ট ট্র্যাকিং এর জন্য <code>Morgan</code> ইন্টিগ্রেটেড।</li>
        </ul>
    </div>

    <div class="footer">
        Backend Project — Purpose & Business Logic Specification Guide
    </div>

</body>
</html>`;

const htmlPath = path.join(__dirname, 'Project_Overview_And_Business_Logic.html');
const pdfPath = path.join(__dirname, 'Project_Overview_And_Business_Logic.pdf');
const rootPdfPath = path.join(__dirname, '..', 'Project_Overview_And_Business_Logic.pdf');

fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
console.log(`[Node.js Generator] HTML overview saved to: ${htmlPath}`);

const edgeExecutable = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

if (fs.existsSync(edgeExecutable)) {
    const result = spawnSync(edgeExecutable, [
        '--headless=new',
        `--print-to-pdf=${pdfPath}`,
        '--no-pdf-header-footer',
        htmlPath
    ]);

    if (fs.existsSync(pdfPath) && fs.statSync(pdfPath).size > 0) {
        console.log(`[Node.js Generator] SUCCESS! PDF generated at: ${pdfPath} (${fs.statSync(pdfPath).size} bytes)`);
        fs.copyFileSync(pdfPath, rootPdfPath);
        console.log(`[Node.js Generator] Copied PDF to workspace root: ${rootPdfPath}`);
    } else {
        console.error('[Node.js Generator] PDF generation failed via Chromium/Edge:', result.stderr.toString());
    }
} else {
    console.log('[Node.js Generator] Browser binary not found at standard path. HTML document created.');
}
