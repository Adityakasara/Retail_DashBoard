/**
 * India Retail Sales & Profit Performance Dashboard
 * Clean, High-Readability Analytical Engine for Power BI
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
  activeTab: 'overview',
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
  theme: 'dark',
  charts: {}
};

// ==========================================================================
// 1. Indian Retail Dataset Generation
// ==========================================================================
function generateIndianRetailData() {
  const regions = {
    North: [
      { state: 'Delhi NCR', city: 'New Delhi' },
      { state: 'Delhi NCR', city: 'Gurugram' },
      { state: 'Delhi NCR', city: 'Noida' },
      { state: 'Uttar Pradesh', city: 'Lucknow' },
      { state: 'Rajasthan', city: 'Jaipur' },
      { state: 'Punjab', city: 'Chandigarh' }
    ],
    South: [
      { state: 'Karnataka', city: 'Bengaluru' },
      { state: 'Telangana', city: 'Hyderabad' },
      { state: 'Tamil Nadu', city: 'Chennai' },
      { state: 'Kerala', city: 'Kochi' }
    ],
    West: [
      { state: 'Maharashtra', city: 'Mumbai' },
      { state: 'Maharashtra', city: 'Pune' },
      { state: 'Gujarat', city: 'Ahmedabad' },
      { state: 'Gujarat', city: 'Surat' }
    ],
    East: [
      { state: 'West Bengal', city: 'Kolkata' },
      { state: 'Odisha', city: 'Bhubaneswar' },
      { state: 'Bihar', city: 'Patna' }
    ]
  };

  const catalog = {
    'Electronics & Appliances': {
      'Smartphones & 5G': [
        { name: 'Samsung Galaxy S24 Ultra (256GB)', price: 119999, margin: 0.22, gst: 0.18 },
        { name: 'OnePlus 12 5G (16GB RAM)', price: 64999, margin: 0.20, gst: 0.18 },
        { name: 'Apple iPhone 15 (128GB)', price: 71999, margin: 0.18, gst: 0.18 }
      ],
      'Smart TVs & Audio': [
        { name: 'Sony Bravia 55" 4K Google TV', price: 62990, margin: 0.24, gst: 0.28 },
        { name: 'LG 43" 4K Smart LED TV', price: 34990, margin: 0.21, gst: 0.18 },
        { name: 'boAt Aavante Soundbar 2050', price: 7999, margin: 0.32, gst: 0.18 }
      ],
      'Laptops & Computing': [
        { name: 'Apple MacBook Air M3 (16GB)', price: 114900, margin: 0.17, gst: 0.18 },
        { name: 'Dell Inspiron 15 Core i5', price: 54990, margin: 0.19, gst: 0.18 }
      ],
      'Home Appliances': [
        { name: 'Voltas 1.5 Ton 5 Star Split AC', price: 38490, margin: 0.22, gst: 0.28 },
        { name: 'LG 260L Smart Inverter Fridge', price: 27990, margin: 0.21, gst: 0.18 },
        { name: 'Philips 750W Mixer Grinder', price: 4499, margin: 0.35, gst: 0.18 }
      ]
    },
    'Home & Living': {
      'Furniture & Seating': [
        { name: 'Solid Sheesham 6-Seater Dining Set', price: 34999, margin: 0.28, gst: 0.18 },
        { name: 'Green Soul Ergonomic Office Chair', price: 11990, margin: 0.30, gst: 0.18 },
        { name: 'Wakefit Sectional Fabric Sofa', price: 26499, margin: 0.25, gst: 0.18 }
      ],
      'Mattress & Bedding': [
        { name: 'Wakefit Orthopedic Memory Mattress (King)', price: 14499, margin: 0.35, gst: 0.18 },
        { name: 'Spaces 100% Cotton King Bedsheet Set', price: 2299, margin: 0.42, gst: 0.12 }
      ]
    },
    'FMCG & Groceries': {
      'Staples & Packaged Food': [
        { name: 'Daawat Rozana Basmati Rice (5kg)', price: 499, margin: 0.14, gst: 0.05 },
        { name: 'Fortune Sunlite Refined Oil (5L)', price: 685, margin: 0.12, gst: 0.05 },
        { name: 'Aashirvaad Shudh Chakki Atta (10kg)', price: 540, margin: 0.15, gst: 0.05 },
        { name: 'Tata Tea Gold Premium (1kg)', price: 520, margin: 0.22, gst: 0.05 }
      ],
      'Festive & Dry Fruits': [
        { name: 'California Almonds & Cashews Gift Pack (1kg)', price: 1199, margin: 0.28, gst: 0.12 },
        { name: 'Ferrero Rocher Box (24 Pcs)', price: 895, margin: 0.25, gst: 0.18 }
      ]
    },
    'Fashion & Apparel': {
      'Ethnic Wear': [
        { name: 'Manyavar Silk Blend Kurta Set', price: 4999, margin: 0.45, gst: 0.12 },
        { name: 'Biba Pure Cotton Anarkali Kurti', price: 2799, margin: 0.44, gst: 0.12 },
        { name: 'Fabindia Handcrafted Silk Saree', price: 8990, margin: 0.48, gst: 0.12 }
      ],
      'Western & Footwear': [
        { name: "Levi's Men 511 Slim Jeans", price: 3199, margin: 0.38, gst: 0.12 },
        { name: 'Allen Solly Classic Formal Shirt', price: 1899, margin: 0.40, gst: 0.12 },
        { name: 'Red Tape Airflow Sports Shoes', price: 1699, margin: 0.42, gst: 0.12 }
      ]
    }
  };

  const customers = [
    'Rajesh Sharma', 'Ananya Iyer', 'Vikram Patel', 'Pooja Deshmukh',
    'Rohan Gupta', 'Sneha Mukherjee', 'Amit Verma', 'Neha Agarwal',
    'Karthik Raman', 'Priya Nair', 'Aditya Kasara', 'Sunita Joshi',
    'Rahul Mehra', 'Suresh Reddy', 'Divya Pillai', 'Manish Jain'
  ];

  const payments = ['UPI / QR', 'UPI / QR', 'UPI / QR', 'Credit / Debit Card', 'Credit / Debit Card', 'Cash on Delivery'];
  const fiscalYears = [
    { name: 'FY 23-24', start: new Date('2023-04-01'), end: new Date('2024-03-31') },
    { name: 'FY 24-25', start: new Date('2024-04-01'), end: new Date('2025-03-31') },
    { name: 'FY 25-26', start: new Date('2025-04-01'), end: new Date('2026-08-30') }
  ];

  const orders = [];
  const totalRecords = 1200;

  for (let i = 1; i <= totalRecords; i++) {
    const zoneKeys = Object.keys(regions);
    const zone = zoneKeys[Math.floor(Math.random() * zoneKeys.length)];
    const geo = regions[zone][Math.floor(Math.random() * regions[zone].length)];

    const catKeys = Object.keys(catalog);
    const category = catKeys[Math.floor(Math.random() * catKeys.length)];
    const subCatKeys = Object.keys(catalog[category]);
    const subCategory = subCatKeys[Math.floor(Math.random() * subCatKeys.length)];
    const product = catalog[category][subCategory][Math.floor(Math.random() * catalog[category][subCategory].length)];

    const customer = customers[Math.floor(Math.random() * customers.length)];
    const paymentMode = payments[Math.floor(Math.random() * payments.length)];

    const fy = fiscalYears[Math.floor(Math.random() * fiscalYears.length)];
    const randomTime = fy.start.getTime() + Math.random() * (fy.end.getTime() - fy.start.getTime());
    const dateObj = new Date(randomTime);
    const dateStr = dateObj.toISOString().slice(0, 10);
    const month = dateObj.getMonth() + 1;
    const yearNum = dateObj.getFullYear();

    const quantity = category === 'FMCG & Groceries' ? Math.floor(Math.random() * 4) + 1 : Math.floor(Math.random() * 2) + 1;
    const discountRate = Math.random() > 0.65 ? (Math.floor(Math.random() * 3) + 1) * 0.05 : 0;
    
    const grossSales = product.price * quantity;
    const netSales = Math.round(grossSales * (1 - discountRate));
    const gstAmount = Math.round(netSales * product.gst);

    const cost = Math.round(product.price * (1 - product.margin) * quantity);
    const profit = Math.round(netSales - cost);
    const profitMargin = netSales > 0 ? Number(((profit / netSales) * 100).toFixed(1)) : 0;

    const invoiceId = `INV-IN-${yearNum}-${String(10000 + i).slice(1)}`;

    orders.push({
      id: i,
      invoiceId,
      orderDate: dateStr,
      year: fy.name,
      calendarYear: yearNum,
      month,
      customerName: customer,
      zone,
      state: geo.state,
      city: geo.city,
      category,
      subCategory,
      productName: product.name,
      quantity,
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
// 2. INR Currency Formatter
// ==========================================================================
function formatINR(val, compact = false) {
  if (val === undefined || isNaN(val)) return '₹0';
  if (compact) {
    const abs = Math.abs(val);
    if (abs >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (abs >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    if (abs >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${Math.round(val)}`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
}

// ==========================================================================
// 3. DAX & Filter Pipeline
// ==========================================================================
function applyFilters() {
  const { year, region, category, payment, search } = state.filters;
  const searchLower = search.trim().toLowerCase();

  state.filteredOrders = state.rawOrders.filter(o => {
    if (year !== 'ALL' && o.year !== year) return false;
    if (region !== 'ALL' && o.zone !== region) return false;
    if (category !== 'ALL' && o.category !== category) return false;
    if (payment !== 'ALL' && o.paymentMode !== payment) return false;
    if (searchLower) {
      const match =
        o.invoiceId.toLowerCase().includes(searchLower) ||
        o.customerName.toLowerCase().includes(searchLower) ||
        o.city.toLowerCase().includes(searchLower) ||
        o.productName.toLowerCase().includes(searchLower);
      if (!match) return false;
    }
    return true;
  });

  // Update filter breadcrumb summary
  const summaryEl = document.getElementById('activeFilterText');
  if (summaryEl) {
    const yText = year === 'ALL' ? 'All Financial Years' : year;
    const rText = region === 'ALL' ? 'All India' : `${region} Zone`;
    const cText = category === 'ALL' ? 'All Categories' : category.split(' ')[0];
    const pText = payment === 'ALL' ? 'All Channels' : payment;
    summaryEl.textContent = `Showing: ${yText} • ${rText} • ${cText} • ${pText}`;
  }

  computeScorecard();
  updateVisuals();
  renderLedger();
}

function computeScorecard() {
  const orders = state.filteredOrders;
  const sim = state.simulation;

  let totalSales = 0;
  let totalProfit = 0;
  let totalQuantity = 0;
  let totalGst = 0;
  let upiCount = 0;
  const uniqueInvoices = new Set();

  orders.forEach(o => {
    let sSales = o.sales * (1 + sim.priceDelta / 100) * (1 - sim.discountDelta / 100) * (1 + sim.volumeDelta / 100);
    const cost = (o.sales - o.profit) * (1 + sim.volumeDelta / 100);
    const sProfit = sSales - cost;

    totalSales += sSales;
    totalProfit += sProfit;
    totalQuantity += o.quantity * (1 + sim.volumeDelta / 100);
    totalGst += o.gstAmount * (1 + sim.priceDelta / 100);

    if (o.paymentMode.includes('UPI')) upiCount++;
    uniqueInvoices.add(o.invoiceId);
  });

  const totalOrders = uniqueInvoices.size;
  const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
  const aov = totalOrders > 0 ? totalSales / totalOrders : 0;
  const upiRate = orders.length > 0 ? (upiCount / orders.length) * 100 : 0;

  const pySales = totalSales * 0.859;
  const pyProfit = totalProfit * 0.822;
  const salesGrowth = pySales > 0 ? ((totalSales - pySales) / pySales) * 100 : 0;
  const profitGrowth = pyProfit > 0 ? ((totalProfit - pyProfit) / pyProfit) * 100 : 0;

  // DOM Updates
  document.getElementById('kpiTotalSales').textContent = formatINR(totalSales, true);
  document.getElementById('kpiSalesGrowth').textContent = `+${salesGrowth.toFixed(1)}% YoY`;
  document.getElementById('kpiSalesPy').textContent = formatINR(pySales, true);

  document.getElementById('kpiTotalProfit').textContent = formatINR(totalProfit, true);
  document.getElementById('kpiProfitGrowth').textContent = `+${profitGrowth.toFixed(1)}% YoY`;
  document.getElementById('kpiProfitPy').textContent = formatINR(pyProfit, true);

  const marginEl = document.getElementById('kpiProfitMargin');
  marginEl.textContent = `${profitMargin.toFixed(1)}%`;
  marginEl.className = `kpi-value ${profitMargin >= 16 ? 'text-success' : ''}`;

  document.getElementById('kpiTotalOrders').textContent = totalOrders.toLocaleString('en-IN');
  document.getElementById('kpiTotalUnits').textContent = `${Math.round(totalQuantity).toLocaleString('en-IN')} Units Dispatched`;
  document.getElementById('kpiAovVal').textContent = `AOV: ${formatINR(aov)}`;

  // Tab 4 GST Cards
  const gstEl = document.getElementById('cardTotalGst');
  if (gstEl) gstEl.textContent = formatINR(totalGst, true);
  const upiEl = document.getElementById('cardUpiShare');
  if (upiEl) upiEl.textContent = `${upiRate.toFixed(1)}%`;
  const aovEl = document.getElementById('cardAov');
  if (aovEl) aovEl.textContent = formatINR(aov);

  const doughnutCenter = document.getElementById('doughnutCenterVal');
  if (doughnutCenter) doughnutCenter.textContent = formatINR(totalSales, true);
}

// ==========================================================================
// 4. Visualizations (Chart.js)
// ==========================================================================
function initCharts() {
  const isDark = state.theme === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  const textColor = isDark ? '#94a3b8' : '#475569';

  Chart.defaults.color = textColor;
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.plugins.tooltip.backgroundColor = isDark ? '#141b26' : '#ffffff';
  Chart.defaults.plugins.tooltip.titleColor = isDark ? '#f8fafc' : '#0f172a';
  Chart.defaults.plugins.tooltip.bodyColor = isDark ? '#94a3b8' : '#475569';
  Chart.defaults.plugins.tooltip.borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.1)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 8;
  Chart.defaults.plugins.tooltip.cornerRadius = 6;

  // 1. Timeline
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
          ticks: { callback: v => `₹${(v / 100000).toFixed(1)}L` }
        }
      },
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 6 } },
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${formatINR(ctx.raw)}` } }
      }
    }
  });

  // 2. Category Doughnut
  const ctxCategory = document.getElementById('categoryChart').getContext('2d');
  state.charts.category = new Chart(ctxCategory, {
    type: 'doughnut',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 12, font: { size: 11 } } },
        tooltip: { callbacks: { label: ctx => `${ctx.label}: ${formatINR(ctx.raw)}` } }
      }
    }
  });

  // 3. Zone Bar
  const ctxRegion = document.getElementById('regionChart').getContext('2d');
  state.charts.region = new Chart(ctxRegion, {
    type: 'bar',
    data: { labels: [], datasets: [] },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { color: gridColor }, ticks: { callback: v => `₹${(v / 100000).toFixed(1)}L` } },
        y: { grid: { display: false } }
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `Sales: ${formatINR(ctx.raw)}` } }
      }
    }
  });

  // 4. City Bar
  const ctxCity = document.getElementById('cityChart').getContext('2d');
  state.charts.city = new Chart(ctxCity, {
    type: 'bar',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: gridColor }, ticks: { callback: v => `₹${(v / 100000).toFixed(1)}L` } }
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `Sales: ${formatINR(ctx.raw)}` } }
      }
    }
  });

  // 5. Sub-Category
  const ctxSubCategory = document.getElementById('subCategoryChart').getContext('2d');
  state.charts.subCategory = new Chart(ctxSubCategory, {
    type: 'bar',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: gridColor }, ticks: { callback: v => `₹${(v / 100000).toFixed(1)}L` } }
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `Sales: ${formatINR(ctx.raw)}` } }
      }
    }
  });

  // 6. Payment
  const ctxPayment = document.getElementById('paymentChart').getContext('2d');
  state.charts.payment = new Chart(ctxPayment, {
    type: 'bar',
    data: { labels: [], datasets: [] },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { color: gridColor }, ticks: { callback: v => `₹${(v / 100000).toFixed(1)}L` } },
        y: { grid: { display: false } }
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `Volume: ${formatINR(ctx.raw)}` } }
      }
    }
  });
}

function updateVisuals() {
  const orders = state.filteredOrders;

  // 1. Timeline
  const timeMap = {};
  orders.forEach(o => {
    let key = state.timelineGranularity === 'month' ? `${o.calendarYear}-${String(o.month).padStart(2, '0')}` : `${o.year}`;
    if (!timeMap[key]) timeMap[key] = { sales: 0, profit: 0 };
    timeMap[key].sales += o.sales;
    timeMap[key].profit += o.profit;
  });

  const sortedKeys = Object.keys(timeMap).sort();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const labels = sortedKeys.map(k => {
    if (state.timelineGranularity === 'month') {
      const [y, m] = k.split('-');
      return `${months[parseInt(m, 10) - 1]} '${y.slice(2)}`;
    }
    return k;
  });

  if (state.charts.timeline) {
    state.charts.timeline.data = {
      labels,
      datasets: [
        {
          label: 'Sales Revenue (₹)',
          data: sortedKeys.map(k => timeMap[k].sales),
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 2
        },
        {
          label: 'Gross Profit (₹)',
          data: sortedKeys.map(k => timeMap[k].profit),
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          tension: 0.3,
          borderWidth: 2,
          borderDash: [3, 3]
        }
      ]
    };
    state.charts.timeline.update();
  }

  // 2. Category
  const catMap = {};
  orders.forEach(o => { catMap[o.category] = (catMap[o.category] || 0) + o.sales; });
  if (state.charts.category) {
    state.charts.category.data = {
      labels: Object.keys(catMap),
      datasets: [{
        data: Object.values(catMap),
        backgroundColor: ['#38bdf8', '#f59e0b', '#10b981', '#a855f7'],
        borderWidth: 0
      }]
    };
    state.charts.category.update();
  }

  // 3. Zone
  const zoneMap = { North: 0, South: 0, West: 0, East: 0 };
  orders.forEach(o => { if (zoneMap[o.zone] !== undefined) zoneMap[o.zone] += o.sales; });
  if (state.charts.region) {
    state.charts.region.data = {
      labels: ['North Zone', 'South Zone', 'West Zone', 'East Zone'],
      datasets: [{
        data: [zoneMap.North, zoneMap.South, zoneMap.West, zoneMap.East],
        backgroundColor: ['#38bdf8', '#10b981', '#f59e0b', '#a855f7'],
        borderRadius: 4
      }]
    };
    state.charts.region.update();
  }

  // 4. City
  const cityMap = {};
  orders.forEach(o => { cityMap[o.city] = (cityMap[o.city] || 0) + o.sales; });
  const topCities = Object.keys(cityMap).map(c => ({ city: c, sales: cityMap[c] })).sort((a, b) => b.sales - a.sales).slice(0, 6);
  if (state.charts.city) {
    state.charts.city.data = {
      labels: topCities.map(c => c.city),
      datasets: [{
        data: topCities.map(c => c.sales),
        backgroundColor: '#38bdf8',
        borderRadius: 4
      }]
    };
    state.charts.city.update();
  }

  // 5. Sub-Category
  const subMap = {};
  orders.forEach(o => {
    if (!subMap[o.subCategory]) subMap[o.subCategory] = { sales: 0, profit: 0 };
    subMap[o.subCategory].sales += o.sales;
    subMap[o.subCategory].profit += o.profit;
  });
  const subList = Object.keys(subMap).map(k => ({
    name: k,
    sales: subMap[k].sales,
    margin: subMap[k].sales > 0 ? (subMap[k].profit / subMap[k].sales) * 100 : 0
  })).sort((a, b) => b.sales - a.sales).slice(0, 8);

  if (state.charts.subCategory) {
    state.charts.subCategory.data = {
      labels: subList.map(s => s.name),
      datasets: [{
        data: subList.map(s => s.sales),
        backgroundColor: subList.map(s => s.margin >= 20 ? '#10b981' : s.margin >= 12 ? '#f59e0b' : '#ef4444'),
        borderRadius: 4
      }]
    };
    state.charts.subCategory.update();
  }

  // 6. Payment
  const payMap = {};
  orders.forEach(o => { payMap[o.paymentMode] = (payMap[o.paymentMode] || 0) + o.sales; });
  if (state.charts.payment) {
    state.charts.payment.data = {
      labels: Object.keys(payMap),
      datasets: [{
        data: Object.values(payMap),
        backgroundColor: ['#10b981', '#38bdf8', '#f59e0b'],
        borderRadius: 4
      }]
    };
    state.charts.payment.update();
  }
}

// ==========================================================================
// 5. Clean Transaction Ledger
// ==========================================================================
function renderLedger() {
  const tbody = document.getElementById('tableBody');
  const tableInfo = document.getElementById('tableInfo');
  if (!tbody) return;

  const orders = [...state.filteredOrders];
  orders.sort((a, b) => {
    let factor = state.sorting.direction === 'asc' ? 1 : -1;
    if (state.sorting.column === 'date') return (new Date(a.orderDate) - new Date(b.orderDate)) * factor;
    if (state.sorting.column === 'sales') return (a.sales - b.sales) * factor;
    if (state.sorting.column === 'profit') return (a.profit - b.profit) * factor;
    if (state.sorting.column === 'margin') return (a.profitMargin - b.profitMargin) * factor;
    return 0;
  });

  const total = orders.length;
  state.pagination.totalPages = Math.max(1, Math.ceil(total / state.pagination.pageSize));
  if (state.pagination.page > state.pagination.totalPages) state.pagination.page = state.pagination.totalPages;

  const startIdx = (state.pagination.page - 1) * state.pagination.pageSize;
  const items = orders.slice(startIdx, startIdx + state.pagination.pageSize);

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="13" style="text-align: center; padding: 2rem; color: var(--text-secondary);">No orders match current filter selection.</td></tr>`;
    tableInfo.textContent = 'Showing 0 of 0 records';
    updatePagination();
    return;
  }

  tbody.innerHTML = items.map(o => `
    <tr>
      <td style="font-family: var(--font-mono); font-weight: 600; color: var(--pbi-blue);">${o.invoiceId}</td>
      <td style="font-family: var(--font-mono); color: var(--text-secondary);">${o.orderDate}</td>
      <td><strong>${o.customerName}</strong></td>
      <td>${o.city}</td>
      <td><span style="color: var(--pbi-yellow); font-size: 0.72rem;">${o.zone}</span></td>
      <td>${o.category.split(' ')[0]}</td>
      <td style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${o.productName}">${o.productName}</td>
      <td style="font-family: var(--font-mono); font-weight: 700;">${formatINR(o.sales)}</td>
      <td style="font-family: var(--font-mono); color: var(--text-secondary);">${formatINR(o.gstAmount)}</td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: ${o.profit >= 0 ? 'var(--pbi-green)' : 'var(--pbi-red)'};">${formatINR(o.profit)}</td>
      <td style="font-family: var(--font-mono); font-weight: 700;">${o.profitMargin.toFixed(1)}%</td>
      <td><span style="font-size: 0.7rem; background: var(--bg-subtle); padding: 0.1rem 0.35rem; border-radius: 3px;">${o.paymentMode}</span></td>
      <td><span class="badge-tag ${o.profitMargin >= 18 ? 'tag-green' : o.profitMargin >= 10 ? 'tag-yellow' : 'tag-red'}">${o.profitMargin >= 18 ? 'High Margin' : o.profitMargin >= 10 ? 'Normal' : 'Low Margin'}</span></td>
    </tr>
  `).join('');

  tableInfo.textContent = `Showing ${startIdx + 1} to ${Math.min(startIdx + state.pagination.pageSize, total)} of ${total} records`;
  updatePagination();
}

function updatePagination() {
  const btnPrev = document.getElementById('btnPrevPage');
  const btnNext = document.getElementById('btnNextPage');
  const ind = document.getElementById('pageIndicator');

  if (btnPrev) btnPrev.disabled = state.pagination.page <= 1;
  if (btnNext) btnNext.disabled = state.pagination.page >= state.pagination.totalPages;
  if (ind) ind.textContent = `Page ${state.pagination.page} / ${state.pagination.totalPages}`;
}

// ==========================================================================
// 6. What-If Simulator
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

    let sSales = o.sales * (1 + priceDelta / 100) * (1 - discountDelta / 100) * (1 + volumeDelta / 100);
    const cost = (o.sales - o.profit) * (1 + volumeDelta / 100);
    const sProfit = sSales - cost;

    simSales += sSales;
    simProfit += sProfit;
  });

  const salesDelta = simSales - baseSales;
  const profitDelta = simProfit - baseProfit;
  const simMargin = simSales > 0 ? (simProfit / simSales) * 100 : 0;
  const marginDelta = simMargin - (baseSales > 0 ? (baseProfit / baseSales) * 100 : 0);

  document.getElementById('simSales').textContent = formatINR(simSales, true);
  document.getElementById('simSalesDelta').textContent = `${salesDelta >= 0 ? '+' : ''}${formatINR(salesDelta, true)}`;

  document.getElementById('simProfit').textContent = formatINR(simProfit, true);
  document.getElementById('simProfitDelta').textContent = `${profitDelta >= 0 ? '+' : ''}${formatINR(profitDelta, true)}`;

  document.getElementById('simMargin').textContent = `${simMargin.toFixed(1)}%`;
  document.getElementById('simMarginDelta').textContent = `${marginDelta >= 0 ? '+' : ''}${marginDelta.toFixed(1)}% vs Base`;
}

// ==========================================================================
// 7. Event Handlers & Initialization
// ==========================================================================
function setupHandlers() {
  // Slicers
  ['yearPills', 'regionPills', 'categoryPills', 'paymentPills'].forEach(id => {
    document.querySelectorAll(`#${id} .pill`).forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll(`#${id} .pill`).forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        if (id === 'yearPills') state.filters.year = pill.dataset.year;
        if (id === 'regionPills') state.filters.region = pill.dataset.region;
        if (id === 'categoryPills') state.filters.category = pill.dataset.category;
        if (id === 'paymentPills') state.filters.payment = pill.dataset.payment;
        applyFilters();
      });
    });
  });

  // Reset Slicers
  document.getElementById('btnResetFilters')?.addEventListener('click', () => {
    state.filters = { year: 'ALL', region: 'ALL', category: 'ALL', payment: 'ALL', search: '' };
    document.querySelectorAll('.pill-group').forEach(g => {
      g.querySelectorAll('.pill').forEach((p, idx) => {
        if (idx === 0) p.classList.add('active');
        else p.classList.remove('active');
      });
    });
    const s = document.getElementById('tableSearch');
    if (s) s.value = '';
    applyFilters();
  });

  // Workspace Tabs
  document.querySelectorAll('.workspace-tabs .ws-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.workspace-tabs .ws-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.ws-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      if (target === 'overview') document.getElementById('tabContentOverview').classList.add('active');
      if (target === 'regional') document.getElementById('tabContentRegional').classList.add('active');
      if (target === 'categories') document.getElementById('tabContentCategories').classList.add('active');
      if (target === 'payments') document.getElementById('tabContentPayments').classList.add('active');
    });
  });

  // Granularity Toggle
  document.querySelectorAll('#granularityToggle .gran-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#granularityToggle .gran-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.timelineGranularity = btn.dataset.gran;
      updateVisuals();
    });
  });

  // Search & Sorting
  document.getElementById('tableSearch')?.addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    state.pagination.page = 1;
    applyFilters();
  });

  document.getElementById('tableSortSelect')?.addEventListener('change', (e) => {
    const [col, dir] = e.target.value.split('_');
    state.sorting.column = col;
    state.sorting.direction = dir;
    renderLedger();
  });

  // Pager
  document.getElementById('btnPrevPage')?.addEventListener('click', () => {
    if (state.pagination.page > 1) {
      state.pagination.page--;
      renderLedger();
    }
  });

  document.getElementById('btnNextPage')?.addEventListener('click', () => {
    if (state.pagination.page < state.pagination.totalPages) {
      state.pagination.page++;
      renderLedger();
    }
  });

  // CSV Export
  document.getElementById('btnExportCsv')?.addEventListener('click', () => {
    const headers = ['Invoice ID', 'Date', 'Customer', 'City', 'State', 'Zone', 'Category', 'Product', 'Sales INR', 'GST INR', 'Profit INR', 'Margin %', 'Payment'];
    const rows = [headers.join(',')];
    state.filteredOrders.forEach(o => {
      rows.push([
        o.invoiceId, o.orderDate, `"${o.customerName}"`, `"${o.city}"`, `"${o.state}"`, o.zone,
        `"${o.category}"`, `"${o.productName.replace(/"/g, '""')}"`, o.sales, o.gstAmount, o.profit, o.profitMargin, `"${o.paymentMode}"`
      ].join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `India_Retail_Sales_Performance_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  // Modals
  const daxModal = document.getElementById('daxModal');
  const whatIfModal = document.getElementById('whatIfModal');

  document.getElementById('btnDaxExplorer')?.addEventListener('click', () => daxModal.classList.add('active'));
  document.getElementById('btnCloseDaxModal')?.addEventListener('click', () => daxModal.classList.remove('active'));

  document.getElementById('btnWhatIf')?.addEventListener('click', () => {
    whatIfModal.classList.add('active');
    updateSimulator();
  });
  document.getElementById('btnCloseWhatIfModal')?.addEventListener('click', () => whatIfModal.classList.remove('active'));

  window.addEventListener('click', (e) => {
    if (e.target === daxModal) daxModal.classList.remove('active');
    if (e.target === whatIfModal) whatIfModal.classList.remove('active');
  });

  // Modal DAX tabs
  document.querySelectorAll('.modal-tab-strip .m-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.modal-tab-strip .m-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.modal-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target)?.classList.add('active');
    });
  });

  // Sliders
  ['sliderPrice', 'sliderDiscount', 'sliderVolume'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateSimulator);
  });

  document.getElementById('btnResetSimulation')?.addEventListener('click', () => {
    document.getElementById('sliderPrice').value = 0;
    document.getElementById('sliderDiscount').value = 0;
    document.getElementById('sliderVolume').value = 0;
    state.simulation = { priceDelta: 0, discountDelta: 0, volumeDelta: 0 };
    updateSimulator();
    applyFilters();
  });

  document.getElementById('btnApplySimulation')?.addEventListener('click', () => {
    state.simulation.priceDelta = parseInt(document.getElementById('sliderPrice').value, 10);
    state.simulation.discountDelta = parseInt(document.getElementById('sliderDiscount').value, 10);
    state.simulation.volumeDelta = parseInt(document.getElementById('sliderVolume').value, 10);
    whatIfModal.classList.remove('active');
    computeScorecard();
  });

  // Theme Toggle
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const isDark = document.body.classList.contains('theme-dark');
    if (isDark) {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      state.theme = 'light';
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      state.theme = 'dark';
    }
    Object.values(state.charts).forEach(c => c.destroy());
    initCharts();
    updateVisuals();
  });
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  state.rawOrders = generateIndianRetailData();
  state.filteredOrders = [...state.rawOrders];

  initCharts();
  setupHandlers();
  applyFilters();

  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();
  }, 100);
});
