<template>
  <div class="stock-out-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>出库管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增出库单
          </el-button>
        </div>
      </template>

      <el-form :model="queryParams" inline class="search-form">
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryParams.type" placeholder="请选择类型" clearable style="width: 160px">
            <el-option label="销售出库" value="sale" />
            <el-option label="领料出库" value="material" />
            <el-option label="报废出库" value="scrap" />
            <el-option label="调整出库" value="adjustment" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="待处理" value="pending" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" border stripe style="width: 100%">
        <el-table-column prop="orderNo" label="单号" min-width="180" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="typeTagMap[row.type]">{{ typeLabelMap[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户" width="140" show-overflow-tooltip />
        <el-table-column prop="warehouseName" label="仓库" width="120" />
        <el-table-column prop="totalAmount" label="总金额" width="120" align="right">
          <template #default="{ row }">¥{{ row.totalAmount?.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusTagMap[row.status]" effect="dark">{{ statusLabelMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operatedBy" label="操作人" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchList"
          @current-change="fetchList"
        />
      </div>
    </el-card>

    <el-dialog v-model="addDialogVisible" title="新增出库单" width="720px" destroy-on-close @close="resetAddForm">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出库类型" prop="type">
              <el-select v-model="addForm.type" placeholder="请选择类型" style="width: 100%">
                <el-option label="销售出库" value="sale" />
                <el-option label="领料出库" value="material" />
                <el-option label="报废出库" value="scrap" />
                <el-option label="调整出库" value="adjustment" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户">
              <el-select v-model="addForm.customerId" placeholder="请选择客户" clearable filterable style="width: 100%">
                <el-option
                  v-for="c in customerOptions"
                  :key="c.id"
                  :label="c.name"
                  :value="c.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="仓库" prop="warehouseId">
              <el-select v-model="addForm.warehouseId" placeholder="请选择仓库" style="width: 100%">
                <el-option
                  v-for="w in warehouseOptions"
                  :key="w.id"
                  :label="w.name"
                  :value="w.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="addForm.remark" type="textarea" :rows="2" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>

      <div class="section-title">出库明细</div>
      <el-table :data="addForm.items" border size="small" style="width: 100%; margin-bottom: 16px">
        <el-table-column label="产品" min-width="200">
          <template #default="{ row, $index }">
            <el-select
              v-model="row.productId"
              placeholder="选择产品"
              filterable
              size="small"
              style="width: 100%"
              @change="(val: string) => handleProductChange(val, $index)"
            >
              <el-option
                v-for="p in productOptions"
                :key="p.id"
                :label="`${p.name} (${p.sku})`"
                :value="p.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="130">
          <template #default="{ row }">
            <el-input-number v-model="row.quantity" :min="0.01" :precision="2" size="small" controls-position="right" style="width: 110px" @change="calcItemAmount(row)" />
          </template>
        </el-table-column>
        <el-table-column label="单价" width="130">
          <template #default="{ row }">
            <el-input-number v-model="row.unitPrice" :min="0" :precision="2" size="small" controls-position="right" style="width: 110px" @change="calcItemAmount(row)" />
          </template>
        </el-table-column>
        <el-table-column label="金额" width="120" align="right">
          <template #default="{ row }">{{ (row.quantity * row.unitPrice || 0).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="70" align="center">
          <template #default="{ $index }">
            <el-button link type="danger" size="small" @click="removeItem($index)" :disabled="addForm.items.length <= 1">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" plain size="small" @click="addItem">
        <el-icon><Plus /></el-icon>添加明细行
      </el-button>

      <div class="total-amount">
        总金额：<span class="amount-value">¥{{ totalAddAmount.toFixed(2) }}</span>
      </div>

      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmitAdd">确定提交</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" title="出库单详情" width="700px" destroy-on-close>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="单号">{{ detailData?.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="类型">
          <el-tag :type="typeTagMap[detailData?.type]">{{ typeLabelMap[detailData?.type] }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="客户">{{ detailData?.customerName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="仓库">{{ detailData?.warehouseName }}</el-descriptions-item>
        <el-descriptions-item label="总金额">¥{{ detailData?.totalAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusTagMap[detailData?.status]" effect="dark">{{ statusLabelMap[detailData?.status] }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作人">{{ detailData?.operatedBy }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatTime(detailData?.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detailData?.remark || '-' }}</el-descriptions-item>
      </el-descriptions>

      <div class="section-title" style="margin-top: 20px">明细列表</div>
      <el-table :data="detailData?.items || []" border size="small" style="width: 100%">
        <el-table-column prop="productName" label="产品名称" min-width="160" />
        <el-table-column prop="productSku" label="SKU" width="140" />
        <el-table-column prop="quantity" label="数量" width="100" align="right" />
        <el-table-column prop="unitPrice" label="单价" width="100" align="right">
          <template #default="{ row }">¥{{ row.unitPrice?.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="110" align="right">
          <template #default="{ row }">¥{{ row.amount?.toFixed(2) }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { getStockOutList, createStockOut, getStockOutDetail, type StockOut, type CreateStockOutPayload } from '@/api/stock-out'
import { getCustomerAll, type Customer } from '@/api/customer'
import { getWarehouseList, type Warehouse } from '@/api/warehouse'
import { getProductList, type Product } from '@/api/product'

const loading = ref(false)
const tableData = ref<StockOut[]>([])
const total = ref(0)
const dateRange = ref<string[]>([])

const queryParams = reactive({
  page: 1,
  pageSize: 10,
  type: '',
  status: '',
  startDate: '',
  endDate: '',
})

const typeLabelMap: Record<string, string> = {
  sale: '销售出库',
  material: '领料出库',
  scrap: '报废出库',
  adjustment: '调整出库',
}

const typeTagMap: Record<string, string> = {
  sale: '',
  material: 'warning',
  scrap: 'danger',
  adjustment: 'info',
}

const statusLabelMap: Record<string, string> = {
  pending: '待处理',
  completed: '已完成',
  cancelled: '已取消',
}

const statusTagMap: Record<string, string> = {
  pending: 'warning',
  completed: 'success',
  cancelled: 'danger',
}

function formatTime(val?: string) {
  if (!val) return '-'
  return val.replace('T', ' ').substring(0, 19)
}

async function fetchList() {
  loading.value = true
  try {
    const params: Record<string, any> = { ...queryParams }
    if (dateRange.value && dateRange.value.length === 2) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }
    Object.keys(params).forEach((k) => !params[k] && delete params[k])
    const res = await getStockOutList(params)
    tableData.value = res.list || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryParams.page = 1
  fetchList()
}

function handleReset() {
  dateRange.value = []
  queryParams.type = ''
  queryParams.status = ''
  queryParams.page = 1
  fetchList()
}

const addDialogVisible = ref(false)
const addFormRef = ref<FormInstance>()
const submitLoading = ref(false)
const customerOptions = ref<Customer[]>([])
const warehouseOptions = ref<Warehouse[]>([])
const productOptions = ref<Product[]>([])

interface AddFormItem {
  productId: string
  quantity: number
  unitPrice: number
}

const addForm = reactive({
  type: '' as CreateStockOutPayload['type'],
  customerId: '',
  warehouseId: '',
  remark: '',
  items: [{ productId: '', quantity: 1, unitPrice: 0 }] as AddFormItem[],
})

const addRules: FormRules = {
  type: [{ required: true, message: '请选择出库类型', trigger: 'change' }],
  warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
}

const totalAddAmount = computed(() => {
  return addForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice || 0), 0)
})

async function loadSelectOptions() {
  const [customers, warehouses, products] = await Promise.all([
    getCustomerAll().catch(() => []),
    getWarehouseList().catch(() => []),
    getProductList().catch(() => []),
  ])
  customerOptions.value = customers as Customer[]
  warehouseOptions.value = warehouses as Warehouse[]
  productOptions.value = products as Product[]
}

function handleAdd() {
  addDialogVisible.value = true
  loadSelectOptions()
}

function resetAddForm() {
  addForm.type = '' as CreateStockOutPayload['type']
  addForm.customerId = ''
  addForm.warehouseId = ''
  addForm.remark = ''
  addForm.items = [{ productId: '', quantity: 1, unitPrice: 0 }]
}

function addItem() {
  addForm.items.push({ productId: '', quantity: 1, unitPrice: 0 })
}

function removeItem(index: number) {
  addForm.items.splice(index, 1)
}

function handleProductChange(productId: string, index: number) {
  const product = productOptions.value.find((p) => p.id === productId)
  if (product) {
    addForm.items[index].unitPrice = product.salePrice
    calcItemAmount(addForm.items[index])
  }
}

function calcItemAmount(item: AddFormItem) {}

async function handleSubmitAdd() {
  const valid = await addFormRef.value?.validate().catch(() => false)
  if (!valid) return

  const hasEmptyItem = addForm.items.some((item) => !item.productId)
  if (hasEmptyItem) {
    ElMessage.warning('请完善所有明细行的产品信息')
    return
  }

  try {
    await ElMessageBox.confirm('确认提交该出库单？', '提示', { type: 'warning' })
  } catch {
    return
  }

  submitLoading.value = true
  try {
    const payload: CreateStockOutPayload = {
      type: addForm.type,
      warehouseId: addForm.warehouseId,
      items: addForm.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    }
    if (addForm.customerId) payload.customerId = addForm.customerId
    if (addForm.remark) payload.remark = addForm.remark

    await createStockOut(payload)
    ElMessage.success('出库单创建成功')
    addDialogVisible.value = false
    fetchList()
  } finally {
    submitLoading.value = false
  }
}

const detailDialogVisible = ref(false)
const detailData = ref<any>(null)

async function handleViewDetail(row: StockOut) {
  try {
    detailData.value = await getStockOutDetail(row.id)
    detailDialogVisible.value = true
  } catch {}
}

onMounted(fetchList)
</script>

<style scoped>
.stock-out-container {
  padding: 0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-form {
  margin-bottom: 16px;
}
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #409eff;
}
.total-amount {
  text-align: right;
  font-size: 15px;
  margin-top: 12px;
  padding: 8px 16px;
  background: #f5f7fa;
  border-radius: 4px;
}
.amount-value {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}
</style>
