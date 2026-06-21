<template>
  <div class="page login-page">
    <el-card class="card login-card login-card-electric">
      <div class="login-emblem">
        <div class="login-emblem-icon">⚡</div>
        <div>
          <h1 class="h1" style="margin-bottom:8px">能源可信数据空间平台</h1>
          <p class="muted" style="margin:0">电力数据、隐私计算、链上存证统一入口</p>
        </div>
      </div>
      <p class="muted" style="margin:18px 0 20px">按角色进入不同工作台</p>
      <el-alert v-if="error" :title="error" type="error" :closable="false" style="margin-bottom:12px" />
      <el-tabs v-model="mode">
        <el-tab-pane label="登录" name="login">
          <el-input v-model="form.username" placeholder="账号" style="margin-bottom:12px" />
          <el-input v-model="form.password" type="password" placeholder="密码" style="margin-bottom:18px" />
          <el-button type="primary" style="width:100%" :loading="loading" @click="login">登录</el-button>
        </el-tab-pane>
        <el-tab-pane label="注册" name="register">
          <el-input v-model="form.username" placeholder="账号" style="margin-bottom:12px" />
          <el-input v-model="form.password" type="password" placeholder="密码" style="margin-bottom:12px" />
          <el-input v-model="form.name" placeholder="姓名" style="margin-bottom:12px" />
          <el-select v-model="form.role" placeholder="角色" style="width:100%;margin-bottom:12px">
            <el-option label="管理员" value="admin" />
            <el-option label="业务负责人" value="manager" />
            <el-option label="数据分析员" value="analyst" />
            <el-option label="普通用户" value="user" />
          </el-select>
          <el-button style="width:100%" :loading="loading" @click="register">注册</el-button>
        </el-tab-pane>
      </el-tabs>
      <div class="muted" style="margin-top:12px">默认账号：admin / 123456</div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import http from '../api/http';
import { getRolePermissions } from '../utils/auth';

const router = useRouter();
const mode = ref('login');
const loading = ref(false);
const error = ref('');
const form = reactive({ username: 'admin', password: '123456', name: '系统管理员', role: 'admin' });

function goWorkspace(role) {
  const map = { admin: '/workspace/admin', manager: '/workspace/manager', analyst: '/workspace/analyst', user: '/workspace/user' };
  return map[role] || '/home';
}

function cacheUser(user, permissions) {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('permissions', JSON.stringify(permissions));
  const cache = JSON.parse(localStorage.getItem('user_cache') || '[]');
  const next = cache.filter(u => u.id !== user.id);
  next.unshift(user);
  localStorage.setItem('user_cache', JSON.stringify(next));
}

async function login() {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await http.post('/auth/login', { username: form.username, password: form.password });
    localStorage.setItem('token', data.token);
    const permissions = data.permissions || getRolePermissions(data.user.role);
    cacheUser(data.user, permissions);
    ElMessage.success('登录成功');
    await router.replace(goWorkspace(data.user.role));
  } catch (e) {
    error.value = e?.response?.data?.message || '登录失败，请检查账号密码或后端服务是否启动';
  } finally {
    loading.value = false;
  }
}

async function register() {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await http.post('/auth/register', form);
    ElMessage.success(data.message || '注册成功');
    mode.value = 'login';
  } catch (e) {
    error.value = e?.response?.data?.message || '注册失败，请重试';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (localStorage.getItem('token')) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.role) router.replace(goWorkspace(user.role));
  }
});
</script>

<style scoped>
.login-page{display:grid;place-items:center;min-height:100vh;}
.login-card{width:min(460px,92vw);}
.login-card-electric {
  background:
    radial-gradient(circle at 20% 10%, rgba(0,255,209,.12), transparent 22%),
    radial-gradient(circle at 85% 0%, rgba(52,166,255,.16), transparent 20%),
    linear-gradient(180deg, rgba(15,30,52,.94), rgba(7,13,25,.9));
}
.login-emblem { display:flex; align-items:center; gap:14px; padding:12px 0 6px; }
.login-emblem-icon {
  width: 54px; height: 54px; border-radius: 16px; display:grid; place-items:center; font-size: 24px;
  background: linear-gradient(135deg, rgba(25,145,255,.34), rgba(0,255,209,.22));
  border: 1px solid rgba(0,255,209,.18);
  box-shadow: 0 14px 24px rgba(0,0,0,.28), 0 0 24px rgba(0,255,209,.12);
}
</style>
