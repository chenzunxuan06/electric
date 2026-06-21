import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Dashboard from './views/Dashboard.vue';
import RoleManage from './views/RoleManage.vue';
import SystemInfo from './views/SystemInfo.vue';
import Assets from './views/Assets.vue';
import Approvals from './views/Approvals.vue';
import Chain from './views/Chain.vue';
import Logs from './views/Logs.vue';
import Privacy from './views/Privacy.vue';
import AdminWorkspace from './views/AdminWorkspace.vue';
import AnalystWorkspace from './views/AnalystWorkspace.vue';
import WorkspaceUser from './views/WorkspaceUser.vue';
import UsersManage from './views/admin/UsersManage.vue';
import RolesManage from './views/admin/RolesManage.vue';
import AssetsManage from './views/admin/AssetsManage.vue';
import AuditsManage from './views/admin/AuditsManage.vue';
import { getCurrentPermissions } from './utils/auth';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home, meta: { permission: 'home:view' } },
  { path: '/dashboard', component: Dashboard, meta: { permission: 'dashboard:view' } },
  { path: '/roles', component: RoleManage, meta: { permission: 'role:view' } },
  { path: '/system', component: SystemInfo, meta: { permission: 'system:view' } },
  { path: '/assets', component: Assets, meta: { permission: 'asset:view' } },
  { path: '/auth', redirect: '/approvals' },
  { path: '/approvals', component: Approvals, meta: { permission: 'approval:view' } },
  { path: '/chain', component: Chain, meta: { permission: 'chain:view' } },
  { path: '/logs', component: Logs, meta: { permission: 'audit:view' } },
  { path: '/privacy', component: Privacy, meta: { permission: 'privacy:view' } },
  { path: '/workspace/admin', component: AdminWorkspace },
  { path: '/workspace/analyst', component: AnalystWorkspace },
  { path: '/workspace/user', component: WorkspaceUser },
  { path: '/workspace/manager', component: Home },
  { path: '/workspace', redirect: '/home' },
  { path: '/admin/users', component: UsersManage, meta: { permission: 'user:view' } },
  { path: '/admin/roles', component: RolesManage, meta: { permission: 'role:view' } },
  { path: '/admin/assets', component: AssetsManage, meta: { permission: 'asset:view' } },
  { path: '/admin/audits', component: AuditsManage, meta: { permission: 'audit:view' } }
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const permissions = new Set(getCurrentPermissions());
  if (to.path !== '/login' && !token) return next('/login');
  if (to.meta?.permission && !permissions.has(to.meta.permission)) return next('/home');
  if (to.path === '/login' && token) return next('/home');
  next();
});

export default router;
