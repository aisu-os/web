import { useRef, createRef, useMemo, useCallback } from 'react'
import { cn } from '@/lib/cn'
import { useClickOutside } from '@/hooks/use-click-outside'
import { useMenuBarStore } from '@/stores/use-menubar-store'
import { useAuthStore } from '@/stores/use-auth-store'
import {
  SYSTEM_BRAND_MENU,
  DEFAULT_SYSTEM_MENUS,
} from './taskbar.constants'
import MenuDropdown from './MenuDropdown'

const BrandLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 120 120"
    width={14}
    height={14}
    className="opacity-90"
  >
    <defs>
      <linearGradient id="barIceG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#7DD3FC' }} />
        <stop offset="50%" style={{ stopColor: '#38BDF8' }} />
        <stop offset="100%" style={{ stopColor: '#0EA5E9' }} />
      </linearGradient>
    </defs>
    <g transform="translate(60,60)">
      <polygon
        points="0,-50 43,-25 43,25 0,50 -43,25 -43,-25"
        fill="url(#barIceG)"
        stroke="#BAE6FD"
        strokeWidth="2"
        opacity="0.95"
      />
      <polygon
        points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15"
        fill="none"
        stroke="#BAE6FD"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <circle cx="0" cy="0" r="6" fill="#fff" opacity="0.85" />
    </g>
  </svg>
)

const MenuBar = () => {
  const activeMenu = useMenuBarStore((s) => s.activeMenu)
  const appMenuConfig = useMenuBarStore((s) => s.appMenuConfig)
  const setActiveMenu = useMenuBarStore((s) => s.setActiveMenu)
  const closeMenu = useMenuBarStore((s) => s.closeMenu)

  const logout = useAuthStore((s) => s.logout)
  const openAbout = useMenuBarStore((s) => s.openAbout)

  const containerRef = useRef<HTMLDivElement>(null)
  const brandButtonRef = useRef<HTMLButtonElement>(null)

  useClickOutside(containerRef, closeMenu)

  const handleAction = useCallback((action: string) => {
    closeMenu()

    switch (action) {
      case 'system:about':
        openAbout()
        break
      case 'system:fullscreen':
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          document.documentElement.requestFullscreen()
        }
        break
      case 'system:logout':
        logout()
        break
      default:
        break
    }
  }, [closeMenu, logout, openAbout])

  const appName = useMenuBarStore((s) => s.appName)

  const menus = appMenuConfig?.menus ?? DEFAULT_SYSTEM_MENUS.menus

  const menuRefs = useMemo(
    () => menus.map(() => createRef<HTMLButtonElement>()),
    [menus],
  )

  const handleMenuClick = (label: string) => {
    setActiveMenu(activeMenu === label ? '' : label)
  }

  const handleMenuHover = (label: string) => {
    if (activeMenu) {
      setActiveMenu(label)
    }
  }

  return (
    <div className="flex h-full pl-1 items-center" ref={containerRef}>
      {/* Brand menu */}
      <div className="relative">
        <button
          ref={brandButtonRef}
          onClick={() => handleMenuClick(SYSTEM_BRAND_MENU.label)}
          onMouseEnter={() => handleMenuHover(SYSTEM_BRAND_MENU.label)}
          className={cn(
            'relative z-1 flex h-full items-center px-2 outline-none py-0.5',
            'text-white/90 transition-none',
            activeMenu === SYSTEM_BRAND_MENU.label
              ? 'rounded bg-white/20'
              : 'hover:rounded hover:bg-white/10',
          )}
        >
          <BrandLogo />
        </button>
        <MenuDropdown
          items={SYSTEM_BRAND_MENU.items}
          isVisible={activeMenu === SYSTEM_BRAND_MENU.label}
          anchorRef={brandButtonRef}
          onAction={handleAction}
        />
      </div>

      {/* App name (bold, non-interactive) */}
      <div className="flex h-full items-center px-2 text-[13px] font-semibold text-white/90 cursor-default select-none">
        {appName}
      </div>

      {/* App menus */}
      {menus.map((menu, index) => {
        const isOpen = activeMenu === menu.label

        return (
          <div key={menu.label} className="relative">
            <button
              ref={menuRefs[index]}
              onClick={() => handleMenuClick(menu.label)}
              onMouseEnter={() => handleMenuHover(menu.label)}
              className={cn(
                'relative z-[1] flex h-full items-center px-2 text-[13px] font-medium outline-none',
                'text-white/90 transition-none',
                isOpen
                  ? 'rounded bg-white/20'
                  : 'hover:rounded hover:bg-white/10',
              )}
            >
              {menu.label}
            </button>
            <MenuDropdown
              items={menu.items}
              isVisible={isOpen}
              anchorRef={menuRefs[index]}
              onAction={handleAction}
            />
          </div>
        )
      })}
    </div>
  )
}

export default MenuBar
