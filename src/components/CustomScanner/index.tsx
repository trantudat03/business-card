import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import "./style.css"

const CustomScanner = ({ onDetected }) => {
  const videoRef = useRef(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [hasFlash, setHasFlash] = useState(false);
  const [flashOn, setFlashOn] = useState(false);


  useEffect(() => {
    if (videoRef.current) {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          console.log("QR code detected:");
          onDetected(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          calculateScanRegion: video => {
            const regionSize = 500;
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
        
            return {
              x: (videoWidth - regionSize) / 2,
              y: (videoHeight - regionSize) / 2,
              width: regionSize,
              height: regionSize
            };
          },
          maxScansPerSecond: 1,
        }
      );
      qrScanner.start();
      setScanner(qrScanner);
      qrScanner.hasFlash().then(setHasFlash);
  
      return () => {
        qrScanner.stop();
        qrScanner.destroy();
      };
    }
  }, []);

  const toggleFlash = async () => {
    if (scanner && hasFlash) {
      await scanner.toggleFlash();
      const flashNow = await scanner.isFlashOn();
      setFlashOn(flashNow);
    }
  };
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      <video ref={videoRef} className="w-full h-full object-cover" />
      <div className="scanner-overlay ">
        <div className="scan-hole">
        <div className="scan-line"></div>
        </div>
        {hasFlash && (
          <button
            className="absolute top-4 right-4 z-50"
            onClick={toggleFlash}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-7 h-7 ${flashOn ? 'text-yellow-400' : 'text-white'}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
              />
            </svg>
          </button>
        )}
      </div>

    </div>
  );
};

export default CustomScanner
