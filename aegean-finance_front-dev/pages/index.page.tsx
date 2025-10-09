import { useEffect } from "react"
import { LandingMain } from "src/modules/landMain";
import { useRootStore } from "src/store/root"


export default function LandingPage () {
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Landing',
    })
  }, [trackEvent]);

  return (
    <LandingMain />
  )
}

LandingPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <>
      {page}
    </>
  )
}

