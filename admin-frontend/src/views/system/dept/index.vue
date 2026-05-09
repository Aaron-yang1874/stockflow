<template>
  <div class="dept-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>部门管理</span>
          <el-button type="primary" @click="handleAdd">新增部门</el-button>
        </div>
      </template>
      <el-table :data="list" border row-key="id">
        <el-table-column prop="deptName" label="部门名称" />
        <el-table-column prop="orderNum" label="排序" />
        <el-table-column prop="leader" label="负责人" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deptApi } from '@/api'

const list = ref<any[]>([])

const loadData = async () => {
  const res: any = await deptApi.list()
  list.value = res
}

const handleAdd = () => {
  ElMessage.info('新增功能待完善')
}

const handleEdit = (row: any) => {
  ElMessage.info('编辑功能待完善')
}

const handleDelete = async (row: any) => {
  await ElMessageBox.confirm('确定删除?')
  await deptApi.delete(row.id)
  ElMessage.success('删除成功')
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>