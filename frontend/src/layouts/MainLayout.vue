<template>
  <div class="layout-shell">
    <div v-if="showMask" class="drawer-mask" @click="drawerOpen = false"></div>
    <aside class="layout-aside" :class="{ open: drawerOpen }">
      <div class="sidebar">
        <div class="sidebar-brand">
          <img src="../assets/sd-logo.svg" alt="山东电网风格图标" class="sidebar-logo" />
          <div>
            <div class="sidebar-title">能源可信数据空间</div>
            <div class="muted">山东电网风格平台</div>
          </div>
        </div>
        <div class="sidebar-mobile-head">
          <div class="muted">当前角色：{{ roleText }}</div>
          <el-button v-if="isMobile" size="small" @click="drawerOpen = false">关闭</el-button>
        </div>
        <el-menu class="sidebar-menu" :default-active="active" background-color="transparent" text-color="#eaf4ff" active-text-color="#2f8cff" router @select="closeDrawer">
          <el-menu-item index="/home" v-if="can('home:view')">工作台</el-menu-item>
          <el-menu-item index="/dashboard" v-if="can('dashboard:view')">安全态势</el-menu-item>
          <el-menu-item index="/assets" v-if="can('asset:view')">数据资产</el-menu-item>
          <el-menu-item index="/approvals" v-if="can('approval:view')">审批中心</el-menu-item>
          <el-menu-item index="/privacy" v-if="can('privacy:view')">隐私计算</el-menu-item>
          <el-menu-item index="/chain" v-if="can('chain:view')">存证中心</el-menu-item>
          <el-menu-item index="/logs" v-if="can('audit:view')">安全日志</el-menu-item>
          <el-menu-item index="/roles" v-if="can('role:view')">权限管理</el-menu-item>
          <el-menu-item index="/system" v-if="can('system:view')">项目说明</el-menu-item>
          <el-menu-item index="/login" @click="logout">退出登录</el-menu-item>
        </el-menu>
      </div>
    </aside>
    <main class="layout-main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCurrentPermissions, getCurrentRole } from '../utils/auth';
const route = useRoute();
const router = useRouter();
const active = computed(() => route.path);
const role = computed(() => getCurrentRole());
const roleText = computed(() => ({ admin: '管理员', manager: '业务负责人', analyst: '数据分析员', user: '普通用户', visitor: '访客' }[role.value] || role.value));
const drawerOpen = ref(false);
const isMobile = ref(window.innerWidth <= 900);
const showMask = computed(() => drawerOpen.value && isMobile.value);
function can(permission) { return getCurrentPermissions().includes(permission); }
function logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); localStorage.removeItem('permissions'); router.push('/login'); }
function closeDrawer() { if (isMobile.value) drawerOpen.value = false; }
function syncLayout() { isMobile.value = window.innerWidth <= 900; drawerOpen.value = !isMobile.value; }
onMounted(() => { syncLayout(); window.addEventListener('resize', syncLayout); });
onBeforeUnmount(() => window.removeEventListener('resize', syncLayout));
defineExpose({ openDrawer: () => (drawerOpen.value = true), closeDrawer });
</script>

<style scoped>
.sidebar-mobile-head { display:none; justify-content:space-between; align-items:center; margin-bottom:12px; gap:12px; }
@media (max-width: 900px) { .sidebar-mobile-head { display:flex; } }
</style>
