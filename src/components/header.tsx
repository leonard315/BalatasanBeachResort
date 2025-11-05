import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Mountain } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              Balatasan Resort Hub
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/accommodations"
              className="transition-colors hover:text-primary"
            >
              Accommodations
            </Link>
            <Link
              href="/tours"
              className="transition-colors hover:text-primary"
            >
              Tours
            </Link>
            <Link
              href="/bookings"
              className="transition-colors hover:text-primary"
            >
              My Bookings
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <Mountain className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline">
                  Balatasan Resort Hub
                </span>
              </Link>
              <div className="grid gap-2 py-6">
                <Link
                  href="/accommodations"
                  className="flex w-full items-center py-2 text-lg font-semibold"
                >
                  Accommodations
                </Link>
                <Link
                  href="/tours"
                  className="flex w-full items-center py-2 text-lg font-semibold"
                >
                  Tours
                </Link>
                <Link
                  href="/bookings"
                  className="flex w-full items-center py-2 text-lg font-semibold"
                >
                  My Bookings
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          <div className="hidden items-center space-x-2 md:flex">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
