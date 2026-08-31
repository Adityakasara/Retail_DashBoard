/**
 * Retail Sales Performance Dashboard - Power BI Analytics Engine
 * Features: DAX calculation pipeline, multi-dimensional slicing, dynamic Chart.js rendering, What-If simulator, and CSV export.
 */

// Global State
const state = {
  rawOrders: [],
  filteredOrders: [],
  filters: {
    year: 'ALL',
    region: 'ALL',
    category: 'ALL',
    segment: 'ALL',
    search: '',
  },
  sorting: {
    column: 'date',
    direction: 'desc'
  },
  pagination: {
    page: 1,
    pageSize: 10,
    totalPages: 1
  },
  timelineGranularity: 'month', // 'month' | 'quarter'
  simulation: {
    priceDelta: 0,
    discountDelta: 0,
    volumeDelta: 0
  },
  theme: 'dark',
  charts: {}
};

// ==========================================================================
// 1. Synthetic Superstore Retail Dataset Generator
// ==========================================================================
function generateRetailDataset() {
  const regions = {
    West: ['California', 'Washington', 'Oregon', 'Arizona', 'Nevada', 'Colorado'],
    East: ['New York', 'Pennsylvania', 'Massachusetts', 'New Jersey', 'Ohio'],
    Central: ['Illinois', 'Texas', 'Michigan', 'Indiana', 'Wisconsin', 'Minnesota'],
    South: ['Florida', 'North Carolina', 'Georgia', 'Virginia', 'Tennessee']
  };

  const categories = {
    Technology: {
      Phones: ['Apple iPhone 15 Pro', 'Samsung Galaxy S24', 'Google Pixel 8', 'OnePlus 12', 'Motorola Edge'],
      Laptops: ['MacBook Pro M3', 'Dell XPS 15', 'Lenovo ThinkPad X1', 'HP Spectre x360', 'Asus ROG Zephyrus'],
      Accessories: ['Logitech MX Master 3S', 'AirPods Pro 2', 'Anker USB-C Hub 7-in-1', 'SanDisk 1TB SSD', 'Keychron Mechanical Keyboard'],
      Machines: ['Epson EcoTank Pro', 'Canon ImageClass Laser', 'Zebra Thermal Label Printer', 'Brother All-in-One']
    },
    Furniture: {
      Chairs: ['Herman Miller Aeron Chair', 'Steelcase Gesture Ergonomic', 'Secretlab Titan Evo', 'HON Ignition 2.0 Mesh'],
      Tables: ['Autonomous SmartDesk Pro', 'Uplift V2 Standing Desk', 'Bush Furniture Conference Table', 'IKEA Bekant Meeting Desk'],
      Bookcases: ['Sauder Heritage 5-Shelf', 'Bush Furniture Cabot Bookcase', 'Atlantic Oskar Media Storage'],
      Furnishings: ['3M Anti-Glare Desk Lamp', 'Deflect-o Floor Mat', 'Kensington Monitor Arm', 'Fellowes Footrest']
    },
    'Office Supplies': {
      Storage: ['Fellowes Bankers Box (Pack of 12)', 'Sterilite 4-Drawer Tower', 'Akro-Mils Hardware Cabinet'],
      Binders: ['Avery Heavy-Duty 3-Ring Binder', 'Wilson Jones Custom Binder', 'GBC ProClick Binding Spines'],
      Paper: ['Hammermill Premium Multi-Purpose Paper', 'HP Heavyweight 24lb Ream', 'Xerox Vitality Recycled Paper'],
      Appliances: ['Keurig K-Elite Coffee Maker', 'Breville Smart Toaster Oven', 'Honeywell HEPA Air Purifier'],
      Fasteners: ['Swingline Heavy Duty Stapler', 'ACCO Rubber Bands Assortment', 'Scotch Heavy Duty Shipping Tape']
    }
  };

  const customerFirstNames = ['James', 'Emma', 'Oliver', 'Sophia', 'Liam', 'Ava', 'Noah', 'Isabella', 'William', 'Mia', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn', 'Daniel', 'Emily', 'Aditya', 'Priya', 'Rahul', 'Ananya', 'Vikram'];
  const customerLastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Kasara', 'Patel', 'Sharma', 'Gupta', 'Verma', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee'];
  const segments = ['Consumer', 'Corporate', 'Home Office'];
  const shipModes = ['Standard Class', 'Second Class', 'First Class', 'Same Day'];

  const orders = [];
  const totalRecords = 1350;
  
  const startYear = 2023;
  const endYear = 2026;

  for (let i = 1; i <= totalRecords; i++) {
    const regionKeys = Object.keys(regions);
    const region = regionKeys[Math.floor(Math.random() * regionKeys.length)];
    const states = regions[region];
    const stateName = states[Math.floor(Math.random() * states.length)];

    const categoryKeys = Object.keys(categories);
    const category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    
    const subCatKeys = Object.keys(categories[category]);
    const subCategory = subCatKeys[Math.floor(Math.random() * subCatKeys.length)];
    const products = categories[category][subCategory];
    const productName = products[Math.floor(Math.random() * products.length)];

    const customer = `${customerFirstNames[Math.floor(Math.random() * customerFirstNames.length)]} ${customerLastNames[Math.floor(Math.random() * customerLastNames.length)]}`;
    const segment = segments[Math.floor(Math.random() * segments.length)];
    const shipMode = shipModes[Math.floor(Math.random() * shipModes.length)];

    // Random Date between 2023-01-01 and 2026-08-31
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const month = year === 2026 ? Math.floor(Math.random() * 8) + 1 : Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Base unit price & quantity
    let basePrice = 25;
    let marginTarget = 0.18; // Default 18%

    if (category === 'Technology') {
      basePrice = subCategory === 'Laptops' ? Math.floor(Math.random() * 900) + 700 :
                  subCategory === 'Phones' ? Math.floor(Math.random() * 600) + 400 :
                  subCategory === 'Machines' ? Math.floor(Math.random() * 400) + 250 :
                  Math.floor(Math.random() * 120) + 40;
      marginTarget = 0.24; // High tech margins
    } else if (category === 'Furniture') {
      basePrice = subCategory === 'Tables' ? Math.floor(Math.random() * 500) + 300 :
                  subCategory === 'Chairs' ? Math.floor(Math.random() * 350) + 150 :
                  subCategory === 'Bookcases' ? Math.floor(Math.random() * 250) + 100 :
                  Math.floor(Math.random() * 90) + 30;
      marginTarget = 0.08; // Furniture has tighter margins / shipping costs
    } else {
      basePrice = subCategory === 'Appliances' ? Math.floor(Math.random() * 200) + 80 :
                  subCategory === 'Storage' ? Math.floor(Math.random() * 90) + 35 :
                  subCategory === 'Binders' ? Math.floor(Math.random() * 30) + 10 :
                  Math.floor(Math.random() * 25) + 8;
      marginTarget = 0.28; // Office supplies have strong margins
    }

    const quantity = Math.floor(Math.random() * 6) + 1;
    // Discount between 0% and 30%
    const discountChance = Math.random();
    const discountRate = discountChance > 0.65 ? (Math.floor(Math.random() * 4) + 1) * 0.05 : 0; // 0, 5, 10, 15, 20%
    
    const grossSales = basePrice * quantity;
    const sales = Number((grossSales * (1 - discountRate)).toFixed(2));
    
    // Cost calculation (simulating COGS)
    const costFactor = 1 - marginTarget + (Math.random() * 0.1 - 0.05); // slight variance
    const totalCost = (basePrice * costFactor) * quantity;
    
    // Profit = Sales - TotalCost (Heavy discounts can yield negative profit)
    const profit = Number((sales - totalCost).toFixed(2));
    const profitMargin = sales > 0 ? Number(((profit / sales) * 100).toFixed(1)) : 0;

    const orderId = `CA-${year}-${100000 + i}`;

    orders.push({
      id: i,
      orderId,
      orderDate: dateStr,
      year,
      month,
      quarter: `Q${Math.ceil(month / 3)}`,
      customerName: customer,
      segment,
      region,
      state: stateName,
      category,
      subCategory,
      productName,
      sales,
      quantity,
      discountRate,
      profit,
      profitMargin,
      shipMode,
      isReturned: Math.random() < 0.024 // 2.4% return rate
    });
  }

  // Sort initially by date descending
  return orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
}

// ==========================================================================
// 2. DAX Metric Engine & Filtering Pipeline
// ==========================================================================
function applyFilters() {
  const { year, region, category, segment, search } = state.filters;
  const searchLower = search.trim().toLowerCase();

  state.filteredOrders = state.rawOrders.filter(order => {
    if (year !== 'ALL' && order.year.toString() !== year) return false;
    if (region !== 'ALL' && order.region !== region) return false;
    if (category !== 'ALL' && order.category !== category) return false;
    if (segment !== 'ALL' && order.segment !== segment) return false;
    if (searchLower) {
      const match = 
        order.orderId.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower) ||
        order.productName.toLowerCase().includes(searchLower) ||
        order.state.toLowerCase().includes(searchLower) ||
        order.subCategory.toLowerCase().includes(searchLower);
      if (!match) return false;
    }
    return true;
  });

  // Calculate DAX Measures
  computeDaxMeasures();

  // Update Visuals & Table
  updateCharts();
  renderTable();
}

function computeDaxMeasures() {
  const orders = state.filteredOrders;
  const sim = state.simulation;

  let totalSales = 0;
  let totalProfit = 0;
  let totalQuantity = 0;
  let totalDiscountSum = 0;
  let returnCount = 0;
  const uniqueOrderIds = new Set();

  orders.forEach(o => {
    // Apply What-If Adjustments
    let adjSales = o.sales * (1 + sim.priceDelta / 100) * (1 - sim.discountDelta / 100);
    adjSales = adjSales * (1 + sim.volumeDelta / 100);

    // Approximate cost adjustment
    const cost = o.sales - o.profit;
    const adjCost = cost * (1 + sim.volumeDelta / 100);
    const adjProfit = adjSales - adjCost;

    totalSales += adjSales;
    totalProfit += adjProfit;
    totalQuantity += o.quantity * (1 + sim.volumeDelta / 100);
    totalDiscountSum += (o.discountRate + (sim.discountDelta / 100));
    if (o.isReturned) returnCount++;
    uniqueOrderIds.add(o.orderId);
  });

  const totalOrders = uniqueOrderIds.size;
  const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
  const aov = totalOrders > 0 ? totalSales / totalOrders : 0;
  const avgDiscount = orders.length > 0 ? (totalDiscountSum / orders.length) * 100 : 0;
  const returnRate = orders.length > 0 ? (returnCount / orders.length) * 100 : 0;

  // Simulated Prior Year Benchmark (PY)
  const pySales = totalSales * 0.875;
  const pyProfit = totalProfit * 0.843;
  const salesGrowth = pySales > 0 ? ((totalSales - pySales) / pySales) * 100 : 0;
  const profitGrowth = pyProfit > 0 ? ((totalProfit - pyProfit) / pyProfit) * 100 : 0;

  // DOM Updates
  document.getElementById('kpiTotalSales').textContent = formatCurrency(totalSales);
  document.getElementById('kpiSalesGrowth').textContent = `+${salesGrowth.toFixed(1)}% YoY`;
  document.getElementById('kpiSalesPy').textContent = `PY: ${formatCurrency(pySales)}`;

  document.getElementById('kpiTotalProfit').textContent = formatCurrency(totalProfit);
  document.getElementById('kpiProfitGrowth').textContent = `+${profitGrowth.toFixed(1)}% YoY`;
  document.getElementById('kpiProfitPy').textContent = `PY: ${formatCurrency(pyProfit)}`;

  const marginEl = document.getElementById('kpiProfitMargin');
  marginEl.textContent = `${profitMargin.toFixed(1)}%`;
  marginEl.className = `kpi-main-val ${profitMargin >= 15 ? 'text-success' : profitMargin >= 10 ? 'text-warning' : 'text-danger'}`;

  const marginBar = document.getElementById('kpiMarginBar');
  if (marginBar) {
    marginBar.style.setProperty('--prog', `${Math.min(Math.max(profitMargin * 3, 5), 100)}%`);
  }

  document.getElementById('kpiTotalOrders').textContent = totalOrders.toLocaleString();
  document.getElementById('kpiTotalUnits').textContent = `${Math.round(totalQuantity).toLocaleString()} Units`;

  document.getElementById('kpiAOV').textContent = formatCurrency(aov);
  document.getElementById('kpiAvgDiscount').textContent = `${Math.max(0, avgDiscount).toFixed(1)}%`;
  document.getElementById('kpiReturnRate').textContent = `Return: ${returnRate.toFixed(1)}%`;

  // Center doughnut text
  const doughnutCenter = document.getElementById('doughnutCenterTotal');
  if (doughnutCenter) {
    doughnutCenter.textContent = formatCompactCurrency(totalSales);
  }
}

// ==========================================================================
// 3. Chart.js Visualizations
// ==========================================================================
function initCharts() {
  const isDark = state.theme === 'dark';
  const gridColor = isDark ? 'rgba(240, 246, 252, 0.06)' : 'rgba(0, 0, 0, 0.06)';
  const textColor = isDark ? '#8b949e' : '#64748b';

  // Global Chart Defaults
  Chart.defaults.color = textColor;
  Chart.defaults.font.family = "'Outfit', sans-serif";
  Chart.defaults.plugins.tooltip.backgroundColor = isDark ? '#161b22' : '#ffffff';
  Chart.defaults.plugins.tooltip.titleColor = isDark ? '#f0f6fc' : '#1e293b';
  Chart.defaults.plugins.tooltip.bodyColor = isDark ? '#8b949e' : '#64748b';
  Chart.defaults.plugins.tooltip.borderColor = isDark ? 'rgba(240, 246, 252, 0.15)' : 'rgba(0,0,0,0.15)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;

  // Chart 1: Sales & Profit Timeline (Dual Line / Area)
  const ctxTimeline = document.getElementById('timelineChart').getContext('2d');
  state.charts.timeline = new Chart(ctxTimeline, {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { grid: { color: gridColor }, ticks: { maxRotation: 0 } },
        y: {
          grid: { color: gridColor },
          ticks: {
            callback: value => '$' + (value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value)
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { usePointStyle: true, boxWidth: 6, font: { weight: '600' } }
        }
      }
    }
  });

  // Chart 2: Regional Performance & Profit Margin
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
          ticks: { callback: v => '$' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v) }
        },
        y: { grid: { display: false } }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });

  // Chart 3: Category Contribution (Doughnut)
  const ctxCategory = document.getElementById('categoryChart').getContext('2d');
  state.charts.category = new Chart(ctxCategory, {
    type: 'doughnut',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, boxWidth: 8, padding: 16 }
        }
      }
    }
  });

  // Chart 4: Sub-Category Profitability Matrix
  const ctxSubCategory = document.getElementById('subCategoryChart').getContext('2d');
  state.charts.subCategory = new Chart(ctxSubCategory, {
    type: 'bar',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: {
          grid: { color: gridColor },
          ticks: { callback: v => '$' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v) }
        }
      },
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 6 } }
      }
    }
  });

  // Chart 5: Customer Segment Breakdown
  const ctxSegment = document.getElementById('segmentChart').getContext('2d');
  state.charts.segment = new Chart(ctxSegment, {
    type: 'bar',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: gridColor },
          ticks: { callback: v => '$' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v) }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function updateCharts() {
  const orders = state.filteredOrders;

  // 1. Timeline Aggregation
  const timelineMap = {};
  orders.forEach(o => {
    let key;
    if (state.timelineGranularity === 'month') {
      key = `${o.year}-${String(o.month).padStart(2, '0')}`;
    } else {
      key = `${o.year} ${o.quarter}`;
    }
    if (!timelineMap[key]) {
      timelineMap[key] = { sales: 0, profit: 0, label: key };
    }
    timelineMap[key].sales += o.sales;
    timelineMap[key].profit += o.profit;
  });

  const sortedTimelineKeys = Object.keys(timelineMap).sort();
  const timelineLabels = sortedTimelineKeys.map(k => {
    if (state.timelineGranularity === 'month') {
      const [y, m] = k.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(m, 10) - 1]} '${y.slice(2)}`;
    }
    return k;
  });
  const salesData = sortedTimelineKeys.map(k => Math.round(timelineMap[k].sales));
  const profitData = sortedTimelineKeys.map(k => Math.round(timelineMap[k].profit));

  if (state.charts.timeline) {
    state.charts.timeline.data = {
      labels: timelineLabels,
      datasets: [
        {
          label: 'Total Sales ($)',
          data: salesData,
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.12)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointRadius: sortedTimelineKeys.length > 20 ? 1 : 3,
          pointHoverRadius: 6
        },
        {
          label: 'Gross Profit ($)',
          data: profitData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          borderDash: [4, 4],
          pointRadius: sortedTimelineKeys.length > 20 ? 1 : 3,
          pointHoverRadius: 6
        }
      ]
    };
    state.charts.timeline.update();
  }

  // 2. Regional Breakdown
  const regionMap = { West: 0, East: 0, Central: 0, South: 0 };
  const regionProfitMap = { West: 0, East: 0, Central: 0, South: 0 };
  orders.forEach(o => {
    if (regionMap[o.region] !== undefined) {
      regionMap[o.region] += o.sales;
      regionProfitMap[o.region] += o.profit;
    }
  });

  const regionLabels = Object.keys(regionMap);
  const regionSales = regionLabels.map(r => Math.round(regionMap[r]));
  const regionColors = ['#38bdf8', '#818cf8', '#f59e0b', '#10b981'];

  if (state.charts.region) {
    state.charts.region.data = {
      labels: regionLabels,
      datasets: [
        {
          label: 'Sales ($)',
          data: regionSales,
          backgroundColor: regionColors,
          borderRadius: 6
        }
      ]
    };
    state.charts.region.update();
  }

  // 3. Category Breakdown
  const catMap = { Technology: 0, Furniture: 0, 'Office Supplies': 0 };
  orders.forEach(o => {
    if (catMap[o.category] !== undefined) {
      catMap[o.category] += o.sales;
    }
  });

  const catLabels = Object.keys(catMap);
  const catSales = catLabels.map(c => Math.round(catMap[c]));

  // Find top category
  let topCat = 'Technology';
  let maxVal = -1;
  catLabels.forEach(c => {
    if (catMap[c] > maxVal) {
      maxVal = catMap[c];
      topCat = c;
    }
  });
  const topCatPill = document.getElementById('topCategoryPill');
  if (topCatPill) topCatPill.textContent = `Top: ${topCat}`;

  if (state.charts.category) {
    state.charts.category.data = {
      labels: catLabels,
      datasets: [
        {
          data: catSales,
          backgroundColor: ['#38bdf8', '#f59e0b', '#10b981'],
          borderWidth: 0,
          hoverOffset: 6
        }
      ]
    };
    state.charts.category.update();
  }

  // 4. Sub-Category Breakdown
  const subCatMap = {};
  orders.forEach(o => {
    if (!subCatMap[o.subCategory]) {
      subCatMap[o.subCategory] = { sales: 0, profit: 0 };
    }
    subCatMap[o.subCategory].sales += o.sales;
    subCatMap[o.subCategory].profit += o.profit;
  });

  const subCatList = Object.keys(subCatMap)
    .map(k => ({
      name: k,
      sales: Math.round(subCatMap[k].sales),
      profit: Math.round(subCatMap[k].profit),
      margin: subCatMap[k].sales > 0 ? (subCatMap[k].profit / subCatMap[k].sales) * 100 : 0
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);

  const subCatBarColors = subCatList.map(item => {
    if (item.margin >= 20) return '#10b981'; // Green (high margin)
    if (item.margin >= 10) return '#f59e0b'; // Amber (mid margin)
    return '#ef4444'; // Red (low margin)
  });

  if (state.charts.subCategory) {
    state.charts.subCategory.data = {
      labels: subCatList.map(s => s.name),
      datasets: [
        {
          label: 'Sales Revenue ($)',
          data: subCatList.map(s => s.sales),
          backgroundColor: subCatBarColors,
          borderRadius: 6
        }
      ]
    };
    state.charts.subCategory.update();
  }

  // 5. Segment Breakdown
  const segMap = { Consumer: 0, Corporate: 0, 'Home Office': 0 };
  orders.forEach(o => {
    if (segMap[o.segment] !== undefined) {
      segMap[o.segment] += o.sales;
    }
  });

  if (state.charts.segment) {
    state.charts.segment.data = {
      labels: Object.keys(segMap),
      datasets: [
        {
          label: 'Sales ($)',
          data: Object.values(segMap).map(v => Math.round(v)),
          backgroundColor: ['#a855f7', '#38bdf8', '#10b981'],
          borderRadius: 6
        }
      ]
    };
    state.charts.segment.update();
  }
}

// ==========================================================================
// 4. Interactive Transaction Ledger Table
// ==========================================================================
function renderTable() {
  const tbody = document.getElementById('tableBody');
  const tableInfo = document.getElementById('tableInfo');
  if (!tbody) return;

  const orders = [...state.filteredOrders];

  // Sorting
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
  const pageOrders = orders.slice(startIdx, startIdx + state.pagination.pageSize);

  if (pageOrders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="12" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
          No matching transaction records found with the active slicer configuration.
        </td>
      </tr>
    `;
    tableInfo.textContent = 'Showing 0 of 0 orders';
    updatePaginationControls();
    return;
  }

  const rows = pageOrders.map(o => {
    const marginClass = o.profitMargin >= 18 ? 'tag-green' : o.profitMargin >= 8 ? 'tag-yellow' : 'tag-red';
    const statusText = o.profitMargin >= 18 ? 'High Margin' : o.profitMargin >= 8 ? 'Moderate' : 'Margin Risk';

    return `
      <tr>
        <td style="font-family: var(--font-mono); font-weight: 600; color: var(--brand-blue);">${o.orderId}</td>
        <td style="font-family: var(--font-mono); color: var(--text-secondary);">${o.orderDate}</td>
        <td><strong>${o.customerName}</strong></td>
        <td><span class="badge-tag">${o.segment}</span></td>
        <td>${o.region} (${o.state})</td>
        <td>${o.category}</td>
        <td style="max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${o.productName}">${o.productName}</td>
        <td style="font-family: var(--font-mono); font-weight: 700;">$${o.sales.toFixed(2)}</td>
        <td style="font-family: var(--font-mono); color: var(--text-secondary);">${(o.discountRate * 100).toFixed(0)}%</td>
        <td style="font-family: var(--font-mono); font-weight: 700; color: ${o.profit >= 0 ? 'var(--success)' : 'var(--danger)'};">$${o.profit.toFixed(2)}</td>
        <td style="font-family: var(--font-mono); font-weight: 700;">${o.profitMargin.toFixed(1)}%</td>
        <td><span class="tag-badge ${marginClass}">${statusText}</span></td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = rows;
  tableInfo.textContent = `Showing ${startIdx + 1} to ${Math.min(startIdx + state.pagination.pageSize, total)} of ${total} orders`;
  
  updatePaginationControls();
}

function updatePaginationControls() {
  const btnPrev = document.getElementById('btnPrevPage');
  const btnNext = document.getElementById('btnNextPage');
  const pageNumbers = document.getElementById('pageNumbers');

  if (btnPrev) btnPrev.disabled = state.pagination.page <= 1;
  if (btnNext) btnNext.disabled = state.pagination.page >= state.pagination.totalPages;

  if (pageNumbers) {
    pageNumbers.innerHTML = `<span style="font-size: 0.78rem; font-weight: 600; padding: 0.3rem 0.6rem;">Page ${state.pagination.page} / ${state.pagination.totalPages}</span>`;
  }
}

// ==========================================================================
// 5. What-If Simulator Logic
// ==========================================================================
function updateWhatIfCalculation() {
  const priceDelta = parseInt(document.getElementById('sliderPrice').value, 10);
  const discountDelta = parseInt(document.getElementById('sliderDiscount').value, 10);
  const volumeDelta = parseInt(document.getElementById('sliderVolume').value, 10);

  document.getElementById('valPriceDelta').textContent = `${priceDelta >= 0 ? '+' : ''}${priceDelta}%`;
  document.getElementById('valDiscountDelta').textContent = `${discountDelta >= 0 ? '+' : ''}${discountDelta}%`;
  document.getElementById('valVolumeDelta').textContent = `${volumeDelta >= 0 ? '+' : ''}${volumeDelta}%`;

  // Compute Base & Simulated totals for current filtered orders
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

  document.getElementById('simSales').textContent = formatCurrency(simSales);
  const simSalesDeltaEl = document.getElementById('simSalesDelta');
  simSalesDeltaEl.textContent = `${salesDeltaVal >= 0 ? '+' : ''}${formatCurrency(salesDeltaVal)} (${salesDeltaPct >= 0 ? '+' : ''}${salesDeltaPct.toFixed(1)}%)`;
  simSalesDeltaEl.className = `res-delta ${salesDeltaVal >= 0 ? 'positive' : 'danger'}`;

  document.getElementById('simProfit').textContent = formatCurrency(simProfit);
  const simProfitDeltaEl = document.getElementById('simProfitDelta');
  simProfitDeltaEl.textContent = `${profitDeltaVal >= 0 ? '+' : ''}${formatCurrency(profitDeltaVal)} (${profitDeltaPct >= 0 ? '+' : ''}${profitDeltaPct.toFixed(1)}%)`;
  simProfitDeltaEl.className = `res-delta ${profitDeltaVal >= 0 ? 'positive' : 'danger'}`;

  document.getElementById('simMargin').textContent = `${simMargin.toFixed(1)}%`;
  const simMarginDeltaEl = document.getElementById('simMarginDelta');
  simMarginDeltaEl.textContent = `${marginDelta >= 0 ? '+' : ''}${marginDelta.toFixed(1)}% vs Base`;
  simMarginDeltaEl.className = `res-delta ${marginDelta >= 0 ? 'positive' : 'danger'}`;
}

// ==========================================================================
// 6. CSV Export Utility
// ==========================================================================
function exportToCsv() {
  const headers = ['Order ID', 'Order Date', 'Customer Name', 'Segment', 'Region', 'State', 'Category', 'Sub-Category', 'Product Name', 'Sales', 'Quantity', 'Discount', 'Profit', 'Profit Margin %'];
  
  const csvRows = [headers.join(',')];

  state.filteredOrders.forEach(o => {
    const row = [
      o.orderId,
      o.orderDate,
      `"${o.customerName}"`,
      o.segment,
      o.region,
      `"${o.state}"`,
      o.category,
      o.subCategory,
      `"${o.productName.replace(/"/g, '""')}"`,
      o.sales.toFixed(2),
      o.quantity,
      o.discountRate,
      o.profit.toFixed(2),
      o.profitMargin.toFixed(1)
    ];
    csvRows.push(row.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Retail_Sales_Performance_Export_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Trigger celebration confetti
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  }
}

// ==========================================================================
// 7. Event Listeners & Interactive Handlers
// ==========================================================================
function setupEventListeners() {
  // Slicers: Year
  document.querySelectorAll('#yearPills .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#yearPills .pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.filters.year = pill.dataset.year;
      applyFilters();
    });
  });

  // Slicers: Region
  document.querySelectorAll('#regionPills .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#regionPills .pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.filters.region = pill.dataset.region;
      applyFilters();
    });
  });

  // Slicers: Category
  document.querySelectorAll('#categoryPills .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#categoryPills .pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.filters.category = pill.dataset.category;
      applyFilters();
    });
  });

  // Slicers: Segment
  document.querySelectorAll('#segmentPills .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#segmentPills .pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.filters.segment = pill.dataset.segment;
      applyFilters();
    });
  });

  // Reset Slicers Button
  document.getElementById('btnResetFilters')?.addEventListener('click', () => {
    state.filters = { year: 'ALL', region: 'ALL', category: 'ALL', segment: 'ALL', search: '' };
    document.querySelectorAll('.pill-selector').forEach(sel => {
      sel.querySelectorAll('.pill').forEach((p, idx) => {
        if (idx === 0) p.classList.add('active');
        else p.classList.remove('active');
      });
    });
    const searchInput = document.getElementById('tableSearch');
    if (searchInput) searchInput.value = '';
    applyFilters();
  });

  // Timeline Granularity Toggle
  document.querySelectorAll('#timelineGranularity .toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#timelineGranularity .toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.timelineGranularity = btn.dataset.gran;
      updateCharts();
    });
  });

  // Table Search
  document.getElementById('tableSearch')?.addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    state.pagination.page = 1;
    applyFilters();
  });

  // Table Sort Select
  document.getElementById('tableSortSelect')?.addEventListener('change', (e) => {
    const [col, dir] = e.target.value.split('_');
    state.sorting.column = col;
    state.sorting.direction = dir;
    renderTable();
  });

  // Table Pagination Buttons
  document.getElementById('btnPrevPage')?.addEventListener('click', () => {
    if (state.pagination.page > 1) {
      state.pagination.page--;
      renderTable();
    }
  });

  document.getElementById('btnNextPage')?.addEventListener('click', () => {
    if (state.pagination.page < state.pagination.totalPages) {
      state.pagination.page++;
      renderTable();
    }
  });

  // CSV Export
  document.getElementById('btnExportCsv')?.addEventListener('click', exportToCsv);

  // Modals Toggle
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
    updateWhatIfCalculation();
  });
  document.getElementById('btnCloseWhatIfModal')?.addEventListener('click', () => {
    whatIfModal.classList.remove('active');
  });

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === daxModal) daxModal.classList.remove('active');
    if (e.target === whatIfModal) whatIfModal.classList.remove('active');
  });

  // DAX Modal Tabs
  document.querySelectorAll('.modal-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const tabTarget = btn.dataset.tab;
      if (tabTarget === 'dax') document.getElementById('tabDax').classList.add('active');
      if (tabTarget === 'schema') document.getElementById('tabSchema').classList.add('active');
      if (tabTarget === 'etl') document.getElementById('tabEtl').classList.add('active');
    });
  });

  // What-If Sliders
  ['sliderPrice', 'sliderDiscount', 'sliderVolume'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateWhatIfCalculation);
  });

  // Reset Simulation
  document.getElementById('btnResetSimulation')?.addEventListener('click', () => {
    document.getElementById('sliderPrice').value = 0;
    document.getElementById('sliderDiscount').value = 0;
    document.getElementById('sliderVolume').value = 0;
    state.simulation = { priceDelta: 0, discountDelta: 0, volumeDelta: 0 };
    updateWhatIfCalculation();
    applyFilters();
  });

  // Apply Simulation
  document.getElementById('btnApplySimulation')?.addEventListener('click', () => {
    state.simulation.priceDelta = parseInt(document.getElementById('sliderPrice').value, 10);
    state.simulation.discountDelta = parseInt(document.getElementById('sliderDiscount').value, 10);
    state.simulation.volumeDelta = parseInt(document.getElementById('sliderVolume').value, 10);
    whatIfModal.classList.remove('active');
    computeDaxMeasures();
    if (typeof confetti === 'function') {
      confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
    }
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
    // Re-init charts with adapted color palette
    Object.values(state.charts).forEach(c => c.destroy());
    initCharts();
    updateCharts();
  });
}

// ==========================================================================
// 8. Helper Formatters
// ==========================================================================
function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val);
}

function formatCompactCurrency(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
  return `$${Math.round(val)}`;
}

// ==========================================================================
// 9. Application Bootstrap
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Generate dataset
  state.rawOrders = generateRetailDataset();
  state.filteredOrders = [...state.rawOrders];

  // Initialize UI & Charts
  initCharts();
  setupEventListeners();
  applyFilters();

  // Re-run icon replacement for any dynamic icons
  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();
  }, 100);
});
