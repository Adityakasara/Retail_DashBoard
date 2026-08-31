/**
 * Reliance Retail Limited - Executive Power BI Analytical Engine
 * Multi-format Analysis: Reliance Digital, Reliance Trends, Smart Bazaar, and JioMart
 * Currency: Indian Rupee (INR ₹)
 */

const state = {
  rawOrders: [],
  filteredOrders: [],
  filters: {
    year: 'ALL',
    format: 'ALL',
    zone: 'ALL',
    payment: 'ALL',
    search: ''
  },
  pagination: {
    page: 1,
    pageSize: 10,
    totalPages: 1
  },
  charts: {}
};

// 1. Reliance Retail Data Generation
function generateRelianceData() {
  const zones = {
    West: ['Mumbai Hub', 'Pune Metro', 'Ahmedabad', 'Surat', 'Nagpur'],
    South: ['Bengaluru Hub', 'Hyderabad Metro', 'Chennai', 'Kochi', 'Coimbatore'],
    North: ['Delhi NCR Hub', 'Gurugram', 'Noida', 'Lucknow', 'Jaipur', 'Chandigarh'],
    East: ['Kolkata Hub', 'Bhubaneswar', 'Patna', 'Guwahati']
  };

  const formats = {
    'Reliance Digital': [
      { name: 'Samsung Galaxy S24 Ultra 5G', price: 119999, margin: 0.22, gst: 0.18 },
      { name: 'Apple iPhone 15 Pro (256GB)', price: 129900, margin: 0.18, gst: 0.18 },
      { name: 'Sony Bravia 55" 4K Google TV', price: 62990, margin: 0.24, gst: 0.28 },
      { name: 'Apple MacBook Air M3', price: 114900, margin: 0.17, gst: 0.18 },
      { name: 'Voltas 1.5 Ton Inverter Split AC', price: 38490, margin: 0.22, gst: 0.28 },
      { name: 'JioFiber Home Gateway Router Pro', price: 2999, margin: 0.35, gst: 0.18 }
    ],
    'Reliance Trends': [
      { name: 'Avaasa Embroidered Anarkali Kurta', price: 2199, margin: 0.46, gst: 0.12 },
      { name: 'Netplay Men Slim Fit Formal Shirt', price: 1499, margin: 0.44, gst: 0.12 },
      { name: 'DNMX Men Stretchable Slim Jeans', price: 1899, margin: 0.42, gst: 0.12 },
      { name: 'Performax Lightweight Sports Shoes', price: 1699, margin: 0.45, gst: 0.12 }
    ],
    'Smart Bazaar': [
      { name: 'Good Life Premium Basmati Rice (5kg)', price: 485, margin: 0.16, gst: 0.05 },
      { name: 'Fortune Sunlite Refined Oil (5L)', price: 685, margin: 0.12, gst: 0.05 },
      { name: 'Aashirvaad Shudh Chakki Atta (10kg)', price: 540, margin: 0.15, gst: 0.05 },
      { name: 'Tata Tea Gold Premium Blend (1kg)', price: 520, margin: 0.22, gst: 0.05 }
    ],
    'JioMart Omni': [
      { name: 'Nutraj California Almonds & Cashews (1kg)', price: 1199, margin: 0.28, gst: 0.12 },
      { name: 'Surf Excel Matic Liquid Detergent (4L)', price: 820, margin: 0.24, gst: 0.18 },
      { name: 'Dettol Antiseptic Liquid (1L)', price: 345, margin: 0.20, gst: 0.12 }
    ]
  };

  const customers = [
    'Rajesh Sharma', 'Ananya Iyer', 'Vikram Patel', 'Pooja Deshmukh',
    'Rohan Gupta', 'Sneha Mukherjee', 'Amit Verma', 'Neha Agarwal',
    'Karthik Raman', 'Priya Nair', 'Aditya Kasara', 'Sunita Joshi',
    'Rahul Mehra', 'Suresh Reddy', 'Divya Pillai', 'Manish Jain'
  ];

  const payments = ['UPI / QR', 'UPI / QR', 'UPI / QR', 'Credit / Debit Card', 'Credit / Debit Card', 'Cash on Delivery'];
  const years = ['FY 25-26', 'FY 24-25', 'FY 23-24'];

  const orders = [];
  for (let i = 1; i <= 1250; i++) {
    const zoneKeys = Object.keys(zones);
    const zone = zoneKeys[Math.floor(Math.random() * zoneKeys.length)];
    const city = zones[zone][Math.floor(Math.random() * zones[zone].length)];

    const formatKeys = Object.keys(formats);
    const format = formatKeys[Math.floor(Math.random() * formatKeys.length)];
    const product = formats[format][Math.floor(Math.random() * formats[format].length)];

    const customer = customers[Math.floor(Math.random() * customers.length)];
    const payment = payments[Math.floor(Math.random() * payments.length)];
    const fy = years[Math.floor(Math.random() * years.length)];

    const yearNum = fy === 'FY 25-26' ? 2025 : fy === 'FY 24-25' ? 2024 : 2023;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const dateStr = `${yearNum}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const quantity = (format === 'Smart Bazaar' || format === 'JioMart Omni') ? Math.floor(Math.random() * 3) + 1 : 1;
    const discount = Math.random() > 0.65 ? 0.08 : 0;
    
    const grossSales = product.price * quantity;
    const netSales = Math.round(grossSales * (1 - discount));
    const gstAmount = Math.round(netSales * product.gst);

    const cost = Math.round(product.price * (1 - product.margin) * quantity);
    const profit = Math.round(netSales - cost);
    const margin = netSales > 0 ? Number(((profit / netSales) * 100).toFixed(1)) : 0;

    orders.push({
      id: i,
      invoiceId: `RR-INV-${yearNum}-${String(10000 + i).slice(1)}`,
      orderDate: dateStr,
      year: fy,
      yearNum,
      month,
      customerName: customer,
      zone,
      city,
      format,
      productName: product.name,
      quantity,
      sales: netSales,
      gstAmount,
      profit,
      margin,
      paymentMode: payment
    });
  }

  return orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
}

// 2. INR Formatter
function formatINR(val, compact = false) {
  if (!val || isNaN(val)) return '₹0';
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

// 3. DAX Pipeline & Slicers
function applySlicers() {
  const { year, format, zone, payment, search } = state.filters;
  const searchLower = search.trim().toLowerCase();

  state.filteredOrders = state.rawOrders.filter(o => {
    if (year !== 'ALL' && o.year !== year) return false;
    if (format !== 'ALL' && o.format !== format) return false;
    if (zone !== 'ALL' && o.zone !== zone) return false;
    if (payment !== 'ALL' && o.paymentMode !== payment) return false;
    if (searchLower) {
      const m = o.invoiceId.toLowerCase().includes(searchLower) ||
                o.customerName.toLowerCase().includes(searchLower) ||
                o.city.toLowerCase().includes(searchLower) ||
                o.format.toLowerCase().includes(searchLower) ||
                o.productName.toLowerCase().includes(searchLower);
      if (!m) return false;
    }
    return true;
  });

  const bEl = document.getElementById('activeFilterBadge');
  if (bEl) {
    const yT = year === 'ALL' ? 'All Financial Years' : year;
    const fT = format === 'ALL' ? 'All Formats' : format;
    const zT = zone === 'ALL' ? 'National' : `${zone} Hub`;
    bEl.textContent = `Filter: ${yT} • ${fT} • ${zT}`;
  }

  computeScorecard();
  updateCharts();
  renderMatrixTable();
}

function computeScorecard() {
  const orders = state.filteredOrders;
  let totalSales = 0;
  let totalProfit = 0;
  let totalQuantity = 0;
  const uniqueInvoices = new Set();

  orders.forEach(o => {
    totalSales += o.sales;
    totalProfit += o.profit;
    totalQuantity += o.quantity;
    uniqueInvoices.add(o.invoiceId);
  });

  const totalOrders = uniqueInvoices.size;
  const marginPct = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
  const aov = totalOrders > 0 ? totalSales / totalOrders : 0;

  const pySales = totalSales * 0.844;
  const pyProfit = totalProfit * 0.812;
  const sGrowth = pySales > 0 ? ((totalSales - pySales) / pySales) * 100 : 0;
  const pGrowth = pyProfit > 0 ? ((totalProfit - pyProfit) / pyProfit) * 100 : 0;

  // DOM
  document.getElementById('kpiSales').textContent = formatINR(totalSales, true);
  document.getElementById('kpiSalesGrowth').textContent = `+${sGrowth.toFixed(1)}% YoY`;
  document.getElementById('kpiSalesPy').textContent = formatINR(pySales, true);

  document.getElementById('kpiProfit').textContent = formatINR(totalProfit, true);
  document.getElementById('kpiProfitGrowth').textContent = `+${pGrowth.toFixed(1)}% YoY`;
  document.getElementById('kpiProfitPy').textContent = formatINR(pyProfit, true);

  document.getElementById('kpiMargin').textContent = `${marginPct.toFixed(1)}%`;
  document.getElementById('kpiOrders').textContent = totalOrders.toLocaleString('en-IN');
  document.getElementById('kpiUnits').textContent = `${totalQuantity.toLocaleString('en-IN')} Units Dispatched`;
  document.getElementById('kpiAov').textContent = `AOV: ${formatINR(aov)}`;

  const dCenter = document.getElementById('dCenterSales');
  if (dCenter) dCenter.textContent = formatINR(totalSales, true);
}

// 4. Charts
function initVisuals() {
  const gridColor = 'rgba(255, 255, 255, 0.06)';
  const textColor = '#94a3b8';

  Chart.defaults.color = textColor;
  Chart.defaults.font.family = "'Segoe UI', sans-serif";
  Chart.defaults.plugins.tooltip.backgroundColor = '#121824';
  Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
  Chart.defaults.plugins.tooltip.bodyColor = '#94a3b8';
  Chart.defaults.plugins.tooltip.borderColor = '#1e293b';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 8;

  // Timeline
  const ctxT = document.getElementById('timelineChart').getContext('2d');
  state.charts.timeline = new Chart(ctxT, {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { color: gridColor }, ticks: { maxRotation: 0, font: { size: 10 } } },
        y: { grid: { color: gridColor }, ticks: { callback: v => `₹${(v / 100000).toFixed(1)}L` } }
      },
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 6 } },
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${formatINR(ctx.raw)}` } }
      }
    }
  });

  // Store Format Doughnut
  const ctxC = document.getElementById('categoryChart').getContext('2d');
  state.charts.category = new Chart(ctxC, {
    type: 'doughnut',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 8, font: { size: 10 } } },
        tooltip: { callbacks: { label: ctx => `${ctx.label}: ${formatINR(ctx.raw)}` } }
      }
    }
  });

  // Regional Hubs Bar
  const ctxR = document.getElementById('regionChart').getContext('2d');
  state.charts.region = new Chart(ctxR, {
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

  // Top Metros Bar
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
}

function updateCharts() {
  const orders = state.filteredOrders;

  // Timeline
  const timeMap = {};
  orders.forEach(o => {
    const key = `${o.yearNum}-${String(o.month).padStart(2, '0')}`;
    if (!timeMap[key]) timeMap[key] = { sales: 0, profit: 0 };
    timeMap[key].sales += o.sales;
    timeMap[key].profit += o.profit;
  });

  const keys = Object.keys(timeMap).sort();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const labels = keys.map(k => {
    const [y, m] = k.split('-');
    return `${months[parseInt(m, 10) - 1]} '${y.slice(2)}`;
  });

  if (state.charts.timeline) {
    state.charts.timeline.data = {
      labels,
      datasets: [
        {
          label: 'Gross Sales (₹)',
          data: keys.map(k => timeMap[k].sales),
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 2
        },
        {
          label: 'Net Realized Profit (₹)',
          data: keys.map(k => timeMap[k].profit),
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          borderDash: [3, 3],
          tension: 0.3,
          borderWidth: 2
        }
      ]
    };
    state.charts.timeline.update();
  }

  // Format Share
  const fmtMap = {};
  orders.forEach(o => { fmtMap[o.format] = (fmtMap[o.format] || 0) + o.sales; });
  if (state.charts.category) {
    state.charts.category.data = {
      labels: Object.keys(fmtMap),
      datasets: [{
        data: Object.values(fmtMap),
        backgroundColor: ['#0a3871', '#e31837', '#10b981', '#f59e0b'],
        borderWidth: 0
      }]
    };
    state.charts.category.update();
  }

  // Zone
  const zoneMap = { West: 0, South: 0, North: 0, East: 0 };
  orders.forEach(o => { if (zoneMap[o.zone] !== undefined) zoneMap[o.zone] += o.sales; });
  if (state.charts.region) {
    state.charts.region.data = {
      labels: ['West Hub', 'South Hub', 'North Hub', 'East Hub'],
      datasets: [{
        data: [zoneMap.West, zoneMap.South, zoneMap.North, zoneMap.East],
        backgroundColor: ['#38bdf8', '#10b981', '#f59e0b', '#a855f7'],
        borderRadius: 3
      }]
    };
    state.charts.region.update();
  }

  // Top Cities
  const cityMap = {};
  orders.forEach(o => { cityMap[o.city] = (cityMap[o.city] || 0) + o.sales; });
  const topCities = Object.keys(cityMap).map(c => ({ city: c, sales: cityMap[c] })).sort((a, b) => b.sales - a.sales).slice(0, 6);
  if (state.charts.city) {
    state.charts.city.data = {
      labels: topCities.map(c => c.city),
      datasets: [{
        data: topCities.map(c => c.sales),
        backgroundColor: '#38bdf8',
        borderRadius: 3
      }]
    };
    state.charts.city.update();
  }
}

// 5. Matrix Table
function renderMatrixTable() {
  const tbody = document.getElementById('matrixTableBody');
  const countInfo = document.getElementById('matrixCountInfo');
  if (!tbody) return;

  const orders = [...state.filteredOrders];
  const total = orders.length;
  state.pagination.totalPages = Math.max(1, Math.ceil(total / state.pagination.pageSize));
  if (state.pagination.page > state.pagination.totalPages) state.pagination.page = state.pagination.totalPages;

  const startIdx = (state.pagination.page - 1) * state.pagination.pageSize;
  const pageItems = orders.slice(startIdx, startIdx + state.pagination.pageSize);

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding: 1.5rem; color: #94a3b8;">No matching transaction records found.</td></tr>`;
    countInfo.textContent = 'Showing 0 of 0 records';
    updateMatrixPager();
    return;
  }

  tbody.innerHTML = pageItems.map(o => `
    <tr>
      <td style="font-family: var(--font-mono); color: var(--pbi-blue); font-weight:600;">${o.invoiceId}</td>
      <td style="font-family: var(--font-mono); color: var(--pbi-text-sub);">${o.orderDate}</td>
      <td><strong>${o.customerName}</strong></td>
      <td>${o.city} (${o.zone})</td>
      <td><span style="color: var(--pbi-yellow); font-weight:600;">${o.format}</span></td>
      <td style="max-width: 170px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${o.productName}">${o.productName}</td>
      <td style="font-family: var(--font-mono); font-weight: 700;">${formatINR(o.sales)}</td>
      <td style="font-family: var(--font-mono); color: var(--pbi-text-sub);">${formatINR(o.gstAmount)}</td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: ${o.profit >= 0 ? 'var(--pbi-green)' : 'var(--pbi-red)'};">${formatINR(o.profit)}</td>
      <td style="font-family: var(--font-mono); font-weight: 700;">${o.margin.toFixed(1)}%</td>
      <td><span style="font-size: 0.7rem; background: #080c12; padding: 0.1rem 0.3rem; border-radius: 3px;">${o.paymentMode}</span></td>
      <td><span class="pbi-tag ${o.margin >= 18 ? 'green' : o.margin >= 10 ? 'yellow' : 'red'}">${o.margin >= 18 ? 'Strong Margin' : o.margin >= 10 ? 'Healthy' : 'Low'}</span></td>
    </tr>
  `).join('');

  countInfo.textContent = `Showing ${startIdx + 1} to ${Math.min(startIdx + state.pagination.pageSize, total)} of ${total} records`;
  updateMatrixPager();
}

function updateMatrixPager() {
  const btnP = document.getElementById('btnPrev');
  const btnN = document.getElementById('btnNext');
  const bBadge = document.getElementById('pageBadge');
  if (btnP) btnP.disabled = state.pagination.page <= 1;
  if (btnN) btnN.disabled = state.pagination.page >= state.pagination.totalPages;
  if (bBadge) bBadge.textContent = `Page ${state.pagination.page} / ${state.pagination.totalPages}`;
}

// 6. Event Listeners
function setupEvents() {
  const slicerMap = {
    slicerYear: 'year',
    slicerFormat: 'format',
    slicerZone: 'zone',
    slicerPay: 'payment'
  };

  Object.keys(slicerMap).forEach(paneId => {
    document.querySelectorAll(`#${paneId} .s-btn`).forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll(`#${paneId} .s-btn`).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.filters[slicerMap[paneId]] = btn.dataset.val;
        applySlicers();
      });
    });
  });

  document.getElementById('btnResetSlicers')?.addEventListener('click', () => {
    state.filters = { year: 'ALL', format: 'ALL', zone: 'ALL', payment: 'ALL', search: '' };
    document.querySelectorAll('.pbi-slicer-pill').forEach(g => {
      g.querySelectorAll('.s-btn').forEach((b, i) => {
        if (i === 0) b.classList.add('active');
        else b.classList.remove('active');
      });
    });
    const s = document.getElementById('tableSearchInput');
    if (s) s.value = '';
    applySlicers();
  });

  document.getElementById('tableSearchInput')?.addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    state.pagination.page = 1;
    applySlicers();
  });

  document.getElementById('btnPrev')?.addEventListener('click', () => {
    if (state.pagination.page > 1) { state.pagination.page--; renderMatrixTable(); }
  });
  document.getElementById('btnNext')?.addEventListener('click', () => {
    if (state.pagination.page < state.pagination.totalPages) { state.pagination.page++; renderMatrixTable(); }
  });

  const dModal = document.getElementById('daxModal');
  const wModal = document.getElementById('whatIfModal');

  document.getElementById('btnDaxModal')?.addEventListener('click', () => dModal.classList.add('active'));
  document.getElementById('btnCloseDax')?.addEventListener('click', () => dModal.classList.remove('active'));

  document.getElementById('btnWhatIfModal')?.addEventListener('click', () => {
    wModal.classList.add('active');
    updateSim();
  });
  document.getElementById('btnCloseWhatIf')?.addEventListener('click', () => wModal.classList.remove('active'));

  window.addEventListener('click', (e) => {
    if (e.target === dModal) dModal.classList.remove('active');
    if (e.target === wModal) wModal.classList.remove('active');
  });

  document.querySelectorAll('.pbi-bottom-bar .pbi-page-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pbi-bottom-bar .pbi-page-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const page = tab.dataset.page;
      if (page === 'dax') dModal.classList.add('active');
      else if (page === 'regional') {
        document.getElementById('regionChart')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  document.getElementById('btnExportData')?.addEventListener('click', () => {
    const headers = ['Invoice ID', 'Order Date', 'Customer', 'City', 'Zone', 'Format', 'Product', 'Sales INR', 'GST INR', 'Profit INR', 'Margin %', 'Payment'];
    const rows = [headers.join(',')];
    state.filteredOrders.forEach(o => {
      rows.push([
        o.invoiceId, o.orderDate, `"${o.customerName}"`, `"${o.city}"`, o.zone,
        `"${o.format}"`, `"${o.productName.replace(/"/g, '""')}"`, o.sales, o.gstAmount, o.profit, o.margin, `"${o.paymentMode}"`
      ].join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reliance_Retail_Sales_Performance_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  ['sliderAsp', 'sliderDisc'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateSim);
  });
}

function updateSim() {
  const asp = parseInt(document.getElementById('sliderAsp').value, 10);
  const disc = parseInt(document.getElementById('sliderDisc').value, 10);

  document.getElementById('aspDeltaVal').textContent = `${asp >= 0 ? '+' : ''}${asp}%`;
  document.getElementById('discDeltaVal').textContent = `${disc >= 0 ? '+' : ''}${disc}%`;

  let bSales = 0, bProfit = 0, sSales = 0, sProfit = 0;
  state.filteredOrders.forEach(o => {
    bSales += o.sales;
    bProfit += o.profit;
    const simS = o.sales * (1 + asp / 100) * (1 - disc / 100);
    const cost = o.sales - o.profit;
    sSales += simS;
    sProfit += (simS - cost);
  });

  const simM = sSales > 0 ? (sProfit / sSales) * 100 : 0;
  document.getElementById('simSalesVal').textContent = formatINR(sSales, true);
  document.getElementById('simProfitVal').textContent = formatINR(sProfit, true);
  document.getElementById('simMarginVal').textContent = `${simM.toFixed(1)}%`;
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  state.rawOrders = generateRelianceData();
  state.filteredOrders = [...state.rawOrders];

  initVisuals();
  setupEvents();
  applySlicers();

  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();
  }, 100);
});
