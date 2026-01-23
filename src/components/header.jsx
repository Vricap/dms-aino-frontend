import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ThemeProvider } from "./theme-provider";
import { ModeToggle } from "./mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AinoLogo from "../pages/assets/aino-login.png";

export function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      if (token) {
        setUserName(localStorage.getItem("username"));
        setEmail(localStorage.getItem("email"));
        setRole(localStorage.getItem("role"));
      }
    };

    checkToken();

    // Listen for changes (even from other tabs)
    window.addEventListener("storage", checkToken);

    // Optional: poll for changes in the same tab
    const interval = setInterval(checkToken, 1000);

    return () => {
      window.removeEventListener("storage", checkToken);
      clearInterval(interval);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("division");
    setIsLoggedIn(false);
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center justify-center gap-0">
          <Link to="/dashboard" className="flex flex-col">
            <img src={AinoLogo} alt="AINO Payment Solution" className="w-24" />
            {/* <span className="text-xs text-muted-foreground -mt-6">
              Document Management
            </span>*/}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* NO NOTIFICATION*/}
          {/* <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>*/}
          <ThemeProvider>
            <ModeToggle />
          </ThemeProvider>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  // variant="ghost"
                  className="h-8 w-8 rounded-full"
                >
                  {/* <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>*/}
                  <div className="bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                    {username?.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Username: {username}
                    </p>
                    <p className="text-sm font-medium leading-none">
                      Role: {role}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>*/}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate("/login")}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
}
