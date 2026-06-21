<template>
  <MainLayout>
    <div class="page">
      <div class="header">
        <div class="brand"><div class="logo">SD</div><div><h1 class="h1">审批中心</h1><div class="muted">授权申请、审批处理、审批流转</div></div></div>
        <div class="input-row">
          <el-input v-model="keyword" placeholder="搜索申请" style="width:260px" />
          <el-button @click="loadRequests">刷新</el-button>
        </div>
      </div>

      <div class="energy-sub-banner card approvals-banner">
        <div>
          <div class="banner-kicker">APPROVAL GATE</div>
          <h2 class="mini-banner-title">安全闸口 · 授权审批流转</h2>
          <p class="mini-banner-desc">所有跨主体的数据申请都先经过安全闸口，确保授权、审计与回溯可控。</p>
        </div>
        <svg viewBox="0 0 420 140" class="mini-banner-svg" aria-hidden="true">
          <defs>
            <linearGradient id="gateLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#ffbf47" />
              <stop offset="50%" stop-color="#6fffe9" />
              <stop offset="100%" stop-color="#34a6ff" />
            </linearGradient>
          </defs>
          <path d="M20 78 H110 M110 38 V118 M110 38 H178 M110 118 H178 M220 38 V118 M220 38 H288 M220 118 H288 M320 78 H400" stroke="url(#gateLine)" stroke-width="4" fill="none" stroke-linecap="round"/>
          <rect x="178" y="42" width="42" height="72" rx="10" fill="rgba(255,191,71,.18)" stroke="rgba(255,191,71,.5)"/>
          <circle cx="110" cy="78" r="7" fill="#ffbf47" />
          <circle cx="220" cy="78" r="7" fill="#6fffe9" />
          <circle cx="320" cy="78" r="7" fill="#34a6ff" />
        </svg>
      </div>

      <el-card class="card">
        <el-table :data="filteredRequests" height="620">
          <el-table-column prop="time" label="时间" width="170" />
          <el-table-column prop="applicant" label="申请方" />
          <el-table-column prop="asset" label="资产" />
          <el-table-column prop="status" label="状态" width="100" />
          <el-table-column label="操作" width="180">
            <template #default="{ row }">
              <el-button v-if="can('approval:approve') && row.status === 'pending'" size="small" type="success" @click="approve(row)">通过</el-button>
              <el-button v-if="can('approval:approve') && row.status === 'pending'" size="small" type="danger" @click="reject(row)">拒绝</el-button>
            </template>
          </el-table-column>
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
const requests = ref([]);
const filteredRequests = computed(() => requests.value.filter(r => `${r.time}${r.applicant}${r.asset}${r.status}`.includes(keyword.value)));
async function loadRequests() { const { data } = await http.get('/auth/requests'); requests.value = data; }
async function approve(row) { await http.patch(`/auth/requests/${row.id}`, { status: 'approved' }); await loadRequests(); }
async function reject(row) { await http.patch(`/auth/requests/${row.id}`, { status: 'rejected' }); await loadRequests(); }
onMounted(loadRequests);
</script>

<style scoped>
.approvals-banner { display:flex; justify-content:space-between; gap:16px; align-items:center; margin-bottom:16px; }
.mini-banner-title { margin: 6px 0 10px; font-size: 24px; }
.mini-banner-desc { margin: 0; color: rgba(234,244,255,.72); line-height:1.75; }
.mini-banner-svg { width: 360px; max-width: 100%; height: 120px; }
@media (max-width: 900px) { .approvals-banner { flex-direction:column; align-items:flex-start; } .mini-banner-svg { width:100%; } }
</style>
