import type React from "react"
export default function POSLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="pos-theme min-h-screen bg-pos-muted">{children}</div>
}

