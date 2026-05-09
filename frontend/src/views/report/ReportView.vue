<template>
  <div class="report-view">
    <el-card shadow="never">
      <template #header>
        <span class="title">报表统计中心</span>
      </template>

      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <!-- Tab 1: 仪表盘概览 -->
        <el-tab-pane label="仪表盘概览" name="dashboard">
          <div v-loading="dashboardLoading">
            <el-row :gutter="16" class="stat-cards">
              <el-col :span="6" v-for="(card, idx) in dashboardCards" :key="idx">
                <div class="stat-card" :style="{ borderTopColor: card.color }">
                  <div class="stat-icon" :style="{ background: card.color + '15', color: card.color }">
                    <el-icon :size="28"><component :is="card.icon" /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ formatNumber(card.value) }}</div>
                    <div class="stat-label">{{ card.label }}</div>
                  </div>
                </div>
              </el-col>
            </el-row>

            <h4 style="margin: 20px 0 12px">低库存预警</h4>
            <el-table :data="dashboardData?.lowStockProducts || []" border stripe size="small" empty-text="暂无低库存产品">
              <el-table-column prop="productName" label="产品名称" min-width="150" />
              <el-table-column prop="productSku" label="SKU" width="140" />
              <el-table-column prop="currentQuantity" label="当前库存" width="100" align="right">
                <template #default="{ row }">
                  <span :class="{ 'low-stock': true }">{{ row.currentQuantity }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="minStockLevel" label="最低库存" width="100" align="right" />
              <el-table-column label="状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag type="danger" size="small">低于安全线</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <!-- Tab 2: 库存分析 -->
        <el-tab-pane label="库存分析" name="stock">
          <div v-loading="stockLoading">
            <el-row :gutter="20">
              <el-col :span="12">
                <h4>各仓库库存占比</h4>
                <v-chart class="chart-container" :option="stockPieOption" autoresize />
              </el-col>
              <el-col :span="12">
                <h4>各仓库库存量对比</h4>
                <v-chart class="chart-container" :option="stockBarOption" autoresize />
              </el-col>
            </el-row>

            <h4 style="margin-top: 20px">仓库库存明细</h4>
            <el-table :data="stockSummaryData" border stripe size="small" empty-text="暂无数据">
              <el-table-column prop="warehouseName" label="仓库名称" min-width="150" />
              <el-table-column prop="totalQuantity" label="总数量" width="120" align="right" />
              <el-table-column prop="totalValue" label="总价值(¥)" width="140" align="right">
                <template #default="{ row }">¥{{ row.totalValue?.toFixed(2) }}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <!-- Tab 3: 出入库趋势 -->
        <el-tab-pane label="出入库趋势" name="trend">
          <div style="margin-bottom: 16px">
            <el-date-picker
              v-model="trendDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              @change="fetchTrendData"
            />
          </div>
          <div v-loading="trendLoading">
            <h4>每日出入库数量趋势</h4>
            <v-chart class="chart-container-lg" :option="trendLineOption" autoresize />

            <el-row :gutter="20" style="margin-top: 20px">
              <el-col :span="12">
                <h4>入库类型汇总</h4>
                <el-table :data="inboundTypeSummary" border stripe size="small" empty-text="暂无数据">
                  <el-table-column prop="type" label="类型" min-width="120" />
                  <el-table-column prop="quantity" label="数量" width="100" align="right" />
                  <el-table-column prop="amount" label="金额(¥)" width="120" align="right">
                    <template #default="{ row }">¥{{ row.amount?.toFixed(2) }}</template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="12">
                <h4>出库类型汇总</h4>
                <el-table :data="outboundTypeSummary" border stripe size="small" empty-text="暂无数据">
                  <el-table-column prop="type" label="类型" min-width="120" />
                  <el-table-column prop="quantity" label="数量" width="100" align="right" />
                  <el-table-column prop="amount" label="金额(¥)" width="120" align="right">
                    <template #default="{ row }">¥{{ row.amount?.toFixed(2) }}</template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <!-- Tab 4: 产品周转 -->
        <el-tab-pane label="产品周转" name="turnover">
          <div v-loading="turnoverLoading">
            <el-row :gutter="20">
              <el-col :span="14">
                <h4>产品周转率排名</h4>
                <v-chart class="chart-container-lg" :option="turnoverBarOption" autoresize />
              </el-col>
              <el-col :span="10">
                <h4>产品周转明细</h4>
                <el-table :data="turnoverData" border stripe size="small" max-height="400" empty-text="暂无数据">
                  <el-table-column prop="productName" label="产品名称" min-width="120" show-overflow-tooltip />
                  <el-table-column prop="inboundTotal" label="入库总量" width="80" align="right" />
                  <el-table-column prop="outboundTotal" label="出库总量" width="80" align="right" />
                  <el-table-column prop="currentStock" label="当前库存" width="85" align="right" />
                  <el-table-column prop="turnoverRate" label="周转率" width="80" align="right">
                    <template #default="{ row }">
                      <span :class="{ 'high-turnover': row.turnoverRate >= 1, 'low-turnover': row.turnoverRate > 0 && row.turnoverRate < 0.5 }">
                        {{ row.turnoverRate?.toFixed(2) }}
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <!-- Tab 5: 供应商/客户分析 -->
        <el-tab-pane label="供应商/客户分析" name="partner">
          <div v-loading="partnerLoading">
            <el-row :gutter="24">
              <el-col :span="12">
                <h4>供应商分析</h4>
                <el-table :data="supplierAnalysisData" border stripe size="small" max-height="280" empty-text="暂无数据">
                  <el-table-column prop="supplierName" label="供应商名称" min-width="120" show-overflow-tooltip />
                  <el-table-column prop="purchaseCount" label="采购次数" width="90" align="right" />
                  <el-table-column prop="totalAmount" label="采购金额(¥)" width="130" align="right">
                    <template #default="{ row }">¥{{ row.totalAmount?.toFixed(2) }}</template>
                  </el-table-column>
                  <el-table-column prop="lastPurchaseDate" label="最近采购" width="110" align="center">
                    <template #default="{ row }">{{ row.lastPurchaseDate ? formatDate(row.lastPurchaseDate) : '-' }}</template>
                  </el-table-column>
                </el-table>
                <v-chart class="chart-container" :option="supplierBarOption" autoresize style="margin-top: 12px" />
              </el-col>
              <el-col :span="12">
                <h4>客户分析</h4>
                <el-table :data="customerAnalysisData" border stripe size="small" max-height="280" empty-text="暂无数据">
                  <el-table-column prop="customerName" label="客户名称" min-width="120" show-overflow-tooltip />
                  <el-table-column prop="salesCount" label="销售次数" width="90" align="right" />
                  <el-table-column prop="totalAmount" label="销售金额(¥)" width="130" align="right">
                    <template #default="{ row }">¥{{ row.totalAmount?.toFixed(2) }}</template>
                  </el-table-column>
                  <el-table-column prop="lastSaleDate" label="最近销售" width="110" align="center">
                    <template #default="{ row }">{{ row.lastSaleDate ? formatDate(row.lastSaleDate) : '-' }}</template>
                  </el-table-column>
                </el-table>
                <v-chart class="chart-container" :option="customerBarOption" autoresize style="margin-top: 12px" />
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import { Box, Goods, Wallet, Document, TrendCharts } from '@element-plus/icons-vue'
import {
  getDashboard,
  getStockSummary,
  getInboundReport,
  getOutboundReport,
  getTurnover,
  getSupplierAnalysis,
  getCustomerAnalysis,
  type DashboardOverview,
  type StockSummaryItem,
  type DailyRecord,
  type TypeSummary,
  type TurnoverItem,
  type SupplierAnalysisItem,
  type CustomerAnalysisItem,
} from '@/api/report'

use([CanvasRenderer, PieChart, BarChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const activeTab = ref('dashboard')

const CHART_COLORS = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#9B59B6']

function formatDate(dateStr: string | Date): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatNumber(val: number): string {
  if (val >= 10000) return (val / 10000).toFixed(1) + '万'
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k'
  return String(Math.round(val))
}

// ---- Tab 1: 仪表盘 ----
const dashboardLoading = ref(false)
const dashboardData = ref<DashboardOverview | null>(null)

const dashboardCards = computed(() => [
  { icon: 'Box', label: '产品总数', value: dashboardData.value?.totalProducts ?? 0, color: '#409EFF' },
  { icon: 'Goods', label: '仓库数量', value: dashboardData.value?.totalWarehouses ?? 0, color: '#67C23A' },
  { icon: 'Wallet', label: '库存价值(¥)', value: dashboardData.value?.totalStockValue ?? 0, color: '#E6A23C' },
  { icon: 'Document', label: '待处理订单', value: (dashboardData.value?.pendingPurchaseOrders ?? 0) + (dashboardData.value?.pendingSalesOrders ?? 0), color: '#F56C6C' },
])

async function fetchDashboard() {
  dashboardLoading.value = true
  try {
    dashboardData.value = await getDashboard()
  } finally {
    dashboardLoading.value = false
  }
}

// ---- Tab 2: 库存分析 ----
const stockLoading = ref(false)
const stockSummaryData = ref<StockSummaryItem[]>([])

const stockPieOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
  legend: { bottom: 0, type: 'scroll' },
  series: [{
    type: 'pie',
    radius: ['40%', '65%'],
    center: ['50%', '48%'],
    avoidLabelOverlap: true,
    itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
    label: { formatter: '{b}\n{d}%' },
    data: stockSummaryData.value.map((item, i) => ({
      name: item.warehouseName,
      value: Number(item.totalValue.toFixed(2)),
      itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
    })),
  }],
}))

const stockBarOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: stockSummaryData.value.map((i) => i.warehouseName), axisLabel: { rotate: 30 } },
  yAxis: { type: 'value', name: '数量' },
  series: [{
    type: 'bar',
    data: stockSummaryData.value.map((item, i) => ({
      value: item.totalQuantity,
      itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length], borderRadius: [4, 4, 0, 0] },
    })),
    barMaxWidth: 50,
    label: { show: true, position: 'top' },
  }],
}))

async function fetchStockData() {
  stockLoading.value = true
  try {
    stockSummaryData.value = await getStockSummary()
  } finally {
    stockLoading.value = false
  }
}

// ---- Tab 3: 出入库趋势 ----
const trendLoading = ref(false)
const trendDateRange = ref<[string, string] | null>(null)
const inboundDailyRecords = ref<DailyRecord[]>([])
const outboundDailyRecords = ref<DailyRecord[]>([])
const inboundTypeSummary = ref<TypeSummary[]>([])
const outboundTypeSummary = ref<TypeSummary[]>([])

const trendLineOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['入库数量', '出库数量'] },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: inboundDailyRecords.value.map((r) => r.date),
    boundaryGap: false,
    axisLabel: { rotate: 30 },
  },
  yAxis: [
    { type: 'value', name: '数量', position: 'left' },
    { type: 'value', name: '金额', position: 'right', splitLine: { show: false } },
  ],
  series: [
    {
      name: '入库数量',
      type: 'line',
      smooth: true,
      data: inboundDailyRecords.value.map((r) => r.quantity),
      lineStyle: { color: '#67C23A', width: 2 },
      itemStyle: { color: '#67C23A' },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(103,194,58,0.25)' }, { offset: 1, color: 'rgba(103,194,58,0.02)' }] } },
    },
    {
      name: '出库数量',
      type: 'line',
      smooth: true,
      data: outboundDailyRecords.value.map((r) => r.quantity),
      lineStyle: { color: '#E6A23C', width: 2 },
      itemStyle: { color: '#E6A23C' },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(230,162,60,0.25)' }, { offset: 1, color: 'rgba(230,162,60,0.02)' }] } },
    },
  ],
}))

async function fetchTrendData() {
  trendLoading.value = true
  const params = trendDateRange.value
    ? { startDate: trendDateRange.value[0], endDate: trendDateRange.value[1] }
    : {}
  try {
    const [inbound, outbound] = await Promise.all([
      getInboundReport(params),
      getOutboundReport(params),
    ])
    inboundDailyRecords.value = inbound.dailyRecords || []
    outboundDailyRecords.value = outbound.dailyRecords || []
    inboundTypeSummary.value = inbound.typeSummaries || []
    outboundTypeSummary.value = outbound.typeSummaries || []
  } finally {
    trendLoading.value = false
  }
}

// ---- Tab 4: 产品周转 ----
const turnoverLoading = ref(false)
const turnoverData = ref<TurnoverItem[]>([])

const turnoverBarOption = computed(() => {
  const sorted = [...turnoverData.value].sort((a, b) => b.turnoverRate - a.turnoverRate).slice(0, 10)
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '8%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', name: '周转率' },
    yAxis: {
      type: 'category',
      data: sorted.map((i) => i.productName).reverse(),
      axisLabel: { width: 100, overflow: 'truncate' },
    },
    series: [{
      type: 'bar',
      data: sorted.map((item, i) => ({
        value: Number(item.turnoverRate.toFixed(2)),
        itemStyle: {
          color: item.turnoverRate >= 1 ? '#67C23A' : item.turnoverRate >= 0.5 ? '#E6A23C' : '#F56C6C',
          borderRadius: [0, 4, 4, 0],
        },
      })).reverse(),
      barMaxWidth: 24,
      label: { show: true, position: 'right', formatter: '{c}' },
    }],
  }
})

async function fetchTurnoverData() {
  turnoverLoading.value = true
  try {
    turnoverData.value = await getTurnover()
  } finally {
    turnoverLoading.value = false
  }
}

// ---- Tab 5: 供应商/客户分析 ----
const partnerLoading = ref(false)
const supplierAnalysisData = ref<SupplierAnalysisItem[]>([])
const customerAnalysisData = ref<CustomerAnalysisItem[]>([])

const supplierBarOption = computed(() => {
  const top5 = supplierAnalysisData.value.slice(0, 5)
  return {
    tooltip: { trigger: 'axis', formatter: '{b}<br/>采购金额: ¥{c}' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: top5.map((s) => s.supplierName), axisLabel: { rotate: 20, fontSize: 11 } },
    yAxis: { type: 'value', name: '金额(¥)' },
    series: [{
      type: 'bar',
      data: top5.map((_, i) => ({
        value: Number(top5[i].totalAmount.toFixed(2)),
        itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length], borderRadius: [4, 4, 0, 0] },
      })),
      barMaxWidth: 40,
      label: { show: true, position: 'top', fontSize: 11 },
    }],
  }
})

const customerBarOption = computed(() => {
  const top5 = customerAnalysisData.value.slice(0, 5)
  return {
    tooltip: { trigger: 'axis', formatter: '{b}<br/>销售金额: ¥{c}' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: top5.map((c) => c.customerName), axisLabel: { rotate: 20, fontSize: 11 } },
    yAxis: { type: 'value', name: '金额(¥)' },
    series: [{
      type: 'bar',
      data: top5.map((_, i) => ({
        value: Number(top5[i].totalAmount.toFixed(2)),
        itemStyle: { color: CHART_COLORS[(i + 3) % CHART_COLORS.length], borderRadius: [4, 4, 0, 0] },
      })),
      barMaxWidth: 40,
      label: { show: true, position: 'top', fontSize: 11 },
    }],
  }
})

async function fetchPartnerData() {
  partnerLoading.value = true
  try {
    const [suppliers, customers] = await Promise.all([
      getSupplierAnalysis(),
      getCustomerAnalysis(),
    ])
    supplierAnalysisData.value = suppliers
    customerAnalysisData.value = customers
  } finally {
    partnerLoading.value = false
  }
}

// ---- Tab 切换懒加载 ----
function handleTabChange(tab: string) {
  switch (tab) {
    case 'dashboard':
      if (!dashboardData.value) fetchDashboard()
      break
    case 'stock':
      if (stockSummaryData.value.length === 0) fetchStockData()
      break
    case 'trend':
      if (inboundDailyRecords.value.length === 0) fetchTrendData()
      break
    case 'turnover':
      if (turnoverData.value.length === 0) fetchTurnoverData()
      break
    case 'partner':
      if (supplierAnalysisData.value.length === 0) fetchPartnerData()
      break
  }
}

onMounted(() => {
  fetchDashboard()
})
</script>

<style scoped>
.report-view {
  padding: 16px;
}
.title {
  font-size: 18px;
  font-weight: 600;
}
.stat-cards {
  margin-bottom: 8px;
}
.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: #fff;
  border-radius: 8px;
  border-top: 3px solid;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.stat-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
}
.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  line-height: 1.3;
}
.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 2px;
}
.chart-container {
  height: 340px;
  width: 100%;
}
.chart-container-lg {
  height: 380px;
  width: 100%;
}
.low-stock {
  color: #f56c6c;
  font-weight: 600;
}
.high-turnover {
  color: #67c23a;
  font-weight: 600;
}
.low-turnover {
  color: #e6a23c;
  font-weight: 600;
}
h4 {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}
:deep(.el-tabs__header) {
  margin-bottom: 20px;
}
</style>
