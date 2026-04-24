import Script from "next/script";

type GoogleAnalyticsProps = {
  measurementId?: string;
};

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        id="ga4-consent-defaults"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=window.gtag||gtag;
gtag('consent','default',{'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','analytics_storage':'denied'});`
        }}
      />
      <Script
        id="ga4-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="beforeInteractive"
      />
      <Script
        id="ga4-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=window.gtag||gtag;
gtag('js',new Date());
gtag('config','${measurementId}',{send_page_view:false});`
        }}
      />
    </>
  );
}
