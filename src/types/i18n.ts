export type Language = 'tg' | 'ru' | 'en';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  currencyUnit: string;
  diramUnit: string;
  
  // Navigation
  navDashboard: string;
  navHistory: string;
  navReports: string;
  navBudget: string;
  navCategories: string;
  navProfile: string;

  // Sync statuses
  syncSynced: string;
  syncSyncing: string;
  syncOffline: string;

  // Install Banner
  installTitle: string;
  installSubtitle: string;
  installBtn: string;
  installIosHelp: string;

  // Dashboard
  dashTitle: string;
  dashSubtitle: string;
  newExpenseBtn: string;
  kpiMonthExpense: string;
  kpiTotalPayments: string;
  kpiTodayExpense: string;
  kpiTodayDate: string;
  kpiMonthlyBudget: string;
  kpiNotSet: string;
  kpiProgress: string;
  kpiOverBudget: string;
  kpiRemaining: string;
  kpiSetBudget: string;
  recentExpensesTitle: string;
  viewAll: string;
  noExpensesYet: string;
  addFirstExpense: string;

  // History
  historyTitle: string;
  historySubtitle: string;
  searchPlaceholder: string;
  allCategories: string;
  filterAllTime: string;
  filterThisMonth: string;
  filterToday: string;
  foundRecords: string;
  totalSum: string;
  noExpensesFound: string;
  edit: string;
  delete: string;

  // Reports
  reportsTitle: string;
  reportsSubtitle: string;
  totalExpenses: string;
  topCategory: string;
  noData: string;
  paymentCount: string;
  paymentsThisMonth: string;
  categoryBreakdown: string;
  noExpensesThisMonth: string;
  paymentsCountLabel: string;

  // Budget
  budgetTitle: string;
  budgetSubtitle: string;
  setBudgetLimit: string;
  currentMonthLabel: string;
  budgetSavedSuccess: string;
  limitAmountLabel: string;
  saveBudgetBtn: string;
  savingBtn: string;
  budgetStatusTitle: string;
  budgetNotSetYet: string;
  budgetNotSetHint: string;
  spentLabel: string;
  limitLabel: string;
  usedLabel: string;
  overBudgetAlert: string;
  dushanbeTimezoneNote: string;

  // Categories
  categoriesTitle: string;
  categoriesSubtitle: string;
  newCategoryBtn: string;
  addNewCategory: string;
  categoryNameLabel: string;
  categoryNamePlaceholder: string;
  colorSelection: string;
  cancelBtn: string;
  addBtn: string;
  defaultBadge: string;
  thisMonthRecords: string;

  // Profile
  profileTitle: string;
  profileSubtitle: string;
  activeUser: string;
  verifiedAccount: string;
  logoutBtn: string;
  totalAllTimeExpenses: string;
  sinceBeginning: string;
  totalOperations: string;
  inDatabaseHistory: string;
  regionalAndSecurityTitle: string;
  timezoneLabel: string;
  currencyLabel: string;
  firestoreRulesLabel: string;
  languageSelectLabel: string;

  // Modals
  editExpenseTitle: string;
  newExpenseModalTitle: string;
  expenseTitleLabel: string;
  expenseTitlePlaceholder: string;
  amountLabel: string;
  diramStorageHint: string;
  categoryLabel: string;
  dateLabel: string;
  noteLabel: string;
  notePlaceholder: string;
  savingExpense: string;
  saveExpense: string;
  deleteConfirmTitle: string;
  deleteConfirmQuestion: string;
  deleteConfirmYes: string;
  deletingExpense: string;
  errEnterTitle: string;
  errAmountGreaterZero: string;
  errGenericSave: string;

  // Auth
  loginTitle: string;
  loginSubtitle: string;
  emailLabel: string;
  passwordLabel: string;
  confirmPasswordLabel: string;
  loginBtn: string;
  loggingInBtn: string;
  noAccountQuestion: string;
  registerLink: string;
  registerTitle: string;
  registerSubtitle: string;
  passwordMinChars: string;
  registerBtn: string;
  registeringBtn: string;
  haveAccountQuestion: string;
  loginLink: string;
  errPasswordMismatch: string;
  errPasswordMin6: string;
  errEmailInUse: string;
  errInvalidEmail: string;
  errWrongCredentials: string;
}
