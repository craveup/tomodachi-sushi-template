"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "../components/navbar";
import { ChefHat, Award, Heart, Users, Clock, MapPin } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-backgrounddefault">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/sushi/hero-background.png)",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        {/* Header */}
        <header className="absolute top-6 left-6 lg:top-12 lg:left-12 z-20">
          <Navbar />
        </header>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center space-y-8 px-6">
            {/* Japanese Characters */}
            <div className="font-wdxl-jp text-white text-4xl lg:text-6xl opacity-60">
              友達の物語
            </div>

            {/* Main Title */}
            <h1 className="font-heading-xlarge text-white text-6xl lg:text-8xl tracking-wider leading-none">
              OUR STORY
            </h1>

            {/* Subtitle */}
            <p className="font-text-meta text-white/80 text-lg lg:text-xl tracking-wider max-w-2xl mx-auto">
              Where tradition meets innovation in the heart of every roll
            </p>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/40 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-backgrounddefault">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading-h1 text-textdefault text-4xl lg:text-6xl tracking-wider mb-6">
              TOMODACHI PHILOSOPHY
            </h2>
            <div className="w-24 h-px bg-borderdefault mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Tradition */}
            <Card className="bg-backgroundmuted border-borderdefault rounded-2xl p-8 text-center group hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-backgroundprimary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-textinverse" />
              </div>
              <h3 className="font-heading-h3 text-textdefault text-2xl tracking-wider mb-4">
                TRADITION
              </h3>
              <p className="font-text-meta text-textmuted leading-relaxed">
                Rooted in centuries-old Japanese techniques, we honor the
                traditional artistry that makes each piece a masterpiece of
                flavor and presentation.
              </p>
            </Card>

            {/* Innovation */}
            <Card className="bg-backgroundmuted border-borderdefault rounded-2xl p-8 text-center group hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-backgroundprimary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-textinverse" />
              </div>
              <h3 className="font-heading-h3 text-textdefault text-2xl tracking-wider mb-4">
                INNOVATION
              </h3>
              <p className="font-text-meta text-textmuted leading-relaxed">
                While respecting tradition, we embrace modern techniques and
                creative presentations to elevate the sushi experience to new
                heights.
              </p>
            </Card>

            {/* Community */}
            <Card className="bg-backgroundmuted border-borderdefault rounded-2xl p-8 text-center group hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-backgroundprimary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-textinverse" />
              </div>
              <h3 className="font-heading-h3 text-textdefault text-2xl tracking-wider mb-4">
                COMMUNITY
              </h3>
              <p className="font-text-meta text-textmuted leading-relaxed">
                Tomodachi means &ldquo;friend&rdquo; in Japanese. We create a
                welcoming space where food brings people together in friendship
                and celebration.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Master Chef Section */}
      <section className="py-24 bg-backgroundmuted">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src="/images/sushi/reservation-card.jpg"
                    alt="Master Chef Tanaka"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="font-heading-h4 text-xl tracking-wider">
                    MASTER CHEF TANAKA
                  </h4>
                  <p className="font-text-meta text-sm opacity-80">
                    30 years of experience
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <h2 className="font-heading-h1 text-textdefault text-4xl lg:text-5xl tracking-wider mb-6">
                  MASTER OF THE CRAFT
                </h2>
                <Separator className="w-16 bg-borderdefault mb-6" />
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <ChefHat className="w-6 h-6 text-backgroundprimary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-heading-h6 text-textdefault tracking-wider mb-2">
                      TOKYO TRAINED
                    </h4>
                    <p className="font-text-meta text-textmuted">
                      Apprenticed under legendary sushi masters in Tsukiji
                      Market for over a decade.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Award className="w-6 h-6 text-backgroundprimary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-heading-h6 text-textdefault tracking-wider mb-2">
                      AWARD WINNING
                    </h4>
                    <p className="font-text-meta text-textmuted">
                      Recipient of the prestigious James Beard Award for
                      Outstanding Chef.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Heart className="w-6 h-6 text-backgroundprimary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-heading-h6 text-textdefault tracking-wider mb-2">
                      PASSIONATE ARTISAN
                    </h4>
                    <p className="font-text-meta text-textmuted">
                      Every piece is crafted with precision, passion, and
                      respect for the ingredients.
                    </p>
                  </div>
                </div>
              </div>

              <blockquote className="border-l-4 border-backgroundprimary pl-6 py-4">
                <p className="font-text-meta text-textdefault italic text-lg leading-relaxed">
                  &ldquo;Sushi is not just food, it&apos;s a meditation on
                  perfection. Each grain of rice, each slice of fish tells a
                  story.&rdquo;
                </p>
                <cite className="font-heading-h6 text-textmuted tracking-wider mt-2 block">
                  - Chef Tanaka
                </cite>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Gallery */}
      <section className="py-24 bg-backgrounddefault">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading-h1 text-textdefault text-4xl lg:text-6xl tracking-wider mb-6">
              THE TOMODACHI EXPERIENCE
            </h2>
            <p className="font-text-meta text-textmuted text-lg max-w-2xl mx-auto">
              Step into our world where every detail is carefully curated to
              create an unforgettable journey through Japanese culinary
              artistry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative overflow-hidden rounded-2xl aspect-square">
              <Image
                src="/images/sushi/menu-items/spicy-tuna-maki.jpg"
                alt="Fresh preparation"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-heading-h6 tracking-wider">
                    FRESH DAILY
                  </h4>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl aspect-square">
              <Image
                src="/images/sushi/menu-items/mystic-garden.jpg"
                alt="Artful presentation"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-heading-h6 tracking-wider">
                    ARTFUL DESIGN
                  </h4>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl aspect-square">
              <Image
                src="/images/sushi/restaurant-card.jpg"
                alt="Elegant atmosphere"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-heading-h6 tracking-wider">
                    ELEGANT SPACE
                  </h4>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl aspect-square">
              <Image
                src="/images/sushi/menu-card.jpg"
                alt="Premium service"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-heading-h6 tracking-wider">
                    PREMIUM SERVICE
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="py-24 bg-backgroundmuted">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-heading-h1 text-textdefault text-4xl lg:text-5xl tracking-wider mb-8">
            VISIT TOMODACHI
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="space-y-3">
              <MapPin className="w-8 h-8 text-backgroundprimary mx-auto" />
              <h3 className="font-heading-h5 text-textdefault tracking-wider">
                LOCATION
              </h3>
              <p className="font-text-meta text-textmuted">
                123 Nihonbashi Street
                <br />
                New York, NY 10001
              </p>
            </div>

            <div className="space-y-3">
              <Clock className="w-8 h-8 text-backgroundprimary mx-auto" />
              <h3 className="font-heading-h5 text-textdefault tracking-wider">
                HOURS
              </h3>
              <p className="font-text-meta text-textmuted">
                Monday - Saturday
                <br />
                5:00 PM - 11:00 PM
              </p>
            </div>

            <div className="space-y-3">
              <Award className="w-8 h-8 text-backgroundprimary mx-auto" />
              <h3 className="font-heading-h5 text-textdefault tracking-wider">
                RESERVATIONS
              </h3>
              <p className="font-text-meta text-textmuted">
                Call (555) 123-SUSHI
                <br />
                or book online
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-text-meta text-textmuted text-lg leading-relaxed max-w-2xl mx-auto">
              Join us for an unforgettable culinary journey where every bite
              tells the story of our dedication to excellence, tradition, and
              the bonds of friendship that bring us together.
            </p>

            <div className="font-wdxl-jp text-textmuted text-2xl opacity-60 mt-8">
              ありがとうございます
            </div>
            <p className="font-text-meta text-textmuted text-sm tracking-wider">
              Thank you for being part of our story
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
