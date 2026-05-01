import { useState } from "react";
import smartechLogo from "@/imports/Black_and_Grey__Y2K_Shodwe_Fashion_Logo.png";

export function SmarTechLogo() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <img
          src={smartechLogo}
          alt="SMARTech Logo"
          className="h-16 w-16 object-contain cursor-pointer transition-opacity hover:opacity-80"
        />

        {showTooltip && (
          <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded whitespace-nowrap">
            developed by FEU BSAM students
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800" />
          </div>
        )}
      </div>
    </div>
  );
}
