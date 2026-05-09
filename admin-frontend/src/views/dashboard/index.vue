<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <el-statistic title="总用户数" :value="120" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="今日登录" :value="12" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="总角色数" :value="6" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="总部门数" :value="10" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
</style>