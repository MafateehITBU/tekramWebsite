export const HERO_TITLE = {
  en: 'In a World Full of Uncertainty…Choose Proven Results',
  ar: 'وسط فوضى الاحتمالات… اختر النتائج المضمونة',
}

export const HERO_BOOT = {
  en: {
    title: HERO_TITLE.en,
    line: 'We Build Digital Solutions That Drive Real Growth & Sales',
    subtitle:
      'At Tikram Arabia, we combine marketing, technology, and systems to create integrated experiences that strengthen your business and deliver measurable results.',
    quote: 'Get a Quote',
    start: 'Start With Us',
  },
  ar: {
    title: HERO_TITLE.ar,
    line: 'نبني حلولًا رقمية تساعد مشروعك على النمو وتحقيق مبيعات فعلية',
    subtitle:
      'في تكرم، نجمع بين التسويق، التقنية، والأنظمة لنصنع تجربة متكاملة تمنح مشروعك حضورًا أقوى، أداءً أفضل، ونتائج يمكن قياسها.',
    quote: 'اطلب عرض سعر',
    start: 'ابدأ معنا',
  },
}

/** @param {'en' | 'ar'} locale */
export function getHeroTitle(locale) {
  return locale === 'ar' ? HERO_TITLE.ar : HERO_TITLE.en
}

/** @param {'en' | 'ar'} locale */
export function getHeroBoot(locale) {
  return locale === 'ar' ? HERO_BOOT.ar : HERO_BOOT.en
}
