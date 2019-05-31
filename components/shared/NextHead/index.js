import Head from 'next/head'
import theme from 'config/theme'

const NextHead = (props) => {
  const {
    title,
    description,
    imageSrc,
    imageWidth,
    imageHeight,
    url,
    canonical,
    children
  } = props
  return (
    <Head>
      <title>{title || 'EmCasa'}</title>
      <meta name="title" content={title || 'EmCasa'} />
      <meta name="description" content={description || ''} />
      <meta
        property="twitter:card"
        content={imageSrc ? 'summary_large_image' : 'summary'}
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || 'https://www.emcasa.com/'} />
      <meta property="og:title" content={title || 'EmCasa'} />
      <meta property="og:description" content={description || ''} />
      <meta
        property="og:image"
        content={
          imageSrc ||
          'https://res.cloudinary.com/emcasa/image/upload/f_auto/v1513818385/buy'
        }
      />
      <meta property="og:site_name" content="EmCasa" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="fb:app_id" content={process.env.FACEBOOK_APP_ID} />
      <meta property="fb:pages" content={process.env.FACEBOOK_PAGES} />
      <meta property="og:image:width" content={imageWidth || null} />
      <meta property="og:image:height" content={imageHeight || null} />
      <meta name="theme-color" content={theme.colors.pink} />
      {canonical && <link rel="canonical" href={canonical} />}
      <link
        rel="image_src"
        href={
          imageSrc ||
          'https://res.cloudinary.com/emcasa/image/upload/f_auto/v1513818385/buy'
        }
      />
      <link
        rel="manifest"
        href="https://www.emcasa.com.br/static/manifest.json?v=1.0"
      />
      {children}
    </Head>
  )
}

export default NextHead
