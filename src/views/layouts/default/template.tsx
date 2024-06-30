import { Link, Outlet } from 'react-router-dom'
import { Navigation } from './nav'
import { Footer } from './footer'
import { Toaster } from '@/views/components/ui/toaster'
export function Template() {
    return (
        <>
            <main id="default-template">
                <header
                    className={`relative z-10 flex w-full items-center justify-between`}
                >
                    <Navigation />
                </header>
                <Outlet />
                <Footer />
            </main>
            <Toaster />
        </>
    )
}
