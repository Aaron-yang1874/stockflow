<template>
  <div class="config-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统配置</span>
          <el-button type="primary" @click="handleAdd">新增配置</el-button>
        </div>
      </template>
      <el-table :data="list" border>
        <el-table-column prop="configName" label="参数名称" />
        <el-table-column prop="configKey" label="参数键名" />
        <el-table-column prop="configValue" label="参数键值" />
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
import { configApi } from '@/api'

const list = ref<any[]>([])

const loadData = async () => {
  const res: any = await configApi.list()
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
  await configApi.delete(row.id)
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