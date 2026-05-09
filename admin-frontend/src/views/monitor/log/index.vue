<template>
  <div class="log-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>日志管理</span>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="操作日志" name="operations">
          <el-table :data="operations" border>
            <el-table-column prop="module" label="模块" />
            <el-table-column prop="username" label="操作人" />
            <el-table-column prop="requestMethod" label="请求方式" />
            <el-table-column prop="requestIp" label="IP地址" />
            <el-table-column prop="createdAt" label="时间" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="登录日志" name="logins">
          <el-table :data="logins" border>
            <el-table-column prop="username" label="用户" />
            <el-table-column prop="ipAddress" label="IP地址" />
            <el-table-column prop="loginLocation" label="登录地点" />
            <el-table-column prop="createdAt" label="时间" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { logApi } from '@/api'

const activeTab = ref('operations')
const operations = ref<any[]>([])
const logins = ref<any[]>([])

const loadData = async () => {
  const opRes: any = await logApi.operations()
  operations.value = opRes
  const loginRes: any = await logApi.logins()
  logins.value = loginRes
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