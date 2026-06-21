# 面向能源可信数据空间的多方安全协同平台

## 启动方式

### 后端
```bash
cd backend
npm install
npm run dev
```

### 前端
```bash
cd frontend
npm install
npm run dev
```

默认账号
- 用户名: `admin`
- 密码: `123456`

## 功能
- 登录鉴权
- 首页大屏
- 数据资产管理
- 区块链存证记录
- 授权申请展示
- 审计日志展示
- 隐私计算任务展示
- 智能问答
- 财务测算
- 安全态势大屏
- 权限管理
- 项目说明页

## 接口
- `POST /api/auth/login`
- `GET /api/dashboard/stats`
- `GET /api/assets`
- `GET /api/chain/records`
- `GET /api/auth/requests`
- `GET /api/audit/logs`
- `GET /api/privacy/tasks`
- `GET /api/finance/metrics`
- `POST /api/llm/chat`
- `POST /api/privacy/run`
