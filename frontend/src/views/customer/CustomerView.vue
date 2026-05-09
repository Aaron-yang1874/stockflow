<template>
  <div class="customer-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>客户管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增客户
          </el-button>
        </div>
      </template>

      <el-form :model="queryParams" inline class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="queryParams.keyword" placeholder="搜索编码/名称/联系人" clearable style="width: 220px" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="queryParams.level" placeholder="请选择等级" clearable style="width: 120px">
            <el-option label="普通" value="normal" />
            <el-option label="VIP" value="vip" />
            <el-option label="重点" value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="启用" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" border stripe style="width: 100%">
        <el-table-column prop="code" label="编码" width="120" />
        <el-table-column prop="name" label="名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="contactPerson" label="联系人" width="100" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="level" label="等级" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="levelTagMap[row.level]" effect="dark" size="small">{{ levelLabelMap[row.level] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creditLimit" label="信用额度" width="120" align="right">
          <template #default="{ row }">¥{{ Number(row.creditLimit).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" effect="dark" size="small">
              {{ row.status === 'active' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确认删除该客户？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
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

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑客户' : '新增客户'"
      width="640px"
      destroy-on-close
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入编码" :disabled="isEdit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input v-model="form.contactPerson" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="等级">
              <el-select v-model="form.level" placeholder="请选择等级" style="width: 100%">
                <el-option label="普通 (Normal)" value="normal" />
                <el-option label="VIP" value="vip" />
                <el-option label="重点 (Key)" value="key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="信用额度">
              <el-input-number
                v-model="form.creditLimit"
                :min="0"
                :precision="2"
                :step="1000"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="地址">
              <el-input v-model="form.address" placeholder="请输入地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">{{ isEdit ? '保存修改' : '确认新增' }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getCustomerList,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  type Customer,
} from '@/api/customer'

const loading = ref(false)
const tableData = ref<Customer[]>([])
const total = ref(0)

const queryParams = reactive({
  page: 1,
  pageSize: 10,
  keyword: '',
  level: '',
  status: '',
})

const levelLabelMap: Record<string, string> = {
  normal: '普通',
  vip: 'VIP',
  key: '重点',
}

const levelTagMap: Record<string, string> = {
  normal: 'info',
  vip: '',
  key: 'warning',
}

async function fetchList() {
  loading.value = true
  try {
    const params: Record<string, any> = { ...queryParams }
    Object.keys(params).forEach((k) => !params[k] && delete params[k])
    const res = await getCustomerList(params)
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
  queryParams.keyword = ''
  queryParams.level = ''
  queryParams.status = ''
  queryParams.page = 1
  fetchList()
}

const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const isEdit = ref(false)
const editId = ref('')

const form = reactive({
  code: '',
  name: '',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  level: 'normal',
  creditLimit: 0,
  remark: '',
})

const formRules: FormRules = {
  code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  contactPerson: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
}

function handleAdd() {
  isEdit.value = false
  dialogVisible.value = true
}

function handleEdit(row: Customer) {
  isEdit.value = true
  editId.value = row.id
  Object.assign(form, {
    code: row.code,
    name: row.name,
    contactPerson: row.contactPerson,
    phone: row.phone,
    email: row.email || '',
    address: row.address || '',
    level: row.level,
    creditLimit: row.creditLimit,
    remark: row.remark || '',
  })
  dialogVisible.value = true
}

function resetForm() {
  form.code = ''
  form.name = ''
  form.contactPerson = ''
  form.phone = ''
  form.email = ''
  form.address = ''
  form.level = 'normal'
  form.creditLimit = 0
  form.remark = ''
  if (formRef.value) formRef.value.resetFields()
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value) {
      await updateCustomer(editId.value, {
        name: form.name,
        contactPerson: form.contactPerson,
        phone: form.phone,
        email: form.email || undefined,
        address: form.address || undefined,
        level: form.level as any,
        creditLimit: form.creditLimit,
        remark: form.remark || undefined,
      })
      ElMessage.success('修改成功')
    } else {
      await createCustomer({
        code: form.code,
        name: form.name,
        contactPerson: form.contactPerson,
        phone: form.phone,
        email: form.email || undefined,
        address: form.address || undefined,
        level: form.level as any,
        creditLimit: form.creditLimit,
        remark: form.remark || undefined,
      })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchList()
  } finally {
    submitLoading.value = false
  }
}

async function handleDelete(id: string) {
  await deleteCustomer(id)
  ElMessage.success('删除成功')
  fetchList()
}

onMounted(fetchList)
</script>

<style scoped>
.customer-container {
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
</style>
