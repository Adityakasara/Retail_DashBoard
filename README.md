# 🏬 Reliance Retail Limited — Sales & Profitability Performance Dashboard (Power BI)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://adityakasara.github.io/Retail_DashBoard/)
[![Power BI](https://img.shields.io/badge/Power_BI-Reliance%20Analytics-F2C811?style=for-the-badge&logo=powerbi&logoColor=black)](https://adityakasara.github.io/Retail_DashBoard/)
[![Entity](https://img.shields.io/badge/Entity-Reliance%20Retail%20Ltd.-0a3871?style=for-the-badge)](https://adityakasara.github.io/Retail_DashBoard/)
[![Currency](https://img.shields.io/badge/Currency-INR%20(%E2%82%B9)-blue?style=for-the-badge)](https://adityakasara.github.io/Retail_DashBoard/)

An enterprise **Power BI Retail Performance Dashboard** engineered for **Reliance Retail Limited** (India's largest omni-channel retail enterprise). Analyzes gross sales revenue, gross margin profitability, store format contributions, and regional growth across **Reliance Digital**, **Reliance Trends**, **Smart Bazaar**, and **JioMart Omni**.

---

## 🌟 Executive Highlights & Features

- **Enterprise Entity**: Customized specifically for **Reliance Retail Limited**, covering key retail divisions:
  - **Reliance Digital**: 5G Smartphones, Laptops, 4K Google TVs, Inverter ACs, and Jio ecosystem products.
  - **Reliance Trends & Ajio**: Ethnic and Western fashion lines (Avaasa, Netplay, DNMX, Performax).
  - **Smart Bazaar & Fresh**: FMCG, staples, edible oils, and packaged foods (Good Life, Fortune, Aashirvaad).
  - **JioMart Omni**: Hyperlocal digital grocery and quick fulfillment orders.
- **Rupee (INR ₹) & Lakhs/Crores Engine**: Native Indian currency formatting (`₹ Lakhs` & `₹ Crores`) with standard Indian numerical grouping.
- **DAX Measures Implementation**: Real-time evaluation of `[Gross Revenue INR]`, `[Net Realized Profit]`, `[Profit Margin %]`, `[YoY Sales Growth %]`, `[Average Order Value]`, and time-intelligence comparisons (`SAMEPERIODLASTYEAR`).
- **Interactive Multi-Format Slicers**: Slicing by Financial Year (FY 23-24, FY 24-25, FY 25-26), Reliance Store Formats, Regional Hubs (West, South, North, East), and Payment Channels (JioPay/UPI, Cards/EMI, COD).
- **Core Visual Analytics Suite**:
  - **Monthly Trajectory**: Dual-axis line & area chart tracking monthly invoiced sales vs realized net profit in INR Lakhs.
  - **Store Format Revenue Share**: Doughnut visualization illustrating revenue split across Digital, Trends, Smart Bazaar, and JioMart.
  - **Regional Hub Performance**: Bar chart comparing sales volume across West Hub (Mumbai/Pune), South Hub (Bengaluru/Hyderabad), North Hub (Delhi NCR), and East Hub (Kolkata).
  - **Top Metropolitan Clusters**: Sales volume in major metropolitan clusters.
- **Structured Transaction Ledger**: Filterable, searchable transaction matrix with state tax details and one-click **Excel / CSV Export**.
- **What-If Margin Simulator**: Real-time scenario parameter testing for Average Selling Price (ASP) adjustments and promotional discount optimization.

---

## 📐 Data Modeling & Star Schema

```
                       +-----------------------+
                       |  Dim_Fiscal_Calendar  |
                       | (Date_Key PK)         |
                       +-----------+-----------+
                                   | 1
                                   |
                                   | *
+-----------------------+ 1      +---+-------------------+      * 1 +-----------------------+
|   Dim_Store_Format    +--------+  Fact_Reliance_Sales  +----------+     Dim_Geography     |
| (Format_Key PK)       |        | (Gross Sales & Profit)|          | (City_Key PK)         |
+-----------------------+        +---+-------------------+          +-----------------------+
                                   | *
                                   |
                                   | 1
                       +-----------+-----------+
                       |     Dim_Customer      |
                       | (Customer_Key PK)     |
                       +-----------------------+
```

---

## 🧮 Core DAX Formulas

### 1. Total Gross Revenue (INR)
```dax
Gross Revenue INR = 
SUM ( 'Fact_Reliance_Sales'[Gross_Invoiced_Sales] )
```

### 2. Net Realized Profit
```dax
Net Realized Profit = 
SUM ( 'Fact_Reliance_Sales'[Net_Profit_Amount] )
```

### 3. Realized Profit Margin (%)
```dax
Profit Margin % = 
DIVIDE ( 
    [Net Realized Profit], 
    [Gross Revenue INR], 
    0 
)
```

### 4. Prior Financial Year Sales (Time Intelligence)
```dax
Sales SPLY = 
CALCULATE ( 
    [Gross Revenue INR], 
    SAMEPERIODLASTYEAR ( 'Dim_Fiscal_Calendar'[Date] ) 
)
```

### 5. Year-over-Year Growth Rate
```dax
YoY Sales Growth % = 
VAR CurrentSales = [Gross Revenue INR]
VAR PriorYearSales = [Sales SPLY]
RETURN
    DIVIDE ( CurrentSales - PriorYearSales, PriorYearSales, 0 )
```

---

## 🚀 Live Demo & Deployment

- **Live URL**: [https://adityakasara.github.io/Retail_DashBoard/](https://adityakasara.github.io/Retail_DashBoard/)
- **Repository**: [https://github.com/Adityakasara/Retail_DashBoard.git](https://github.com/Adityakasara/Retail_DashBoard.git)

---

## 💻 Tech Stack
- **Dashboard Interface**: HTML5, Vanilla CSS3 (Microsoft Power BI Native Theme), ES6+ JavaScript
- **Analytics & Visuals**: Chart.js 4.4, Lucide Icons
- **Deployment**: GitHub Pages CI/CD Pipeline
