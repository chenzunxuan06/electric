<template>
  <MainLayout>
    <div class="page">
      <div class="header">
        <div class="brand">
          <div class="logo">SD</div>
          <div>
            <h1 class="h1">权限管理</h1>
            <div class="muted">角色、用户、菜单权限示例</div>
          </div>
        </div>
        <div class="input-row">
          <el-input v-model="keyword" placeholder="搜索角色" style="width:240px" />
          <el-button type="primary" @click="showRoleDialog = true">新增角色</el-button>
          <el-button @click="loadUsers">刷新</el-button>
        </div>
      </div>
      <el-card class="card" style="margin-bottom:16px">
        <el-table :data="filteredRoles" @row-click="openRoleDetail" style="cursor:pointer">
          <el-table-column prop="name" label="角色" />
          <el-table-column prop="desc" label="说明" />
          <el-table-column prop="perm" label="权限" />
          <el-table-column label="数据库查看" width="140">
            <template #default="{ row }">
              <el-button size="small" @click.stop="openRoleUsers(row)">查看内容</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="card">
        <div class="section-title"><strong>用户数据库</strong><span class="muted">点击角色可查看权限细节</span></div>
        <el-table :data="users" height="360" style="margin-top:12px">
          <el-table-column prop="id" label="ID" width="180" />
          <el-table-column prop="username" label="账号" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="role" label="角色" width="120" />
        </el-table>
      </el-card>

      <el-dialog v-model="detailVisible" :title="detail.name" width="700px">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="角色">{{ detail.name }}</el-descriptions-item>
          <el-descriptions-item label="说明">{{ detail.desc }}</el-descriptions-item>
          <el-descriptions-item label="权限">{{ detail.perm }}</el-descriptions-item>
          <el-descriptions-item label="可访问模块">{{ detail.modules }}</el-descriptions-item>
        </el-descriptions>
      </el-dialog>

      <el-dialog v-model="usersVisible" :title="`角色数据库内容 - ${currentRole.name}`" width="760px">
        <el-table :data="roleUsers" height="420">
          <el-table-column prop="id" label="ID" width="180" />
          <el-table-column prop="username" label="账号" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="role" label="角色" width="120" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button size="small" @click="showUserDetail(row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <el-dialog v-model="userDetailVisible" title="用户详情" width="680px">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="用户ID">{{ userDetail.id }}</el-descriptions-item>
          <el-descriptions-item label="账号">{{ userDetail.username }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ userDetail.name }}</el-descriptions-item>
          <el-descriptions-item label="角色">{{ userDetail.role }}</el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import axios from 'axios';

const keyword = ref('');
const showRoleDialog = ref(false);
const detailVisible = ref(false);
const usersVisible = ref(false);
const userDetailVisible = ref(false);
const detail = reactive({ name: '', desc: '', perm: '', modules: '' });
const currentRole = reactive({ name: '', desc: '', perm: '', modules: '' });
const userDetail = reactive({ id: '', username: '', name: '', role: '' });
const users = ref([]);
const roleUsers = ref([]);
const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use((config) => { const token = localStorage.getItem('token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
const roles = [
  { name: '管理员', desc: '系统全权限', perm: '用户管理 / 数据管理 / 审计 / 链上操作', modules: '工作台、资产、审批、日志、权限管理' },
  { name: '业务负责人', desc: '审批授权', perm: '授权审批 / 查看报表', modules: '工作台、资产、审批、日志' },
  { name: '数据分析员', desc: '发起任务', perm: '隐私计算 / 智能问答 / 报告生成', modules: '工作台、资产、隐私计算、日志' },
  { name: '普通用户', desc: '浏览与申请', perm: '查看资产 / 提交申请', modules: '工作台、资产、隐私计算、日志' }
];
const filteredRoles = computed(() => roles.filter(r => `${r.name}${r.desc}${r.perm}`.includes(keyword.value)));
async function loadUsers() { users.value = JSON.parse(localStorage.getItem('user_cache') || '[]'); }
function openRoleDetail(row) { Object.assign(detail, row); detailVisible.value = true; }
function openRoleUsers(row) { Object.assign(currentRole, row); roleUsers.value = users.value.filter(u => (row.name === '管理员' && u.role === 'admin') || (row.name === '业务负责人' && u.role === 'manager') || (row.name === '数据分析员' && u.role === 'analyst') || (row.name === '普通用户' && u.role === 'user')); usersVisible.value = true; }
function showUserDetail(row) { Object.assign(userDetail, row); userDetailVisible.value = true; }
onMounted(loadUsers);
</script>
