/** next-intl routing — Task 1.2 */
export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
