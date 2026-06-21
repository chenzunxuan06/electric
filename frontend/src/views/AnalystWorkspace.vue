<template>
  <MainLayout>
    <div class="page">
      <div class="header">
        <div class="brand"><div class="logo">SD</div><div><h1 class="h1">数据分析员工作台</h1><div class="muted">任务、模型、报告</div></div></div>
        <div class="input-row">
          <el-button type="primary" @click="$router.push('/privacy')">隐私计算</el-button>
          <el-button type="primary" @click="$router.push('/assets')">资产中心</el-button>
          <el-button type="primary" @click="$router.push('/chain')">链上存证</el-button>
        </div>
      </div>
      <div class="grid">
        <el-card class="card" style="grid-column: span 6"><div class="muted">运行中任务</div><div class="kpi">4</div></el-card>
        <el-card class="card" style="grid-column: span 6"><div class="muted">已完成报告</div><div class="kpi">11</div></el-card>
      </div>
      <el-card class="card" style="margin-top:16px">
        <div class="section-title"><strong>工作台快捷入口</strong><span class="muted">跳转到独立页面</span></div>
        <el-table :data="panelData" height="320" style="margin-top:12px">
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="desc" label="说明" />
          <el-table-column prop="path" label="路径" />
        </el-table>
      </el-card>
    </div>
  </MainLayout>
</template>
<script setup>
import MainLayout from '../layouts/MainLayout.vue';
const panelData = [{ name: '隐私计算', desc: '发起任务、查看结果、导出报告', path: '/privacy' }, { name: '资产中心', desc: '查看可分析数据资产', path: '/assets' }, { name: '链上存证', desc: '查看任务与资产上链记录', path: '/chain' }, { name: '安全日志', desc: '查看操作审计', path: '/logs' }];
</script>
