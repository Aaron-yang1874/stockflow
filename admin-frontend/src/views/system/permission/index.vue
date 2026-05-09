<template>
  <div class="permission-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>权限/菜单管理</span>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
      </template>
      <el-table :data="list" border row-key="id">
        <el-table-column prop="menuName" label="菜单名称" />
        <el-table-column prop="menuType" label="类型">
          <template #default="{ row }">
            {{ row.menuType === 'M' ? '目录' : row.menuType === 'C' ? '菜单' : '按钮' }}
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由地址" />
        <el-table-column prop="perms" label="权限标识" />
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
import { permissionApi } from '@/api'

const list = ref<any[]>([])

const loadData = async () => {
  const res: any = await permissionApi.list()
  list.value = res
}

const handleAdd = () => {
  ElMessage.info('请在后端直接添加权限')
}

const handleEdit = (row: any) => {
  ElMessage.info('编辑功能待完善')
}

const handleDelete = async (row: any) => {
  await ElMessageBox.confirm('确定删除?')
  await permissionApi.delete(row.id)
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