import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
} from "@heroui/navbar"
import { Link } from "@heroui/link"
import { link as linkStyles } from "@heroui/theme"
import clsx from "clsx"
import { useState, useEffect } from "react"
import { ThemeSwitch } from "@/components/theme-switch"
import { LogoSection } from "./LogoSection"
import { ILayout } from "@/interfaces/ILayout"

interface Page { _id: string; title: string }

interface Props {
  config: ILayout
}

export const Navbar = ({ config }: Props) => {
  const [showLogo, setShowLogo] = useState(true)
  const [pages] = useState<Page[]>([])

  useEffect(() => {
    window.addEventListener("scroll", () => setShowLogo(window.scrollY < 50))
    return () => window.removeEventListener("scroll", () => { })
  }, [])


  const items = [
    ...config.navItems,
    ...pages.map(p => ({ label: p.title, href: `/pages/${p._id}` }))
  ]

  return (
    <NextUINavbar maxWidth="xl" className="mt-4">
      <NavbarContent justify="start" className={clsx("transition-opacity duration-300", showLogo ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <LogoSection />
      </NavbarContent>

      <NavbarContent justify="center" className="hidden lg:flex">
        {items.map(item => (
          <NavbarItem key={item.href}>
            <Link
              className={clsx(
                linkStyles({ color: "foreground" }),
                "text-lg font-bold data-[active=true]:text-primary data-[active=true]:font-extrabold"
              )}
              color="foreground"
              href={item.href}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="lg:hidden">
          <NavbarMenuToggle />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {items.map(item => (
          <NavbarItem key={item.href}>
            <Link className="text-lg" href={item.href}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarMenu>
    </NextUINavbar>
  )
}
