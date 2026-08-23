export const HERO_TITLE = {
  en: 'In a World Full of Uncertainty…Choose Proven Results',
  ar: 'وسط فوضى الاحتمالات… اختر النتائج المضمونة',
}

/** @param {'en' | 'ar'} locale */
export function getHeroTitle(locale) {
  return locale === 'ar' ? HERO_TITLE.ar : HERO_TITLE.en
}
