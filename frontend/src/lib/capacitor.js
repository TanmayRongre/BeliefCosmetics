import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";

export const isNative = Capacitor.isNativePlatform();

/**
 * Initializes mobile platform behavior:
 * - Brand-colored status bar
 * - Auto-hides native splash screen
 * - Handles Android hardware back button cleanly with React Router
 */
export const setupCapacitor = (navigate, location) => {
  if (!isNative) return () => {};

  // 1. Status Bar Styling (Belief Cosmetics Dark Forest Green)
  try {
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#142923" });
  } catch (err) {
    console.debug("Capacitor StatusBar not available:", err);
  }

  // 2. Hide Splash Screen after initial load
  try {
    SplashScreen.hide();
  } catch (err) {
    console.debug("Capacitor SplashScreen not available:", err);
  }

  // 3. Android Hardware Back Button listener
  let backListener = null;
  CapApp.addListener("backButton", ({ canGoBack }) => {
    const isRoot = location.pathname === "/" || location.pathname === "";
    if (isRoot) {
      CapApp.exitApp();
    } else if (canGoBack) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }).then((handle) => {
    backListener = handle;
  });

  return () => {
    if (backListener) {
      backListener.remove();
    }
  };
};
