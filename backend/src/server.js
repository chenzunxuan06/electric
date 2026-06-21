import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'energy-demo-secret';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'data', 'db.json');
const DEFAULT_USERS = [
  { id: 'u001', username: 'admin', password: '123456', name: '系统管理员', role: 'admin' },
  { id: 'u002', username: 'manager', password: '123456', name: '业务负责人', role: 'manager' },
  { id: 'u003', username: 'analyst', password: '123456', name: '数据分析员', role: 'analyst' },
  { id: 'u004', username: 'user', password: '123456', name: '普通用户', role: 'user' }
];
const DEFAULT_ROLES = [
  { id: 'role-admin', key: 'admin', name: '管理员', desc: '系统全权限', perm: '用户管理 / 数据管理 / 审计 / 链上操作', modules: '工作台、资产、审批、日志、权限管理', permissions: ['home:view', 'dashboard:view', 'user:view', 'user:create', 'user:update', 'user:delete', 'role:view', 'role:create', 'role:update', 'role:delete', 'asset:view', 'asset:create', 'asset:update', 'asset:delete', 'approval:view', 'approval:approve', 'privacy:view', 'privacy:create', 'privacy:complete', 'chain:view', 'audit:view', 'system:view', 'report:view'] },
  { id: 'role-manager', key: 'manager', name: '业务负责人', desc: '审批授权', perm: '授权审批 / 查看报表', modules: '工作台、资产、审批、日志', permissions: ['home:view', 'dashboard:view', 'asset:view', 'approval:view', 'approval:approve', 'privacy:view', 'chain:view', 'audit:view', 'report:view'] },
  { id: 'role-analyst', key: 'analyst', name: '数据分析员', desc: '发起任务', perm: '隐私计算 / 智能问答 / 报告生成', modules: '工作台、资产、隐私计算、日志', permissions: ['home:view', 'dashboard:view', 'asset:view', 'privacy:view', 'privacy:create', 'privacy:complete', 'chain:view', 'audit:view', 'report:view'] },
  { id: 'role-user', key: 'user', name: '普通用户', desc: '浏览与申请', perm: '查看资产 / 提交申请', modules: '工作台、资产、隐私计算、日志', permissions: ['home:view', 'asset:view', 'privacy:view', 'chain:view', 'report:view', 'request:create'] }
];

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

function logBoot(msg) { console.log(`[boot] ${msg}`); }
function loadDB() {
  try {
    const db = JSON.parse(readFileSync(dbPath, 'utf-8'));
    db.users = Array.isArray(db.users) ? db.users : [...DEFAULT_USERS];
    db.assets = Array.isArray(db.assets) ? db.assets : [];
    db.chainRecords = Array.isArray(db.chainRecords) ? db.chainRecords : [];
    db.privacyTasks = Array.isArray(db.privacyTasks) ? db.privacyTasks : [];
    db.authRequests = Array.isArray(db.authRequests) ? db.authRequests : [];
    db.auditLogs = Array.isArray(db.auditLogs) ? db.auditLogs : [];
    db.financeMetrics = db.financeMetrics || {};
    db.roleDefs = Array.isArray(db.roleDefs) && db.roleDefs.length ? db.roleDefs : [...DEFAULT_ROLES];
    return db;
  } catch {
    const fresh = { users: [...DEFAULT_USERS], assets: [], chainRecords: [], privacyTasks: [], authRequests: [], auditLogs: [], financeMetrics: {}, roleDefs: [...DEFAULT_ROLES] };
    saveDB(fresh);
    return fresh;
  }
}
function saveDB(db) { writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8'); }
function now() { const d = new Date(); const pad = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; }
function createId(prefix) { return `${prefix}-${Date.now()}`; }
function buildPrivacyResult(scene) { if (scene === '负荷预测') return { summary: '已输出负荷预测结果，峰谷趋势清晰，建议采用削峰填谷策略。', indicators: [{ name: '预测准确率', value: '92.4%' }, { name: '峰值偏差', value: '-3.1%' }, { name: '调峰收益', value: '18.6万元' }] }; if (scene === '交易风险') return { summary: '已输出交易风险评估结果，发现2项中风险交易策略，建议加强保证金校验。', indicators: [{ name: '风险得分', value: '67/100' }, { name: '高风险项', value: '2' }, { name: '建议通过率', value: '81.2%' }] }; return { summary: '已输出新能源消纳评估结果，建议优先调度午间高出力时段。', indicators: [{ name: '消纳率', value: '89.7%' }, { name: '弃电率', value: '4.2%' }, { name: '收益提升', value: '12.8%' }] }; }
function authMiddleware(req, res, next) { const token = (req.headers.authorization || '').replace('Bearer ', ''); if (!token) return res.status(401).json({ message: '未登录或令牌缺失' }); try { req.user = jwt.verify(token, JWT_SECRET); next(); } catch { res.status(401).json({ message: '令牌无效或已过期' }); } }
function reportHtml(task, result) { const steps = (task.steps || ['任务提交', '审批联动', '隐私协同', '结果生成', '报告导出', '审计归档']).map(s => `<li>${s}</li>`).join(''); const indicators = (result.indicators || []).map(i => `<li>${i.name}：${i.value}</li>`).join(''); return `<!doctype html><html><head><meta charset="utf-8"><title>${task.name} 报告</title><style>body{font-family:Arial,'Microsoft YaHei',sans-serif;padding:24px;color:#0f172a}h1{margin:0 0 12px}.box{border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin:14px 0}.muted{color:#475569}li{margin:6px 0}</style></head><body><h1>${task.name} 分析报告</h1><div class="muted">场景：${task.scene}｜参与方：${task.participants}｜算法：${task.algorithm}</div><div class="box"><strong>结果摘要</strong><p>${result.summary}</p></div><div class="box"><strong>指标列表</strong><ul>${indicators}</ul></div><div class="box"><strong>执行步骤</strong><ol>${steps}</ol></div><div class="box"><strong>任务生命周期</strong><p>任务ID：${task.id}</p><p>提交时间：${task.submittedAt || '-'} </p><p>审批状态：${task.approvalStatus || 'pending'}</p><p>执行状态：${task.status}</p></div></body></html>`; }
function auditText(db, taskId) { return db.auditLogs.map(l => `${l.time} | ${l.actor} | ${l.action} | ${l.result}`).join('\n') + `\n\n关联任务：${taskId || '全部'}`; }
function auditHtml(db, taskId) { const rows = db.auditLogs.map(l => `<tr><td>${l.time}</td><td>${l.actor}</td><td>${l.action}</td><td>${l.result}</td></tr>`).join(''); return `<!doctype html><html><head><meta charset="utf-8"><title>审计记录</title><style>body{font-family:Arial,'Microsoft YaHei',sans-serif;padding:24px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #d1d5db;padding:8px;text-align:left}h1{margin:0 0 12px}.muted{color:#64748b}</style></head><body><h1>审计记录导出</h1><div class="muted">关联任务：${taskId || '全部'}</div><table><thead><tr><th>时间</th><th>操作者</th><th>操作</th><th>结果</th></tr></thead><tbody>${rows}</tbody></table></body></html>`; }

function getRoleDef(key) { const db = loadDB(); return (db.roleDefs || []).find(r => r.key === key) || null; }
function getPermissionsByRole(role) { const roleDef = getRoleDef(role); if (roleDef?.permissions?.length) return roleDef.permissions; const fallback = DEFAULT_ROLES.find(r => r.key === role); return fallback?.permissions || []; }

logBoot('server.js loaded');
logBoot('registering routes');

app.get('/api/ping', (_, res) => res.json({ ok: true, message: 'server alive', time: now() }));
app.get('/api/health', (_, res) => res.json({ ok: true, service: 'backend' }));
app.post('/api/auth/login', (req, res) => { console.log('[debug] login route hit', req.body); const { username, password } = req.body || {}; if (!username || !password) return res.status(400).json({ message: '用户名和密码不能为空' }); const db = loadDB(); const user = db.users.find(u => u.username === username && u.password === password); if (!user) return res.status(400).json({ message: '账号或密码错误' }); const permissions = getPermissionsByRole(user.role); const roleDef = getRoleDef(user.role) || DEFAULT_ROLES.find(r => r.key === user.role) || null; const token = jwt.sign({ id: user.id, username: user.username, name: user.name, role: user.role, permissions }, JWT_SECRET, { expiresIn: '2h' }); console.log('[debug] login success', user.username, user.role, permissions.join(',')); return res.json({ token, user: { id: user.id, username: user.username, name: user.name, role: user.role }, permissions, role: roleDef }); });
app.post('/api/auth/register', (req, res) => { console.log('[debug] register route hit', req.body); const { username, password, name, role = 'user' } = req.body || {}; if (!username || !password || !name) return res.status(400).json({ message: '用户名、密码、姓名不能为空' }); const db = loadDB(); if (db.users.some(u => u.username === username)) return res.status(400).json({ message: '用户名已存在' }); const user = { id: createId('u'), username, password, name, role }; db.users.push(user); saveDB(db); res.json({ message: '注册成功', user: { id: user.id, username: user.username, name: user.name, role: user.role } }); });
app.get('/api/roles', authMiddleware, (_, res) => { const db = loadDB(); res.json(db.roleDefs || []); });
app.post('/api/roles', authMiddleware, (req, res) => { const db = loadDB(); db.roleDefs = db.roleDefs || []; const item = { id: createId('role'), key: req.body?.key || req.body?.name?.toLowerCase(), permissions: req.body?.permissions || getPermissionsByRole(req.body?.key || req.body?.name?.toLowerCase()), ...req.body }; db.roleDefs.unshift(item); db.auditLogs.unshift({ id: createId('log'), action: '新增角色', actor: req.user.name, result: '成功', time: now() }); saveDB(db); res.json({ message: '角色已新增', item }); });
app.put('/api/roles/:id', authMiddleware, (req, res) => { const db = loadDB(); db.roleDefs = db.roleDefs || []; const item = db.roleDefs.find(r => r.id === req.params.id); if (!item) return res.status(404).json({ message: '角色不存在' }); Object.assign(item, req.body || {}); if (!item.key) item.key = (item.name || '').includes('管理员') ? 'admin' : (item.name || '').includes('负责人') ? 'manager' : (item.name || '').includes('分析') ? 'analyst' : 'user'; if (!Array.isArray(item.permissions)) item.permissions = getPermissionsByRole(item.key); db.auditLogs.unshift({ id: createId('log'), action: '编辑角色', actor: req.user.name, result: '成功', time: now() }); saveDB(db); res.json({ message: '角色已更新', item }); });
app.delete('/api/roles/:id', authMiddleware, (req, res) => { const db = loadDB(); db.roleDefs = db.roleDefs || []; const idx = db.roleDefs.findIndex(r => r.id === req.params.id); if (idx < 0) return res.status(404).json({ message: '角色不存在' }); const removed = db.roleDefs.splice(idx, 1)[0]; db.auditLogs.unshift({ id: createId('log'), action: '删除角色', actor: req.user.name, result: '成功', time: now() }); saveDB(db); res.json({ message: '角色已删除', removed }); });
app.get('/api/permissions/role-map', authMiddleware, (_, res) => { const db = loadDB(); const map = db.roleDefs.reduce((acc, role) => { const key = role.key || 'user'; acc[key] = { role, permissions: role.permissions?.length ? role.permissions : getPermissionsByRole(key) }; return acc; }, { admin: null, manager: null, analyst: null, user: null }); res.json({ rolePermissions: ROLE_PERMISSIONS, roleMap: map }); });
app.get('/api/users', authMiddleware, (_, res) => { const db = loadDB(); res.json(db.users.map(({ password, ...u }) => u)); });
app.post('/api/users', authMiddleware, (req, res) => { const { username, name, role = 'user', password = '123456' } = req.body || {}; const db = loadDB(); const user = { id: createId('u'), username, name, role, password }; db.users.unshift(user); db.auditLogs.unshift({ id: createId('log'), action: '新增用户', actor: req.user.name, result: '成功', time: now() }); saveDB(db); res.json({ message: '用户已新增', user: { id: user.id, username: user.username, name: user.name, role: user.role } }); });
app.put('/api/users/:id', authMiddleware, (req, res) => { const db = loadDB(); const user = db.users.find(u => u.id === req.params.id); if (!user) return res.status(404).json({ message: '用户不存在' }); Object.assign(user, req.body || {}); db.auditLogs.unshift({ id: createId('log'), action: '编辑用户', actor: req.user.name, result: '成功', time: now() }); saveDB(db); res.json({ message: '用户已更新', user: { id: user.id, username: user.username, name: user.name, role: user.role } }); });
app.delete('/api/users/:id', authMiddleware, (req, res) => { const db = loadDB(); const idx = db.users.findIndex(u => u.id === req.params.id); if (idx < 0) return res.status(404).json({ message: '用户不存在' }); const removed = db.users.splice(idx, 1)[0]; db.auditLogs.unshift({ id: createId('log'), action: '删除用户', actor: req.user.name, result: '成功', time: now() }); saveDB(db); res.json({ message: '用户已删除', removed }); });
app.get('/api/audits', authMiddleware, (_, res) => { const db = loadDB(); res.json(db.auditLogs); });
app.get('/api/assets', authMiddleware, (_, res) => { const db = loadDB(); res.json(db.assets); });
app.post('/api/assets', authMiddleware, (req, res) => { const { name, owner, sensitivity = '中', price = 0, type = 'power' } = req.body || {}; if (!name || !owner) return res.status(400).json({ message: '资产名称和归属方不能为空' }); const db = loadDB(); const asset = { id: createId('asset'), name, owner, sensitivity, status: '已登记', price, type }; db.assets.unshift(asset); db.chainRecords.unshift({ txHash: `0x${Date.now().toString(16)}`, action: '资产注册', actor: req.user.name, time: now(), detail: name }); db.auditLogs.unshift({ id: createId('log'), action: '新增资产', actor: req.user.name, result: '成功', time: now() }); saveDB(db); res.json({ message: '电力数据资产已写入', asset }); });
app.put('/api/assets/:id', authMiddleware, (req, res) => { const db = loadDB(); const asset = db.assets.find(a => a.id === req.params.id); if (!asset) return res.status(404).json({ message: '资产不存在' }); Object.assign(asset, req.body || {}); db.auditLogs.unshift({ id: createId('log'), action: '编辑资产', actor: req.user.name, result: '成功', time: now() }); saveDB(db); res.json({ message: '资产已更新', asset }); });
app.delete('/api/assets/:id', authMiddleware, (req, res) => { const db = loadDB(); const idx = db.assets.findIndex(a => a.id === req.params.id); if (idx < 0) return res.status(404).json({ message: '资产不存在' }); const removed = db.assets.splice(idx, 1)[0]; db.auditLogs.unshift({ id: createId('log'), action: '删除资产', actor: req.user.name, result: '成功', time: now() }); saveDB(db); res.json({ message: '资产已删除', removed }); });
app.get('/api/chain/records', authMiddleware, (_, res) => { const db = loadDB(); res.json(db.chainRecords); });
app.get('/api/privacy/tasks', authMiddleware, (_, res) => { const db = loadDB(); res.json(db.privacyTasks); });
app.get('/api/finance/metrics', authMiddleware, (_, res) => { const db = loadDB(); res.json(db.financeMetrics); });
app.get('/api/auth/requests', authMiddleware, (_, res) => { const db = loadDB(); res.json(db.authRequests); });
app.patch('/api/auth/requests/:id', authMiddleware, (req, res) => { const { status } = req.body || {}; const db = loadDB(); const item = db.authRequests.find(i => i.id === req.params.id); if (!item) return res.status(404).json({ message: '申请不存在' }); item.status = status || item.status; db.auditLogs.unshift({ id: createId('log'), action: `授权申请${status === 'approved' ? '通过' : '拒绝'}`, actor: req.user.name, result: '成功', time: now() }); saveDB(db); res.json({ message: '审批已更新', item }); });
app.post('/api/auth/requests', authMiddleware, (req, res) => { const { applicant, asset } = req.body || {}; if (!applicant || !asset) return res.status(400).json({ message: '申请方和资产名称不能为空' }); const db = loadDB(); const item = { id: createId('ar'), applicant, asset, status: 'pending', time: now() }; db.authRequests.unshift(item); db.auditLogs.unshift({ id: createId('log'), action: '授权申请提交', actor: req.user.name, result: '成功', time: now() }); saveDB(db); res.json({ message: '授权申请已提交', item }); });
app.get('/api/audit/logs', authMiddleware, (_, res) => { const db = loadDB(); res.json(db.auditLogs); });
app.post('/api/privacy/run', authMiddleware, (req, res) => { const { taskName, scene = '新能源消纳', participants = '电网公司,发电企业', algorithm = '联邦学习' } = req.body || {}; const db = loadDB(); const result = buildPrivacyResult(scene); const task = { id: createId('priv'), name: taskName || '未命名任务', scene, participants, algorithm, status: 'running', progress: 12, submittedAt: now(), approvalStatus: 'pending', summary: result.summary, indicators: result.indicators, resultText: result.summary, steps: ['任务提交', '审批联动', '隐私协同', '结果生成', '报告导出', '审计归档'] }; db.privacyTasks.unshift(task); db.chainRecords.unshift({ txHash: `0x${Date.now().toString(16)}`, action: '隐私计算任务提交', actor: req.user.name, time: now(), detail: task.name }); db.auditLogs.unshift({ id: createId('log'), action: '提交隐私任务', actor: req.user.name, result: '成功', time: now() }); saveDB(db); res.json({ taskId: task.id, taskName: task.name, status: task.status, progress: task.progress, message: '隐私计算任务已提交，正在调度执行', summary: result.summary, indicators: result.indicators, steps: task.steps, task }); });
app.get('/api/privacy/tasks/:id/result', authMiddleware, (req, res) => { const db = loadDB(); const task = db.privacyTasks.find(t => t.id === req.params.id); if (!task) return res.status(404).json({ message: '任务不存在' }); const result = task.indicators || buildPrivacyResult(task.scene || '新能源消纳').indicators; res.json({ taskId: task.id, name: task.name, scene: task.scene, participants: task.participants, algorithm: task.algorithm, approvalStatus: task.approvalStatus || 'pending', summary: task.summary || task.resultText || '暂无结果', indicators: result, status: task.status, progress: task.progress, steps: task.steps || ['任务提交', '审批联动', '隐私协同', '结果生成', '报告导出', '审计归档'], submittedAt: task.submittedAt || '-' }); });
app.post('/api/privacy/tasks/:id/complete', authMiddleware, (req, res) => { const db = loadDB(); const task = db.privacyTasks.find(t => t.id === req.params.id); if (!task) return res.status(404).json({ message: '任务不存在' }); const result = buildPrivacyResult(task.scene || '新能源消纳'); task.status = 'completed'; task.progress = 100; task.summary = result.summary; task.indicators = result.indicators; task.resultText = result.summary; db.auditLogs.unshift({ id: createId('log'), action: '隐私任务完成', actor: req.user.name, result: '成功', time: now() }); saveDB(db); res.json({ message: '任务已完成', task, ...result }); });
app.get('/api/privacy/tasks/:id/report', authMiddleware, (req, res) => { const db = loadDB(); const task = db.privacyTasks.find(t => t.id === req.params.id); if (!task) return res.status(404).send('任务不存在'); const result = task.indicators || buildPrivacyResult(task.scene || '新能源消纳'); const html = reportHtml(task, { summary: task.summary || task.resultText || buildPrivacyResult(task.scene || '新能源消纳').summary, indicators: result }); res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(task.name)}_report.html"`); res.send(html); });
app.get('/api/privacy/tasks/:id/audit', authMiddleware, (req, res) => { const db = loadDB(); res.setHeader('Content-Type', 'text/plain; charset=utf-8'); res.setHeader('Content-Disposition', `attachment; filename="privacy_audit_${req.params.id}.txt"`); res.send(auditText(db, req.params.id)); });
app.get('/api/privacy/tasks/:id/audit-html', authMiddleware, (req, res) => { const db = loadDB(); res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.setHeader('Content-Disposition', `attachment; filename="privacy_audit_${req.params.id}.html"`); res.send(auditHtml(db, req.params.id)); });
function buildAiReply(message = '', context = {}) {
  const text = String(message || '').trim();
  const stats = context.stats || {};
  const role = context.role || 'user';
  const prefix = role === 'admin' ? '管理员视角' : role === 'manager' ? '业务负责人视角' : role === 'analyst' ? '分析员视角' : '用户视角';
  if (!text) return `${prefix}：请先输入问题，我可以帮你总结当前工作台、解释权限或给出下一步操作建议。`;
  if (/总结|概览|状态|工作台/.test(text)) {
    return `${prefix}：当前工作台共有 ${stats.dataAssets || 0} 个资产、${stats.authRequests || 0} 条待审批、${stats.privacyTasks || 0} 个隐私任务、${stats.chainRecords || 0} 条链上记录。建议优先处理待审批和高风险告警。`;
  }
  if (/权限|角色|用户管理/.test(text)) {
    return `${prefix}：当前权限体系按角色分权。管理员可管理用户、角色、资产和审计；业务负责人侧重审批；分析员侧重任务；普通用户侧重查看与申请。`;
  }
  if (/隐私|任务|计算/.test(text)) {
    return `${prefix}：隐私计算中心支持任务发起、结果导出和报告归档。你可以先输入场景、参与方和算法，我会给出执行建议。`;
  }
  return `${prefix}：已收到你的问题“${text}”。建议先明确目标、涉及数据范围、权限边界和输出形式，再结合资产、审批、隐私计算与存证记录进行分析。`;
}

function buildAiMessages(message = '', context = {}) {
  const stats = context.stats || {};
  const role = context.role || 'user';
  const roleLabel = role === 'admin' ? '管理员' : role === 'manager' ? '业务负责人' : role === 'analyst' ? '数据分析员' : '普通用户';
  return [
    { role: 'system', content: '你是能源可信数据空间的工作台助手。请用中文、简洁、专业、面向企业后台场景回答问题。优先结合页面统计数据和权限信息给出建议，不要编造不存在的功能。' },
    { role: 'system', content: `当前角色：${roleLabel}。当前统计：资产 ${stats.dataAssets || 0}，待审批 ${stats.authRequests || 0}，隐私任务 ${stats.privacyTasks || 0}，链上记录 ${stats.chainRecords || 0}。` },
    { role: 'user', content: String(message || '').trim() },
  ];
}

async function callOpenAiCompatibleChat(message, context = {}) {
  const apiKey = process.env.AI_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.DOUBAO_API_KEY || '';
  const provider = (process.env.AI_PROVIDER || 'mock').toLowerCase();
  if (!apiKey || provider === 'mock') return null;

  const baseUrl = process.env.AI_BASE_URL || (provider === 'deepseek' ? 'https://api.deepseek.com' : 'https://ark.cn-beijing.volces.com/api/v3');
  const model = process.env.AI_MODEL || (provider === 'deepseek' ? 'deepseek-chat' : 'doubao-seed-1.6');
  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
  const body = {
    model,
    messages: buildAiMessages(message, context),
    temperature: 0.7,
    stream: false
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`AI API 请求失败 ${response.status}: ${detail}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || data?.output_text || data?.reply || '';
}

app.post('/api/ai/chat', authMiddleware, async (req, res) => {
  const { message, context } = req.body || {};
  try {
    const remoteReply = await callOpenAiCompatibleChat(message, context);
    const answer = remoteReply || buildAiReply(message, context);
    res.json({ reply: answer, answer, content: answer, provider: remoteReply ? (process.env.AI_PROVIDER || 'remote') : 'mock' });
  } catch (error) {
    const answer = buildAiReply(message, context);
    res.status(200).json({ reply: answer, answer, content: answer, provider: 'fallback', warning: error.message });
  }
});

app.post('/api/llm/chat', authMiddleware, (req, res) => { const { message } = req.body || {}; res.json({ answer: buildAiReply(message) }); });
app.post('/api/llm/report', authMiddleware, (req, res) => { const { subject } = req.body || {}; res.json({ title: `${subject || '能源数据'}分析报告`, content: '报告已生成，包含风险、收益、数据流通效率和建议。' }); });

app.listen(PORT, () => {
  logBoot(`routes registered on port ${PORT}`);
  logBoot('GET /api/ping ready');
  logBoot('POST /api/auth/login ready');
  console.log(`Backend running on http://localhost:${PORT}`);
});
