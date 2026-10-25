# SmartFDR AI — Intelligent Security Deposit & FDR Lifecycle Management

**Problem Statement:** SIH26265 (AICTE)  
**Theme:** Smart Automation

## 📌 Overview
AICTE manages security deposits and Fixed Deposit Receipts (FDRs) for technical institutions. The bottleneck in the release process isn't the final approval; it's the coordination, document verification, and tracking around it. 

**SmartFDR AI** is a proposed operations layer that sits *around* existing government portals. It does not replace the official approval process. Instead, it adds document intelligence, proactive deadline monitoring, visible ownership, and audit visibility.

## ✨ Key Features
* **Document Intelligence & Validation:** Simulates OCR extraction from uploaded FDR scans. A deterministic rule engine flags inconsistencies (e.g., amount mismatches) before a human reviewer sees them.
* **Role-Based Access Control (RBAC):** Distinct views and permissions for **Institution Users**, **Reviewers**, and **Administrators**. Institutions cannot approve their own releases.
* **Immutable Audit Trail:** Every action, status change, and resolution is timestamped and logged for total accountability ("No more 'who has this file?'").
* **Dynamic Notifications:** In-app notifications trigger based on user actions and filter depending on the active role.
* **Enterprise-Grade UI:** A dense, accessible, government-style interface designed for clarity, high information density, and trust.

## 🛡️ The Human-in-the-Loop Safety Boundary
* **AI Never Approves:** The system flags issues but does not authorize releases. The final financial decision rests entirely with authorized officials.
* **Not Independently Verified:** OCR reads text; it cannot prove a document is genuine. Records default to an "unverified" status until bank confirmation or manual clearance is provided.

## 🛠️ Technology Stack
* **Frontend:** React (Vite)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **State Management:** React Context API (ephemeral state for demo purposes)

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/smartfdr-ai.git
   cd smartfdr-ai
