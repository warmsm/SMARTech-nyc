import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  House,
  Image,
  MessageSquare,
  Menu,
  X as CloseIcon,
  Upload,
  LogOut,
  ChevronDown,
  ClipboardList,
  Settings,
  CheckCircle,
  MessageSquareWarning,
} from "lucide-react";

import { Instagram } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/app/components/ui/button";
import nycLogo from "figma:asset/32e65005e1211eef2a5c6c89d5f1fa935cae4da4.png";
import bagongPilipinasLogo from "figma:asset/55eb1781941b555e08c0b366d93a03c121091573.png";

// Custom Facebook icon
const FacebookIcon = ({
  className,
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
  </svg>
);

// Custom X icon - simple X shape
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Custom filled arrow down icon
const FilledArrowDown = ({
  className,
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentOffice, logout } = useAuth();

  const isCentral = currentOffice === "Central NYC";

  const navItems = [
    { path: "/", label: "Home", icon: House },
    { path: "/pubmats", label: "PubMats", icon: Image },
    {
      path: "/captions",
      label: "Captions",
      icon: MessageSquare,
    },
  ];

  const centralNavItems = isCentral
    ? [
        { path: "/review-approved", label: "Review Approved", icon: CheckCircle },
        { path: "/review-appeals", label: "Review Appeals", icon: MessageSquareWarning },
      ]
    : [];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-secondary text-secondary-foreground shadow-lg">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center h-16">
          {/* Left: Logo and Title */}
          <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
            <img
              src={nycLogo}
              alt="NYC Logo"
              className="h-8 w-8 md:h-10 md:w-10"
            />
            <img
              src={bagongPilipinasLogo}
              alt="Bagong Pilipinas Logo"
              className="h-8 w-8 md:h-10 md:w-10"
            />
            <div className="hidden sm:block">
              <h1 className="text-sm md:text-xl font-bold whitespace-nowrap">
                National Youth Commission
              </h1>
              {currentOffice && (
                <p className="text-xs text-secondary-foreground/70">
                  {currentOffice}
                </p>
              )}
            </div>
            <h1 className="text-sm font-bold sm:hidden">NYC</h1>
          </div>

          {/* Center: Desktop Navigation - uses flex-1 to take remaining space and centers content */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex space-x-1">
              {[...navItems, ...centralNavItems].map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-secondary-foreground/10"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Social Icons, Logout Button, and Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:space-x-4 group">
            {/* Social Icons */}
            <div className="flex items-center space-x-3 md:space-x-4">
              <a
                href="https://www.facebook.com/nationalyouthcommission"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#009FE3]"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5 md:h-6 md:w-6" />
              </a>
              <a
                href="https://x.com/NYCPilipinas?mx=2"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#009FE3]"
                aria-label="X (Twitter)"
              >
                <XIcon className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a
                href="https://www.instagram.com/nycpilipinas/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#009FE3]"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 md:h-6 md:w-6" />
              </a>
            </div>

            {/* Desktop Dropdown Menu */}
            <div className="hidden lg:block relative">
              <button
                onClick={() =>
                  setIsDropdownOpen(!isDropdownOpen)
                }
                className="p-2 rounded-md hover:bg-secondary-foreground/10 transition-colors"
                aria-label="User menu"
              >
                <FilledArrowDown className="h-5 w-5" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop to close dropdown when clicking outside */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />

                  {/* Dropdown content */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                    <div className="py-1">
                      {isCentral && (
                        <>
                          <button
                            onClick={() => {
                              navigate("/request-approval");
                              setIsDropdownOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <ClipboardList className="h-4 w-4 mr-2" />
                            Request Approval
                          </button>

                          <div className="border-t my-1" />
                        </>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-secondary-foreground/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden pb-4">
            {currentOffice && (
              <div className="px-4 py-2 mb-2 bg-secondary-foreground/5 rounded-md">
                <p className="text-xs text-secondary-foreground/70">
                  Logged in as:
                </p>
                <p className="text-sm font-medium">
                  {currentOffice}
                </p>
              </div>
            )}
            <div className="flex flex-col space-y-2">
              {[...navItems, ...centralNavItems].map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-secondary-foreground/10"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {isCentral && (
                <Button
                  onClick={() => {
                    navigate("/request-approval");
                    setIsOpen(false);
                  }}
                  variant="outline"
                  className="flex items-center justify-start px-4 py-3 h-auto bg-transparent border-secondary-foreground/20 hover:bg-secondary-foreground/10"
                >
                  <span>Request Approval</span>
                </Button>
              )}

              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2 justify-start px-4 py-3 h-auto bg-transparent border-secondary-foreground/20 hover:bg-secondary-foreground/10"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}