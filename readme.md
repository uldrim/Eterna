# Eterna Labs: Order Execution Engine

**Author:** Mridul Singh  
**Entry Number:** 2018CS50412

---

## 1. Introduction

This project implements a **mock Order Execution Engine** for a Solana-based DEX environment.  
It supports:

- A **Market Order** type
- **DEX routing** between Raydium and Meteora
- **Background execution** via BullMQ (Redis-backed queue)
- **Real-time WebSocket (Socket.IO)** status updates
- **PostgreSQL** persistence for order and status history
- **Concurrency** and retry with exponential backoff

The primary focus is on demonstrating **architecture, routing logic, and live updates**, while blockchain execution is mocked to avoid real token swaps.

---

## 2. Tech Stack

- **Backend**
  - Node.js + TypeScript
  - NestJS (Fastify platform)
  - BullMQ + Upstash Redis
  - TypeORM + PostgreSQL

- **Real-time**
  - WebSockets via Socket.IO (`@nestjs/websockets`)

- **Persistence**
  - PostgreSQL (Supabase / Railway)

- **Deployment**
  - Backend: Railway
  - Frontend: Railway (static Express server)

---

## 3. Supported Order Type

### 3.1 Chosen Type: Market Order

Currently the engine supports **Market Orders**:

> _“Execute immediately at the best available price across Raydium and Meteora.”_

**Reasons for choosing Market Order:**

- Uses the **full routing, quoting and execution pipeline**, demonstrating all main components.
- Best showcases **DEX comparison**, slippage protection (conceptually), and **real-time lifecycle**.
- Easier to mock in a deterministic, testable way without relying on live market data.

### 3.2 Extending to Limit & Sniper Orders

The core engine is designed to be extensible:

- **Limit Orders**
  - Add `limitPrice` to the order.
  - Worker polls or receives price feeds.
  - Execution is triggered only when `marketPrice <= limitPrice`.
  - After trigger, the **same routing + execution + status** pipeline is reused.

- **Sniper Orders**
  - Add metadata about **token launch** or **migration event**.
  - Worker waits for token listing or liquidity appearance (e.g., pool detection).
  - Once token/pool is live, worker executes through the same pipeline.

In both cases, **only the trigger/condition changes**, not the routing/execution engine.

---

## 4. System Architecture

### 4.1 High-Level Components

- **API Layer (NestJS)**
  - Validates and accepts order submission (`POST /api/orders/execute`).
  - Persists the order in PostgreSQL.
  - Enqueues a job in BullMQ.
  - Sends initial `"pending"` status via WebSocket.

- **Queue Layer (BullMQ + Redis)**
  - Stores queued execution jobs.
  - Handles concurrency and retries.
  - Controls throughput and resilience.

- **Worker Layer (BullMQ WorkerHost)**
  - Processes queued orders.
  - Fetches quotes from Raydium & Meteora (mocked).
  - Chooses best route.
  - Simulates transaction build and submission.
  - Updates the database and emits status events.
    a
- **WebSocket Layer (Socket.IO Gateway)**
  - Manages client connections.
  - Allows clients to subscribe to an `orderId`.
  - Broadcasts all status updates to subscribed clients.

- **Database Layer (PostgreSQL)**
  - `Order` table: final state snapshot.
  - `OrderHistory` table: append-only event timeline.

---

## Images

![This is an alt text.](./home.png 'This is a sample image.')

## Links

Check out the [Deployed Version](https://eterna-frontend-production.up.railway.app) here.

## Local Setup

```
git clone
cd eterna
npm install
npm run start:dev
```
