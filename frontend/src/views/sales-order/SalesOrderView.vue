<template>
  <div class="sales-order-view">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="title">销售订单管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增销售订单
          </el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="queryForm.keyword" placeholder="搜索订单单号" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="全部状态" clearable style="width: 140px">
            <el-option label="草稿" value="draft" />
            <el-option label="已确认" value="confirmed" />
            <el-option label="已发货" value="shipped" />
            <el-option label="已交付" value="delivered" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item label="付款状态">
          <el-select v-model="queryForm.paymentStatus" placeholder="全部付款状态" clearable style="width: 140px">
            <el-option label="未付款" value="unpaid" />
            <el-option label="部分付款" value="partial" />
            <el-option label="已付款" value="paid" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" border stripe style="width: 100%">
        <el-table-column prop="orderNo" label="单号" min-width="160" />
        <el-table-column prop="customerName" label="客户名称" min-width="150" />
        <el-table-column prop="totalAmount" label="总金额" width="120" align="right">
          <template #default="{ row }">¥{{ row.totalAmount?.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusTagMap[row.status]">{{ statusTextMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentStatus" label="付款状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="paymentTagMap[row.paymentStatus]" effect="plain">{{ paymentTextMap[row.paymentStatus] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryDate" label="交货日期" width="130" align="center">
          <template #default="{ row }">{{ row.deliveryDate ? formatDate(row.deliveryDate) : '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="warning" size="small" @click="handleEdit(row)" :disabled="row.status === 'cancelled' || row.status === 'delivered'">编辑</el-button>
            <el-popconfirm title="确定删除该销售订单？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button link type="danger" size="small" :disabled="row.status !== 'draft' && row.status !== 'cancelled' && row.status !== 'delivered'">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="queryForm.page"
          v-model:page-size="queryForm.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchData"
          @current-change="fetchData"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑销售订单' : '新增销售订单'"
      width="900px"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户" prop="customerId">
              <el-select v-model="form.customerId" placeholder="请选择客户" filterable style="width: 100%" :loading="customerLoading">
                <el-option v-for="c in customerList" :key="c.id" :label="c.name" :value="c.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交货日期">
              <el-date-picker v-model="form.deliveryDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">订单明细</el-divider>

        <el-table :data="form.items" border size="small" style="width: 100%">
          <el-table-column label="产品" min-width="180">
            <template #default="{ row, $index }">
              <el-select v-model="row.productId" placeholder="选择产品" filterable size="small" style="width: 100%" @change="(val: string) => handleProductChange(val, $index)">
                <el-option v-for="p in productList" :key="p.id" :label="`${p.name} (${p.sku})`" :value="p.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="110">
            <template #default="{ row, $index }">
              <el-input-number v-model="row.quantity" :min="1" size="small" controls-position="right" @change="() => calcItemAmount($index)" />
            </template>
          </el-table-column>
          <el-table-column label="单价" width="120">
            <template #default="{ row, $index }">
              <el-input-number v-model="row.unitPrice" :min="0" :precision="2" size="small" controls-position="right" @change="() => calcItemAmount($index)" />
            </template>
          </el-table-column>
          <el-table-column label="税率(%)" width="110">
            <template #default="{ row, $index }">
              <el-input-number v-model="row.taxRate" :min="0" :max="100" :precision="2" size="small" controls-position="right" @change="() => calcItemAmount($index)" />
            </template>
          </el-table-column>
          <el-table-column label="金额" width="120" align="right">
            <template #default="{ row }">¥{{ (row.quantity * row.unitPrice).toFixed(2) }}</template>
          </el-table-column>
          <el-table-column label="" width="60" align="center">
            <template #default="{ $index }">
              <el-button link type="danger" size="small" @click="removeItem($index)" :disabled="form.items.length <= 1">
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" plain size="small" style="margin-top: 10px" @click="addItem">
          <el-icon><Plus /></el-icon>添加明细行
        </el-button>

        <el-divider content-position="left">金额汇总</el-divider>

        <el-row :gutter="20" class="summary-row">
          <el-col :span="8">
            <div class="summary-item">
              <span class="label">总金额：</span>
              <span class="value">¥{{ summary.totalAmount.toFixed(2) }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="summary-item">
              <span class="label">税额合计：</span>
              <span class="value">¥{{ summary.taxAmount.toFixed(2) }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="summary-item final">
              <span class="label">最终金额：</span>
              <span class="value highlight">¥{{ summary.finalAmount.toFixed(2) }}</span>
            </div>
          </el-col>
        </el-row>

        <el-form-item label="备注" style="margin-top: 16px">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="销售订单详情" width="800px" destroy-on-close>
      <el-descriptions :column="2" border v-if="currentOrder">
        <el-descriptions-item label="订单单号">{{ currentOrder.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="客户">{{ currentOrder.customerName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="总金额">¥{{ currentOrder.totalAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="税额">¥{{ currentOrder.taxAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="折扣金额">¥{{ currentOrder.discountAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="最终金额">¥{{ currentOrder.finalAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="statusTagMap[currentOrder.status]">{{ statusTextMap[currentOrder.status] }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="付款状态">
          <el-tag :type="paymentTagMap[currentOrder.paymentStatus]" effect="plain">{{ paymentTextMap[currentOrder.paymentStatus] }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="交货日期">{{ currentOrder.deliveryDate ? formatDate(currentOrder.deliveryDate) : '-' }}</el-descriptions-item>
        <el-descriptions-item label="操作人">{{ currentOrder.operatedBy }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDate(currentOrder.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ formatDate(currentOrder.updatedAt) }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentOrder.remark || '-' }}</el-descriptions-item>
      </el-descriptions>

      <h4 style="margin: 16px 0 8px">订单明细</h4>
      <el-table :data="currentOrder?.items || []" border size="small" v-if="currentOrder">
        <el-table-column prop="productName" label="产品名称" min-width="150" />
        <el-table-column prop="quantity" label="数量" width="80" align="right" />
        <el-table-column prop="unitPrice" label="单价" width="100" align="right">
          <template #default="{ row }">¥{{ row.unitPrice?.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="taxRate" label="税率(%)" width="80" align="right" />
        <el-table-column prop="amount" label="金额" width="120" align="right">
          <template #default="{ row }">¥{{ row.amount?.toFixed(2) }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import {
  getSalesOrderList,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  getSalesOrderDetail,
  type SalesOrder,
} from '@/api/sales-order'
import { getCustomerList, type Customer } from '@/api/customer'
import { getProductList, type Product } from '@/api/product'

const loading = ref(false)
const tableData = ref<SalesOrder[]>([])
const total = ref(0)

const queryForm = reactive({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: '',
  paymentStatus: '',
})

const statusTagMap: Record<string, string> = {
  draft: 'info',
  confirmed: '',
  shipped: 'warning',
  delivered: 'success',
  cancelled: 'danger',
}

const statusTextMap: Record<string, string> = {
  draft: '草稿',
  confirmed: '已确认',
  shipped: '已发货',
  delivered: '已交付',
  cancelled: '已取消',
}

const paymentTagMap: Record<string, string> = {
  unpaid: 'danger',
  partial: 'warning',
  paid: 'success',
}

const paymentTextMap: Record<string, string> = {
  unpaid: '未付款',
  partial: '部分付款',
  paid: '已付款',
}

async function fetchData() {
  loading.value = true
  try {
    const res = await getSalesOrderList(queryForm)
    tableData.value = res.list || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryForm.page = 1
  fetchData()
}

function handleReset() {
  queryForm.keyword = ''
  queryForm.status = ''
  queryForm.paymentStatus = ''
  queryForm.page = 1
  fetchData()
}

function formatDate(dateStr: string | Date): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ---- 对话框相关 ----
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref('')
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const customerLoading = ref(false)
const customerList = ref<Customer[]>([])
const productList = ref<Product[]>([])

const form = reactive({
  customerId: '',
  deliveryDate: '',
  items: [{ productId: '', quantity: 1, unitPrice: 0, taxRate: 0 }],
  remark: '',
})

const rules: FormRules = {
  customerId: [{ required: true, message: '请选择客户', trigger: 'change' }],
}

const summary = reactive({
  totalAmount: 0,
  taxAmount: 0,
  finalAmount: 0,
})

function calcItemAmount(index: number) {
  const item = form.items[index]
  if (!item) return
  item.amount = item.quantity * item.unitPrice
  calcSummary()
}

function calcSummary() {
  let totalAmt = 0
  let taxAmt = 0
  for (const item of form.items) {
    const lineTotal = item.quantity * item.unitPrice
    totalAmt += lineTotal
    taxAmt += lineTotal * (item.taxRate / 100)
  }
  summary.totalAmount = Number(totalAmt.toFixed(2))
  summary.taxAmount = Number(taxAmt.toFixed(2))
  summary.finalAmount = Number((totalAmt + taxAmt).toFixed(2))
}

function addItem() {
  form.items.push({ productId: '', quantity: 1, unitPrice: 0, taxRate: 0 })
}

function removeItem(index: number) {
  form.items.splice(index, 1)
  calcSummary()
}

function handleProductChange(productId: string, index: number) {
  const product = productList.value.find((p) => p.id === productId)
  if (product) {
    form.items[index].unitPrice = product.salePrice
    form.items[index].productName = product.name
    calcItemAmount(index)
  }
}

async function openDialog(edit?: SalesOrder) {
  dialogVisible.value = true
  isEdit.value = !!edit
  editId.value = edit?.id || ''

  customerLoading.value = true
  const [customers, products] = await Promise.all([getCustomerList(), getProductList()])
  customerList.value = customers
  productList.value = products
  customerLoading.value = false

  if (edit) {
    form.customerId = edit.customerId
    form.deliveryDate = edit.deliveryDate ? formatDate(edit.deliveryDate) : ''
    form.remark = edit.remark || ''
    form.items = (edit.items || []).map((item) => ({
      productId: item.productId,
      productName: item.productName || '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxRate: item.taxRate,
      amount: item.amount,
    }))
    if (form.items.length === 0) form.items.push({ productId: '', quantity: 1, unitPrice: 0, taxRate: 0 })
  } else {
    form.customerId = ''
    form.deliveryDate = ''
    form.remark = ''
    form.items = [{ productId: '', quantity: 1, unitPrice: 0, taxRate: 0 }]
  }
  calcSummary()
}

function handleAdd() {
  openDialog()
}

function handleEdit(row: SalesOrder) {
  openDialog(row)
}

async function handleSubmit() {
  await formRef.value?.validate()

  const validItems = form.items.filter((i) => i.productId && i.quantity > 0)
  if (validItems.length === 0) {
    ElMessage.warning('请至少添加一条有效的订单明细')
    return
  }

  submitLoading.value = true
  try {
    const payload = {
      customerId: form.customerId,
      deliveryDate: form.deliveryDate || undefined,
      items: validItems.map(({ productId, quantity, unitPrice, taxRate }) => ({
        productId,
        quantity,
        unitPrice,
        taxRate,
      })),
      remark: form.remark || undefined,
    }

    if (isEdit.value) {
      await updateSalesOrder(editId.value, payload)
      ElMessage.success('更新成功')
    } else {
      await createSalesOrder(payload)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchData()
  } finally {
    submitLoading.value = false
  }
}

// ---- 删除 ----
async function handleDelete(id: string) {
  await deleteSalesOrder(id)
  ElMessage.success('删除成功')
  fetchData()
}

// ---- 详情 ----
const detailVisible = ref(false)
const currentOrder = ref<SalesOrder | null>(null)

async function handleView(row: SalesOrder) {
  detailVisible.value = true
  try {
    currentOrder.value = await getSalesOrderDetail(row.id)
  } catch {
    currentOrder.value = row
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.sales-order-view {
  padding: 16px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-header .title {
  font-size: 18px;
  font-weight: 600;
}
.search-form {
  margin-bottom: 16px;
}
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
.summary-row {
  background: #f5f7fa;
  padding: 12px 16px;
  border-radius: 4px;
}
.summary-item {
  font-size: 14px;
  line-height: 32px;
}
.summary-item .label {
  color: #909399;
}
.summary-item .value {
  font-weight: 600;
  color: #303133;
}
.summary-item.final .value.highlight {
  color: #409eff;
  font-size: 18px;
}
</style>
