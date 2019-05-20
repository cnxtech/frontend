import get from 'lodash/get'
import Document, {Main, NextScript} from 'next/document'
import {ServerStyleSheet} from 'styled-components'
import Head from './_head';

const CRAWLERS_USER_AGENT = [
  'facebookexternalhit',
  'WhatsApp'
]

export default class AppDocument extends Document {
  static async getInitialProps (ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage
    const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent
    const includeStyles = !CRAWLERS_USER_AGENT.some(ua => userAgent.startsWith(ua))

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        prod: process.env.NODE_ENV === 'production',
        styles: !includeStyles ? null : (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    const {prod} = this.props
    const currentUser = get(this, 'props.__NEXT_DATA__.props.initialProps.currentUser')
    let isAdmin = currentUser && currentUser.isAdmin

    return (
      <html lang="pt-br">
        <Head>
          {prod ? (
            <script
              key="gtm-head"
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5ZF5DFW');`
              }}
            />
          ) : (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || []`
              }}
            />
          )}
          {(process.env.HOTJAR_SITE_ID && !isAdmin) ? (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${process.env.HOTJAR_SITE_ID},hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
               `
              }}
            />
          ) : null}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script")
              ;r.type="text/javascript";r.async=true
              ;r.src="https://cdn.amplitude.com/libs/amplitude-4.2.1-min.gz.js"
              ;r.onload=function(){if(e.amplitude.runQueuedFunctions){
              e.amplitude.runQueuedFunctions()}else{
              console.log("[Amplitude] Error: could not load SDK")}}
              ;var i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)
              ;function s(e,t){e.prototype[t]=function(){
              this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));return this}}
              var o=function(){this._q=[];return this}
              ;var a=["add","append","clearAll","prepend","set","setOnce","unset"]
              ;for(var u=0;u<a.length;u++){s(o,a[u])}n.Identify=o;var c=function(){this._q=[]
              ;return this}
              ;var l=["setProductId","setQuantity","setPrice","setRevenueType","setEventProperties"]
              ;for(var p=0;p<l.length;p++){s(c,l[p])}n.Revenue=c
              ;var d=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut",
              "setVersionName","setDomain","setDeviceId","setGlobalUserProperties","identify",
              "clearUserProperties","setGroup","logRevenueV2","regenerateDeviceId","logEventWithTimestamp",
              "logEventWithGroups","setSessionId","resetSessionId"]
              ;function v(e){function t(t){e[t]=function(){
              e._q.push([t].concat(Array.prototype.slice.call(arguments,0)))}}
              for(var n=0;n<d.length;n++){t(d[n])}}v(n);n.getInstance=function(e){
              e=(!e||e.length===0?"$default_instance":e).toLowerCase()
              ;if(!n._iq.hasOwnProperty(e)){n._iq[e]={_q:[]};v(n._iq[e])}return n._iq[e]}
              ;e.amplitude=n})(window,document);
              amplitude.getInstance().init("${process.env.AMPLITUDE_API_KEY}", null, {
                saveEvents: true,
                saveParamsReferrerOncePerSession: true,
                includeReferrer: true,
                includeUtm: true,
                includeGclid: true,
                forceHttps: true
              });`}}
          />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
            key="viewport"
          />
          <link
            rel="shortcut icon"
            href={`https://res.cloudinary.com/emcasa/image/upload/v1543345889/${
              process.env.REACT_APP_FAVICON
            }`}
            key="favicon"
          />
        </Head>
        <body>
          {prod && (
            <noscript key="gtm-body">
              <iframe
                key="gtm-body-iframe"
                src="https://www.googletagmanager.com/ns.html?id=GTM-5ZF5DFW"
                height="0"
                width="0"
                style={{display: 'none', visibility: 'hidden'}}
              />
            </noscript>
          )}
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
