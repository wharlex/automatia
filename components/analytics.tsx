"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    // Google Analytics 4
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", "G-XXXXXXXXXX", {
        page_path: pathname,
        custom_map: {
          custom_parameter_1: "user_type",
          custom_parameter_2: "page_category"
        }
      })
    }

    // Hotjar
    if (typeof window !== "undefined" && (window as any).hj) {
      (window as any).hj("stateChange", pathname)
    }

    // Custom analytics
    trackPageView(pathname)
  }, [pathname])

  const trackPageView = (path: string) => {
    // Custom page view tracking
    const pageData = {
      path,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      referrer: document.referrer
    }

    // Send to your analytics endpoint
    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageData)
    }).catch(console.error)

    // Track engagement metrics
    trackEngagement()
  }

  const trackEngagement = () => {
    let startTime = Date.now()
    let maxScroll = 0
    let totalClicks = 0

    // Track scroll depth
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      maxScroll = Math.max(maxScroll, scrollPercent)
    }

    // Track clicks
    const handleClick = () => {
      totalClicks++
    }

    // Track time on page
    const handleBeforeUnload = () => {
      const timeOnPage = Date.now() - startTime
      const engagementData = {
        path: pathname,
        timeOnPage,
        maxScroll,
        totalClicks,
        timestamp: new Date().toISOString()
      }

      // Send engagement data
      navigator.sendBeacon("/api/analytics/engagement", JSON.stringify(engagementData))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("click", handleClick)
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("click", handleClick)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }

  return null
}

// Google Analytics 4 Script
export function GoogleAnalyticsScript() {
  return (
    <>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              page_title: 'Automatía',
              page_location: window.location.href,
              send_page_view: true
            });
          `,
        }}
      />
    </>
  )
}

// Hotjar Script
export function HotjarScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:0000000,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `,
      }}
    />
  )
}







