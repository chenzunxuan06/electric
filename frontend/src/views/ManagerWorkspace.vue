<template>
  <MainLayout>
    <div class="page">
      <div class="header"><div class="brand"><div class="logo">SD</div><div><h1 class="h1">业务负责人工作台</h1><div class="muted">审批、授权、风险审查</div></div></div></div>
      <div class="grid">
        <el-card class="card" style="grid-column: span 6"><div class="muted">待审批申请</div><div class="kpi">7</div></el-card>
        <el-card class="card" style="grid-column: span 6"><div class="muted">高风险数据</div><div class="kpi">2</div></el-card>
      </div>
    </div>
  </MainLayout>
</template>
<script setup>
import MainLayout from '../layouts/MainLayout.vue';
</script>
