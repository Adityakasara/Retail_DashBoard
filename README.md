# 🇮🇳 India Retail Sales & Profitability Performance Dashboard (Power BI)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://adityakasara.github.io/Retail_DashBoard/)
[![Power BI](https://img.shields.io/badge/Power_BI-Enterprise%20Analytics-F2C811?style=for-the-badge&logo=powerbi&logoColor=black)](https://adityakasara.github.io/Retail_DashBoard/)
[![Currency](https://img.shields.io/badge/Currency-INR%20(%E2%82%B9)-blue?style=for-the-badge)](https://adityakasara.github.io/Retail_DashBoard/)

An interactive enterprise **Power BI Retail Performance Dashboard** built for pan-India retail operations across metropolitan and tier-1/2 cities. Analyzes multi-crore retail revenue, product profitability, GST slabs, regional zone trends, and UPI payment penetration.

---

## 🌟 Key Highlights & Features

- **Pan-India Retail Analytics**: Comprehensive analysis across **North, South, West, and East Zones** covering key retail hubs (Mumbai, Bengaluru, Delhi NCR, Hyderabad, Chennai, Pune, Ahmedabad, Kolkata).
- **Rupee (INR ₹) & Lakhs/Crores Engine**: Native Indian currency formatting (`₹ Lakhs` & `₹ Crores`) with standard Indian numerical grouping.
- **DAX Measures Implementation**: Real-time evaluation of `[Total Sales INR]`, `[Net Realized Profit]`, `[Blended Profit Margin %]`, `[YoY Sales Growth %]`, `[GST Collected INR]`, and time-intelligence comparisons (`SAMEPERIODLASTYEAR`).
- **Product & Category Mix**: Deep dive across **Electronics & 5G Appliances**, **Home & Living**, **FMCG & Groceries**, and **Ethnic & Western Fashion**.
- **GST & Payment Channels**: Integrated GST analysis across 5%, 12%, 18%, and 28% slabs; UPI (Google Pay / PhonePe) vs Card/EMI vs COD volume split.
- **Dimensional Slicers**: Multi-dimensional filtering by Financial Year (FY 23-24, FY 24-25, FY 25-26), Zone, Category, and Payment Method.
- **Executive BI Visuals**:
  - **Revenue & Profit Trajectory**: Dual-axis line & area chart with Monthly and Fiscal Quarterly granularity.
  - **Zone Performance Matrix**: Regional sales and margin contribution by territory.
  - **Sub-Category Profitability Matrix**: Color-coded margin classification (High >20%, Moderate 12-20%, Volume Driver <12%).
  - **Metro City Breakdown**: Sales velocity in top Indian metros.
  - **Payment Mode Breakdown**: UPI vs Credit/Debit Card vs Cash on Delivery.
- **Structured GST Invoice Ledger**: Filterable, searchable transaction ledger with state tax details and one-click **Excel / CSV Export**.
- **What-If Profitability Simulator**: Simulate pricing adjustments, discount optimization, and volume elasticity on bottom-line profits in INR.

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
|     Dim_Customer      +--------+  Fact_Retail_Orders   +----------+      Dim_Product      |
| (Customer_Key PK)     |        | (Gross Sales & Profit)|          | (Product_Key PK)      |
+-----------------------+        +---+-------------------+          +-----------------------+
                                   | *
                                   |
                                   | 1
                       +-----------+-----------+
                       |     Dim_Geography     |
                       | (City_Key PK)         |
                       +-----------------------+
```

---

## 🧮 Core DAX Formulas

### 1. Total Gross Sales (INR)
```dax
Total Sales INR = 
SUM ( 'Fact_Retail_Orders'[Gross_Sales_Amount] )
```

### 2. Net Realized Profit
```dax
Net Realized Profit = 
SUM ( 'Fact_Retail_Orders'[Net_Profit_Amount] )
```

### 3. Blended Profit Margin (%)
```dax
Blended Profit Margin % = 
DIVIDE ( 
    [Net Realized Profit], 
    [Total Sales INR], 
    0 
)
```

### 4. Prior Financial Year Sales (Time Intelligence)
```dax
Sales SPLY = 
CALCULATE (
    [Total Sales INR],
    SAMEPERIODLASTYEAR ( 'Dim_Fiscal_Calendar'[Date] )
)
```

### 5. Year-over-Year Growth Rate
```dax
YoY Sales Growth % = 
VAR CurrentSales = [Total Sales INR]
VAR PriorYearSales = [Sales SPLY]
RETURN
    DIVIDE ( CurrentSales - PriorYearSales, PriorYearSales, 0 )
```

### 6. GST Tax Liability
```dax
GST Collected INR = 
SUM ( 'Fact_Retail_Orders'[GST_Amount] )
```

---

## 🚀 Live Demo & Deployment

- **Live URL**: [https://adityakasara.github.io/Retail_DashBoard/](https://adityakasara.github.io/Retail_DashBoard/)
- **Repository**: [https://github.com/Adityakasara/Retail_DashBoard.git](https://github.com/Adityakasara/Retail_DashBoard.git)

---

## 💻 Tech Stack
- **Dashboard Interface**: HTML5, Vanilla CSS3 (Power BI Fluent Design System, Glassmorphism, Responsive Grid), ES6+ JavaScript
- **Analytics & Charts**: Chart.js 4.4, Lucide Icons
- **Deployment**: GitHub Pages CI/CD Pipeline
