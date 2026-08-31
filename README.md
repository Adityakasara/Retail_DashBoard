# 📊 Retail Sales Performance Dashboard (Power BI Analytics)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://adityakasara.github.io/Retail_DashBoard/)
[![Power BI](https://img.shields.io/badge/Power_BI-Analytics-F2C811?style=for-the-badge&logo=powerbi&logoColor=black)](https://adityakasara.github.io/Retail_DashBoard/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

An interactive, high-performance **Retail Sales Performance Dashboard** designed to analyze large retail transaction datasets for profitability, sales trends, regional distribution, and pattern identification across categories and customer segments.

---

## 🌟 Key Highlights & Features

- **Interactive BI Dashboard**: Analyze multi-year retail transactions for top-line revenue, gross profit, and bottom-line profit margins.
- **DAX Measures Implementation**: Real-time evaluation of `[Total Sales]`, `[Total Profit]`, `[Profit Margin %]`, `[YoY Sales Growth]`, `[Average Order Value]`, and time-intelligence comparisons (`SAMEPERIODLASTYEAR`).
- **Dimensional Slicers**: Multi-dimensional filtering across Date (2023–2026), Territory/Region (West, East, Central, South), Category (Technology, Furniture, Office Supplies), and Customer Segment (Consumer, Corporate, Home Office).
- **Interactive Visual Suite**:
  - **Revenue & Profit Trajectory**: Dual-axis line and area charts with Monthly and Quarterly aggregation toggles.
  - **Regional Profitability Breakdown**: Horizontal bar chart with margin % metrics.
  - **Category Contribution Matrix**: Dynamic doughnut chart with real-time center revenue summation.
  - **Sub-Category Margin Matrix**: Color-coded margin classification (High >20%, Moderate 10-20%, Risk <10%).
  - **Customer Segment Analysis**: Segment distribution comparisons.
- **Structured Transaction Ledger**: Sortable, searchable retail transaction ledger with live margin health tags and one-click **CSV Dataset Export**.
- **What-If Profitability Simulator**: Interactive sliders to simulate price increases, discount caps, and volume elasticity on bottom-line profits.
- **Data Model & ETL Architecture**: Complete Star Schema documentation (1 Fact table & 4 Dimension tables) and Power Query data privacy & GDPR masking workflow.

---

## 📐 Data Modeling & Star Schema

```
                    +--------------------+
                    |    Dim_Calendar    |
                    | (Date_Key PK)      |
                    +---------+----------+
                              | 1
                              |
                              | *
+--------------------+ 1    +---+----------------+    * 1 +--------------------+
|    Dim_Customer    +------+   Fact_Orders      +--------+     Dim_Product    |
| (Customer_Key PK)  |      |   (Sales & Profit) |        | (Product_Key PK)   |
+--------------------+      +---+----------------+        +--------------------+
                              | *
                              |
                              | 1
                    +---------+----------+
                    |    Dim_Location    |
                    | (Location_Key PK)  |
                    +--------------------+
```

---

## 🧮 Core DAX Formulas

### 1. Total Sales
```dax
Total Sales = 
SUM ( 'Fact_Orders'[Sales_Amount] )
```

### 2. Total Gross Profit
```dax
Total Profit = 
SUM ( 'Fact_Orders'[Profit_Amount] )
```

### 3. Profit Margin (%)
```dax
Profit Margin % = 
DIVIDE ( 
    [Total Profit], 
    [Total Sales], 
    0 
)
```

### 4. Prior Year Sales (Time Intelligence)
```dax
Sales PY = 
CALCULATE (
    [Total Sales],
    SAMEPERIODLASTYEAR ( 'Dim_Calendar'[Date] )
)
```

### 5. Year-over-Year Growth Rate
```dax
YoY Sales Growth % = 
VAR CurrentSales = [Total Sales]
VAR PriorYearSales = [Sales PY]
RETURN
    DIVIDE ( CurrentSales - PriorYearSales, PriorYearSales, 0 )
```

---

## 🚀 Live Demo & Deployment

- **Live URL**: [https://adityakasara.github.io/Retail_DashBoard/](https://adityakasara.github.io/Retail_DashBoard/)
- **Repository**: [https://github.com/Adityakasara/Retail_DashBoard.git](https://github.com/Adityakasara/Retail_DashBoard.git)

---

## 💻 Tech Stack
- **Frontend / Presentation**: HTML5, Vanilla CSS3 (Fluent Design Tokens, Glassmorphism, Responsive CSS Grid), JavaScript (ES6+ Modules)
- **Data Visualization**: Chart.js 4.4, Lucide Icons, Canvas Confetti
- **Deployment**: GitHub Pages, GitHub Actions CI/CD Pipeline
