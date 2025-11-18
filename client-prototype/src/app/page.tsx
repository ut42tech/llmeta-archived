"use client";

import { ArrowRight, ChevronRight, LogIn, LogOut } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import BackgroundCanvas from "@/components/spatial/page/main/BackgroundCanvas";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, isLoading, profile, logout } = useAuth();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <BackgroundCanvas />

      {/* Content Layer */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Minimal Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-between px-6 py-8 md:px-12"
        >
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white/90" />
            <span className="text-sm text-white/90">PROJECT LLMeta</span>
          </div>

          {/* Auth Section */}
          <nav className="flex items-center gap-2">
            {!isLoading &&
              (isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-white/70 hover:bg-white/10 hover:text-white"
                    aria-label="ログアウト"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">ログアウト</span>
                  </Button>
                  <Avatar className="size-8 border border-white/20">
                    <AvatarImage src={profile.avatarUrl} alt="アバター" />
                    <AvatarFallback className="bg-white/10 text-xs">
                      {profile.initial}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <Link href="/auth/login">
                      <LogIn className="h-4 w-4" />
                      <span className="hidden sm:inline">ログイン</span>
                    </Link>
                  </Button>
                </motion.div>
              ))}
          </nav>
        </motion.header>

        {/* Hero Section */}
        <main className="flex flex-1 items-center justify-center px-6 md:px-12">
          <div className="max-w-4xl">
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mb-6 text-balance text-5xl font-light leading-tight tracking-tight md:text-7xl lg:text-8xl"
            >
              Intelligence
              <br />
              <span className="text-white/50">Meets Space</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mb-12 max-w-2xl text-pretty text-base leading-relaxed text-white/60 md:text-lg"
            >
              AIとメタバースが融合した、新しいコミュニケーションの形
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Link
                href="/lobby"
                className="group inline-flex items-center gap-3 rounded-none border border-white/20 bg-white/5 px-8 py-4 transition-all hover:border-white/40 hover:bg-white/10"
              >
                <span className="tracking-wide">体験する</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/vrm"
                className="group inline-flex items-center gap-2 px-8 py-4 text-white/70 transition-colors hover:text-white"
              >
                <span className="tracking-wide">アバターを見る</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </main>

        {/* Minimal Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="px-6 py-8 text-center text-xs font-light tracking-wider text-white/40 md:px-12"
        >
          © 2025 — Takuya Uehara, All Rights Reserved.
        </motion.footer>
      </div>

      {/* Scanline effect overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.02]">
        <div className="h-full w-full bg-[linear-gradient(0deg,transparent_50%,rgba(255,255,255,0.1)_50%)] bg-size-[100%_4px]" />
      </div>
    </div>
  );
}
