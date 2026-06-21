<template>
  <MainLayout>
    <div class="page">
      <div class="header">
        <div class="brand">
          <div class="logo">SD</div>
          <div>
            <h1 class="h1">安全态势大屏</h1>
            <div class="muted">数据流通、隐私保护、链上存证与风险监测</div>
          </div>
        </div>
        <div class="input-row">
          <el-button @click="$router.push('/home')">业务首页</el-button>
          <el-button type="primary" @click="reload">刷新</el-button>
        </div>
      </div>

      <div class="energy-banner card" data-badge="STATE 01">
        <div class="banner-left">
          <div class="banner-kicker">ENERGY CONTROL CENTER</div>
          <h2 class="banner-title">能源可信数据空间 · 电力指挥大屏</h2>
          <p class="banner-desc">融合资产流、审批流、隐私计算流与链上存证流，统一呈现安全态势与数据协同状态。</p>
          <div class="banner-chips">
            <span class="banner-chip">实时监测</span>
            <span class="banner-chip">异常告警</span>
            <span class="banner-chip">链上追踪</span>
          </div>
        </div>
        <div class="banner-right">
          <svg viewBox="0 0 520 220" class="energy-svg" aria-hidden="true">
            <defs>
              <linearGradient id="bolt" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#6fffe9" />
                <stop offset="55%" stop-color="#34a6ff" />
                <stop offset="100%" stop-color="#ffffff" />
              </linearGradient>
              <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="rgba(48, 143, 255, 0.08)" />
                <stop offset="50%" stop-color="rgba(0, 255, 209, 0.55)" />
                <stop offset="100%" stop-color="rgba(48, 143, 255, 0.08)" />
              </linearGradient>
              <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <path d="M20 140 C80 40, 150 40, 210 120 S340 200, 410 92 S500 40, 510 140" fill="none" stroke="url(#wave)" stroke-width="3" filter="url(#glow)" />
            <path d="M56 170 C120 80, 170 70, 232 130 S360 210, 430 110 S485 55, 500 160" fill="none" stroke="rgba(0,255,209,.18)" stroke-width="1.5" />
            <g filter="url(#glow)" stroke-linecap="round" stroke-linejoin="round">
              <path d="M260 32 L220 108 H262 L238 182 L318 92 H276 Z" fill="url(#bolt)" stroke="rgba(255,255,255,.24)" stroke-width="1.5"/>
            </g>
            <g fill="none" stroke="rgba(255,255,255,.16)">
              <circle cx="78" cy="54" r="14"/>
              <circle cx="430" cy="56" r="14"/>
              <circle cx="456" cy="170" r="18"/>
              <circle cx="104" cy="168" r="18"/>
            </g>
            <g fill="rgba(0,255,209,.9)">
              <circle cx="78" cy="54" r="3.5"/>
              <circle cx="430" cy="56" r="3.5"/>
              <circle cx="456" cy="170" r="3.5"/>
              <circle cx="104" cy="168" r="3.5"/>
            </g>
          </svg>
        </div>
      </div>

      <div class="grid" style="margin-bottom:16px">
        <el-card class="card stat-card" style="grid-column: span 3"><div class="muted">在线状态</div><div class="kpi">{{ stats.online }}</div></el-card>
        <el-card class="card stat-card" style="grid-column: span 3"><div class="muted">风险等级</div><div class="kpi">{{ stats.risk }}</div></el-card>
        <el-card class="card stat-card" style="grid-column: span 3"><div class="muted">链上同步</div><div class="kpi">{{ stats.chain }}</div></el-card>
        <el-card class="card stat-card" style="grid-column: span 3"><div class="muted">任务数</div><div class="kpi">{{ stats.tasks }}</div></el-card>
      </div>

      <div class="grid">
        <el-card class="card" style="grid-column: span 7">
          <strong>安全概览</strong>
          <div class="muted" style="margin-top:12px;line-height:1.9">平台运行平稳，任务调度正常，链上同步稳定，核心模块访问受权限控制。</div>
        </el-card>
        <el-card class="card" style="grid-column: span 5">
          <strong>重点告警</strong>
          <div class="muted" style="margin-top:12px;line-height:1.9">当前无高危告警；若发现异常申请、任务重复提交或角色越权将自动留痕。</div>
        </el-card>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue';
import { reactive } from 'vue';
const stats = reactive({ online: '正常', risk: '低', chain: '同步中', tasks: 12 });
function reload() { stats.tasks += 1; }
</script>
