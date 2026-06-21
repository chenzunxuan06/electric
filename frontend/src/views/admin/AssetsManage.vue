<template>
  <MainLayout>
    <div class="page">
      <div class="header">
        <div class="brand"><div class="logo">SD</div><div><h1 class="h1">资产管理</h1><div class="muted">查看、搜索、编辑、删除资产</div></div></div>
        <div class="input-row">
          <el-input v-model="keyword" placeholder="搜索资产" style="width:260px" />
          <el-button type="primary" @click="openDialog()">新增资产</el-button>
        </div>
      </div>
      <el-card class="card">
        <el-table :data="filteredAssets" height="620">
          <el-table-column prop="id" label="资产ID" width="180" />
          <el-table-column prop="name" label="资产名称" />
          <el-table-column prop="owner" label="归属方" />
          <el-table-column prop="sensitivity" label="敏感级别" width="100" />
          <el-table-column prop="status" label="状态" width="100" />
          <el-table-column prop="price" label="价格" width="100" />
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button size="small" @click="openDialog(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="remove(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-dialog v-model="showDialog" :title="editingIndex >= 0 ? '编辑资产' : '新增资产'">
        <el-form :model="form" label-width="90px">
          <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
          <el-form-item label="归属方"><el-input v-model="form.owner" /></el-form-item>
          <el-form-item label="敏感级别"><el-input v-model="form.sensitivity" /></el-form-item>
          <el-form-item label="状态"><el-input v-model="form.status" /></el-form-item>
          <el-form-item label="价格"><el-input v-model="form.price" /></el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showDialog=false">取消</el-button>
          <el-button type="primary" @click="submit">保存</el-button>
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
const keyword = ref('');
const showDialog = ref(false);
const editingIndex = ref(-1);
const assets = ref([]);
const form = reactive({ name: '', owner: '', sensitivity: '中', status: '已登记', price: 0 });
const filteredAssets = computed(() => assets.value.filter(a => `${a.id}${a.name}${a.owner}${a.status}`.includes(keyword.value)));
async function loadAssets(){ const { data } = await http.get('/assets'); assets.value = data; }
function openDialog(row) { if (row) { editingIndex.value = assets.value.indexOf(row); Object.assign(form, row); } else { editingIndex.value = -1; Object.assign(form, { name: '', owner: '', sensitivity: '中', status: '已登记', price: 0 }); } showDialog.value = true; }
async function remove(row) { await ElMessageBox.confirm(`确定删除资产 ${row.name} 吗？`, '提示'); await http.delete(`/assets/${row.id}`); ElMessage.success('删除成功'); await loadAssets(); }
async function submit() { if (editingIndex.value >= 0) await http.put(`/assets/${assets.value[editingIndex.value].id}`, { ...form, price: Number(form.price) }); else await http.post('/assets', { ...form, price: Number(form.price) }); showDialog.value = false; ElMessage.success('保存成功'); await loadAssets(); }
loadAssets();
</script>
