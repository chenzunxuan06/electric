<template>
  <MainLayout>
    <div class="page">
      <div class="header">
        <div class="brand"><div class="logo">SD</div><div><h1 class="h1">用户管理</h1><div class="muted">查看、搜索、管理系统用户</div></div></div>
        <div class="input-row">
          <el-input v-model="keyword" placeholder="搜索用户" style="width:240px" />
          <el-button v-if="can('user:create')" type="primary" @click="dialogVisible = true">新增用户</el-button>
          <el-button @click="loadUsers">刷新</el-button>
        </div>
      </div>
      <el-card class="card">
        <el-table :data="filteredUsers" height="620">
          <el-table-column prop="id" label="用户ID" width="180" />
          <el-table-column prop="username" label="账号" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="role" label="角色" width="120" />
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button v-if="can('user:update')" size="small" @click="editRow(row)">编辑</el-button>
              <el-button v-if="can('user:delete')" size="small" type="danger" @click="removeRow(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-dialog v-model="dialogVisible" :title="editingId ? '编辑用户' : '新增用户'" width="640px">
        <el-form :model="form" label-width="80px">
          <el-form-item label="账号"><el-input v-model="form.username" /></el-form-item>
          <el-form-item label="姓名"><el-input v-model="form.name" /></el-form-item>
          <el-form-item label="角色">
            <el-select v-model="form.role" style="width:100%">
              <el-option label="管理员" value="admin" />
              <el-option label="业务负责人" value="manager" />
              <el-option label="数据分析员" value="analyst" />
              <el-option label="普通用户" value="user" />
            </el-select>
          </el-form-item>
          <el-form-item label="密码"><el-input v-model="form.password" type="password" /></el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../../layouts/MainLayout.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import http from '../../api/http';
import { hasPermission as can } from '../../utils/auth';

const keyword = ref('');
const dialogVisible = ref(false);
const editingId = ref('');
const users = ref([]);
const form = reactive({ username: '', name: '', role: 'user', password: '' });
const filteredUsers = computed(() => users.value.filter(u => `${u.id}${u.username}${u.name}${u.role}`.includes(keyword.value)));

async function loadUsers() { const { data } = await http.get('/users'); users.value = data; localStorage.setItem('user_cache', JSON.stringify(data)); }
function resetForm() { Object.assign(form, { username: '', name: '', role: 'user', password: '' }); editingId.value = ''; }
function editRow(row) { editingId.value = row.id; Object.assign(form, row); form.password = ''; dialogVisible.value = true; }
async function removeRow(row) { await ElMessageBox.confirm(`确定删除用户 ${row.name} 吗？`, '提示'); await http.delete(`/users/${row.id}`); ElMessage.success('删除成功'); await loadUsers(); }
async function submit() { if (editingId.value) await http.put(`/users/${editingId.value}`, form); else await http.post('/users', form); ElMessage.success('保存成功'); dialogVisible.value = false; resetForm(); await loadUsers(); }

onMounted(loadUsers);
</script>
