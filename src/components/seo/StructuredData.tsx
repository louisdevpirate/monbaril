interface StructuredDataProps {
  type: 'Organization' | 'Product' | 'WebSite' | 'BreadcrumbList' | 'FAQPage';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data
    };

    switch (type) {
      case 'Organization':
        return {
          ...baseData,
          name: 'MonBaril™',
          url: 'https://monbaril.fr',
          logo: 'https://monbaril.fr/images/monbaril.fr.svg',
          description: 'Spécialiste des barils de stockage premium',
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+33-1-23-45-67-89',
            contactType: 'customer service',
            availableLanguage: 'French'
          },
          sameAs: [
            'https://www.facebook.com/monbaril',
            'https://www.instagram.com/monbaril',
            'https://twitter.com/monbaril'
          ]
        };

      case 'Product':
        return {
          ...baseData,
          brand: {
            '@type': 'Brand',
            name: 'MonBaril™'
          },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            ...data.offers
          }
        };

      case 'WebSite':
        return {
          ...baseData,
          name: 'MonBaril™',
          url: 'https://monbaril.fr',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://monbaril.fr/categories?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        };

      case 'BreadcrumbList':
        return {
          ...baseData,
          itemListElement: data.items.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
          }))
        };

      case 'FAQPage':
        return {
          ...baseData,
          mainEntity: data.faqs.map((faq: any) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        };

      default:
        return baseData;
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getStructuredData()) }}
    />
  );
}
