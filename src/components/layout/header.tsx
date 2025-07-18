import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
   Search, Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { persistor } from "@/store";

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  className?: string;
}

const searchSuggestions = [
  // { label: "Users", value: "users", href: "/dashboard/users" },
  { label: "Home", value: "home", href: "/dashboard/home" },
  { label: "Blogs", value: "blogs", href: "/dashboard/blogs" },
  // { label: "Products", value: "products", href: "/dashboard/products" },
  { label: "Purohits", value: "purohits", href: "/dashboard/purohits" },
  // { label: "Services", value: "services", href: "/dashboard/services" },
  { label: "Daily Routines", value: "dailyroutines", href: "/dashboard/dailyroutines" },
  { label: "Appointments", value: "appointments", href: "/dashboard/appointments" },
  { label: "Leads", value: "leads", href: "/dashboard/leads" },
];

const headerVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" as const }
  }
};

const searchVariants = {
  focused: { scale: 1.02, transition: { duration: 0.2 } },
  unfocused: { scale: 1, transition: { duration: 0.2 } }
};

const Header = ({ title, onMenuClick, className }: HeaderProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])


  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "sticky top-0 z-30 w-full h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b",
        className
      )}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          {onMenuClick && (
            <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            </Button>
          )}
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-xl font-semibold hidden sm:block">{title}</h1>
          </motion.div>
          {/* Search Bar - Desktop */}
          <motion.div
            variants={searchVariants}
            whileFocus="focused"
            className="hidden lg:block"
          >
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={searchOpen}
                  className="w-[300px] justify-between text-muted-foreground"
                >
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <span>Search dashboard...</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 hidden sm:inline-flex">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search..." 
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Quick Navigation">
                      {searchSuggestions
                        .filter(item => 
                          item.label.toLowerCase().includes(searchValue.toLowerCase())
                        )
                        .map((item) => (
                          <CommandItem
                            key={item.value}
                            onSelect={() => {
                              setSearchOpen(false);
                              navigate(item.href);
                            }}
                            value={item.value}
                            className="cursor-pointer"
                          >
                            {item.label}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </motion.div>
        </div>
        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Search Button - Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
          >
            <Search className="h-5 w-5" />
          </Button>
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/logo.png" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    PJ
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Puja Jyotish Admin</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={() => {
                  dispatch(logout());
                  persistor.purge();
                  navigate('/login');
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
