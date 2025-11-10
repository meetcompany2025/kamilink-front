"use client"

import { useState, useCallback, memo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LogOut,
  Menu,
  Settings,
  Truck,
  User,
  X,
  Package,
  FileText,
  Home,
  Search,
  DollarSign,
  HelpCircle,
  MapPin,
  User2,
  User2Icon,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslation } from "@/hooks/use-translation"
import { useScreenSize } from "@/hooks/use-screen-size"
import { useAuth } from "./auth-provider"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationIndicator } from "./notification-indicator"

// Memoize navigation items to prevent unnecessary re-renders
const MemoizedNavItems = memo(
  ({
    items,
    isActivePath,
  }: {
    items: any[]
    isActivePath: (path: string) => boolean
  }) => (
    <>
      {items.map((item) => (
        <NavigationMenuItem key={item.href}>
          <Link href={item.href} legacyBehavior passHref>
            <NavigationMenuLink
              className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                isActivePath(item.href) ? "bg-accent/50 font-semibold" : "bg-background"
              }`}
            >
              {item.label}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ))}
    </>
  ),
)
MemoizedNavItems.displayName = "MemoizedNavItems"

// Memoize public navigation items
const MemoizedPublicNavItems = memo(({ items }: { items: any[] }) => (
  <>
    {items.map((item, index) => (
      <NavigationMenuItem key={index}>
        {item.items ? (
          <>
            <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                {item.items.map((subItem: any, subIndex: number) => (
                  <NavigationMenuLink asChild key={subIndex}>
                    <Link
                      href={subItem.href}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">{subItem.label}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{subItem.description}</p>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </>
        ) : (
          <Link href={item.href} legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
              {item.label}
            </NavigationMenuLink>
          </Link>
        )}
      </NavigationMenuItem>
    ))}
  </>
))
MemoizedPublicNavItems.displayName = "MemoizedPublicNavItems"

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const { user, isLoading, signOut, userProfile } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Get user initials for avatar fallback - memoized to prevent recalculation
  const getUserInitials = useCallback(() => {
  const fullName = userProfile?.person?.fullName ?? user?.user_metadata?.name ?? "";
  if (!fullName) return "U";
  return fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}, [userProfile?.person?.fullName, user?.user_metadata?.name]);


  // Check if the current path matches a navigation item - memoized
  const isActivePath = useCallback(
    (path: string) => {
      return pathname === path || pathname.startsWith(`${path}/`)
    },
    [pathname],
  )

  // Handle logout - memoized
  const handleLogout = useCallback(async () => {
    try {
      await signOut()
      router.replace("/")
      router.refresh()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }, [signOut, router])

  // Get navigation items based on user type - memoized
  const getNavItems = useCallback(() => {
    if (!user) return []

    if (user.profile === "ADMIN") {
      return [
        { label: t("navigation.dashboard"), href: "/dashboard/admin", icon: <Home className="mr-2 h-4 w-4" /> },
        { label: t("navigation.clients"), href: "/services/admin/find-client", icon: <User2 className="mr-2 h-4 w-4" /> },
        {
          label: t("navigation.transporters"),
          href: "/services/admin/find-transporter",
          icon: <User2Icon className="mr-2 h-4 w-4" />,
        },
        {
          label: t("navigation.freights"),
          href: "/services/admin/find-freight",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        { label: t("navigation.tracking"), href: "/services/admin/tracking", icon: <MapPin className="mr-2 h-4 w-4" /> },
        { label: t("navigation.reports"), href: "/services/admin/reports", icon: <FileText className="mr-2 h-4 w-4" /> },
      ]
    } 
    else if (user.profile === "CLIENT") {
      return [
        { label: t("navigation.dashboard"), href: "/dashboard/client", icon: <Home className="mr-2 h-4 w-4" /> },
        { label: t("navigation.request"), href: "/services/client/freight", icon: <Truck className="mr-2 h-4 w-4" /> },
        {
          label: t("navigation.my_freights"),
          href: "/services/client/my-freights",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        { label: t("navigation.tracking"), href: "/services/client/tracking", icon: <MapPin className="mr-2 h-4 w-4" /> },
        { label: t("navigation.reports"), href: "/services/client/reports", icon: <FileText className="mr-2 h-4 w-4" /> },
        { label: t("navigation.faq"), href: "/faq", icon: <HelpCircle className="mr-2 h-4 w-4" /> },
      ]
    } else {
      return [
        { label: t("navigation.dashboard"), href: "/dashboard/transporter", icon: <Home className="mr-2 h-4 w-4" /> },
        { label: t("navigation.find_freights"), href: "/services/transporter/find-freight", icon: <Search className="mr-2 h-4 w-4" /> },
        {
          label: t("navigation.vehicles"),
          href: "/services/transporter/vehicles",
          icon: <Truck className="mr-2 h-4 w-4" />,
        },
        {
          label: t("navigation.my_freights"),
          href: "/services/transporter/my-freights",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        {
          label: t("navigation.finances"),
          href: "/services/transporter/financial",
          icon: <DollarSign className="mr-2 h-4 w-4" />,
        },
        { label: t("navigation.reports"), href: "/services/transporter/reports", icon: <FileText className="mr-2 h-4 w-4" /> },
        { label: t("navigation.faq"), href: "/faq", icon: <HelpCircle className="mr-2 h-4 w-4" /> },
      ]
    }
  }, [user, t])

  // Get public navigation items for non-authenticated users - memoized
  const getPublicNavItems = useCallback(() => {
    return [
      
      { label: t("navigation.home"), href: "/" },
      { label: t("navigation.services"), href: "/services" },
      { label: t("navigation.about"), href: "/about" },
    ]
  }, [])

  const navItems = user ? getNavItems() : []
  const publicNavItems = !user ? getPublicNavItems() : []

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <span className="text-3xl font-bold">
              <span className="text-slate-900 dark:text-slate-200">Kami</span>
              <span className="text-green-500">Link</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation - Authenticated User */}
        {user && !isMobile && (
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <MemoizedNavItems items={navItems} isActivePath={isActivePath} />
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* Desktop Navigation - Public */}
        {!user && !isMobile && (
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <MemoizedPublicNavItems items={publicNavItems} />
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* Mobile Navigation */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" onClick={() => setIsMenuOpen(true)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" onCloseAutoFocus={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <Link
                  href={user ? "/" : "/"}
                  // href={user ? "/dashboard" : "/"}
                  className="flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-3xl font-bold">
                    <span className="text-slate-900 dark:text-slate-200">Kami</span>
                    <span className="text-green-500">Link</span>
                  </span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Mobile Menu - Authenticated User */}
              {user && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b pb-4">
                    <Avatar>
                      <AvatarImage
                        src={userProfile?.avatar_url || "/placeholder.svg"}
                        alt={userProfile?.person.fullName || "User"}
                      />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{userProfile?.person.fullName || user?.user_metadata?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                          isActivePath(item.href) ? "bg-accent/50 font-medium" : ""
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-auto border-t pt-4">
                    <div className="flex justify-between mb-4">
                      <LanguageSwitcher />
                      <ThemeToggle />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button asChild variant="outline" size="sm" className="justify-start">
                        <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          {t("navigation.profile")}
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="justify-start">
                        <Link href="/settings" onClick={() => setIsMenuOpen(false)}>
                          <Settings className="mr-2 h-4 w-4" />
                          {t("navigation.settings")}
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="justify-start"
                        onClick={() => {
                          handleLogout()
                          setIsMenuOpen(false)
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("common.logout")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Menu - Public */}
              {!user && (
                <div className="flex flex-col gap-4">
                  {publicNavItems.map((item, index) =>
                    item.items ? (
                      <div key={index} className="border-b pb-2">
                        <p className="text-sm font-medium mb-2">{item.label}</p>
                        <div className="flex flex-col gap-2">
                          {item.items.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={index}
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground border-b pb-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t(item.label.toString())}
                      </Link>
                    ),
                  )}
                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex justify-end gap-2 mb-2">
                      <LanguageSwitcher />
                      <ThemeToggle />
                    </div>
                    <Button asChild>
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        {t("common.login")}
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                        {t("common.register")}
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Auth Buttons or User Menu */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />

          {/* Show these buttons only when not logged in */}
          {!user && !isLoading && (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">{t("common.login")}</Link>
              </Button>
              <Button asChild variant="default">
                <Link href="/register">{t("common.register")}</Link>
              </Button>
            </>
          )}

          {/* Show user menu when logged in */}
          {user && (
            <div className="flex items-center gap-2">
              <NotificationIndicator />

              {/* Botão de logout visível */}
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>{t("common.logout")}</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={userProfile?.avatarUrl || ""}
                        alt={userProfile?.fullName || "User"}
                        onError={(e) => {
                          // Hide the image if it fails to load
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                 <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userProfile?.person?.fullName || user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userProfile?.email || user?.email}
                      </p>
                    </div>
                </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <Home className="mr-2 h-4 w-4" />
                      <span>{t("navigation.dashboard")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("navigation.profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t("navigation.settings")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("common.logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
