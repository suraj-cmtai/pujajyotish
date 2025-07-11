import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
 FileText, LogOut, Newspaper, Users2, GalleryVerticalEnd, MailCheck, ChevronLeft, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { persistor } from "@/store";

const links = [
  // { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Blogs", href: "/dashboard/blogs", icon: Newspaper },
  // { name: "Products", href: "/dashboard/products", icon: LayoutDashboard },
  { name: "Purohits", href: "/dashboard/purohits", icon: Users2 },
  // { name: "Services", href: "/dashboard/services", icon: BookOpenText },
  { name: "Daily Routines", href: "/dashboard/dailyroutines", icon: FileText },
  { name: "Appointments", href: "/dashboard/appointments", icon: GalleryVerticalEnd },
  { name: "Leads", href: "/dashboard/leads", icon: MailCheck },
];

const sidebarVariants = {
  open: { width: 280, transition: { duration: 0.3, ease: "easeInOut" as const } },
  collapsed: { width: 80, transition: { duration: 0.3, ease: "easeInOut" as const } }
};

const linkVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } }
};

const textVariants = {
  hidden: { opacity: 0, width: 0, transition: { duration: 0.2 } },
  visible: { opacity: 1, width: "auto", transition: { duration: 0.3, delay: 0.1 } }
};

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const mobileDrawerVariants = {
  hidden: { x: -300, opacity: 0, transition: { duration: 0.25, ease: "easeInOut" as const } },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeInOut" as const } },
};

const Sidebar = ({ onClose, isMobile = false }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false);
    }
  }, [isMobile]);

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const toggleCollapse = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    if (isMobile && onClose) {
      onClose();
    }
    navigate("/login");
  };

  const SidebarContent = () => (
    <motion.div
      variants={sidebarVariants}
      animate={isCollapsed && !isMobile ? "collapsed" : "open"}
      className="flex flex-col h-full bg-background border-r"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <AnimatePresence mode="wait">
          {(!isCollapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center space-x-3"
            >
              <Link to="/" className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/logo.png" alt="User" />
                    <AvatarFallback className="bg-gradient-to-br from-orange-600 to-navy-600 text-white">
                      PJ
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </Link>
              <div>
                <Link to="/" className="text-lg font-bold text-primary">
                  <span className="text-navy">Puja</span> <span className="text-orange">Jyotish</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Collapse Toggle (Desktop only) */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="h-8 w-8"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </Button>
        )}
        {/* Close Button (Mobile only) */}
        {isMobile && onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <TooltipProvider>
          {links.map((link, index) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            const LinkContent = (
              <motion.div
                variants={linkVariants}
                whileHover="hover"
                whileTap="tap"
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors cursor-pointer group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted/50"
                )}
                onClick={handleLinkClick}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <AnimatePresence mode="wait">
                  {(!isCollapsed || isMobile) && (
                    <motion.div
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="flex items-center justify-between flex-1 min-w-0"
                    >
                      <span className="font-medium truncate">{link.name}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
            return (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {isCollapsed && !isMobile ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to={link.href}>
                        {LinkContent}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex items-center space-x-2">
                      <span>{link.name}</span>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link to={link.href}>
                    {LinkContent}
                  </Link>
                )}
              </motion.div>
            );
          })}
          {/* Logout Button as nav item */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: links.length * 0.05 }}
          >
            {isCollapsed && !isMobile ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full h-12"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span>Logout</span>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3 mt-2"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            )}
          </motion.div>
        </TooltipProvider>
      </nav>
      <Separator />
      {/* Footer removed */}
    </motion.div>
  );

  if (isMobile) {
    // Render as sliding drawer for mobile
    return (
      <motion.div
        className="fixed inset-y-0 left-0 z-50 w-64 max-w-full h-full bg-background border-r shadow-lg"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={mobileDrawerVariants}
      >
        {SidebarContent()}
      </motion.div>
    );
  }
  // Desktop sidebar
  return SidebarContent();
};

export default Sidebar;
