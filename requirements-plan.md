# Product Requirements & Implementation Plan

## Overview

This document summarizes the requirements and technical plan for the internal web application as described in the assessment. All features and design decisions strictly follow the provided requirements. No extra features will be added.

---

## Core Features

### 1. Users & Access Control

- Authenticated users (sign in required)
- Role-based access control (roles: SYSADMIN, ADMIN, USER, MODERATOR)
- Actions restricted by role permissions
- Multiple users supported

#### Role Definitions & Permissions

- **SYSADMIN**: Full system access. Can manage all users, roles, and work items. Can assign/revoke roles. Can view and edit all data, including audit/history. Foundational role for system setup and emergency access.
- **ADMIN**: Can manage work items and users (except SYSADMINs). Can perform all state transitions, block/unblock, and rework. Can view all history/audit data. Cannot assign SYSADMIN role.
- **USER**: Can create and update their own work items, perform allowed state transitions, block/unblock their own items, and view their own history. Cannot manage users or assign roles.
- **MODERATOR**: Can review, approve, or reject work item transitions. Can unblock or request rework on items. Cannot manage users or assign roles. Can view all work item history.

> Permissions are enforced server-side and reflected in the UI. All actions are restricted according to these definitions. No extra roles or permissions will be added.

### 2. Work Items

- Unique identifier (ID)
- Title (string)
- Description (string)
- Current state (enum, see below)
- Blocked (boolean)
- Block reason (string, nullable)
- Rework required (boolean)
- Created by (user reference)
- Timestamps: createdAt, updatedAt
- Audit/history: all state changes, blocking/unblocking, rework events

#### Work Item States (example)

- NEW: Item created, not yet started
- IN_PROGRESS: Work is being done
- REVIEW: Awaiting review/approval
- BLOCKED: Temporarily blocked (with reason)
- REWORK: Sent back for rework (with justification)
- DONE: Completed
- CANCELLED: No longer active

#### State Transitions

- NEW → IN_PROGRESS
- IN_PROGRESS → REVIEW
- REVIEW → DONE | REWORK | BLOCKED
- REWORK → IN_PROGRESS
- BLOCKED → IN_PROGRESS (when unblocked)
- Any → CANCELLED (with justification)

> Not all transitions are allowed. Blocked items cannot progress. Rework and blocking require justification. All transitions are validated server-side and recorded in history.

#### Blocking & Rework

- Any item can be blocked with a reason. While blocked, no state transitions except unblocking are allowed.
- Rework requires a justification and moves the item to REWORK state. Only allowed from REVIEW.

#### Audit & History

- Every state change, block/unblock, and rework event is recorded with timestamp, user, and justification (if any).
- Users can view the full history of each work item.

### 3. Lifecycle & State Management

- Defined states and allowed transitions
- Some transitions require input
- Blocked items cannot progress
- Rework must be explicit
- Invalid transitions rejected and logged
- State changes recorded and retrievable

### 4. Blocking & Rework

- Work item can be blocked with a reason
- Blocked items cannot progress
- Blocking/unblocking events traceable
- Rework requires justification and affects flow

### 5. History & Audit Trail

- Record state changes, blocking/unblocking, rework events
- Users can view history in a meaningful way

---

## Backend Requirements

- Authentication (token/session-based)
- Authorization enforced server-side
- API for user auth, work item management, state transitions, blocking, history
- Data integrity: lifecycle and authorization rules enforced
- Prevent invalid/conflicting updates, handle concurrency
- Use persistent database (e.g., PostgreSQL via Prisma)

---

## Frontend Requirements

- Authenticated users can sign in
- View list of accessible work items
- Inspect work item details, state, history
- Perform allowed actions based on state and permissions
- UI reflects server-side rules, handles loading/error/auth states
- Prevent invalid/unauthorized actions before submission

---

## Technical Approach

- Use existing folder structure and coding style
- Backend: Express, Prisma, JWT/session auth, role middleware
- Frontend: React, role-aware UI, error/loading/auth handling
- No extra features beyond requirements

---

## Implementation Plan

- [ ] Define roles and permissions (documented)
- [ ] Design work item model/schema (states, transitions, blocking, rework)
- [ ] Implement authentication & authorization
- [ ] Build API endpoints for work item lifecycle
- [ ] Implement audit/history tracking
- [ ] Build frontend for work item list/detail, actions, history
- [ ] Document edge case handling
- [ ] Write README for setup, design decisions, limitations

---

## Assumptions

- Only features in requirements will be implemented
- No major changes to existing code style or structure
- No extra features or endpoints

---

## Next Steps

- Review and confirm this plan
- Use this file as reference for all development steps

---

**Do not add any extra features not in context/documents.**
