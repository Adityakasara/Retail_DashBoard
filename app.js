/**
 * India Retail Sales & Profit Performance Dashboard - Power BI Analytical Engine
 * Currency: Indian Rupee (INR - ₹) with Lakhs (L) and Crores (Cr) Formatting
 * Data Architecture: Star Schema (Fact_Retail_Orders, Dim_Customer, Dim_Product, Dim_Geography, Dim_Fiscal_Calendar)
 */

// Application State
const state = {
  rawOrders: [],
  filteredOrders: [],
  filters: {
    year: 'ALL',
    region: 'ALL',
    category: 'ALL',
    payment: 'ALL',
    search: '',
  },
  activeView: 'overview',
  sorting: {
    column: 'date',
    direction: 'desc'
  },
  pagination: {
    page: 1,
    pageSize: 10,
    totalPages: 1
  },
  timelineGranularity: 'month',
  simulation: {
    priceDelta: 0,
    discountDelta: 0,
    volumeDelta: 0
  },
  theme: 'powerbi',
  charts: {}
};

// ==========================================================================
// 1. Authentic Indian Retail Dataset Generator
// ==========================================================================
function generateIndianRetailDataset() {
  const geography = {
    North: [
      { state: 'Delhi NCR', city: 'New Delhi', tier: 'Metro' },
      { state: 'Delhi NCR', city: 'Gurugram', tier: 'Tier-1' },
      { state: 'Delhi NCR', city: 'Noida', tier: 'Tier-1' },
      { state: 'Uttar Pradesh', city: 'Lucknow', tier: 'Tier-2' },
      { state: 'Rajasthan', city: 'Jaipur', tier: 'Tier-2' },
      { state: 'Punjab', city: 'Chandigarh', tier: 'Tier-2' }
    ],
    South: [
      { state: 'Karnataka', city: 'Bengaluru', tier: 'Metro' },
      { state: 'Telangana', city: 'Hyderabad', tier: 'Metro' },
      { state: 'Tamil Nadu', city: 'Chennai', tier: 'Metro' },
      { state: 'Tamil Nadu', city: 'Coimbatore', tier: 'Tier-2' },
      { state: 'Kerala', city: 'Kochi', tier: 'Tier-2' }
    ],
    West: [
      { state: 'Maharashtra', city: 'Mumbai', tier: 'Metro' },
      { state: 'Maharashtra', city: 'Pune', tier: 'Tier-1' },
      { state: 'Maharashtra', city: 'Nagpur', tier: 'Tier-2' },
      { state: 'Gujarat', city: 'Ahmedabad', tier: 'Tier-1' },
      { state: 'Gujarat', city: 'Surat', tier: 'Tier-2' },
      { state: 'Goa', city: 'Panaji', tier: 'Tier-2' }
    ],
    East: [
      { state: 'West Bengal', city: 'Kolkata', tier: 'Metro' },
      { state: 'Odisha', city: 'Bhubaneswar', tier: 'Tier-2' },
      { state: 'Bihar', city: 'Patna', tier: 'Tier-2' },
      { state: 'Assam', city: 'Guwahati', tier: 'Tier-2' }
    ]
  };

  const productCatalog = {
    'Electronics & Appliances': {
      'Smartphones & 5G': [
        { name: 'Samsung Galaxy S24 Ultra (256GB)', price: 119999, margin: 0.22, gst: 0.18 },
        { name: 'OnePlus 12 5G (16GB RAM)', price: 64999, margin: 0.20, gst: 0.18 },
        { name: 'Apple iPhone 15 (128GB)', price: 71999, margin: 0.18, gst: 0.18 },
        { name: 'Redmi Note 13 Pro+ 5G', price: 29999, margin: 0.19, gst: 0.18 }
      ],
      'Smart TVs & Audio': [
        { name: 'Sony Bravia 55" 4K Ultra HD Google TV', price: 62990, margin: 0.24, gst: 0.28 },
        { name: 'LG 43" 4K Smart LED TV', price: 34990, margin: 0.21, gst: 0.18 },
        { name: 'boAt Aavante Bar 2050 Soundbar', price: 7999, margin: 0.32, gst: 0.18 },
        { name: 'Sony WH-1000XM5 ANC Headphones', price: 26990, margin: 0.28, gst: 0.18 }
      ],
      'Laptops & Tablets': [
        { name: 'Apple MacBook Air M3 (16GB)', price: 114900, margin: 0.17, gst: 0.18 },
        { name: 'Dell Inspiron 15 Core i5 13th Gen', price: 54990, margin: 0.19, gst: 0.18 },
        { name: 'Lenovo IdeaPad Slim 3 Ryzen 7', price: 48990, margin: 0.20, gst: 0.18 },
        { name: 'Apple iPad Air M2 11-inch', price: 59900, margin: 0.16, gst: 0.18 }
      ],
      'Home Appliances': [
        { name: 'Voltas 1.5 Ton 5 Star Inverter Split AC', price: 38490, margin: 0.22, gst: 0.28 },
        { name: 'LG 260L Double Door Smart Inverter Refrigerator', price: 27990, margin: 0.21, gst: 0.18 },
        { name: 'Philips 750W Mixer Grinder (3 Jars)', price: 4499, margin: 0.35, gst: 0.18 },
        { name: 'IFB 7 Kg 5 Star Front Load Washing Machine', price: 31990, margin: 0.23, gst: 0.18 }
      ]
    },
    'Home & Living': {
      'Living Room Furniture': [
        { name: 'Solid Sheesham Wood 6-Seater Dining Set', price: 34999, margin: 0.28, gst: 0.18 },
        { name: 'Wakefit L-Shape Fabric Sectional Sofa', price: 26499, margin: 0.25, gst: 0.18 },
        { name: 'Green Soul Ergonomic High-Back Office Chair', price: 11990, margin: 0.30, gst: 0.18 },
        { name: 'DeckUp Zebrano Engineered Wood Bookcase', price: 6499, margin: 0.32, gst: 0.12 }
      ],
      'Bedroom & Storage': [
        { name: 'Wakefit Orthopedic Memory Foam Mattress (King)', price: 14499, margin: 0.35, gst: 0.18 },
        { name: 'Godrej Interio 2-Door Steel Wardrobe', price: 19999, margin: 0.22, gst: 0.18 },
        { name: 'Spacewood Engineered Wood Queen Bed', price: 16999, margin: 0.24, gst: 0.18 }
      ],
      'Home Decor & Lighting': [
        { name: 'Wipro 16W Smart LED Batten (Pack of 4)', price: 1899, margin: 0.40, gst: 0.18 },
        { name: 'Spaces 100% Cotton King Bedsheet with Pillow Covers', price: 2299, margin: 0.42, gst: 0.12 },
        { name: 'Jaipur Rugs Hand-Tufted Wool Carpet', price: 12500, margin: 0.38, gst: 0.12 }
      ]
    },
    'FMCG & Groceries': {
      'Packaged Foods & Staples': [
        { name: 'Daawat Rozana Super Basmati Rice (5 kg)', price: 499, margin: 0.14, gst: 0.05 },
        { name: 'Fortune Sunlite Refined Sunflower Oil (5 L)', price: 685, margin: 0.12, gst: 0.05 },
        { name: 'Aashirvaad Select Shudh Chakki Atta (10 kg)', price: 540, margin: 0.15, gst: 0.05 },
        { name: 'Tata Tea Gold Premium Blend (1 kg)', price: 520, margin: 0.22, gst: 0.05 }
      ],
      'Festive & Dry Fruits': [
        { name: 'Nutraj California Almonds & Cashews Hamper (1 kg)', price: 1199, margin: 0.28, gst: 0.12 },
        { name: 'Ferrero Rocher Premium Chocolate Box (24 Pcs)', price: 895, margin: 0.25, gst: 0.18 },
        { name: 'Organic India Tulsi Green Tea Combo (Pack of 3)', price: 680, margin: 0.32, gst: 0.05 }
      ],
      'Personal & Home Care': [
        { name: 'Surf Excel Matic Liquid Detergent Front Load (4 L)', price: 820, margin: 0.24, gst: 0.18 },
        { name: 'Dettol Antiseptic Liquid (1 L)', price: 345, margin: 0.20, gst: 0.12 },
        { name: 'Dove Intense Repair Shampoo & Conditioner Pack', price: 699, margin: 0.28, gst: 0.18 }
      ]
    },
    'Fashion & Apparel': {
      'Ethnic & Festive Wear': [
        { name: 'Manyavar Silk Blend Kurta Churidar Set', price: 4999, margin: 0.45, gst: 0.12 },
        { name: 'Biba Pure Cotton Printed Anarkali Kurti', price: 2799, margin: 0.44, gst: 0.12 },
        { name: 'Fabindia Handcrafted Tussar Silk Saree', price: 8990, margin: 0.48, gst: 0.12 }
      ],
      'Western & Casuals': [
        { name: "Levi's Men's 511 Slim Fit Stretchable Jeans", price: 3199, margin: 0.38, gst: 0.12 },
        { name: 'Allen Solly Men Classic Regular Fit Formal Shirt', price: 1899, margin: 0.40, gst: 0.12 },
        { name: 'Red Tape Airflow Walking Sports Shoes', price: 1699, margin: 0.42, gst: 0.12 }
      ]
    }
  };

  const indianCustomers = [
    { name: 'Rajesh Sharma', type: 'Consumer' },
    { name: 'Ananya Iyer', type: 'Consumer' },
    { name: 'Vikram Patel', type: 'Corporate / B2B' },
    { name: 'Pooja Deshmukh', type: 'Consumer' },
    { name: 'Rohan Gupta', type: 'SME Merchant' },
    { name: 'Sneha Mukherjee', type: 'Consumer' },
    { name: 'Amit Verma', type: 'Consumer' },
    { name: 'Neha Agarwal', type: 'Corporate / B2B' },
    { name: 'Karthik Raman', type: 'Consumer' },
    { name: 'Priya Nair', type: 'Consumer' },
    { name: 'Aditya Kasara', type: 'Corporate / B2B' },
    { name: 'Sunita Joshi', type: 'Consumer' },
    { name: 'Rahul Mehra', type: 'Consumer' },
    { name: 'Ritu Bansal', type: 'SME Merchant' },
    { name: 'Suresh Reddy', type: 'Consumer' },
    { name: 'Divya Pillai', type: 'Consumer' },
    { name: 'Manish Jain', type: 'Corporate / B2B' },
    { name: 'Swati Kulkarni', type: 'Consumer' },
    { name: 'Sanjay Ghosh', type: 'Consumer' },
    { name: 'Meenakshi Sundaram', type: 'Consumer' },
    { name: 'Harpreet Singh', type: 'SME Merchant' },
    { name: 'Alok Tripathi', type: 'Consumer' }
  ];

  const paymentModes = [
    'UPI / QR',
    'UPI / QR',
    'UPI / QR', // UPI accounts for over 50% in India
    'Credit / Debit Card',
    'Credit / Debit Card',
    'Cash on Delivery',
    'Net Banking'
  ];

  const totalOrdersCount = 1420;
  const orders = [];

  // Generate realistic fiscal periods (FY 23-24, FY 24-25, FY 25-26)
  const fiscalYears = [
    { name: 'FY 23-24', start: new Date('2023-04-01'), end: new Date('2024-03-31') },
    { name: 'FY 24-25', start: new Date('2024-04-01'), end: new Date('2025-03-31') },
    { name: 'FY 25-26', start: new Date('2025-04-01'), end: new Date('2026-08-30') }
  ];

  for (let i = 1; i <= totalOrdersCount; i++) {
    // Pick Zone & Geo
    const zones = Object.keys(geography);
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const geoList = geography[zone];
    const geo = geoList[Math.floor(Math.random() * geoList.length)];

    // Pick Category, Sub-Category, Product
    const categories = Object.keys(productCatalog);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subCategories = Object.keys(productCatalog[category]);
    const subCategory = subCategories[Math.floor(Math.random() * subCategories.length)];
    const productList = productCatalog[category][subCategory];
    const product = productList[Math.floor(Math.random() * productList.length)];

    // Pick Customer
    const customer = indianCustomers[Math.floor(Math.random() * indianCustomers.length)];
    const paymentMode = paymentModes[Math.floor(Math.random() * paymentModes.length)];

    // Pick Fiscal Year & Date
    const fyObj = fiscalYears[Math.floor(Math.random() * fiscalYears.length)];
    const randomTime = fyObj.start.getTime() + Math.random() * (fyObj.end.getTime() - fyObj.start.getTime());
    const orderDate = new Date(randomTime);
    const dateStr = orderDate.toISOString().slice(0, 10);

    const monthNum = orderDate.getMonth() + 1; // 1-12
    const yearNum = orderDate.getFullYear();
    
    // Indian Fiscal Quarter (Q1 = Apr-Jun, Q2 = Jul-Sep, Q3 = Oct-Dec, Q4 = Jan-Mar)
    let fiscalQuarter = 'Q1';
    if (monthNum >= 4 && monthNum <= 6) fiscalQuarter = 'Q1 (Apr-Jun)';
    else if (monthNum >= 7 && monthNum <= 9) fiscalQuarter = 'Q2 (Jul-Sep)';
    else if (monthNum >= 10 && monthNum <= 12) fiscalQuarter = 'Q3 (Oct-Dec - Festive)';
    else fiscalQuarter = 'Q4 (Jan-Mar)';

    // Quantity & Discount
    const quantity = category === 'FMCG & Groceries' ? Math.floor(Math.random() * 4) + 1 : Math.floor(Math.random() * 2) + 1;
    const discountTier = Math.random();
    const discountRate = discountTier > 0.6 ? (Math.floor(Math.random() * 3) + 1) * 0.05 : 0; // 0%, 5%, 10%, 15%

    const unitPrice = product.price;
    const grossSales = unitPrice * quantity;
    const netSales = Math.round(grossSales * (1 - discountRate));

    // GST Amount (Calculated based on HSN slab)
    const gstAmount = Math.round(netSales * product.gst);

    // Cost & Profit
    const baseMargin = product.margin;
    // Small realistic variance in procurement cost
    const costRatio = (1 - baseMargin) + (Math.random() * 0.04 - 0.02);
    const cost = Math.round(unitPrice * costRatio * quantity);
    const profit = Math.round(netSales - cost);
    const profitMargin = netSales > 0 ? Number(((profit / netSales) * 100).toFixed(1)) : 0;

    const invoiceId = `INV-IN-${yearNum}-${String(10000 + i).slice(1)}`;

    orders.push({
      id: i,
      invoiceId,
      orderDate: dateStr,
      year: fyObj.name,
      calendarYear: yearNum,
      month: monthNum,
      quarter: fiscalQuarter,
      customerName: customer.name,
      customerType: customer.type,
      zone,
      state: geo.state,
      city: geo.city,
      cityTier: geo.tier,
      category,
      subCategory,
      productName: product.name,
      unitPrice,
      quantity,
      discountRate,
      sales: netSales,
      gstAmount,
      profit,
      profitMargin,
      paymentMode
    });
  }

  return orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
}

// ==========================================================================
// 2. Indian Number & Rupee Formatters (Lakhs & Crores)
// ==========================================================================
function formatINR(amount, compact = false) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';

  if (compact) {
    const absVal = Math.abs(amount);
    if (absVal >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (absVal >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    if (absVal >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
    return `₹${Math.round(amount)}`;
  }

  // Standard Indian Currency formatting: ₹12,34,567
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// ==========================================================================
// 3. DAX Engine & Slicer Execution
// ==========================================================================
function applySlicers() {
  const { year, region, category, payment, search } = state.filters;
  const searchLower = search.trim().toLowerCase();

  state.filteredOrders = state.rawOrders.filter(order => {
    if (year !== 'ALL' && order.year !== year) return false;
    if (region !== 'ALL' && order.zone !== region) return false;
    if (category !== 'ALL' && order.category !== category) return false;
    if (payment !== 'ALL' && order.paymentMode !== payment) return false;
    if (searchLower) {
      const match = 
        order.invoiceId.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower) ||
        order.city.toLowerCase().includes(searchLower) ||
        order.state.toLowerCase().includes(searchLower) ||
        order.productName.toLowerCase().includes(searchLower) ||
        order.subCategory.toLowerCase().includes(searchLower);
      if (!match) return false;
    }
    return true;
  });

  computeDaxMeasures();
  updateVisuals();
  renderLedgerTable();
  updateDynamicInsights();
}

function computeDaxMeasures() {
  const orders = state.filteredOrders;
  const sim = state.simulation;

  let totalSales = 0;
  let totalProfit = 0;
  let totalQuantity = 0;
  let totalGst = 0;
  let upiCount = 0;
  const uniqueInvoices = new Set();

  orders.forEach(o => {
    // What-If Pricing & Volume multipliers
    let adjSales = o.sales * (1 + sim.priceDelta / 100) * (1 - sim.discountDelta / 100);
    adjSales = adjSales * (1 + sim.volumeDelta / 100);

    const cost = (o.sales - o.profit) * (1 + sim.volumeDelta / 100);
    const adjProfit = adjSales - cost;

    totalSales += adjSales;
    totalProfit += adjProfit;
    totalQuantity += o.quantity * (1 + sim.volumeDelta / 100);
    totalGst += o.gstAmount * (1 + sim.priceDelta / 100);

    if (o.paymentMode.includes('UPI')) upiCount++;
    uniqueInvoices.add(o.invoiceId);
  });

  const totalOrders = uniqueInvoices.size;
  const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
  const aov = totalOrders > 0 ? totalSales / totalOrders : 0;
  const upiPercentage = orders.length > 0 ? (upiCount / orders.length) * 100 : 0;

  // Prior Year Benchmarks
  const pySales = totalSales * 0.859;
  const pyProfit = totalProfit * 0.821;
  const salesGrowth = pySales > 0 ? ((totalSales - pySales) / pySales) * 100 : 0;
  const profitGrowth = pyProfit > 0 ? ((totalProfit - pyProfit) / pyProfit) * 100 : 0;

  // DOM Updates
  document.getElementById('kpiTotalSales').textContent = formatINR(totalSales, true);
  document.getElementById('kpiSalesGrowth').innerHTML = `<i data-lucide="arrow-up-right"></i> +${salesGrowth.toFixed(1)}% vs SPLY`;
  document.getElementById('kpiSalesPy').textContent = formatINR(pySales, true);

  document.getElementById('kpiTotalProfit').textContent = formatINR(totalProfit, true);
  document.getElementById('kpiProfitGrowth').innerHTML = `<i data-lucide="arrow-up-right"></i> +${profitGrowth.toFixed(1)}% YoY`;
  document.getElementById('kpiProfitPy').textContent = formatINR(pyProfit, true);

  const marginEl = document.getElementById('kpiProfitMargin');
  marginEl.textContent = `${profitMargin.toFixed(1)}%`;
  const marginStatusEl = document.getElementById('kpiMarginStatus');
  if (profitMargin >= 16) {
    marginStatusEl.className = 'kpi-trend positive';
    marginStatusEl.innerHTML = `<i data-lucide="check-circle-2"></i> Strong (> 16%)`;
  } else if (profitMargin >= 12) {
    marginStatusEl.className = 'kpi-trend warning';
    marginStatusEl.innerHTML = `<i data-lucide="alert-circle"></i> Moderate (12-16%)`;
  } else {
    marginStatusEl.className = 'kpi-trend danger';
    marginStatusEl.innerHTML = `<i data-lucide="alert-triangle"></i> Margin Risk (< 12%)`;
  }

  document.getElementById('kpiTotalOrders').textContent = totalOrders.toLocaleString('en-IN');
  document.getElementById('kpiTotalUnits').textContent = `${Math.round(totalQuantity).toLocaleString('en-IN')} Units Dispatched`;

  document.getElementById('kpiAOV').textContent = formatINR(aov);
  document.getElementById('kpiTotalGst').textContent = formatINR(totalGst, true);
  document.getElementById('kpiUpiShare').textContent = `UPI Share: ${upiPercentage.toFixed(1)}%`;

  const doughnutCenter = document.getElementById('doughnutCenterVal');
  if (doughnutCenter) {
    doughnutCenter.textContent = formatINR(totalSales, true);
  }

  if (window.lucide) window.lucide.createIcons();
}

function updateDynamicInsights() {
  const notesEl = document.getElementById('analystNotesText');
  if (!notesEl) return;

  const orders = state.filteredOrders;
  if (orders.length === 0) {
    notesEl.textContent = 'No sales records match current slicer selection. Please reset or broaden dimensional filters.';
    return;
  }

  // Find top zone
  const zoneSales = {};
  const catSales = {};
  orders.forEach(o => {
    zoneSales[o.zone] = (zoneSales[o.zone] || 0) + o.sales;
    catSales[o.category] = (catSales[o.category] || 0) + o.sales;
  });

  const topZone = Object.keys(zoneSales).sort((a, b) => zoneSales[b] - zoneSales[a])[0] || 'West';
  const topCat = Object.keys(catSales).sort((a, b) => catSales[b] - catSales[a])[0] || 'Electronics';

  notesEl.textContent = `Executive Review: ${topZone} Zone currently leads top-line sales, spearheaded by robust demand in ${topCat}. UPI continues to provide frictionless settlements with zero payment gateway friction across metropolitan retail centers. Gross margin profile remains solid at healthy benchmark targets.`;
}

// ==========================================================================
// 4. Visualizations with Chart.js
// ==========================================================================
function initVisuals() {
  const isDark = state.theme === 'powerbi';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  const textColor = isDark ? '#94a3b8' : '#475569';

  Chart.defaults.color = textColor;
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.plugins.tooltip.backgroundColor = isDark ? '#1e293b' : '#ffffff';
  Chart.defaults.plugins.tooltip.titleColor = isDark ? '#f8fafc' : '#0f172a';
  Chart.defaults.plugins.tooltip.bodyColor = isDark ? '#94a3b8' : '#475569';
  Chart.defaults.plugins.tooltip.borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.1)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 9;
  Chart.defaults.plugins.tooltip.cornerRadius = 6;

  // Chart 1: Revenue Timeline (Line)
  const ctxTimeline = document.getElementById('timelineChart').getContext('2d');
  state.charts.timeline = new Chart(ctxTimeline, {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { grid: { color: gridColor }, ticks: { maxRotation: 0, font: { size: 11 } } },
        y: {
          grid: { color: gridColor },
          ticks: {
            callback: v => {
              if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
              if (v >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
              return `₹${v}`;
            }
          }
        }
      },
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 6, font: { weight: '600' } } },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${formatINR(ctx.raw)}`
          }
        }
      }
    }
  });

  // Chart 2: Zone Performance (Bar)
  const ctxRegion = document.getElementById('regionChart').getContext('2d');
  state.charts.region = new Chart(ctxRegion, {
    type: 'bar',
    data: { labels: [], datasets: [] },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: {
            callback: v => `₹${(v / 100000).toFixed(1)}L`
          }
        },
        y: { grid: { display: false } }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `Sales: ${formatINR(ctx.raw)}`
          }
        }
      }
    }
  });

  // Chart 3: Category Doughnut
  const ctxCategory = document.getElementById('categoryChart').getContext('2d');
  state.charts.category = new Chart(ctxCategory, {
    type: 'doughnut',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, boxWidth: 8, padding: 12, font: { size: 11 } }
        },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.label}: ${formatINR(ctx.raw)}`
          }
        }
      }
    }
  });

  // Chart 4: Sub-Category Profitability Matrix (Bar)
  const ctxSubCategory = document.getElementById('subCategoryChart').getContext('2d');
  state.charts.subCategory = new Chart(ctxSubCategory, {
    type: 'bar',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: {
          grid: { color: gridColor },
          ticks: { callback: v => `₹${(v / 100000).toFixed(1)}L` }
        }
      },
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 6 } },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${formatINR(ctx.raw)}`
          }
        }
      }
    }
  });

  // Chart 5: Top 6 Cities (Bar)
  const ctxCity = document.getElementById('cityChart').getContext('2d');
  state.charts.city = new Chart(ctxCity, {
    type: 'bar',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: gridColor },
          ticks: { callback: v => `₹${(v / 100000).toFixed(1)}L` }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `Sales: ${formatINR(ctx.raw)}`
          }
        }
      }
    }
  });

  // Chart 6: Payment Channel Breakdown (Horizontal Bar)
  const ctxPayment = document.getElementById('paymentChart').getContext('2d');
  state.charts.payment = new Chart(ctxPayment, {
    type: 'bar',
    data: { labels: [], datasets: [] },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { callback: v => `₹${(v / 100000).toFixed(1)}L` }
        },
        y: { grid: { display: false } }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `Total Volume: ${formatINR(ctx.raw)}`
          }
        }
      }
    }
  });
}

function updateVisuals() {
  const orders = state.filteredOrders;

  // 1. Timeline Chart (Monthly / Quarterly in Fiscal Calendar)
  const timelineMap = {};
  orders.forEach(o => {
    let key = state.timelineGranularity === 'month' ? `${o.calendarYear}-${String(o.month).padStart(2, '0')}` : `${o.year} ${o.quarter.slice(0, 2)}`;
    if (!timelineMap[key]) {
      timelineMap[key] = { sales: 0, profit: 0, label: key };
    }
    timelineMap[key].sales += o.sales;
    timelineMap[key].profit += o.profit;
  });

  const sortedKeys = Object.keys(timelineMap).sort();
  const timelineLabels = sortedKeys.map(k => {
    if (state.timelineGranularity === 'month') {
      const [y, m] = k.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[parseInt(m, 10) - 1]} '${y.slice(2)}`;
    }
    return k;
  });

  if (state.charts.timeline) {
    state.charts.timeline.data = {
      labels: timelineLabels,
      datasets: [
        {
          label: 'Gross Sales (₹)',
          data: sortedKeys.map(k => timelineMap[k].sales),
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.12)',
          fill: true,
          tension: 0.3,
          borderWidth: 2.2,
          pointRadius: 2.5
        },
        {
          label: 'Net Realized Profit (₹)',
          data: sortedKeys.map(k => timelineMap[k].profit),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          fill: true,
          tension: 0.3,
          borderWidth: 1.8,
          borderDash: [3, 3],
          pointRadius: 2.5
        }
      ]
    };
    state.charts.timeline.update();
  }

  // 2. Zone Breakdown
  const zoneMap = { North: 0, South: 0, West: 0, East: 0 };
  orders.forEach(o => {
    if (zoneMap[o.zone] !== undefined) {
      zoneMap[o.zone] += o.sales;
    }
  });

  if (state.charts.region) {
    state.charts.region.data = {
      labels: ['North Zone', 'South Zone', 'West Zone', 'East Zone'],
      datasets: [
        {
          data: [zoneMap.North, zoneMap.South, zoneMap.West, zoneMap.East],
          backgroundColor: ['#38bdf8', '#10b981', '#f59e0b', '#a855f7'],
          borderRadius: 4
        }
      ]
    };
    state.charts.region.update();
  }

  // 3. Category Breakdown
  const catMap = {};
  orders.forEach(o => {
    catMap[o.category] = (catMap[o.category] || 0) + o.sales;
  });

  const catLabels = Object.keys(catMap);
  const catSales = catLabels.map(c => catMap[c]);

  // Top category tag
  let topC = 'Electronics';
  let maxS = -1;
  catLabels.forEach(c => {
    if (catMap[c] > maxS) {
      maxS = catMap[c];
      topC = c;
    }
  });
  const topTag = document.getElementById('topCategoryTag');
  if (topTag) topTag.textContent = `Top: ${topC.split(' ')[0]}`;

  if (state.charts.category) {
    state.charts.category.data = {
      labels: catLabels,
      datasets: [
        {
          data: catSales,
          backgroundColor: ['#38bdf8', '#f59e0b', '#10b981', '#ec4899'],
          borderWidth: 0
        }
      ]
    };
    state.charts.category.update();
  }

  // 4. Sub-Category Breakdown
  const subMap = {};
  orders.forEach(o => {
    if (!subMap[o.subCategory]) subMap[o.subCategory] = { sales: 0, profit: 0 };
    subMap[o.subCategory].sales += o.sales;
    subMap[o.subCategory].profit += o.profit;
  });

  const subList = Object.keys(subMap)
    .map(k => ({
      name: k,
      sales: subMap[k].sales,
      profit: subMap[k].profit,
      margin: subMap[k].sales > 0 ? (subMap[k].profit / subMap[k].sales) * 100 : 0
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 8);

  const subColors = subList.map(s => {
    if (s.margin >= 20) return '#10b981';
    if (s.margin >= 12) return '#f59e0b';
    return '#ef4444';
  });

  if (state.charts.subCategory) {
    state.charts.subCategory.data = {
      labels: subList.map(s => s.name),
      datasets: [
        {
          label: 'Gross Sales (₹)',
          data: subList.map(s => s.sales),
          backgroundColor: subColors,
          borderRadius: 4
        }
      ]
    };
    state.charts.subCategory.update();
  }

  // 5. Top Cities Breakdown
  const cityMap = {};
  orders.forEach(o => {
    cityMap[o.city] = (cityMap[o.city] || 0) + o.sales;
  });

  const cityList = Object.keys(cityMap)
    .map(c => ({ city: c, sales: cityMap[c] }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 6);

  if (state.charts.city) {
    state.charts.city.data = {
      labels: cityList.map(c => c.city),
      datasets: [
        {
          data: cityList.map(c => c.sales),
          backgroundColor: '#38bdf8',
          borderRadius: 4
        }
      ]
    };
    state.charts.city.update();
  }

  // 6. Payment Modes Breakdown
  const payMap = {};
  orders.forEach(o => {
    payMap[o.paymentMode] = (payMap[o.paymentMode] || 0) + o.sales;
  });

  const payLabels = Object.keys(payMap);
  if (state.charts.payment) {
    state.charts.payment.data = {
      labels: payLabels,
      datasets: [
        {
          data: payLabels.map(p => payMap[p]),
          backgroundColor: ['#10b981', '#38bdf8', '#f59e0b', '#a855f7'],
          borderRadius: 4
        }
      ]
    };
    state.charts.payment.update();
  }
}

// ==========================================================================
// 5. Transaction Ledger Table & Pagination
// ==========================================================================
function renderLedgerTable() {
  const tbody = document.getElementById('tableBody');
  const tableInfo = document.getElementById('tableInfo');
  if (!tbody) return;

  const orders = [...state.filteredOrders];

  // Sort
  orders.sort((a, b) => {
    let factor = state.sorting.direction === 'asc' ? 1 : -1;
    if (state.sorting.column === 'date') {
      return (new Date(a.orderDate) - new Date(b.orderDate)) * factor;
    }
    if (state.sorting.column === 'sales') {
      return (a.sales - b.sales) * factor;
    }
    if (state.sorting.column === 'profit') {
      return (a.profit - b.profit) * factor;
    }
    if (state.sorting.column === 'margin') {
      return (a.profitMargin - b.profitMargin) * factor;
    }
    return 0;
  });

  const total = orders.length;
  state.pagination.totalPages = Math.max(1, Math.ceil(total / state.pagination.pageSize));
  if (state.pagination.page > state.pagination.totalPages) {
    state.pagination.page = state.pagination.totalPages;
  }

  const startIdx = (state.pagination.page - 1) * state.pagination.pageSize;
  const pageItems = orders.slice(startIdx, startIdx + state.pagination.pageSize);

  if (pageItems.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="13" style="text-align: center; padding: 2rem; color: var(--pbi-text-secondary);">
          No matching transactions found with current filter selections.
        </td>
      </tr>
    `;
    tableInfo.textContent = 'Showing 0 of 0 records';
    updatePager();
    return;
  }

  const rows = pageItems.map(o => {
    const badgeClass = o.profitMargin >= 18 ? 'green' : o.profitMargin >= 10 ? 'yellow' : 'red';
    const statusText = o.profitMargin >= 18 ? 'High Margin' : o.profitMargin >= 10 ? 'Normal' : 'Low Margin';

    return `
      <tr>
        <td style="font-family: var(--font-mono); font-weight: 600; color: var(--pbi-blue);">${o.invoiceId}</td>
        <td style="font-family: var(--font-mono); color: var(--pbi-text-secondary);">${o.orderDate}</td>
        <td><strong>${o.customerName}</strong></td>
        <td>${o.city}, ${o.state}</td>
        <td><span style="font-size: 0.72rem; color: var(--pbi-yellow);">${o.zone} Zone</span></td>
        <td>${o.category}</td>
        <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${o.productName}">${o.productName}</td>
        <td style="font-family: var(--font-mono); font-weight: 700;">${formatINR(o.sales)}</td>
        <td style="font-family: var(--font-mono); color: var(--pbi-text-secondary);">${formatINR(o.gstAmount)}</td>
        <td style="font-family: var(--font-mono); font-weight: 700; color: ${o.profit >= 0 ? 'var(--pbi-success)' : 'var(--pbi-danger)'};">${formatINR(o.profit)}</td>
        <td style="font-family: var(--font-mono); font-weight: 700;">${o.profitMargin.toFixed(1)}%</td>
        <td><span style="font-size: 0.72rem; background: var(--pbi-bg-subtle); padding: 0.15rem 0.4rem; border-radius: 3px;">${o.paymentMode}</span></td>
        <td><span class="status-badge ${badgeClass}">${statusText}</span></td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = rows;
  tableInfo.textContent = `Showing ${startIdx + 1} to ${Math.min(startIdx + state.pagination.pageSize, total)} of ${total} records`;
  updatePager();
}

function updatePager() {
  const btnPrev = document.getElementById('btnPrevPage');
  const btnNext = document.getElementById('btnNextPage');
  const pageInd = document.getElementById('pageIndicator');

  if (btnPrev) btnPrev.disabled = state.pagination.page <= 1;
  if (btnNext) btnNext.disabled = state.pagination.page >= state.pagination.totalPages;
  if (pageInd) pageInd.textContent = `Page ${state.pagination.page} / ${state.pagination.totalPages}`;
}

// ==========================================================================
// 6. What-If Profitability Simulator
// ==========================================================================
function updateSimulator() {
  const priceDelta = parseInt(document.getElementById('sliderPrice').value, 10);
  const discountDelta = parseInt(document.getElementById('sliderDiscount').value, 10);
  const volumeDelta = parseInt(document.getElementById('sliderVolume').value, 10);

  document.getElementById('valPriceDelta').textContent = `${priceDelta >= 0 ? '+' : ''}${priceDelta}%`;
  document.getElementById('valDiscountDelta').textContent = `${discountDelta >= 0 ? '+' : ''}${discountDelta}%`;
  document.getElementById('valVolumeDelta').textContent = `${volumeDelta >= 0 ? '+' : ''}${volumeDelta}%`;

  let baseSales = 0;
  let baseProfit = 0;
  let simSales = 0;
  let simProfit = 0;

  state.filteredOrders.forEach(o => {
    baseSales += o.sales;
    baseProfit += o.profit;

    let sSales = o.sales * (1 + priceDelta / 100) * (1 - discountDelta / 100);
    sSales = sSales * (1 + volumeDelta / 100);

    const cost = (o.sales - o.profit) * (1 + volumeDelta / 100);
    const sProfit = sSales - cost;

    simSales += sSales;
    simProfit += sProfit;
  });

  const salesDeltaVal = simSales - baseSales;
  const salesDeltaPct = baseSales > 0 ? (salesDeltaVal / baseSales) * 100 : 0;

  const profitDeltaVal = simProfit - baseProfit;
  const profitDeltaPct = baseProfit > 0 ? (profitDeltaVal / baseProfit) * 100 : 0;

  const simMargin = simSales > 0 ? (simProfit / simSales) * 100 : 0;
  const baseMargin = baseSales > 0 ? (baseProfit / baseSales) * 100 : 0;
  const marginDelta = simMargin - baseMargin;

  document.getElementById('simSales').textContent = formatINR(simSales, true);
  const simSalesDeltaEl = document.getElementById('simSalesDelta');
  simSalesDeltaEl.textContent = `${salesDeltaVal >= 0 ? '+' : ''}${formatINR(salesDeltaVal, true)} (${salesDeltaPct >= 0 ? '+' : ''}${salesDeltaPct.toFixed(1)}%)`;
  simSalesDeltaEl.className = `stat-delta ${salesDeltaVal >= 0 ? 'positive' : 'danger'}`;

  document.getElementById('simProfit').textContent = formatINR(simProfit, true);
  const simProfitDeltaEl = document.getElementById('simProfitDelta');
  simProfitDeltaEl.textContent = `${profitDeltaVal >= 0 ? '+' : ''}${formatINR(profitDeltaVal, true)} (${profitDeltaPct >= 0 ? '+' : ''}${profitDeltaPct.toFixed(1)}%)`;
  simProfitDeltaEl.className = `stat-delta ${profitDeltaVal >= 0 ? 'positive' : 'danger'}`;

  document.getElementById('simMargin').textContent = `${simMargin.toFixed(1)}%`;
  const simMarginDeltaEl = document.getElementById('simMarginDelta');
  simMarginDeltaEl.textContent = `${marginDelta >= 0 ? '+' : ''}${marginDelta.toFixed(1)}% vs Base`;
  simMarginDeltaEl.className = `stat-delta ${marginDelta >= 0 ? 'positive' : 'danger'}`;
}

// ==========================================================================
// 7. CSV Export (Excel Compatible with INR)
// ==========================================================================
function exportLedgerToCsv() {
  const headers = ['Invoice ID', 'Order Date', 'Customer Name', 'City', 'State', 'Zone', 'Category', 'Sub-Category', 'Product Name', 'Sales (INR)', 'GST (INR)', 'Profit (INR)', 'Margin %', 'Payment Mode'];
  
  const csvRows = [headers.join(',')];

  state.filteredOrders.forEach(o => {
    const row = [
      o.invoiceId,
      o.orderDate,
      `"${o.customerName}"`,
      `"${o.city}"`,
      `"${o.state}"`,
      o.zone,
      `"${o.category}"`,
      `"${o.subCategory}"`,
      `"${o.productName.replace(/"/g, '""')}"`,
      o.sales,
      o.gstAmount,
      o.profit,
      o.profitMargin.toFixed(1),
      `"${o.paymentMode}"`
    ];
    csvRows.push(row.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `India_Retail_Sales_Performance_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ==========================================================================
// 8. Event Handlers & Navigation
// ==========================================================================
function setupEventListeners() {
  // Slicers: Year
  document.querySelectorAll('#yearPills .pbi-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#yearPills .pbi-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.filters.year = pill.dataset.year;
      applySlicers();
    });
  });

  // Slicers: Region / Zone
  document.querySelectorAll('#regionPills .pbi-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#regionPills .pbi-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.filters.region = pill.dataset.region;
      applySlicers();
    });
  });

  // Slicers: Category
  document.querySelectorAll('#categoryPills .pbi-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#categoryPills .pbi-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.filters.category = pill.dataset.category;
      applySlicers();
    });
  });

  // Slicers: Payment Mode
  document.querySelectorAll('#paymentPills .pbi-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#paymentPills .pbi-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.filters.payment = pill.dataset.payment;
      applySlicers();
    });
  });

  // Reset Slicers
  document.getElementById('btnResetFilters')?.addEventListener('click', () => {
    state.filters = { year: 'ALL', region: 'ALL', category: 'ALL', payment: 'ALL', search: '' };
    document.querySelectorAll('.pbi-pill-group').forEach(group => {
      group.querySelectorAll('.pbi-pill').forEach((p, idx) => {
        if (idx === 0) p.classList.add('active');
        else p.classList.remove('active');
      });
    });
    const s = document.getElementById('tableSearch');
    if (s) s.value = '';
    applySlicers();
  });

  // Page Tabs
  document.querySelectorAll('.pbi-page-tabs .pbi-tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pbi-page-tabs .pbi-tab-btn').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const view = tab.dataset.view;
      state.activeView = view;
      
      // Smooth scroll to relevant visual section
      if (view === 'overview') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (view === 'regional') {
        document.getElementById('regionChart')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (view === 'categories') {
        document.getElementById('subCategoryChart')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (view === 'ledger') {
        document.querySelector('.pbi-table-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Granularity Toggle
  document.querySelectorAll('#granularityToggle .pbi-btn-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#granularityToggle .pbi-btn-toggle').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.timelineGranularity = btn.dataset.gran;
      updateVisuals();
    });
  });

  // Search & Sorting
  document.getElementById('tableSearch')?.addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    state.pagination.page = 1;
    applySlicers();
  });

  document.getElementById('tableSortSelect')?.addEventListener('change', (e) => {
    const [col, dir] = e.target.value.split('_');
    state.sorting.column = col;
    state.sorting.direction = dir;
    renderLedgerTable();
  });

  // Pager Buttons
  document.getElementById('btnPrevPage')?.addEventListener('click', () => {
    if (state.pagination.page > 1) {
      state.pagination.page--;
      renderLedgerTable();
    }
  });

  document.getElementById('btnNextPage')?.addEventListener('click', () => {
    if (state.pagination.page < state.pagination.totalPages) {
      state.pagination.page++;
      renderLedgerTable();
    }
  });

  // Export
  document.getElementById('btnExportCsv')?.addEventListener('click', exportLedgerToCsv);

  // Modals
  const daxModal = document.getElementById('daxModal');
  const whatIfModal = document.getElementById('whatIfModal');

  document.getElementById('btnDaxExplorer')?.addEventListener('click', () => {
    daxModal.classList.add('active');
  });
  document.getElementById('btnCloseDaxModal')?.addEventListener('click', () => {
    daxModal.classList.remove('active');
  });

  document.getElementById('btnWhatIf')?.addEventListener('click', () => {
    whatIfModal.classList.add('active');
    updateSimulator();
  });
  document.getElementById('btnCloseWhatIfModal')?.addEventListener('click', () => {
    whatIfModal.classList.remove('active');
  });

  window.addEventListener('click', (e) => {
    if (e.target === daxModal) daxModal.classList.remove('active');
    if (e.target === whatIfModal) whatIfModal.classList.remove('active');
  });

  // DAX Dialog Tabs
  document.querySelectorAll('.dialog-tab-bar .dialog-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dialog-tab-bar .dialog-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.dialog-content-body').forEach(b => b.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      if (target === 'dax') document.getElementById('tabDax').classList.add('active');
      if (target === 'schema') document.getElementById('tabSchema').classList.add('active');
      if (target === 'etl') document.getElementById('tabEtl').classList.add('active');
    });
  });

  // Simulator Sliders
  ['sliderPrice', 'sliderDiscount', 'sliderVolume'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateSimulator);
  });

  document.getElementById('btnResetSimulation')?.addEventListener('click', () => {
    document.getElementById('sliderPrice').value = 0;
    document.getElementById('sliderDiscount').value = 0;
    document.getElementById('sliderVolume').value = 0;
    state.simulation = { priceDelta: 0, discountDelta: 0, volumeDelta: 0 };
    updateSimulator();
    applySlicers();
  });

  document.getElementById('btnApplySimulation')?.addEventListener('click', () => {
    state.simulation.priceDelta = parseInt(document.getElementById('sliderPrice').value, 10);
    state.simulation.discountDelta = parseInt(document.getElementById('sliderDiscount').value, 10);
    state.simulation.volumeDelta = parseInt(document.getElementById('sliderVolume').value, 10);
    whatIfModal.classList.remove('active');
    computeDaxMeasures();
  });

  // Theme Toggle
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const isDark = document.body.classList.contains('theme-powerbi');
    if (isDark) {
      document.body.classList.remove('theme-powerbi');
      document.body.classList.add('theme-light');
      state.theme = 'light';
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-powerbi');
      state.theme = 'powerbi';
    }
    Object.values(state.charts).forEach(c => c.destroy());
    initVisuals();
    updateVisuals();
  });
}

// ==========================================================================
// 9. Application Bootstrap
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Generate Indian Retail Dataset
  state.rawOrders = generateIndianRetailDataset();
  state.filteredOrders = [...state.rawOrders];

  initVisuals();
  setupEventListeners();
  applySlicers();

  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();
  }, 100);
});
