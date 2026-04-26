# couterfeit_detection_new

 # 🔗 AuthentiChain
**Enterprise-Grade Counterfeit Product Detection via Blockchain**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Coverage](https://img.shields.io/badge/coverage-88%25-brightgreen)](#)
[![AWS](https://img.shields.io/badge/Deployed_on-AWS-FF9900?logo=amazonaws&logoColor=white)](#)

AuthentiChain is a Traceability-as-a-Service (TaaS) application designed to eliminate counterfeit goods in supply chains. By leveraging smart contracts and QR codes, consumers can instantly verify the authenticity and origin of a product, while administrators manage a tamper-proof ledger of inventory.

---

## Architectural Evolution: Eliminating the "Idle Tax"

A major focus of this project was **Right-Sizing Infrastructure for Cost and Scalability**. 

Initially, the backend was deployed on an always-on **AWS EC2 instance**. While functional, analysis revealed this to be an anti-pattern for a burst-traffic API (like QR code scans), resulting in paying an "idle tax" for unused compute hours.

**The Solution: Transitioning to Serverless**
The architecture was re-engineered to a fully Serverless stack:
* **Frontend:** Migrated to **AWS S3 Static Hosting** distributed globally via **CloudFront CDN**.
* **Backend:** The Express.js API was refactored and wrapped into an **AWS Lambda** function.

**The Results:**
* **Cost Efficiency:** Monthly compute costs dropped from ~$15/month to effectively **$0.00** (operating well within the AWS Free Tier).
* **Robust Scalability:** Instead of managing Auto-Scaling Groups for EC2, Lambda automatically spins up concurrent executions to handle 1,000+ simultaneous verification scans without crashing.
* **Atomic Deployments:** Replaced manual EC2 SSH updates with seamless S3 uploads and CloudFront cache invalidations (`/*`).

---

##  Tech Stack

**Frontend**
* React.js (Vite)
* Tailwind CSS / Lucide Icons
* React Router v6 (Nested Layouts & Index Routing)
* `react-helmet-async` for Dynamic SEO Metadata

**Backend & Web3**
* Node.js / Express.js
* JSON Web Tokens (JWT) for secure Session-based Token Handoff
* Hardhat & Ethers.js (Smart Contract deployment & interaction)

**Cloud Infrastructure**
* **AWS S3:** Frontend Hosting
* **AWS CloudFront:** Global CDN and HTTPS implementation
* **AWS Lambda:** Serverless Backend Execution
* **AWS Route 53:** DNS Management

---

## ✨ Core Features

* **Instant Verification:** Users scan a product's QR code to query the blockchain and verify its authenticity in milliseconds.
* **Admin Dashboard:** A protected portal for companies to mint new product records to the ledger.
* **Secure Token Handoff:** Implements a strict session-storage handoff via URL parameters to securely navigate authenticated users across subdomains without exposing persistent local storage.
* **SEO Optimized:** Fully indexed SPA using dynamic Helmet tags, `robots.txt`, and XML sitemaps.

---

## 🧪 Enterprise Testing Strategy (CI/CD Pipeline)

To ensure absolute reliability before deployment, AuthentiChain utilizes a multi-layeredtesting:

1. **Unit Testing (Jest):** Isolates and tests JWT generation, input validation, and business logic.
---

## 💻 Local Setup & Development

**1. Clone the repository**
```bash
git clone [https://github.com/AashishKaaley/AuthentiChain.git](https://github.com/AashishKaaley/AuthentiChain.git)
cd AuthentiChain

2. Install Dependencies
Bash

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install

3. Environment Variables
Create a .env file in the root directory:
Code snippet

VITE_API_URL=http://localhost:3000
JWT_SECRET=your_secret_key
WEB3_PROVIDER_URL=your_infura_or_alchemy_url

4. Run Locally
Bash

# Start the Vite development server
npm run dev

# Start the local Express backend
npm run server
```

Developed by Ashish Kale.




