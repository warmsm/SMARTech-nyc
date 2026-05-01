import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Menu,
  X as CloseIcon,
  LogOut,
  ClipboardList,
  CheckCircle,
  MessageSquareWarning,
} from "lucide-react";

import { Instagram } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/app/components/ui/button";
import { ROUTES } from "@/constants/routes";
import nycLogo from "figma:asset/32e65005e1211eef2a5c6c89d5f1fa935cae4da4.png";
import bagongPilipinasLogo from "figma:asset/55eb1781941b555e08c0b366d93a03c121091573.png";

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
  const { profile, isLoading, logout, isAdmin } = useAuth();
  const isCentral = isAdmin;
  const currentOffice = profile?.office ?? null;

  const navItems = useMemo(
    () => [
      { path: ROUTES.HOME, label: "Home" },
      { path: ROUTES.PUBMATS, label: "PubMats" },
      { path: ROUTES.CAPTIONS, label: "Captions" },
    ],
    [],
  );

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsDropdownOpen(false);
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <nav
      style={{ backgroundColor: "#000033" }}
      className="text-white"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center h-16">
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
              <h1 className="text-sm md:text-xl font-bold whitespace-nowrap text-white">
                National Youth Commission
              </h1>
              <p className="text-xs text-white/70">
                {isLoading
                  ? "Loading office..."
                  : currentOffice || ""}
              </p>
            </div>
            <h1 className="text-sm font-bold sm:hidden">NYC</h1>
          </div>

          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex" style={{ gap: "2.5rem" }}>
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative"
                    style={{
                      paddingTop: "0.85rem",
                      paddingBottom: "0.7rem",
                      letterSpacing: "-0.2px",
                      color: isActive ? "#FFFFFF" : "#FFFFFF",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#0099FF";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#FFFFFF";
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "0",
                          left: "0",
                          right: "0",
                          height: "3px",
                          backgroundColor: "#FFFF00",
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-4 group">
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
                              navigate(ROUTES.REQUEST_APPROVAL);
                              setIsDropdownOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <ClipboardList className="h-4 w-4 mr-2" />
                            Requests
                          </button>

                          <button
                            onClick={() => {
                              navigate(ROUTES.REVIEW_APPROVED);
                              setIsDropdownOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approved
                          </button>

                          <button
                            onClick={() => {
                              navigate(ROUTES.REVIEW_APPEALS);
                              setIsDropdownOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <MessageSquareWarning className="h-4 w-4 mr-2" />
                            Appeals
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

        {isOpen && (
          <div className="lg:hidden pb-4">
            {!isLoading && currentOffice && (
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
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="relative px-4 py-3 transition-colors"
                    style={{
                      letterSpacing: "-0.2px",
                      color: isActive ? "#FFFFFF" : "#FFFFFF",
                      borderLeft: isActive
                        ? "3px solid #FFFF00"
                        : "none",
                      paddingLeft: isActive
                        ? "calc(1rem - 3px)"
                        : "1rem",
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {isCentral && (
                <>
                  <Button
                    onClick={() => {
                      navigate(ROUTES.REQUEST_APPROVAL);
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="flex items-center justify-start px-4 py-3 h-auto bg-transparent border-secondary-foreground/20 hover:bg-secondary-foreground/10"
                  >
                    <span>Requests</span>
                  </Button>

                  <Button
                    onClick={() => {
                      navigate(ROUTES.REVIEW_APPROVED);
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="flex items-center justify-start px-4 py-3 h-auto bg-transparent border-secondary-foreground/20 hover:bg-secondary-foreground/10"
                  >
                    <span>Approved</span>
                  </Button>

                  <Button
                    onClick={() => {
                      navigate(ROUTES.REVIEW_APPEALS);
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="flex items-center justify-start px-4 py-3 h-auto bg-transparent border-secondary-foreground/20 hover:bg-secondary-foreground/10"
                  >
                    <span>Appeals</span>
                  </Button>
                </>
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