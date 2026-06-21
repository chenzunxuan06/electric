<template>
  <MainLayout>
    <div class="page">
      <div class="header"><div class="brand"><div class="logo">SD</div><div><h1 class="h1">普通用户工作台</h1><div class="muted">浏览、申请、查看进度</div></div></div></div>
      <div class="grid">
        <el-card class="card" style="grid-column: span 6"><div class="muted">我的申请</div><div class="kpi">5</div></el-card>
        <el-card class="card" style="grid-column: span 6"><div class="muted">可查看资产</div><div class="kpi">18</div></el-card>
      </div>
    </div>
  </MainLayout>
</template>
<script setup>
import MainLayout from '../layouts/MainLayout.vue';
</script>
