<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import request from '../../api/index'

const router = useRouter()

const loginForm = reactive({
  username: '',
  password: ''
})

const loading = ref(false)

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

const formRef = ref()

function handleLogin() {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return

    loading.value = true
    try {
      const res: any = await request.post('/auth/login', loginForm)
      if (res.token) {
        localStorage.setItem('token', res.token)
        localStorage.setItem('username', loginForm.username)
        ElMessage.success('登录成功')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('登录失败:', error)
    } finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">库存管理系统</h2>
      <p class="login-subtitle">StockFlow Management System</p>
      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        size="large"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            style="width: 100%"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-footer">
        <span>默认账号: admin / admin123</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 420px;
  padding: 40px 36px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.login-title {
  text-align: center;
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.login-subtitle {
  text-align: center;
  font-size: 13px;
  color: #999;
  margin: 0 0 32px 0;
  letter-spacing: 1px;
}

.login-footer {
  text-align: center;
  margin-top: 16px;
  font-size: 12px;
  color: #bbb;
}
</style>
