# BizMate - Phase 1 Tasks (MVP, 8周)

> 审阅后更新版（2026-03-29）
> 变化：砍掉Stripe支付（前6月免费）、机票监控提前到P0、微信获客提前到P0
> 每个Task可以直接交给Cursor执行。

---

## Week 1: 项目脚手架 + 数据库 + Auth

### Task 1.1: 项目初始化
```
创建Next.js 15项目（App Router, TypeScript, TailwindCSS v4, src目录）。
安装依赖：@supabase/supabase-js, @supabase/ssr, next-intl, @anthropic-ai/sdk, lucide-react
初始化shadcn/ui，添加组件：button, card, input, textarea, badge, tabs, dialog, sheet,
separator, avatar, dropdown-menu, calendar, select, label, switch, sonner
按照 02-TECH-ARCHITECTURE.md 中的文件结构创建所有目录。
注意：本阶段不需要Stripe，前6个月全功能免费。
```

### Task 1.2: i18n国际化搭建
```
配置next-intl：
- src/i18n/routing.ts: locales=['zh','en'], defaultLocale='zh', localePrefix='as-needed'
- src/i18n/request.ts: getRequestConfig
- src/i18n/navigation.ts: createNavigation
- src/middleware.ts: 使用next-intl的createMiddleware
- messages/en.json 和 messages/zh.json: 参考PRD中的功能复制翻译内容
- src/app/[locale]/layout.tsx: 用NextIntlClientProvider包裹
- 创建locale-switcher组件（中/EN切换按钮）
验证：访问 / 显示中文，访问 /en 显示英文
```

### Task 1.3: Supabase配置 + 数据库Schema
```
1. 在supabase/migrations/下创建SQL迁移文件，包含02-TECH-ARCHITECTURE.md中的完整Schema
   包括：profiles, companies, subscriptions, conversations, messages,
   compliance_deadlines, documents, knowledge_documents, job_listings,
   gp_practices, flight_alerts, flight_prices
2. 运行迁移
3. 创建src/lib/supabase/client.ts（浏览器端）和src/lib/supabase/server.ts（服务端）
4. 运行 npx supabase gen types typescript 生成类型文件到 src/lib/supabase/types.ts
5. 配置.env.local环境变量
验证：Supabase Dashboard中可以看到所有表，RLS策略已生效
```

### Task 1.4: Auth认证
```
配置Supabase Auth：
1. 启用Email + Google OAuth provider
2. 创建(auth)/login/page.tsx: Email/Password登录 + Google登录按钮
3. 创建(auth)/register/page.tsx: 注册页面
4. 在middleware.ts中添加Auth检查：(dashboard)路由需要登录
5. 创建hooks/use-user.ts: 获取当前用户状态的hook
6. Auth layout: 居中卡片布局，顶部BizMate Logo
验证：可以注册新用户、登录、跳转到dashboard
```

### Task 1.5: Dashboard Layout
```
创建(dashboard)/layout.tsx：
- 左侧Sidebar：BizMate Logo, 导航链接：
  - AI对话（MessageSquare图标）
  - 计算器（Calculator图标）
  - 合规日历（Calendar图标）
  - 找GP（Stethoscope图标）
  - 机票监控（Plane图标）
  - 设置（Settings图标）
  使用lucide-react图标
- 顶部Header：页面标题, locale-switcher(中/EN), 用户头像dropdown（设置/退出）
- 移动端：Sheet组件做侧滑菜单，hamburger按钮
- 响应式：md以下隐藏sidebar
验证：登录后看到完整dashboard布局，导航切换正常，移动端侧滑正常
```

---

## Week 2: 企业Onboarding + NZ规则引擎

### Task 2.1: 企业Onboarding
```
(dashboard)/onboarding/page.tsx:
多步骤引导表单（Step 1-4）：
1. 公司基本信息：名称、NZBN（选填）、entity_type（company/sole_trader/partnership/trust）
2. 税务信息：GST号码（选填）、GST申报频率（monthly/2monthly/6monthly/not_registered）、Balance Date
3. 雇员信息：员工数量、是否参加KiwiSaver
4. 行业：从预设列表选择（餐饮/零售/建筑/进出口/IT/房地产/其他）
完成后创建company记录。
新用户首次登录自动跳转到onboarding。
用shadcn的Card + 步骤指示器。
验证：完成4步后，数据库companies表有记录
```

### Task 2.2: GST规则引擎 + 计算器
```
1. src/lib/nz-rules/gst.ts:
   - GST_RATE = 0.15, REGISTRATION_THRESHOLD = 60000
   - addGst(exclusiveAmount) -> {gstAmount, totalInclGst, totalExclGst}
   - removeGst(inclusiveAmount) -> {gstAmount, totalInclGst, totalExclGst}
   全部硬编码，不依赖LLM
2. src/components/calculators/gst-calculator.tsx:
   - 输入金额，选择"加GST"或"去GST"，实时显示结果
3. (dashboard)/calculators/page.tsx: Tabs切换不同计算器
验证：输入100加GST=115(GST:15), 输入115去GST=100(GST:15)
```

### Task 2.3: PAYE规则引擎 + 计算器
```
1. src/lib/nz-rules/paye.ts:
   阶梯税率: $0-15600=10.5%, $15601-53500=17.5%, $53501-78100=30%, $78101-180000=33%, $180001+=39%
   ACC Earner Levy: 1.60%, 上限$142,283
2. src/components/calculators/paye-calculator.tsx:
   输入年薪 -> 年/月/周PAYE、ACC、实际税率、到手工资、阶梯明细
验证：年薪$65,000 -> PAYE约$10,270，实际税率约15.8%
```

### Task 2.4: KiwiSaver计算器
```
1. src/lib/nz-rules/kiwisaver.ts: 员工3/4/6/8/10%, 雇主最低3%, ESCT
2. src/components/calculators/kiwisaver-calculator.tsx
验证：$65,000 @ 3%+3% = 员工$1,950 + 雇主$1,950
```

---

## Week 3: 合规日历 + AI对话引擎

### Task 3.1: 合规截止日引擎 + 日历页面
```
1. src/lib/nz-rules/compliance-dates.ts:
   generateComplianceDates(company) -> ComplianceDeadline[]
   生成：GST Return, PAYE Filing, Annual Return, Provisional Tax, ACC levy
2. Onboarding完成后自动生成并存入compliance_deadlines表
3. (dashboard)/calendar/page.tsx:
   月视图，颜色编码（红=逾期, 黄=7天内, 绿=已完成），可标记完成
验证：Onboarding后日历显示未来12个月截止日
```

### Task 3.2: Claude API + System Prompt + Tools
```
1. src/lib/ai/client.ts: Anthropic client
2. src/lib/ai/system-prompt.ts: 双语prompt，角色+规则+免责声明
3. src/lib/ai/tools.ts: calculate_gst, calculate_paye, calculate_kiwisaver, get_compliance_dates, search_knowledge_base
验证：能调用Claude API获得NZ法规回答
```

### Task 3.3: RAG知识库
```
1. src/lib/ai/embeddings.ts + rag.ts: pgvector余弦搜索
2. scripts/seed-knowledge.ts: 30条核心NZ知识（中英双语）
   GST/PAYE/KiwiSaver/Leave/Minimum Wage/Director义务/Employment Agreement等
验证：搜索"GST registration"返回相关文档
```

---

## Week 4: Chat UI + 找GP

### Task 4.1: AI Chat API + 流式输出
```
src/app/api/chat/route.ts: SSE streaming + Tool Use + RAG + 对话历史
验证：POST能收到streaming响应，工具调用正确
```

### Task 4.2: Chat UI
```
对话列表 + 消息气泡(Markdown渲染) + 工具结果Card + 输入框 + 建议问题 + 免责声明
验证：完整对话体验，流式输出，中英双语
```

### Task 4.3: 找GP页面
```
搜索（城市+语言+是否接新病人）+ 结果卡片列表 + 种子数据20-30条奥克兰华人GP
验证：Auckland + Mandarin能看到GP列表
```

---

## Week 5-6: 机票监控 + Landing Page + 微信获客

### Task 5.1: 回国机票监控
```
1. (dashboard)/flights/page.tsx:
   选出发地(AKL) + 目的地(PVG/PEK/CAN/CTU/WUH/XMN) + 日期范围
   价格趋势折线图 + 最低价高亮 + 设置价格提醒
2. src/lib/integrations/skyscanner.ts: 先用模拟数据，定义接口
3. 种子数据：手动录入AKL-PVG/PEK近期价格
验证：能看价格趋势，能设置提醒
```

### Task 5.2: Landing Page
```
src/app/[locale]/page.tsx:
Hero("新西兰华人老板的AI商业伙伴") + 痛点区 + 6功能卡片 + 3步使用流程 + CTA
核心卖点："前6个月全部免费，所有功能开放"
蓝色主色#4361ee，移动端优先
验证：首页完整，中英切换正常
```

### Task 5.3: 微信公众号获客入口
```
1. (marketing)/wechat/page.tsx: 公众号二维码 + 说明
2. Landing Page Footer + Dashboard侧边栏底部加公众号入口
3. 准备3篇种子文章内容
验证：多处可见公众号入口
```

---

## Week 7-8: 整合测试 + 部署

### Task 7.1: SEO + Meta
```
中英文meta标签 + og-image + robots.txt + sitemap.xml
验证：微信分享显示正确预览
```

### Task 7.2: 部署到Vercel
```
Git repo → GitHub → Vercel (Sydney) → 环境变量 → 生产数据库迁移+种子数据
验证：生产URL可访问
```

### Task 7.3: 端到端测试
```
- [ ] 注册/登录/退出
- [ ] Onboarding 4步
- [ ] GST/PAYE/KiwiSaver计算器
- [ ] 合规日历
- [ ] AI对话（流式+工具+来源+免责）
- [ ] 找GP搜索
- [ ] 机票监控+价格提醒
- [ ] 中英切换
- [ ] 移动端375px
- [ ] Landing Page
验证：所有核心流程走通
```

---

## 执行顺序

```
Week 1:  [1.1] → [1.2] → [1.3并行] → [1.4 + 1.5]
Week 2:  [2.1] → [2.2 + 2.3 + 2.4 并行]
Week 3:  [3.1] → [3.2 + 3.3 并行]
Week 4:  [4.1] → [4.2] → [4.3 并行]
Week 5:  [5.1] → [5.2]
Week 6:  [5.3] → 整合打磨
Week 7:  [7.1] → [7.2]
Week 8:  [7.3] → 修复 → 上线
```

## 对比原版变化

| 原计划 | 调整后 | 原因 |
|--------|--------|------|
| Week 6-7 做Stripe | 砍掉 | 前6个月全免费 |
| 机票监控在Phase 2 | 提前到Week 5 | 用户需求最高的获客功能 |
| 微信获客在Phase 4 | 提前到Week 6 | Phase 1就要开始获客 |
| 空出的2周 | 用于整合测试和打磨 | 质量优先 |
