<template>
  <MainLayout>
    <div class="page">
      <div class="header">
        <div class="brand"><div class="logo">SD</div><div><h1 class="h1">安全日志</h1><div class="muted">系统操作、审计追踪、异常事件</div></div></div>
        <div class="input-row">
          <el-input v-model="keyword" placeholder="搜索日志" style="width:260px" />
          <el-button @click="loadLogs">刷新</el-button>
          <el-button v-if="can('report:view')" type="primary" @click="exportLog">导出</el-button>
        </div>
      </div>

      <div class="energy-sub-banner card logs-banner">
        <div>
          <div class="banner-kicker">AUDIT WAVE</div>
          <h2 class="mini-banner-title">审计波纹 · 操作追踪与安全留痕</h2>
          <p class="mini-banner-desc">平台内所有关键行为均可追踪、可回溯、可导出，形成完整安全闭环。</p>
        </div>
        <svg viewBox="0 0 420 140" class="mini-banner-svg" aria-hidden="true">
          <defs>
            <linearGradient id="logLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#ffbf47" />
              <stop offset="50%" stop-color="#6fffe9" />
              <stop offset="100%" stop-color="#34a6ff" />
            </linearGradient>
          </defs>
          <path d="M18 92 C52 40, 96 40, 130 92 S208 144, 246 76 S336 20, 402 84" fill="none" stroke="url(#logLine)" stroke-width="3.2" />
          <circle cx="70" cy="58" r="8" fill="#ffbf47" />
          <circle cx="154" cy="86" r="8" fill="#6fffe9" />
          <circle cx="262" cy="64" r="8" fill="#34a6ff" />
          <circle cx="360" cy="90" r="8" fill="#ffbf47" />
        </svg>
      </div>

      <el-card class="card">
        <el-table :data="filteredLogs" height="620">
          <el-table-column prop="time" label="时间" width="170" />
          <el-table-column prop="actor" label="操作者" width="120" />
          <el-table-column prop="action" label="操作" />
          <el-table-column prop="result" label="结果" width="100" />
        </el-table>
      </el-card>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue';
import { computed, onMounted, ref } from 'vue';
import http from '../api/http';
import { hasPermission as can } from '../utils/auth';
const keyword = ref('');
const logs = ref([]);
const filteredLogs = computed(() => logs.value.filter(l => `${l.time}${l.actor}${l.action}${l.result}`.includes(keyword.value)));
async function loadLogs() { const { data } = await http.get('/audit/logs'); logs.value = data; }
function exportLog() {
  const base = import.meta.env.DEV ? http.defaults.baseURL.replace('/api', '') : window.location.origin;
  window.open(`${base}/api/audit/logs`, '_blank');
}
onMounted(loadLogs);
</script>

<style scoped>
.logs-banner { display:flex; justify-content:space-between; gap:16px; align-items:center; margin-bottom:16px; }
.mini-banner-title { margin: 6px 0 10px; font-size: 24px; }
.mini-banner-desc { margin: 0; color: rgba(234,244,255,.72); line-height:1.75; }
.mini-banner-svg { width: 360px; max-width: 100%; height: 120px; }
@media (max-width: 900px) { .logs-banner { flex-direction:column; align-items:flex-start; } .mini-banner-svg { width:100%; } }
</style>
