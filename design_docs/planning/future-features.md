# Future Features & Ideas

This document outlines potential features and improvements planned for future development phases.  
Asterisks (*) indicate dependency or feature linkage:
- (1*) = Daily/Weekly Task Generation
- (2*) = Performance Reporting
- (3*) = Department-Level Analytics

---

## Fresh / Important Ideas

- [ ] Create a **second actor app** to simulate customers purchasing products in-store.

---

## Employee Portal

### Core Features
- [ ] Schedule page
  - [ ] Individual employee schedule
  - [ ] Schedule of all employees
    - [ ] Filter by department
    - [ ] Filter by store
- [ ] Pay statements  
- [ ] Daily/Weekly tasks (1*)  
- [ ] Performance Reports (2*)  
- [ ] RTO (Request Time Off) schedule  

### Worklog Enhancements
- [ ] Add time product created to worklog form  
- [ ] Add shrink form (to report discarded products)  
  - [ ] Include time discarded  
  - [ ] Include product ID  
  - [ ] Include quantity  

---

## Management Portal

### Core Management Tools
- [ ] Schedule creation and editing  
- [ ] Manual daily/weekly task creation (1*)  
- [ ] Employee performance reports (2*)  
- [ ] Department performance reports — weekly/monthly (3*)  
- [ ] View, edit, and create employee information  

---

## Customer Page

### Shopping Features
- [ ] Add filters for store items by price ($)  
- [ ] Create a dedicated “Items on Sale” page  

---

## Database Enhancements

### New Tables
- [x] `Sales`
- [ ] `Shrink`
- [ ] `EmployeePerformance`
- [ ] `DepartmentPerformance`

### Table Modifications
- [ ] Add **sale column** to `inventory` table  
- [ ] Add **time_produced column** to `worklog_items` table  

---

## Backend Calculations

### Automated Processes
- [ ] Generate performance reports for employees and departments (2*)  
- [ ] Generate daily tasks automatically (1*)  
- [ ] Analyze sales numbers and production times to:
  - [ ]Create daily production goals for employees  
  - [ ] Identify overproduction leading to high shrink  

---

## AI Integration Ideas

- [ ] Take a **photo of a recipe or customer shopping list** to identify what’s in stock.  
- [ ] Locate each **aisle** of listed items.  
- [ ] Create a **shopping list from a recipe** (or from a recipe link).  
- [ ] **Automatically order** products or generate check/order lists for managers.  
- [ ] **Auto-generate employee schedules** based on constraints and demand.

---