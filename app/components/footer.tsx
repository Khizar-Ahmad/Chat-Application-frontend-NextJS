import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MyApp. All rights reserved.</p>
        <div className="flex gap-6 text-sm">
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}