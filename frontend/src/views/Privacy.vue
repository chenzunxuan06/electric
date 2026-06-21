<template>
  <MainLayout>
    <div class="page">
      <div class="header">
        <div class="brand"><div class="logo">SD</div><div><h1 class="h1">隐私计算中心</h1><div class="muted">任务发起、协同执行、结果归档</div></div></div>
        <div class="input-row">
          <el-button v-if="can('privacy:create')" type="primary" @click="dialogVisible = true">新建任务</el-button>
          <el-button @click="loadTasks">刷新</el-button>
        </div>
      </div>

      <div class="energy-sub-banner card privacy-banner">
        <div>
          <div class="banner-kicker">PRIVACY GRID</div>
          <h2 class="mini-banner-title">协同节点 · 隐私计算执行中枢</h2>
          <p class="mini-banner-desc">多方数据在安全边界内协同计算，结果可用、过程可审、风险可控。</p>
        </div>
        <svg viewBox="0 0 420 140" class="mini-banner-svg" aria-hidden="true">
          <defs>
            <linearGradient id="privacyLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#6fffe9" />
              <stop offset="100%" stop-color="#34a6ff" />
            </linearGradient>
          </defs>
          <circle cx="70" cy="70" r="22" fill="rgba(111,255,233,.12)" stroke="url(#privacyLine)" stroke-width="2" />
          <circle cx="210" cy="34" r="18" fill="rgba(52,166,255,.12)" stroke="url(#privacyLine)" stroke-width="2" />
          <circle cx="210" cy="106" r="18" fill="rgba(52,166,255,.12)" stroke="url(#privacyLine)" stroke-width="2" />
          <circle cx="350" cy="70" r="22" fill="rgba(111,255,233,.12)" stroke="url(#privacyLine)" stroke-width="2" />
          <path d="M92 70 H188 M232 34 L332 66 M232 106 L332 74" stroke="url(#privacyLine)" stroke-width="3" fill="none" stroke-linecap="round" />
        </svg>
      </div>

      <el-card class="card">
        <el-table :data="tasks" height="620">
          <el-table-column prop="name" label="任务" />
          <el-table-column prop="status" label="状态" width="120" />
          <el-table-column prop="progress" label="进度" width="120" />
          <el-table-column label="操作" width="260">
            <template #default="{ row }">
              <el-button v-if="can('privacy:complete')" size="small" @click="finish(row)">完成</el-button>
              <el-button v-if="can('report:view')" size="small" type="primary" @click="downloadReport(row)">报告</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-dialog v-model="dialogVisible" title="新建隐私计算任务" width="640px" :fullscreen="isMobile">
        <el-form :model="form" label-width="90px">
          <el-form-item label="任务名称"><el-input v-model="form.taskName" /></el-form-item>
          <el-form-item label="场景"><el-input v-model="form.scene" /></el-form-item>
          <el-form-item label="参与方"><el-input v-model="form.participants" /></el-form-item>
          <el-form-item label="算法"><el-input v-model="form.algorithm" /></el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </template>
      </el-dialog>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import http from '../api/http';
import { hasPermission as can } from '../utils/auth';
const dialogVisible = ref(false);
const tasks = ref([]);
const form = reactive({ taskName: '新能源消纳评估', scene: '新能源消纳', participants: '电网公司,发电企业', algorithm: '联邦学习' });
const isMobile = computed(() => window.innerWidth < 768);
async function loadTasks() { const { data } = await http.get('/privacy/tasks'); tasks.value = data; }
async function submit() { await http.post('/privacy/run', form); dialogVisible.value = false; await loadTasks(); }
async function finish(row) { await http.post(`/privacy/tasks/${row.id}/complete`); await loadTasks(); }
function downloadReport(row) { const base = import.meta.env.DEV ? http.defaults.baseURL.replace('/api', '') : window.location.origin; window.open(`${base}/api/privacy/tasks/${row.id}/report`, '_blank'); }
onMounted(loadTasks);
</script>

<style scoped>
.privacy-banner { display:flex; justify-content:space-between; gap:16px; align-items:center; margin-bottom:16px; }
.mini-banner-title { margin: 6px 0 10px; font-size: 24px; }
.mini-banner-desc { margin: 0; color: rgba(234,244,255,.72); line-height:1.75; }
.mini-banner-svg { width: 360px; max-width: 100%; height: 120px; }
@media (max-width: 900px) { .privacy-banner { flex-direction:column; align-items:flex-start; } .mini-banner-svg { width:100%; } }
</style>
