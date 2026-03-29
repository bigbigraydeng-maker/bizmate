/** Bilingual seed rows for knowledge_documents — illustrative; verify against official sources. */

export type KnowledgeSeedRow = {
  source: string;
  source_url: string | null;
  title: string;
  content: string;
  content_zh: string;
  category: string;
  effective_date: string;
};

export const KNOWLEDGE_SEED_ENTRIES: KnowledgeSeedRow[] = [
  {
    source: "Inland Revenue",
    source_url: "https://www.ird.govt.nz/gst/registering-for-gst",
    title: "GST registration threshold",
    content:
      "You must register for GST if your turnover is over $60,000 in any 12-month period (or expected to exceed it). Voluntary registration is possible below the threshold.",
    content_zh:
      "若过去 12 个月营业额超过 6 万纽币（或预计将超过），必须注册 GST。低于门槛也可自愿注册。",
    category: "tax",
    effective_date: "2024-04-01",
  },
  {
    source: "Inland Revenue",
    source_url: "https://www.ird.govt.nz/gst/gst-rates",
    title: "GST rate",
    content: "The standard GST rate in New Zealand is 15%. Some supplies are zero-rated or exempt.",
    content_zh: "新西兰标准 GST 税率为 15%。部分供应为零税率或免税。",
    category: "tax",
    effective_date: "2010-10-01",
  },
  {
    source: "Inland Revenue",
    source_url: "https://www.ird.govt.nz/gst/filing-and-paying-gst",
    title: "GST filing and payment",
    content:
      "GST returns are generally due by the 28th of the month after your taxable period ends. Filing frequency can be monthly, two-monthly, or six-monthly.",
    content_zh:
      "GST 申报通常在纳税期结束后的次月 28 日前提交。申报频率可为每月、每两月或每半年。",
    category: "tax",
    effective_date: "2024-04-01",
  },
  {
    source: "Inland Revenue",
    source_url: "https://www.ird.govt.nz/income-tax/paye",
    title: "PAYE — employer obligations",
    content:
      "Employers must deduct PAYE from wages, pay deductions to IRD, and file employment information each payday (payday filing).",
    content_zh:
      "雇主须从工资中预扣 PAYE、向 IRD 缴纳，并在每次发薪日提交雇佣信息（payday filing）。",
    category: "tax",
    effective_date: "2024-04-01",
  },
  {
    source: "Inland Revenue",
    source_url: "https://www.ird.govt.nz/income-tax/tax-rates-individuals",
    title: "Individual income tax brackets",
    content:
      "NZ uses progressive income tax rates on annual income. ACC earner levy is charged on top of PAYE on earnings up to a cap.",
    content_zh:
      "新西兰对个人所得实行累进税率。在应计收入上限内，ACC 工伤附加费与 PAYE 一并扣缴。",
    category: "tax",
    effective_date: "2024-07-01",
  },
  {
    source: "Inland Revenue",
    source_url: "https://www.ird.govt.nz/kiwisaver/kiwisaver-for-employers",
    title: "KiwiSaver — employer contributions",
    content:
      "Employers must contribute at least 3% of employees’ gross salary or wages if the employee is a KiwiSaver member (subject to rules).",
    content_zh:
      "若雇员参加 KiwiSaver，雇主通常须按工资总额至少缴纳 3%（视具体规则而定）。",
    category: "tax",
    effective_date: "2024-04-01",
  },
  {
    source: "Inland Revenue",
    source_url: "https://www.ird.govt.nz/kiwisaver/kiwisaver-contribution-rates",
    title: "KiwiSaver employee rates",
    content:
      "Employee contribution rates are typically 3%, 4%, 6%, 8%, or 10% of gross pay (or a savings suspension may apply).",
    content_zh:
      "雇员缴费比例通常为工资总额的 3%、4%、6%、8% 或 10%（或可申请暂停储蓄）。",
    category: "tax",
    effective_date: "2024-04-01",
  },
  {
    source: "Employment New Zealand",
    source_url: "https://www.employment.govt.nz/holidays-and-leave/annual-holidays/",
    title: "Annual holidays — 4 weeks",
    content:
      "After 12 months’ continuous employment, employees are entitled to at least four weeks’ paid annual holidays.",
    content_zh: "连续工作满 12 个月后，雇员有权享受至少四周带薪年假。",
    category: "employment",
    effective_date: "2024-04-01",
  },
  {
    source: "Employment New Zealand",
    source_url: "https://www.employment.govt.nz/holidays-and-leave/sick-leave/",
    title: "Sick leave — 10 days per year",
    content:
      "Eligible employees accrue sick leave after six months’ service; entitlement builds up to 10 days per year up to a maximum balance.",
    content_zh:
      "符合条件雇员工作满六个月后开始累积病假；每年增至 10 天，并设有上限。",
    category: "employment",
    effective_date: "2024-04-01",
  },
  {
    source: "Employment New Zealand",
    source_url: "https://www.employment.govt.nz/holidays-and-leave/public-holidays/",
    title: "Public holidays",
    content:
      "New Zealand has 12 national public holidays. Employees who work on a public holiday may be entitled to additional pay and a day in lieu.",
    content_zh:
      "新西兰有 12 个全国性公共假日。在公共假日工作的雇员可能享有额外工资与补休。",
    category: "employment",
    effective_date: "2024-04-01",
  },
  {
    source: "Employment New Zealand",
    source_url: "https://www.employment.govt.nz/pay/minimum-wage/",
    title: "Minimum wage",
    content:
      "Adult minimum wage is set by government and updated periodically (verify current rate on Employment New Zealand). Training and starting-out rates may differ.",
    content_zh:
      "成人最低工资由政府制定并定期调整（请以 Employment New Zealand 当前数字为准）。起步/培训费率可能不同。",
    category: "employment",
    effective_date: "2025-04-01",
  },
  {
    source: "Companies Office",
    source_url: "https://www.companiesoffice.govt.nz/",
    title: "Company director duties",
    content:
      "Directors must act in good faith, avoid reckless trading, and keep proper records. Serious breaches can lead to personal liability.",
    content_zh:
      "董事须善意行事、避免鲁莽经营并保存适当记录；严重违规则可能承担个人责任。",
    category: "company_law",
    effective_date: "2024-04-01",
  },
  {
    source: "Employment New Zealand",
    source_url: "https://www.employment.govt.nz/getting-a-job/employment-agreements/",
    title: "Employment agreement requirements",
    content:
      "Employers must provide a written employment agreement. Certain terms are mandatory; additional terms must comply with employment law.",
    content_zh: "雇主须提供书面雇佣协议；部分条款为强制要求，其余须符合雇佣法。",
    category: "employment",
    effective_date: "2024-04-01",
  },
  {
    source: "Employment New Zealand",
    source_url: "https://www.employment.govt.nz/hiring/recruitment/90-day-trial-periods/",
    title: "90-day trial periods",
    content:
      "Trial periods are only available to employers with fewer than 20 employees and must meet strict eligibility and documentation rules.",
    content_zh:
      "90 天试用仅适用于雇员少于 20 人的雇主，且须满足严格的资格与书面要求。",
    category: "employment",
    effective_date: "2024-04-01",
  },
  {
    source: "Employment New Zealand",
    source_url: "https://www.employment.govt.nz/dismissal/personal-grievances/",
    title: "Personal grievance process",
    content:
      "Employees may raise a personal grievance for unjustified dismissal or disadvantage. Time limits apply to lodge claims with MBIE mediation or the ERA.",
    content_zh:
      "雇员可就不当解雇或不利待遇提出个人申诉；向 MBIE 调解或 ERA 提出申诉有时限。",
    category: "employment",
    effective_date: "2024-04-01",
  },
  {
    source: "WorkSafe",
    source_url: "https://www.worksafe.govt.nz/managing-health-and-safety/getting-started/",
    title: "Health and Safety at Work — PCBU duties",
    content:
      "A PCBU must ensure so far as is reasonably practicable the health and safety of workers and others affected by the work.",
    content_zh:
      "PCBU 须在合理可行范围内保障工作者及其他受影响人员的健康与安全。",
    category: "health_safety",
    effective_date: "2024-04-01",
  },
  {
    source: "ACC",
    source_url: "https://www.acc.co.nz/business/",
    title: "ACC employer levies",
    content:
      "Employers pay ACC Work Account levies based on employees’ earnings and industry classification (levy rates and classifications change).",
    content_zh:
      "雇主按雇员收入与行业分类缴纳 ACC Work Account 费用（费率与分类会调整）。",
    category: "tax",
    effective_date: "2024-04-01",
  },
  {
    source: "Inland Revenue",
    source_url: "https://www.ird.govt.nz/income-tax/fringe-benefit-tax",
    title: "Fringe benefit tax (FBT) basics",
    content:
      "Non-cash benefits provided to employees may be subject to FBT. Employers file FBT returns and pay tax on taxable benefits.",
    content_zh:
      "向雇员提供的非现金福利可能需缴纳 FBT；雇主须申报并缴纳相应税款。",
    category: "tax",
    effective_date: "2024-04-01",
  },
  {
    source: "Inland Revenue",
    source_url: "https://www.ird.govt.nz/provisional-tax",
    title: "Provisional tax",
    content:
      "Provisional tax helps pay income tax in instalments during the year. Due dates depend on your balance date and payment option.",
    content_zh:
      "预缴税用于分期缴纳年度所得税；付款日期取决于决算日与所选方案。",
    category: "tax",
    effective_date: "2024-04-01",
  },
  {
    source: "Inland Revenue",
    source_url: "https://www.ird.govt.nz/gst/gst-on-imports-and-exports",
    title: "GST on imports and exports",
    content:
      "Exports are generally zero-rated. Imported goods may attract GST collected at the border or via accounting rules depending on value and regime.",
    content_zh:
      "出口通常为零税率；进口货物可能需在边境或通过会计制度缴纳 GST，视价值与制度而定。",
    category: "tax",
    effective_date: "2024-04-01",
  },
  {
    source: "Employment New Zealand",
    source_url: "https://www.employment.govt.nz/holidays-and-leave/bereavement-leave/",
    title: "Bereavement leave",
    content:
      "Eligible employees are entitled to paid bereavement leave after six months’ employment in certain circumstances.",
    content_zh: "符合条件雇员在满足条件时可享带薪丧假（工作满六个月后等情形）。",
    category: "employment",
    effective_date: "2024-04-01",
  },
  {
    source: "Employment New Zealand",
    source_url: "https://www.employment.govt.nz/holidays-and-leave/parental-leave/",
    title: "Parental leave",
    content:
      "Primary carer leave and related parental leave payments are subject to eligibility tests including work history and hours.",
    content_zh:
      "主要照顾者产假及相关津贴须满足工作时长与工龄等资格条件。",
    category: "employment",
    effective_date: "2024-04-01",
  },
  {
    source: "Privacy Commissioner",
    source_url: "https://www.privacy.org.nz/",
    title: "Privacy Act 2020 — business basics",
    content:
      "Businesses must handle personal information lawfully, securely, and only for proper purposes; individuals have access and correction rights.",
    content_zh:
      "企业须合法、安全地处理个人信息；个人享有查阅与更正等权利。",
    category: "compliance",
    effective_date: "2024-04-01",
  },
  {
    source: "Companies Office",
    source_url: "https://www.companiesoffice.govt.nz/help-centre/annual-returns/",
    title: "Annual return — Companies Office",
    content:
      "NZ companies must file an annual return and pay a fee to confirm key details remain correct; failure can lead to removal from the register.",
    content_zh:
      "新西兰公司须每年提交年度申报并缴费以确认关键信息；逾期可能被除名。",
    category: "company_law",
    effective_date: "2024-04-01",
  },
  {
    source: "Inland Revenue",
    source_url: "https://www.ird.govt.nz/gst/record-keeping",
    title: "GST record keeping",
    content:
      "GST-registered businesses must keep tax invoices and records for at least seven years in English unless IRD agrees otherwise.",
    content_zh:
      "已注册 GST 的企业须保存税务发票与账簿至少七年（除非 IRD 同意其他语言）。",
    category: "tax",
    effective_date: "2024-04-01",
  },
  {
    source: "Employment New Zealand",
    source_url: "https://www.employment.govt.nz/holidays-and-leave/domestic-violence-leave/",
    title: "Domestic violence leave",
    content:
      "Eligible employees may take paid domestic violence leave; employers must not discriminate for taking or requesting leave.",
    content_zh:
      "符合条件雇员可休带薪家庭暴力假；雇主不得因休假或申请休假而歧视。",
    category: "employment",
    effective_date: "2024-04-01",
  },
  {
    source: "MBIE",
    source_url: "https://www.employment.govt.nz/hiring/recruitment/",
    title: "Recruitment advertising — discrimination",
    content:
      "Job ads must not unlawfully discriminate on grounds such as age, race, or national origin unless a genuine occupational requirement applies.",
    content_zh:
      "招聘广告不得非法歧视；除非存在真实职业要求，否则不得基于年龄、种族等排除。",
    category: "employment",
    effective_date: "2024-04-01",
  },
  {
    source: "Inland Revenue",
    source_url: "https://www.ird.govt.nz/managing-my-tax/ird-numbers",
    title: "IRD numbers",
    content:
      "Businesses and individuals use IRD numbers for tax. Employers need employee tax codes and KiwiSaver status for payroll.",
    content_zh:
      "企业与个人使用 IRD 号码办税；雇主发薪需要雇员的税务代码与 KiwiSaver 状态。",
    category: "tax",
    effective_date: "2024-04-01",
  },
  {
    source: "Te Kāwanatanga o Aotearoa / NZ Government",
    source_url: "https://www.govt.nz/",
    title: "Public sector information — verify sources",
    content:
      "Always verify tax and employment information against IRD, MBIE, and official NZ government sites; rates and rules change.",
    content_zh:
      "税务与雇佣信息请以 IRD、MBIE 及新西兰政府官方网站为准；费率与规则会更改。",
    category: "compliance",
    effective_date: "2024-04-01",
  },
  {
    source: "Inland Revenue",
    source_url: "https://www.ird.govt.nz/managing-my-tax/penalties-and-interest",
    title: "Penalties and use-of-money interest",
    content:
      "Late payment of tax can attract penalties and interest. Contact IRD early if you cannot pay on time.",
    content_zh:
      "税款逾期可能产生滞纳金与利息；若无法按时缴纳应尽早联系 IRD。",
    category: "tax",
    effective_date: "2024-04-01",
  },
  {
    source: "Employment New Zealand",
    source_url: "https://www.employment.govt.nz/pay/pay-day-filing/",
    title: "Payday filing timing",
    content:
      "Employers must file employment information within a few working days of each payday; check current IRD rules for exact timing.",
    content_zh:
      "雇主须在每次发薪后的若干工作日内提交雇佣信息；请以 IRD 最新规定为准。",
    category: "tax",
    effective_date: "2024-04-01",
  },
  {
    source: "Inland Revenue",
    source_url: "https://www.ird.govt.nz/gst/zero-rated-supplies",
    title: "Zero-rated supplies",
    content:
      "Certain supplies are taxed at 0% GST (zero-rated) while allowing GST registration and input tax claims on related costs in many cases.",
    content_zh:
      "部分供应为零税率 GST，在多数情况下仍可注册并抵扣相关进项。",
    category: "tax",
    effective_date: "2024-04-01",
  },
  {
    source: "Employment New Zealand",
    source_url: "https://www.employment.govt.nz/ending-employment/redundancy/",
    title: "Redundancy",
    content:
      "Redundancy must be genuine; consultation and fair process requirements apply. Redundancy pay is not mandatory unless in contract or policy.",
    content_zh:
      "裁员须为真实岗位消失并遵循协商与公平程序；法定外遣散费视合同或政策而定。",
    category: "employment",
    effective_date: "2024-04-01",
  },
  {
    source: "WorkSafe",
    source_url: "https://www.worksafe.govt.nz/",
    title: "Notifiable events",
    content:
      "Certain work-related deaths, serious injuries, and illnesses must be notified to WorkSafe as soon as possible.",
    content_zh:
      "特定工亡、重伤及严重疾病须尽快向 WorkSafe 报告。",
    category: "health_safety",
    effective_date: "2024-04-01",
  },
];
