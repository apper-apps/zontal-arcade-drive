import { useEffect, useRef } from "react";
import ApperIcon from "@/components/ApperIcon";

const AdSense = ({ 
  publisherId, 
  adSlot, 
  width = "auto", 
  height = "auto",
  className = ""
}) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (publisherId && adSlot) {
      // Load AdSense script if not already loaded
      if (!window.adsbygoogle) {
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);

        script.onload = () => {
          // Initialize ad after script loads
          if (window.adsbygoogle && adRef.current) {
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
              console.error("AdSense error:", e);
            }
          }
        };
      } else {
        // Script already loaded, initialize ad
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error("AdSense error:", e);
        }
      }
    }
  }, [publisherId, adSlot]);

  if (!publisherId || !adSlot) {
    return (
      <div className={`adsense-container ${className}`}>
        <div className="flex flex-col items-center justify-center text-dark-muted">
          <ApperIcon name="Zap" size={32} className="mb-2 opacity-50" />
          <span className="text-sm">AdSense Not Configured</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          width: width,
          height: height
        }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSense;