import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    name?: string;
    type?: string;
    image?: string;
}

export default function SEO({ title, description, name, type, image }: SEOProps) {
    const siteName = name || 'Daniel Horia - Comic Book Artist / Illustrator';
    const siteTitle = title ? `${title} | ${siteName}` : siteName;
    const siteDescription = description || 'Portfolio of Daniel Horia, Comic Book Artist and Illustrator.';

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name='description' content={siteDescription} />

            {/* Facebook tags */}
            <meta property="og:type" content={type || 'website'} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={siteDescription} />
            {image && <meta property="og:image" content={image} />}

            {/* Twitter tags */}
            <meta name="twitter:creator" content={siteName} />
            <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={siteDescription} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
}
