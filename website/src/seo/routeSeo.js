import { DEFAULT_DESCRIPTION, DEFAULT_DESCRIPTION_AR, SITE_NAME, SITE_URL } from './siteConfig.js'

/** @typedef {{ title: string, titleAr: string, description: string, descriptionAr: string, path: string }} RouteSeo */

/** @type {Record<string, RouteSeo>} */
export const ROUTE_SEO = {
  '/': {
    path: '/',
    title: `${SITE_NAME} | IT, Marketing & Branding in Saudi Arabia`,
    titleAr: `${SITE_NAME} | حلول تقنية وتسويق وعلامات تجارية`,
    description: DEFAULT_DESCRIPTION,
    descriptionAr: DEFAULT_DESCRIPTION_AR,
  },
  '/about': {
    path: '/about',
    title: `About Us | ${SITE_NAME}`,
    titleAr: `من نحن | ${SITE_NAME}`,
    description:
      'Learn about Tikram Arabia — our story, mission, and team delivering smart digital solutions in Saudi Arabia.',
    descriptionAr:
      'تعرّف على تكرم العربية — قصتنا ورسالتنا وفريقنا الذي يقدم حلولاً رقمية ذكية في المملكة العربية السعودية.',
  },
  '/contact': {
    path: '/contact',
    title: `Contact Us | ${SITE_NAME}`,
    titleAr: `تواصل معنا | ${SITE_NAME}`,
    description:
      'Contact Tikram Arabia to discuss your IT, marketing, or branding project. We respond quickly to every inquiry.',
    descriptionAr:
      'تواصل مع تكرم العربية لمناقشة مشروعك في التقنية أو التسويق أو العلامة التجارية.',
  },
  '/blogs': {
    path: '/blogs',
    title: `Blog | ${SITE_NAME}`,
    titleAr: `المدونة | ${SITE_NAME}`,
    description:
      'Insights, trends, and expert knowledge from Tikram Arabia to help your business grow digitally.',
    descriptionAr:
      'رؤى واتجاهات وخبرات من تكرم العربية لمساعدة أعمالك على النمو رقمياً.',
  },
  '/packages': {
    path: '/packages',
    title: `Packages & Pricing | ${SITE_NAME}`,
    titleAr: `الباقات والأسعار | ${SITE_NAME}`,
    description: 'Explore Tikram Arabia service packages tailored to your business goals and budget.',
    descriptionAr: 'استكشف باقات خدمات تكرم العربية المصممة لأهداف ميزانيتك وأعمالك.',
  },
  '/it-solutions': {
    path: '/it-solutions',
    title: `IT Solutions | ${SITE_NAME}`,
    titleAr: `حلول تقنية المعلومات | ${SITE_NAME}`,
    description:
      'Custom software, cloud, and IT infrastructure solutions from Tikram Arabia for scalable business growth.',
    descriptionAr: 'حلول برمجية وسحابية وبنية تحتية من تكرم العربية لنمو أعمالك.',
  },
  '/digital-marketing': {
    path: '/digital-marketing',
    title: `Digital Marketing | ${SITE_NAME}`,
    titleAr: `التسويق الرقمي | ${SITE_NAME}`,
    description:
      'Data-driven digital marketing campaigns and strategies from Tikram Arabia to reach your audience.',
    descriptionAr: 'حملات واستراتيجيات تسويق رقمي قائمة على البيانات من تكرم العربية.',
  },
  '/branding': {
    path: '/branding',
    title: `Branding | ${SITE_NAME}`,
    titleAr: `العلامات التجارية | ${SITE_NAME}`,
    description:
      'Brand identity, visual design, and storytelling services from Tikram Arabia.',
    descriptionAr: 'خدمات الهوية البصرية وتصميم العلامة التجارية من تكرم العربية.',
  },
  '/privacy-policy': {
    path: '/privacy-policy',
    title: `Privacy Policy | ${SITE_NAME}`,
    titleAr: `سياسة الخصوصية | ${SITE_NAME}`,
    description: 'How Tikram Arabia collects, uses, and protects your personal information.',
    descriptionAr: 'كيف تجمع تكرم العربية معلوماتك الشخصية وتستخدمها وتحميها.',
  },
  '/accessibility': {
    path: '/accessibility',
    title: `Accessibility Statement | ${SITE_NAME}`,
    titleAr: `بيان إمكانية الوصول | ${SITE_NAME}`,
    description: 'Tikram Arabia accessibility commitment and contact for accessibility feedback.',
    descriptionAr: 'التزام تكرم العربية بإمكانية الوصول وكيفية تقديم الملاحظات.',
  },
}

/**
 * @param {string} pathname
 * @returns {RouteSeo | null}
 */
export function getRouteSeo(pathname) {
  if (ROUTE_SEO[pathname]) return ROUTE_SEO[pathname]
  if (/^\/blogs\/[^/]+$/.test(pathname)) return null
  return {
    path: pathname,
    title: `Page Not Found | ${SITE_NAME}`,
    titleAr: `الصفحة غير موجودة | ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
    descriptionAr: DEFAULT_DESCRIPTION_AR,
  }
}

export function absoluteUrl(path) {
  if (!path || path === '/') return `${SITE_URL}/`
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
