import { ClerkProvider } from "@clerk/nextjs";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import RouteLayout from "../components/RouteLayout.jsx";
import ReduxProvider from "../redux/provider";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrainsMono",
});

export const metadata = {
  title: "Alif's PORTFOLIO",
  description: "A modern portfolio by NextJS",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={jetbrainsMono.variable}>
          <ReduxProvider>
            <RouteLayout>{children}</RouteLayout>
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
