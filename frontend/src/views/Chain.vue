<template>
  <MainLayout>
    <div class="page">
      <div class="header">
        <div class="brand"><div class="logo">SD</div><div><h1 class="h1">链上存证中心</h1><div class="muted">记录资产、申请和隐私任务上链信息</div></div></div>
        <div class="input-row">
          <el-input v-model="keyword" placeholder="搜索记录" style="width:260px" />
          <el-button @click="loadRecords">刷新</el-button>
        </div>
      </div>

      <div class="energy-sub-banner card chain-banner">
        <div>
          <div class="banner-kicker">CHAIN TRACE</div>
          <h2 class="mini-banner-title">可信链路 · 上链存证追踪</h2>
          <p class="mini-banner-desc">每一次资产流转、审批流和任务执行，都在链上留下可追踪的可信痕迹。</p>
        </div>
        <svg viewBox="0 0 420 140" class="mini-banner-svg" aria-hidden="true">
          <defs>
            <linearGradient id="chainLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#34a6ff" />
              <stop offset="100%" stop-color="#6fffe9" />
            </linearGradient>
          </defs>
          <path d="M30 70 H88 L114 44 H182 L210 70 H278 L304 96 H390" stroke="url(#chainLine)" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          <g fill="none" stroke="url(#chainLine)" stroke-width="2">
            <rect x="56" y="52" width="26" height="26" rx="7" />
            <rect x="156" y="34" width="26" height="26" rx="7" />
            <rect x="256" y="52" width="26" height="26" rx="7" />
            <rect x="342" y="78" width="26" height="26" rx="7" />
          </g>
        </svg>
      </div>

      <el-card class="card">
        <el-table :data="filteredRecords" height="620">
          <el-table-column prop="time" label="时间" width="170" />
          <el-table-column prop="action" label="动作" width="120" />
          <el-table-column prop="detail" label="对象" />
          <el-table-column prop="txHash" label="哈希" width="140" />
        </el-table>
      </el-card>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue';
import { computed, onMounted, ref } from 'vue';
import http from '../api/http';
const keyword = ref('');
const records = ref([]);
const filteredRecords = computed(() => records.value.filter(r => `${r.time}${r.action}${r.detail}${r.txHash}`.includes(keyword.value)));
async function loadRecords() { const { data } = await http.get('/chain/records'); records.value = data; }
onMounted(loadRecords);
</script>

<style scoped>
.chain-banner { display:flex; justify-content:space-between; gap:16px; align-items:center; margin-bottom:16px; }
.mini-banner-title { margin: 6px 0 10px; font-size: 24px; }
.mini-banner-desc { margin: 0; color: rgba(234,244,255,.72); line-height:1.75; }
.mini-banner-svg { width: 360px; max-width: 100%; height: 120px; }
@media (max-width: 900px) { .chain-banner { flex-direction:column; align-items:flex-start; } .mini-banner-svg { width:100%; } }
</style>
