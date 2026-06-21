<template>
  <MainLayout>
    <div class="page">
      <div class="header">
        <div class="brand"><div class="logo">SD</div><div><h1 class="h1">审计查看</h1><div class="muted">查看、筛选、导出审计记录</div></div></div>
        <div class="input-row">
          <el-input v-model="keyword" placeholder="搜索审计记录" style="width:260px" />
          <el-button @click="loadAudits">刷新</el-button>
          <el-button type="primary" @click="exportTxt">导出 TXT</el-button>
          <el-button type="primary" plain @click="exportHtml">导出 HTML</el-button>
        </div>
      </div>
      <el-card class="card">
        <el-table :data="filteredAudits" height="620">
          <el-table-column prop="time" label="时间" width="170" />
          <el-table-column prop="actor" label="操作者" width="120" />
          <el-table-column prop="action" label="操作" />
          <el-table-column prop="result" label="结果" width="100" />
          <el-table-column label="导出" width="160">
            <template #default="{ row }">
              <el-button size="small" @click="exportRowTxt(row)">TXT</el-button>
              <el-button size="small" type="primary" plain @click="exportRowHtml(row)">HTML</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../../layouts/MainLayout.vue';
import { computed, onMounted, ref } from 'vue';
import http from '../../api/http';
const keyword = ref('');
const audits = ref([]);
const filteredAudits = computed(() => audits.value.filter(a => `${a.time}${a.actor}${a.action}${a.result}`.includes(keyword.value)));
async function loadAudits() { const { data } = await http.get('/audits'); audits.value = data; }
function openUrl(path) { window.open(`http://localhost:8080${path}`, '_blank'); }
function exportTxt() { const first = filteredAudits.value[0]; if (!first) return; openUrl(`/api/privacy/tasks/${encodeURIComponent(first.id || 'demo')}/audit`); }
function exportHtml() { const first = filteredAudits.value[0]; if (!first) return; openUrl(`/api/privacy/tasks/${encodeURIComponent(first.id || 'demo')}/audit-html`); }
function exportRowTxt(row) { openUrl(`/api/privacy/tasks/${encodeURIComponent(row.id || 'demo')}/audit`); }
function exportRowHtml(row) { openUrl(`/api/privacy/tasks/${encodeURIComponent(row.id || 'demo')}/audit-html`); }
onMounted(loadAudits);
</script>
