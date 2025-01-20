"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, MenuIcon } from 'lucide-react'
import { useTheme } from "next-themes"
import { SearchBar } from "@/components/search-bar"
import { useWallet } from "@/hooks/useWallet"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setTheme, theme } = useTheme()
  const { address, connectWallet, disconnectWallet, error } = useWallet()

  const handleWalletClick = () => {
    if (address) {
      disconnectWallet()
    } else {
      connectWallet()
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="border-b">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-4">
              <img
                src={theme === "dark" ? "/logo-light.png" : "/logo-dark.png"}
                alt="Logo Mopsos AI"
                className="h-16 w-32 md:h-20 md:w-40"
              />
              <span className="text-xl font-bold md:text-2xl">DApp Square</span>
            </Link>
            <div className="hidden md:block">
              <SearchBar />
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
                <span className="sr-only">Switch theme</span>
              </Button>
              <Button 
                onClick={handleWalletClick}
                variant={address ? "outline" : "default"}
              >
                {address ? formatAddress(address) : "Connect Wallet"}
              </Button>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMenuOpen(true)}
                >
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-4">
                  <SearchBar />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark")
                      setIsMenuOpen(false)
                    }}
                  >
                    {theme === "dark" ? (
                      <SunIcon className="h-5 w-5 mr-2" />
                    ) : (
                      <MoonIcon className="h-5 w-5 mr-2" />
                    )}
                    Switch theme
                  </Button>
                  <Button 
                    onClick={() => {
                      handleWalletClick()
                      setIsMenuOpen(false)
                    }}
                    variant={address ? "outline" : "default"}
                  >
                    {address ? formatAddress(address) : "Connect Wallet"}
                  </Button>
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
