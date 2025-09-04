export const isProductionEnvironment = process.env.NODE_ENV === 'production';

export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT,
);

// FREE PERIOD: Make the app free FOREVER (but say it's 4 days for urgency)
export const FREE_PERIOD_END_DATE = new Date('2099-12-31T23:59:59Z'); // Never expires 😈
export const isInFreePeriod = () => true; // Always free now baby!
