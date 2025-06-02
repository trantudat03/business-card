import React from "react";
import { Icon } from "zmp-ui";

type SettingItemProps = {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  icon?: string | React.ReactNode;
  showChevron?: boolean;
  onClick?: () => void;
  className?: string;
};

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  description,
  icon,
  showChevron = false,
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-between py-2 min-h-[60px] ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      {/* Left: icon + text */}
      <div className="flex items-center gap-4">
        {icon && (
          <div className="">
            {typeof icon === "string" ? (
              <img src={icon} alt="icon" className="w-6 h-6" />
            ) : (
              icon
            )}
          </div>
        )}

        <div className="flex flex-col gap-0">
          {typeof title === "string" ? (
            <p className="text-black text-lg font-semibold ">{title}</p>
          ) : (
            title
          )}

          {description &&
            (typeof description === "string" ? (
              <p className="text-sm text-slate-500">{description}</p>
            ) : (
              description
            ))}
        </div>
      </div>

      {/* Right: chevron */}
      {showChevron && (
        <div className="text-gray-400">
          <Icon icon="zi-chevron-right" size={24}/>
        </div>
      )}
    </div>
  );
};

export default SettingItem;
