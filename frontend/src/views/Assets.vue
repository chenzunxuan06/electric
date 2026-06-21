<template>
  <MainLayout>
    <div class="page">
      <div class="header">
        <div class="brand">
          <div class="logo">SD</div>
          <div>
            <h1 class="h1">数据资产中心</h1>
            <div class="muted">资产登记、分类、共享与流通</div>
          </div>
        </div>
        <div class="input-row">
          <el-input v-model="keyword" placeholder="搜索资产" style="width:260px" />
          <el-button v-if="can('asset:create')" type="primary" @click="showDialog = true">新增资产</el-button>
          <el-button @click="loadAssets">刷新</el-button>
        </div>
      </div>

      <div class="energy-sub-banner card asset-banner">
        <div>
          <div class="banner-kicker">ASSET GRID</div>
          <h2 class="mini-banner-title">电流流线 · 资产登记与共享</h2>
          <p class="mini-banner-desc">像电流在网架中流动一样，数据资产在可信空间中流转、登记、共享与审计。</p>
        </div>
        <svg viewBox="0 0 420 140" class="mini-banner-svg" aria-hidden="true">
          <defs>
            <linearGradient id="assetLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#6fffe9" />
              <stop offset="50%" stop-color="#34a6ff" />
              <stop offset="100%" stop-color="#ffffff" />
            </linearGradient>
          </defs>
          <path d="M10 78 C60 18, 104 18, 148 72 S240 128, 286 62 S352 14, 410 72" fill="none" stroke="url(#assetLine)" stroke-width="3.2" />
          <circle cx="60" cy="42" r="6" fill="#6fffe9" />
          <circle cx="170" cy="82" r="6" fill="#34a6ff" />
          <circle cx="300" cy="58" r="6" fill="#6fffe9" />
          <circle cx="380" cy="76" r="6" fill="#34a6ff" />
        </svg>
      </div>

      <el-card class="card">
        <el-table :data="filteredAssets" height="620">
          <el-table-column prop="id" label="资产ID" width="180" />
          <el-table-column prop="name" label="资产名称" />
          <el-table-column prop="owner" label="归属方" />
          <el-table-column prop="sensitivity" label="敏感级别" width="100" />
          <el-table-column prop="status" label="状态" width="100" />
          <el-table-column prop="price" label="价格" width="100" />
          <el-table-column label="操作" width="220">
            <template #default="{ row }">
              <el-button v-if="can('asset:update')" size="small" @click="editAsset(row)">编辑</el-button>
              <el-button v-if="can('asset:delete')" size="small" type="danger" @click="removeAsset(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-dialog v-model="showDialog" title="新增资产" width="640px" :fullscreen="isMobile">
        <el-form :model="form" label-width="90px">
          <el-form-item label="资产ID"><el-input v-model="form.id" /></el-form-item>
          <el-form-item label="资产名称"><el-input v-model="form.name" /></el-form-item>
          <el-form-item label="归属方"><el-input v-model="form.owner" /></el-form-item>
          <el-form-item label="敏感级别"><el-input v-model="form.sensitivity" /></el-form-item>
          <el-form-item label="状态"><el-input v-model="form.status" /></el-form-item>
          <el-form-item label="价格"><el-input v-model="form.price" /></el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="submitAsset">提交</el-button>
        </template>
      </el-dialog>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import http from '../api/http';
import { hasPermission as can } from '../utils/auth';

const keyword = ref('');
const showDialog = ref(false);
const assets = ref([]);
const editingId = ref('');
const form = reactive({ id: '', name: '', owner: '', sensitivity: '中', status: '可共享', price: '' });
const isMobile = computed(() => window.innerWidth < 768);

const filteredAssets = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return assets.value;
  return assets.value.filter((item) => [item.id, item.name, item.owner, item.sensitivity, item.status, item.price]
    .some((v) => String(v ?? '').toLowerCase().includes(q)));
});

function resetForm() {
  Object.assign(form, { id: '', name: '', owner: '', sensitivity: '中', status: '可共享', price: '' });
  editingId.value = '';
}

async function loadAssets() {
  const { data } = await http.get('/assets');
  assets.value = Array.isArray(data) ? data : [];
}

function editAsset(row) {
  editingId.value = row.id;
  Object.assign(form, row);
  showDialog.value = true;
}

async function submitAsset() {
  if (editingId.value) {
    await http.put(`/assets/${editingId.value}`, form);
    ElMessage.success('资产已更新');
  } else {
    await http.post('/assets', form);
    ElMessage.success('资产已新增');
  }
  showDialog.value = false;
  resetForm();
  await loadAssets();
}

async function removeAsset(row) {
  await ElMessageBox.confirm(`确认删除资产「${row.name || row.id}」吗？`, '删除资产', { type: 'warning' });
  await http.delete(`/assets/${row.id}`);
  ElMessage.success('资产已删除');
  await loadAssets();
}

onMounted(loadAssets);
</script>

<style scoped>
.asset-banner {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
}

.mini-banner-title {
  margin: 6px 0 10px;
  font-size: 24px;
}

.mini-banner-desc {
  margin: 0;
  color: rgba(234, 244, 255, 0.72);
  line-height: 1.75;
}

.mini-banner-svg {
  width: 360px;
  max-width: 100%;
  height: 120px;
}

@media (max-width: 900px) {
  .asset-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .mini-banner-svg {
    width: 100%;
  }
}
</style>
