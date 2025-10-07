import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { LanguageProvider } from "@/lib/language-context"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "My Roofer.ai - Instant Roofing Quotes & AI Roof Analysis",
  description: "Get AI-powered roof analysis and connect with certified local roofing contractors across America. Instant quotes in 60 seconds.",
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.ico',
  },
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: "My Roofer.ai - Instant Roofing Quotes & AI Roof Analysis",
    description: "Get AI-powered roof analysis and connect with certified local roofing contractors across America. Instant quotes in 60 seconds.",
    url: 'https://myroofer.ai',
    siteName: 'My Roofer.ai',
    locale: 'en_US',
    type: 'website',
    images: ['/images/myroofer.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "My Roofer.ai",
    "description": "Free roofing quotes across America. 24/7 emergency roof repair, certified roofing contractors.",
    "url": "https://myroofer.ai",
    "telephone": "+1-800-ROOFERS",
    "priceRange": "$$",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "serviceType": [
      "Emergency roof repair",
      "Free roofing quotes", 
      "Roof inspection",
      "Certified roofing contractors",
      "Roof leak repair",
      "Storm damage repair"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Roofing Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "24/7 Emergency Roof Repair",
            "description": "Emergency service for roof repair, leaks and water damage"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Free Roofing Quotes",
            "description": "Free instant estimates for all roofing projects"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1247"
    }
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '952896926960917');
              fbq('track', 'PageView');
            `
          }}
        />
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{display:'none'}}
            src="https://www.facebook.com/tr?id=952896926960917&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className={inter.className}>
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
