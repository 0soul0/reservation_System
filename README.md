# Reservation System (High-Concurrency & State-Driven Booking Solution)

[![Framework](https://img.shields.io/badge/Architecture-Fullstack%20%7C%20Cross--Platform-blue.svg)](#)
[![TypeScript/Dart](https://img.shields.io/badge/Language-TypeScript%20%2F%20Dart-teal.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌐 Language / 語言切換
- [English (#-english-version)](#-english-version)
- [繁體中文 (#-繁體中文版-traditional-chinese-version)](#-繁體中文版-traditional-chinese-version)

---

## 🇺🇸 English Version

### 📌 Project Overview
**Reservation System** is an enterprise-grade booking management solution designed to handle real-time scheduling, multi-conditional slot filtering, and precise state management. It mitigates race conditions during simultaneous bookings and delivers an intuitive, friction-free user experience for scheduling appointments, venues, or services.

> **💡 Motivation & Technical Challenges:**
> The most critical failure in a booking system is "double-booking" caused by asynchronous race conditions. This project focuses on solving core synchronization problems, ensuring data integrity at the database/API layer, managing complex timezone shifts, and optimizing the state machine governing reservation status lifecycles.

### 🚀 Tech Stack *(Customize based on your code)*
- **Frontend/Mobile:** Next.js (App Router) / Flutter (Dart)
- **Backend Environment:** Node.js (Express/NestJS) / Next.js Route Handlers
- **State Management:** Provider / Riverpod (Mobile) or Redux / Zustand (Web)
- **Database & Cache:** PostgreSQL / MongoDB + Redis (for temporary lock mechanisms)

### ✨ Technical Highlights & Interview QA

1. **Race Condition Mitigation & Double-Booking Prevention**
   - **The Challenge:** When multiple users attempt to reserve the exact same time slot simultaneously, network latency can cause double-booking bugs.
   - **The Solution:** Implemented a **Pessimistic Locking / Optimistic Concurrency Control (OCC)** strategy at the data layer. Temporary reservation slots are locked via memory cache (e.g., Redis TTL locks) or atomic database transactions, guaranteeing that one and only one request succeeds.

2. **Complex Time-Slot Matrix & Timezone Calibration**
   - **The Challenge:** Generating dynamic time-slots based on vendor availability while adjusting for operating hours, break intervals, and local user timezones.
   - **The Solution:** Designed an efficient bitmask or time-interval overlapping algorithm to dynamically calculate available slots. All backend timestamps are strictly stored in UTC, and translated on-the-fly at the presentation layer using user-localized timezone parsing.

3. **State Machine for Booking Lifecycle Management**
   - **The Challenge:** A reservation involves multi-step status changes (`Pending` ➔ `Confirmed` ➔ `Completed` or `Expired`/`Cancelled`). Hardcoded flags can lead to invalid state transitions.
   - **The Solution:** Implemented a strict **Finite State Machine (FSM)** pattern. Status modifications can only occur via predefined triggers, and unpaid or pending bookings are automatically released via an automatic TTL (Time-To-Live) expiration worker.

### 📦 Key Features
- [x] **Real-Time Calendar Sync:** Interactive availability dashboard with instant slot status updates.
- [x] **Conflict-Free Booking:** Atomic transaction protection preventing concurrent scheduling overlaps.
- [x] **Dynamic Rule Engine:** Custom configuration for operating hours, slot intervals (e.g., 30m/60m), and maximum capacities.
- [x] **Automated Lifecycle Expiration:** Automatic release of reserved slots if payment or confirmation isn't completed within the grace period.

---

## 🇹🇼 繁體中文版 (Traditional Chinese Version)

### 📌 專案概述
**Reservation System** 是一款專為即時排程、多條件時段篩選及嚴格狀態管理設計的企業級預約管理解決方案。本專案核心在於解決多人同時預約時的資料競爭問題（Race Conditions），並在預約掛號、場地租借或服務排班等場景中，提供流暢且無衝突的使用者體驗。

> **💡 開發動機與技術挑戰：**
> 預約系統最致命的臭蟲是因非同步延遲引發的「重複預約（Double-Booking）」。本專案將焦點放在解決資料庫與 API 層的同步化問題、處理複雜的跨時區轉換，以及實作嚴謹的預約狀態生命週期狀態機。

### 🚀 核心技術棧 *(請依據專案實際程式碼微調)*
- **前端/行動端：** Next.js (App Router) 或 Flutter (Dart)
- **後端環境：** Node.js / Next.js Serverless Functions 
- **狀態管理：** Zustand / Redux (網頁) 或 Riverpod / Provider (手機)
- **資料庫與快取：** PostgreSQL / MongoDB + Redis (用於時段暫存鎖定機制)

### ✨ 技術亮點與面試核心 QA

1. **防範資料競爭與重複預約機制 (Race Condition Prevention)**
   - **挑戰：** 當多位使用者在同一毫秒點擊預約同一個熱門時段時，傳統的查詢後寫入（Select-then-Update）會因為時間差導致重複預約。
   - **解法：** 在資料層實作**悲觀鎖（Pessimistic Locking）或樂觀鎖（OCC）**機制。當使用者選定時段後，系統會透過 Redis 實作具備時效性的暫時鎖（TTL Lock）或利用資料庫原子級交易（Atomic Transactions），確保同一時段只有一筆預約能成功寫入。

2. **動態時段矩陣生成與精準時區校正**
   - **挑戰：** 預約系統需要依據店家的營業時間、休息時間及預約間隔（如 30 分鐘一班）動態產生時段，且必須相容使用者與店家的跨時區落差。
   - **解法：** 設計時間區間重疊演算法（Interval Overlap Algorithm）即時計算可用時段。後端一律使用 UTC 時間戳記進行儲存與運算，前端再依據使用者本地瀏覽器/裝置時區進行動態渲染，確保時間絕對精準。

3. **嚴謹的預約生命週期狀態機 (Finite State Machine)**
   - **挑戰：** 預約流程包含多種狀態變更（`暫存/未付款` ➔ `已確認` ➔ `已完成` 或 `逾時取消`），若用複雜的 if-else 邏輯極易產生邏輯漏洞。
   - **解法：** 導入**有限狀態機（FSM）**架構，嚴格限制狀態轉換的合法路徑。配合後端定時排程（Cron Job/TTL），若使用者在 10 分鐘內未完成確認，系統會自動釋放該時段，活化閒置資源。

### 📦 功能特性
- [x] **即時行事曆同步：** 互動式行事曆介面，即時顯示可用與已客滿時段。
- [x] **零衝突預約保障：** 原子級資料交易保護，徹底根除重複重疊預約。
- [x] **彈性規則配置：** 支援自訂營業時間、預約時段長度與每時段容納人數上限。
- [x] **自動逾時釋放：** 超過保留時間未付款或未確認的預約，系統會自動釋放該時段。

---

## 🛠️ Getting Started / 安裝與快速開始

### 1. Clone and Install / 複製與安裝
```bash
git clone [https://github.com/0soul0/reservation_system.git](https://github.com/0soul0/reservation_system.git)
cd reservation_system
# For Node/Next.js: npm install  |  For Flutter: flutter pub get
