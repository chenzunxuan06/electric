<template>
  <MainLayout>
    <div class="page">
      <div class="header">
        <div class="brand"><div class="logo">SD</div><div><h1 class="h1">管理员工作台</h1><div class="muted">全局管理、审计与配置</div></div></div>
        <div class="input-row">
          <el-button type="primary" @click="$router.push('/admin/users')">用户管理</el-button>
          <el-button type="primary" @click="$router.push('/admin/roles')">权限管理</el-button>
          <el-button type="primary" @click="$router.push('/admin/assets')">资产管理</el-button>
          <el-button type="primary" @click="$router.push('/admin/audits')">审计查看</el-button>
        </div>
      </div>
      <div class="grid">
        <el-card class="card" style="grid-column: span 4"><div class="muted">可管理用户</div><div class="kpi">{{ metrics.users }}</div></el-card>
        <el-card class="card" style="grid-column: span 4"><div class="muted">待审批</div><div class="kpi">{{ metrics.pending }}</div></el-card>
        <el-card class="card" style="grid-column: span 4"><div class="muted">系统日志</div><div class="kpi">{{ metrics.logs }}</div></el-card>
      </div>
    </div>
  </MainLayout>
</template>
<script setup>
import MainLayout from '../layouts/MainLayout.vue';
const metrics = { users: 12, pending: 3, logs: 1428 };
</script>
