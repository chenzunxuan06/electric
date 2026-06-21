<template>
  <MainLayout>
    <div class="page">
      <div class="header">
        <div class="brand"><div class="logo">SD</div><div><h1 class="h1">权限管理</h1><div class="muted">角色与菜单权限配置</div></div></div>
        <div class="input-row">
          <el-input v-model="keyword" placeholder="搜索角色" style="width:240px" />
          <el-button v-if="can('role:create')" type="primary" @click="openDialog()">新增角色</el-button>
        </div>
      </div>
      <el-card class="card">
        <el-table :data="filteredRoles" height="620">
          <el-table-column prop="name" label="角色" />
          <el-table-column prop="desc" label="说明" />
          <el-table-column prop="perm" label="权限" />
          <el-table-column prop="modules" label="模块" />
          <el-table-column label="操作" width="260">
            <template #default="{ row }">
              <el-button v-if="can('role:update')" size="small" @click="openDialog(row)">编辑</el-button>
              <el-button v-if="can('role:delete')" size="small" type="danger" @click="remove(row)">删除</el-button>
              <el-button v-if="can('role:update')" size="small" type="primary" plain @click="editPermissions(row)">权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-dialog v-model="showDialog" :title="editingId ? '编辑角色' : '新增角色'" width="760px">
        <el-form :model="form" label-width="80px">
          <el-form-item label="角色Key"><el-input v-model="form.key" placeholder="admin / manager / analyst / user" /></el-form-item>
          <el-form-item label="角色"><el-input v-model="form.name" /></el-form-item>
          <el-form-item label="说明"><el-input v-model="form.desc" /></el-form-item>
          <el-form-item label="权限"><el-input v-model="form.perm" /></el-form-item>
          <el-form-item label="模块"><el-input v-model="form.modules" /></el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showDialog=false">取消</el-button>
          <el-button type="primary" @click="submit">保存</el-button>
        </template>
      </el-dialog>

      <el-dialog v-model="permDialogVisible" title="编辑角色权限" width="820px">
        <el-form :model="permForm" label-width="100px">
          <el-form-item label="角色Key"><el-input v-model="permForm.key" disabled /></el-form-item>
          <el-form-item label="角色名称"><el-input v-model="permForm.name" disabled /></el-form-item>
          <el-form-item label="权限配置">
            <el-checkbox-group v-model="permForm.permissions">
              <div class="perm-grid">
                <el-checkbox v-for="p in allPermissions" :key="p.id" :label="p.id">{{ p.label }}</el-checkbox>
              </div>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="permDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePermissions">保存权限</el-button>
        </template>
      </el-dialog>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../../layouts/MainLayout.vue';
import { computed, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import http from '../../api/http';
import { hasPermission as can } from '../../utils/auth';
const keyword = ref('');
const showDialog = ref(false);
const editingId = ref('');
const roles = ref([]);
const form = reactive({ key: '', name: '', desc: '', perm: '', modules: '' });
const permDialogVisible = ref(false);
const permForm = reactive({ id: '', key: '', name: '', permissions: [] });
const allPermissions = [
  { id: 'home:view', label: '工作台' },
  { id: 'dashboard:view', label: '安全态势' },
  { id: 'user:view', label: '用户查看' },
  { id: 'user:create', label: '用户新增' },
  { id: 'user:update', label: '用户编辑' },
  { id: 'user:delete', label: '用户删除' },
  { id: 'role:view', label: '角色查看' },
  { id: 'role:create', label: '角色新增' },
  { id: 'role:update', label: '角色编辑' },
  { id: 'role:delete', label: '角色删除' },
  { id: 'asset:view', label: '资产查看' },
  { id: 'asset:create', label: '资产新增' },
  { id: 'asset:update', label: '资产编辑' },
  { id: 'asset:delete', label: '资产删除' },
  { id: 'approval:view', label: '审批查看' },
  { id: 'approval:approve', label: '审批处理' },
  { id: 'privacy:view', label: '隐私计算查看' },
  { id: 'privacy:create', label: '隐私任务发起' },
  { id: 'privacy:complete', label: '隐私任务完成' },
  { id: 'chain:view', label: '链上存证' },
  { id: 'audit:view', label: '审计查看' },
  { id: 'system:view', label: '项目说明' },
  { id: 'report:view', label: '报告查看' },
  { id: 'request:create', label: '申请提交' }
];
const filteredRoles = computed(() => roles.value.filter(r => `${r.key}${r.name}${r.desc}${r.perm}`.includes(keyword.value)));
async function loadRoles() { const { data } = await http.get('/roles'); roles.value = data; }
function openDialog(row) { if (row) { editingId.value = row.id; Object.assign(form, row); } else { editingId.value = ''; Object.assign(form, { key: '', name: '', desc: '', perm: '', modules: '' }); } showDialog.value = true; }
async function remove(row) { await ElMessageBox.confirm(`确定删除角色 ${row.name} 吗？`, '提示'); await http.delete(`/roles/${row.id}`); ElMessage.success('删除成功'); await loadRoles(); }
async function submit() { if (editingId.value) await http.put(`/roles/${editingId.value}`, form); else await http.post('/roles', { ...form, permissions: [] }); showDialog.value = false; ElMessage.success('保存成功'); await loadRoles(); }
function editPermissions(row) { Object.assign(permForm, { id: row.id, key: row.key, name: row.name, permissions: row.permissions || [] }); permDialogVisible.value = true; }
async function savePermissions() { await http.put(`/roles/${permForm.id}`, { permissions: permForm.permissions, key: permForm.key, name: permForm.name }); permDialogVisible.value = false; ElMessage.success('权限已保存'); await loadRoles(); }
loadRoles();
</script>

<style scoped>
.perm-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 16px; }
</style>
