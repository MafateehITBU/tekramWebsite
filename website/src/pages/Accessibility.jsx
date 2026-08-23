import { Header } from '../components/layout/Header.jsx'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { useLanguage } from '../context/useLanguage.js'

const COPY = {
  en: {
    pageName: 'Accessibility',
    title: 'Accessibility Statement',
    subtitle: 'Our commitment to an inclusive digital experience.',
    sections: [
      {
        heading: 'Our commitment',
        body: 'Tikram Arabia aims to make tikramarabia.com accessible to the widest possible audience, including people using assistive technologies.',
      },
      {
        heading: 'Measures we take',
        body: 'We use semantic HTML, keyboard-friendly navigation, sufficient color contrast in our design system, and responsive layouts for mobile users.',
      },
      {
        heading: 'Known limitations',
        body: 'Some interactive content relies on JavaScript. We are improving server-side metadata and performance for search engines and assistive tools.',
      },
      {
        heading: 'Feedback',
        body: 'If you encounter accessibility barriers, contact us via the Contact page and we will respond promptly.',
      },
    ],
  },
  ar: {
    pageName: 'إمكانية الوصول',
    title: 'بيان إمكانية الوصول',
    subtitle: 'التزامنا بتجربة رقمية شاملة.',
    sections: [
      {
        heading: 'التزامنا',
        body: 'تسعى تكرم العربية إلى جعل tikramarabia.com متاحاً لأكبر عدد ممكن من الزوار، بمن فيهم مستخدمو تقنيات المساعدة.',
      },
      {
        heading: 'الإجراءات التي نتخذها',
        body: 'نستخدم HTML دلالياً، وتنقلاً يعمل بلوحة المفاتيح، وتباين ألوان كافياً، وتخطيطات متجاوبة للجوال.',
      },
      {
        heading: 'قيود معروفة',
        body: 'يعتمد بعض المحتوى التفاعلي على JavaScript. نعمل على تحسين البيانات الوصفية والأداء لمحركات البحث وأدوات المساعدة.',
      },
      {
        heading: 'الملاحظات',
        body: 'إذا واجهت عائقاً في إمكانية الوصول، تواصل معنا عبر صفحة التواصل وسنرد بسرعة.',
      },
    ],
  },
}

export function Accessibility() {
  const { locale } = useLanguage()
  const copy = COPY[locale]

  return (
    <>
      <Header />
      <main className="section-solid site-container py-10 sm:py-12 lg:py-14">
        <PageHeader
          pageName={copy.pageName}
          title={copy.title}
          subtitle={copy.subtitle}
        />
        <div className="mx-auto mt-8 max-w-3xl space-y-8">
          {copy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                {section.heading}
              </h2>
              <p className="mt-3 font-body text-base leading-relaxed text-foreground/85">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </main>
    </>
  )
}
