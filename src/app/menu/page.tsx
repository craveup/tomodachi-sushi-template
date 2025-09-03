/// app/menu/page.tsx


import {redirect} from "next/navigation";
import React from "react";
import Navbar from "@/app/components/navbar";
import MenuPageClient from "@/app/menu/MenuPageClient";

function MenuPage(
    {
        searchParams,
    }: {
        searchParams: Record<string, string | string[] | undefined>;
    }) {
    const cartId = searchParams.cartId;

    if(!cartId) {
        redirect("/")
    }

    return(
        <div className="flex flex-col lg:flex-row items-start p-3 md:p-6 relative bg-backgrounddefault min-h-screen lg:h-screen lg:overflow-hidden">
            {/* Hero */}
            <div className="relative w-full lg:flex-1 lg:grow h-[40vh] sm:h-[50vh] lg:h-full bg-black rounded-2xl overflow-hidden mb-4 lg:mb-0 lg:mr-4">
                <div className="relative w-full h-full bg-[url(/images/sushi/hero-background.png)] bg-cover bg-center">
                    <div className="absolute w-full h-[60%] lg:h-[381px] bottom-0 left-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_100%)]">
                        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-8 lg:left-16 font-heading-large text-textdefault text-4xl sm:text-6xl lg:text-[112px] tracking-[1px] sm:tracking-[1.5px] lg:tracking-[2px] leading-none">
                            MENU
                        </div>
                    </div>
                    <header className="absolute top-3 sm:top-6 lg:top-12 left-3 sm:left-6 lg:left-12 right-3 sm:right-6 lg:right-auto">
                        <Navbar />
                    </header>
                </div>
            </div>

            <MenuPageClient />
        </div>
    )
}

export default MenuPage;
