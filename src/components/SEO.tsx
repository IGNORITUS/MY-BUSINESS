import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  keywords?: string[];
}

const SEO: React.FC<SEOProps> = ({
  title = 'Ecommerce Store',
  description = 'Your one-stop shop for all your needs',
  image = '/images/default-og.jpg',
  type = 'website',
  keywords = ['ecommerce', 'shopping', 'online store'],
}) => {
  const location = useLocation();
  const canonicalUrl = `https://ecommerce.com${location.pathname}`;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph meta tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Ecommerce Store" />

      {/* Structured data for products */}
      {type === 'product' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: title,
            description: description,
            image: image,
            url: canonicalUrl,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
            },
          })}
        </script>
      )}

      {/* Structured data for organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Ecommerce Store',
          url: 'https://ecommerce.com',
          logo: 'https://ecommerce.com/logo.png',
          sameAs: [
            'https://facebook.com/ecommerce',
            'https://twitter.com/ecommerce',
            'https://instagram.com/ecommerce',
          ],
        })}
      </script>
    </Helmet>
  );
};

export default SEO; 