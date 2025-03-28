import { useState } from "react";
import { ChevronDown, LogOut, Settings } from "lucide-react";

interface ProfileDropdownProps {
  name: string;
  image?: string;
}

export function UserAccount({ name, image }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Button Profile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
      >
        {/* Avatar */}
        {image ? (
          <img
            src={image}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        )}
        <span className="text-gray-700">{name}</span>
        <ChevronDown size={18} className="text-gray-500" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden">
          <button
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={16} className="mr-2 text-gray-600" />
            Setting
          </button>
          <button
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            onClick={async () => {
              try {
                await fetch("/api/auth/logout", { method: "GET" });
                window.location.href = "/"; // Redirect ke halaman home setelah logout
              } catch (error) {
                console.error("Logout failed:", error);
              }

              setIsOpen(false);
            }}
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
