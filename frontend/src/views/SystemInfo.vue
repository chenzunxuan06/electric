<template>
  <MainLayout>
    <div class="page">
      <div class="header">
        <div class="brand">
          <img src="../assets/sd-logo.svg" alt="山东电网风格图标" class="sidebar-logo" />
          <div>
            <h1 class="h1">项目说明</h1>
            <div class="muted">功能、技术、部署、演示说明</div>
          </div>
        </div>
        <el-button @click="$router.push('/home')">返回首页</el-button>
      </div>
      <el-card class="card">
        <p>本项目面向能源可信数据空间，包含数据确权、授权审批、链上存证、隐私计算、智能问答、财务测算和安全态势感知功能。</p>
        <p>使用路径：先登录或注册，再在首页填写电力数据并提交；可在安全态势页查看趋势与告警；在权限管理页查看角色说明。</p>
        <p>技术栈：Vue3、Vite、Element Plus、Express、JWT、ECharts、文件持久化数据库。</p>
      </el-card>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue';
</script>
