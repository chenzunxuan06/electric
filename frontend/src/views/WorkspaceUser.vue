<template>
  <MainLayout>
    <div class="page">
      <div class="header">
        <div class="brand"><div class="logo">SD</div><div><h1 class="h1">普通用户工作台</h1><div class="muted">浏览数据、提交申请、查看任务</div></div></div>
        <div class="input-row">
          <el-button type="primary" @click="$router.push('/assets')">资产中心</el-button>
          <el-button type="primary" @click="$router.push('/privacy')">隐私计算</el-button>
          <el-button type="primary" @click="$router.push('/logs')">安全日志</el-button>
        </div>
      </div>
      <el-card class="card">
        <div class="section-title"><strong>用户功能入口</strong><span class="muted">跳转到独立页面</span></div>
        <div class="hero-stat" style="margin-top:12px">
          <el-button class="hero-chip-btn" @click="$router.push('/assets')">浏览资产</el-button>
          <el-button class="hero-chip-btn" @click="$router.push('/privacy')">发起任务</el-button>
          <el-button class="hero-chip-btn" @click="$router.push('/approvals')">查看申请</el-button>
        </div>
      </el-card>
    </div>
  </MainLayout>
</template>
<script setup>
import MainLayout from '../layouts/MainLayout.vue';
</script>
