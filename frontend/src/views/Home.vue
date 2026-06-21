<template>
  <MainLayout ref="layoutRef">
    <div class="page">
      <div class="header home-header">
        <div class="brand">
          <div class="logo">SD</div>
          <div>
            <h1 class="h1">能源可信数据空间工作台</h1>
            <div class="muted">按角色分权展示不同能力</div>
          </div>
        </div>
        <div class="header-right">
          <div class="status-panel card">
            <div class="status-item"><span class="status-dot green"></span><span>平台在线</span></div>
            <div class="status-item"><span class="status-dot blue"></span><span>风险低</span></div>
            <div class="status-item"><span class="status-dot cyan"></span><span>链上同步</span></div>
            <div class="status-item"><span class="status-dot amber"></span><span>任务 {{ stats.privacyTasks }}</span></div>
          </div>
          <el-button class="mobile-menu-btn" v-if="isMobile" @click="openDrawer">菜单</el-button>
          <div class="muted header-user">当前账号：{{ user.name }} | 角色：{{ user.role }}</div>
        </div>
      </div>

      <div class="mobile-quick-grid">
        <el-button
          v-for="item in quickLinks"
          :key="item.label"
          class="mobile-quick-card mobile-module-card"
          @click="$router.push(item.path)"
        >
          <span class="mobile-module-icon">{{ item.icon }}</span>
          <span class="mobile-module-text">
            <span class="mobile-module-title">{{ item.label }}</span>
            <span class="mobile-module-sub">{{ item.sub }}</span>
          </span>
        </el-button>
      </div>

      <div class="hero-banner">
        <el-card class="card hero-panel">
          <div>
            <div class="muted">角色概览</div>
            <h2 class="hero-title">{{ roleTitle }}工作台</h2>
            <div class="muted">{{ roleDesc }}</div>
          </div>
          <div class="hero-stat desktop-quick-actions">
            <el-button
              v-for="chip in roleButtons"
              :key="chip.label"
              class="hero-chip-btn"
              :type="chip.type"
              @click="$router.push(chip.path)"
            >
              {{ chip.label }}
            </el-button>
          </div>
        </el-card>
        <el-card class="card summary-card">
          <div class="section-title"><strong>今日概览</strong></div>
          <div class="muted summary-list">
            <div>今日新增资产：{{ stats.dataAssets }}</div>
            <div>待审批：{{ stats.authRequests }}</div>
            <div>链上记录：{{ stats.chainRecords }}</div>
            <div>风险告警：{{ stats.riskAlerts }}</div>
          </div>
        </el-card>
      </div>

      <div class="grid" style="margin-bottom: 16px">
        <el-card class="card stat-card" style="grid-column: span 3"><div class="muted stat-label">资产总量</div><div class="kpi stat-value">{{ stats.dataAssets }}</div></el-card>
        <el-card class="card stat-card" style="grid-column: span 3"><div class="muted stat-label">待审批</div><div class="kpi stat-value">{{ stats.authRequests }}</div></el-card>
        <el-card class="card stat-card" style="grid-column: span 3"><div class="muted stat-label">任务数</div><div class="kpi stat-value">{{ stats.privacyTasks }}</div></el-card>
        <el-card class="card stat-card" style="grid-column: span 3"><div class="muted stat-label">链上记录</div><div class="kpi stat-value">{{ stats.chainRecords }}</div></el-card>
      </div>

      <div class="grid">
        <el-card class="card" style="grid-column: span 7">
          <div class="section-title"><strong>资产登记</strong></div>
          <div v-if="canWriteAsset" class="input-row" style="margin: 12px 0">
            <el-input v-model="assetForm.name" placeholder="资产名称" />
            <el-input v-model="assetForm.owner" placeholder="归属方" />
            <el-select v-model="assetForm.sensitivity" placeholder="敏感级别" style="width: 140px">
              <el-option label="低" value="低" />
              <el-option label="中" value="中" />
              <el-option label="高" value="高" />
            </el-select>
            <el-input v-model="assetForm.price" placeholder="价格" style="width: 120px" />
            <el-button type="primary" @click="registerAsset">写入电力数据</el-button>
          </div>
          <el-alert v-else title="当前角色无写入权限，仅可查看和申请使用数据。" type="warning" :closable="false" style="margin: 12px 0" />
          <el-table :data="assets" size="small" height="240" style="margin-top: 12px">
            <el-table-column prop="name" label="资产名称" />
            <el-table-column prop="owner" label="归属方" />
            <el-table-column prop="type" label="类型" width="100" />
            <el-table-column prop="sensitivity" label="敏感级别" width="100" />
            <el-table-column prop="status" label="状态" width="100" />
            <el-table-column prop="price" label="价格" width="100" />
          </el-table>
        </el-card>

        <el-card class="card" style="grid-column: span 5">
          <div class="section-title"><strong>我的申请 / 待办</strong></div>
          <div class="input-row" style="margin: 12px 0">
            <el-input v-model="applyForm.applicant" placeholder="申请方" />
            <el-input v-model="applyForm.asset" placeholder="申请资产" />
            <el-button type="success" @click="submitRequest">提交申请</el-button>
          </div>
          <el-table :data="authRequests" size="small" height="240">
            <el-table-column prop="time" label="申请时间" width="150" />
            <el-table-column prop="applicant" label="申请方" />
            <el-table-column prop="asset" label="资产" />
            <el-table-column prop="status" label="状态" width="90" />
          </el-table>
        </el-card>

        <el-card class="card" style="grid-column: span 6">
          <strong>隐私计算任务</strong>
          <div class="input-row" style="margin: 12px 0">
            <el-input v-model="taskName" placeholder="输入任务名称" />
            <el-button type="success" @click="$router.push('/privacy')">进入隐私计算中心</el-button>
          </div>
          <el-table :data="privacyTasks" size="small" height="220">
            <el-table-column prop="name" label="任务" />
            <el-table-column prop="status" label="状态" width="120" />
            <el-table-column prop="progress" label="进度" width="120" />
          </el-table>
        </el-card>

        <el-card class="card" style="grid-column: span 6">
          <strong>区块链存证记录</strong>
          <el-table :data="chainRecords" size="small" height="220" style="margin-top: 12px">
            <el-table-column prop="time" label="时间" width="170" />
            <el-table-column prop="action" label="动作" width="120" />
            <el-table-column prop="detail" label="对象" />
            <el-table-column prop="txHash" label="哈希" width="120" />
          </el-table>
        </el-card>

        <el-card class="card module-panel" style="grid-column: span 6">
          <div class="section-title"><strong>模块入口</strong></div>
          <div class="module-grid">
            <el-button
              v-for="item in quickLinks"
              :key="item.label"
              class="module-card"
              @click="$router.push(item.path)"
            >
              <span class="module-icon">{{ item.icon }}</span>
              <span class="module-copy">
                <span class="module-title">{{ item.label }}</span>
                <span class="module-sub">{{ item.sub }}</span>
              </span>
            </el-button>
          </div>
        </el-card>

        <el-card class="card ai-card" style="grid-column: span 6">
          <div class="section-title"><strong>AI 回复助手</strong><span class="muted section-muted">在线</span></div>
          <div class="ai-panel">
            <div class="ai-toolbar">
              <el-button size="small" @click="clearAiChat">清空聊天</el-button>
              <el-button v-for="prompt in quickPrompts" :key="prompt" size="small" plain @click="queuePrompt(prompt)">{{ prompt }}</el-button>
            </div>
            <div class="ai-chat" ref="aiChatRef">
              <div v-for="(msg, index) in aiMessages" :key="`${msg.role}-${index}`" class="ai-message" :class="msg.role">
                <div class="ai-bubble">
                  <div class="ai-role">{{ msg.role === 'user' ? '我' : 'AI' }}</div>
                  <div class="ai-text">{{ msg.content }}</div>
                </div>
              </div>
            </div>
            <div class="ai-input-row">
              <el-input v-model="aiPrompt" type="textarea" :rows="3" placeholder="输入问题，例如：帮我总结当前工作台的使用情况" @keydown.enter.exact.prevent="sendAiReply" />
              <div class="input-row ai-actions">
                <el-button @click="queuePrompt('请总结当前工作台的关键状态')">一键总结</el-button>
                <el-button type="primary" :loading="aiLoading" @click="sendAiReply">发送给 AI</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import MainLayout from '../layouts/MainLayout.vue';
import http from '../api/http';
import { hasPermission as can } from '../utils/auth';

const layoutRef = ref(null);
const isMobile = computed(() => window.innerWidth < 768);
const user = ref(JSON.parse(localStorage.getItem('user') || '{"name":"管理员","role":"admin"}'));
const stats = reactive({ dataAssets: 0, authRequests: 0, privacyTasks: 0, chainRecords: 0, riskAlerts: 0 });
const assets = ref([]);
const authRequests = ref([]);
const privacyTasks = ref([]);
const chainRecords = ref([]);
const taskName = ref('');
const assetForm = reactive({ name: '', owner: '', sensitivity: '中', price: '' });
const applyForm = reactive({ applicant: '', asset: '' });
const aiPrompt = ref('');
const aiLoading = ref(false);
const aiChatRef = ref(null);
const aiMessages = ref([
  { role: 'assistant', content: '你好，我可以帮你总结工作台状态、解释指标，或者根据当前页面内容给出建议。' },
]);
const quickPrompts = [
  '总结当前工作台',
  '解释权限中心和用户管理的区别',
  '帮我分析当前待审批情况',
  '给我一个隐私计算任务建议',
];

const roleTitle = computed(() => {
  const roleMap = { admin: '管理员', operator: '运营人员', auditor: '审计人员', user: '普通用户' };
  return roleMap[user.value?.role] || '用户';
});

const roleDesc = computed(() => {
  const descMap = {
    admin: '查看全局资产、审批与审计能力，统筹平台运行。',
    operator: '负责资产登记、权限流转和日常运营处理。',
    auditor: '关注审计、存证与风险告警，保障合规。',
    user: '查看可用资产并发起申请，按权限使用平台能力。',
  };
  return descMap[user.value?.role] || '按角色展示不同模块能力。';
});

const quickLinks = [
  { label: '资产中心', sub: '登记与管理', icon: 'A', path: '/assets', type: 'primary' },
  { label: '权限中心', sub: '授权与审批', icon: 'P', path: '/auth', type: 'success' },
  { label: '隐私计算', sub: '任务与结果', icon: 'C', path: '/privacy', type: 'warning' },
  { label: '数据目录', sub: '检索与发现', icon: 'D', path: '/catalog', type: 'info' },
];

const roleButtons = computed(() => {
  const base = quickLinks.slice(0, 3);
  return user.value?.role === 'admin' ? [...base, { label: '用户管理', sub: '账号与角色', icon: 'U', path: '/admin/users', type: 'info' }] : base;
});
const canWriteAsset = computed(() => can('asset:create'));

function openDrawer() {
  layoutRef.value?.openDrawer?.();
}

async function loadDashboard() {
  const [{ data: assetData }, { data: requestData }, { data: privacyData }, { data: chainData }] = await Promise.all([
    http.get('/assets'),
    http.get('/auth/requests'),
    http.get('/privacy/tasks'),
    http.get('/chain/records'),
  ]);

  assets.value = Array.isArray(assetData) ? assetData : [];
  authRequests.value = Array.isArray(requestData) ? requestData : [];
  privacyTasks.value = Array.isArray(privacyData) ? privacyData : [];
  chainRecords.value = Array.isArray(chainData) ? chainData : [];

  stats.dataAssets = assets.value.length;
  stats.authRequests = authRequests.value.length;
  stats.privacyTasks = privacyTasks.value.length;
  stats.chainRecords = chainRecords.value.length;
  stats.riskAlerts = Math.max(0, chainRecords.value.length - 1);
}

async function registerAsset() {
  if (!assetForm.name || !assetForm.owner) {
    ElMessage.warning('请先填写资产名称和归属方');
    return;
  }
  await http.post('/assets', assetForm);
  ElMessage.success('资产已写入');
  Object.assign(assetForm, { name: '', owner: '', sensitivity: '中', price: '' });
  await loadDashboard();
}

async function submitRequest() {
  if (!applyForm.applicant || !applyForm.asset) {
    ElMessage.warning('请先填写申请方和申请资产');
    return;
  }
  await http.post('/auth/requests', applyForm);
  ElMessage.success('申请已提交');
  Object.assign(applyForm, { applicant: '', asset: '' });
  await loadDashboard();
}

function pushAiMessage(role, content) {
  aiMessages.value.push({ role, content });
  requestAnimationFrame(() => {
    const el = aiChatRef.value;
    if (el) el.scrollTop = el.scrollHeight;
  });
}

function clearAiChat() {
  aiMessages.value = [{ role: 'assistant', content: '聊天已清空，你可以继续提问。' }];
}

function queuePrompt(prompt) {
  aiPrompt.value = prompt;
  sendAiReply();
}

async function sendAiReply() {
  const prompt = aiPrompt.value.trim();
  if (!prompt) {
    ElMessage.warning('请先输入问题');
    return;
  }
  pushAiMessage('user', prompt);
  aiPrompt.value = '';
  aiLoading.value = true;
  try {
    const { data } = await http.post('/ai/chat', {
      message: prompt,
      context: {
        role: user.value?.role,
        stats: { ...stats },
      },
    });
    const reply = typeof data === 'string' ? data : (data?.reply || data?.message || data?.content || 'AI 暂时没有返回内容。');
    const parts = String(reply).split(/(?<=。|！|？)/).filter(Boolean);
    let draft = '';
    for (const part of parts.length ? parts : [reply]) {
      draft += part;
      pushAiMessage('assistant', draft);
      await new Promise((resolve) => setTimeout(resolve, 180));
    }
  } catch (error) {
    const fallback = `我先根据当前页面给你一个简要建议：平台当前有 ${stats.dataAssets} 个资产、${stats.authRequests} 条待审批、${stats.privacyTasks} 个任务和 ${stats.chainRecords} 条存证记录。你可以继续让我总结、生成说明或回答操作问题。`;
    pushAiMessage('assistant', fallback);
  } finally {
    aiLoading.value = false;
  }
}

onMounted(loadDashboard);
</script>

<style scoped>
.home-header {
  align-items: flex-start;
}

.hero-banner {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.hero-panel {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.header-user {
  color: rgba(234, 244, 255, 0.72);
}

.summary-card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(7, 15, 34, 0.7));
}

.ai-card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(7, 15, 34, 0.72));
}

.ai-panel {
  display: grid;
  gap: 12px;
}

.ai-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ai-chat {
  max-height: 260px;
  overflow: auto;
  display: grid;
  gap: 10px;
  padding-right: 4px;
}

.ai-message {
  display: flex;
}

.ai-message.user {
  justify-content: flex-end;
}

.ai-message.assistant {
  justify-content: flex-start;
}

.ai-bubble {
  max-width: 100%;
  border-radius: 16px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.ai-message.user .ai-bubble {
  background: rgba(52, 166, 255, 0.18);
  border-color: rgba(52, 166, 255, 0.28);
}

.ai-role {
  font-size: 12px;
  opacity: 0.72;
  margin-bottom: 4px;
}

.ai-text {
  line-height: 1.7;
  white-space: pre-wrap;
}

.ai-input-row {
  display: grid;
  gap: 10px;
}

.ai-actions {
  justify-content: space-between;
}

.summary-list {
  display: grid;
  gap: 10px;
  margin-top: 12px;
  color: rgba(244, 249, 255, 0.88);
}

.section-muted {
  color: rgba(228, 239, 255, 0.72);
}

.stat-label {
  color: rgba(228, 239, 255, 0.72);
}

.stat-value {
  color: #ffffff;
}

.hero-title {
  margin: 8px 0 10px;
  font-size: 28px;
}

.hero-stat {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

:deep(.el-button.hero-chip-btn),
:deep(.el-button.module-card),
:deep(.el-button.mobile-quick-card) {
  background: #0f172a;
  border-color: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

:deep(.el-button.hero-chip-btn:hover),
:deep(.el-button.module-card:hover),
:deep(.el-button.mobile-quick-card:hover) {
  background: #111c33;
  border-color: rgba(255, 255, 255, 0.14);
}

.hero-chip-btn,
.module-card {
  min-height: 56px;
  background: #0f172a;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.module-card {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 14px 16px;
}

.module-icon,
.mobile-module-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-weight: 700;
}

.module-copy,
.mobile-module-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  color: #ffffff;
}

.module-title,
.mobile-module-title {
  font-weight: 700;
  color: #ffffff;
}

.module-sub,
.mobile-module-sub {
  font-size: 12px;
  opacity: 0.92;
  color: #ffffff;
}

.mobile-quick-grid {
  display: none;
  gap: 10px;
  margin-bottom: 16px;
}

.mobile-quick-card {
  width: 100%;
  justify-content: flex-start;
  color: #ffffff;
}

@media (max-width: 900px) {
  .hero-banner {
    grid-template-columns: 1fr;
  }

  .hero-panel {
    flex-direction: column;
    align-items: flex-start;
  }

  .desktop-quick-actions {
    justify-content: flex-start;
  }

  .module-grid {
    grid-template-columns: 1fr;
  }

  .ai-actions {
    flex-direction: column;
  }

  .ai-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .mobile-quick-grid {
    display: grid;
  }
}
</style>
