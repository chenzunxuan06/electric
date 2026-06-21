<template>
  <div class="sidebar">
    <div class="sidebar-brand">
      <div class="logo">SD</div>
      <div>
        <div class="sidebar-title">能源可信数据空间</div>
        <div class="muted">山东电网风格平台</div>
      </div>
    </div>

    <el-menu :default-active="active" class="sidebar-menu" router>
      <el-menu-item index="/home">业务首页</el-menu-item>
      <el-menu-item index="/dashboard">安全态势</el-menu-item>
      <el-menu-item index="/roles">权限管理</el-menu-item>
      <el-menu-item index="/login">退出登录</el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
defineProps({ active: { type: String, default: '/home' } });
</script>
