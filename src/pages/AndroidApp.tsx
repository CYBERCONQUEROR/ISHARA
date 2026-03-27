import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, ShieldCheck, Info } from "lucide-react";

const AndroidApp = () => {
  const apkUrl = "https://www.upload-apk.com/en/kfzyzHCzTVVOK3i";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero section */}
        <div className="grid gap-10 md:grid-cols-2 items-center mb-16">
          <div>
            <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 ring-1 ring-cyan-500/40">
              Android Application
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
              Experience ISHARA on your{" "}
              <span className="text-cyan-400">Android phone</span>
            </h1>
            <p className="mt-4 text-sm md:text-base text-slate-300 leading-relaxed">
              Take ISHARA with you anywhere. Use real‑time ISL translation,
              practice gestures, and communicate more confidently right from
              your Android device.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button
                asChild
                className="bg-ishara-gradient hover:opacity-90 text-white rounded-full px-6 py-6 text-sm md:text-base shadow-lg shadow-cyan-500/30"
              >
                <a href={apkUrl} target="_blank" rel="noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download Android APK
                </a>
              </Button>
              <p className="text-xs md:text-sm text-slate-400">
                Opens a new page with the latest APK download.
              </p>
            </div>
          </div>

          <Card className="relative border-cyan-500/30 bg-slate-900/80 shadow-2xl shadow-cyan-500/20">
            <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-cyan-500/30 via-teal-400/10 to-transparent opacity-70" />
            <CardContent className="relative pt-8 pb-6 px-6 flex flex-col items-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                <Smartphone className="h-7 w-7" />
              </div>
              <p className="text-sm text-slate-200 text-center">
                Optimized for modern Android devices with a clean, accessible
                interface that matches the ISHARA web experience.
              </p>
              <div className="mt-6 grid w-full grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="rounded-xl bg-slate-900/80 border border-slate-700/60 px-3 py-3">
                  <p className="font-semibold text-cyan-300 mb-1">
                    Real-time gestures
                  </p>
                  <p>Use your camera for instant ISL recognition and text.</p>
                </div>
                <div className="rounded-xl bg-slate-900/80 border border-slate-700/60 px-3 py-3">
                  <p className="font-semibold text-cyan-300 mb-1">
                    Learn on the go
                  </p>
                  <p>Access learning modules and quick practice sessions.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-slate-900/80 border-slate-700/70">
            <CardHeader className="flex flex-row items-center gap-2 pb-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <CardTitle className="text-sm">Safe download</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-2">
              <p>
                The button above takes you directly to our hosted APK download
                page at{" "}
                <span className="break-all text-cyan-300">
                  https://kridikshit.onrender.com/
                </span>
                .
              </p>
              <p>Always download the app only from this official link.</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-slate-700/70">
            <CardHeader className="flex flex-row items-center gap-2 pb-3">
              <Info className="h-5 w-5 text-cyan-400" />
              <CardTitle className="text-sm">Installation tips</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-2">
              <p>
                After downloading the APK, open it from your notifications or
                Downloads folder to start installation.
              </p>
              <p>
                If prompted, temporarily allow installs from unknown sources in
                your Android settings, then disable it again after installing.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-slate-700/70">
            <CardHeader className="flex flex-row items-center gap-2 pb-3">
              <Smartphone className="h-5 w-5 text-teal-400" />
              <CardTitle className="text-sm">Best experience</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-2">
              <p>For best performance, we recommend:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Android 10 or newer</li>
                <li>Stable internet connection</li>
                <li>Good lighting for camera-based gestures</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AndroidApp;

