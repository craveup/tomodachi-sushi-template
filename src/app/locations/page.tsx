import type { Metadata } from "next";
import { Navbar } from "../components/navbar";

export const metadata: Metadata = {
  title: "Location - Tomodachi Sushi | Visit Our Restaurant",
  description:
    "Visit Tomodachi Sushi for an authentic Japanese dining experience. Located in the heart of Nihonbashi, Tokyo. Reservations recommended.",
};

export default function LocationPage() {
  return (
    <div className="min-h-screen bg-backgrounddefault">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/sushi/restaurant-card.jpg)",
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
          <div className="text-center space-y-6 px-6">
            {/* Japanese Characters */}
            <div className="font-yuji-mai text-white text-3xl lg:text-5xl opacity-60">
              場所
            </div>

            {/* Main Title */}
            <h1 className="font-heading-xlarge text-white text-5xl lg:text-7xl tracking-wider leading-none">
              VISIT US
            </h1>

            {/* Subtitle */}
            <p className="font-text-meta text-white/80 text-lg lg:text-xl tracking-wider max-w-2xl mx-auto">
              Experience authentic Japanese cuisine in the heart of the city
            </p>
          </div>
        </div>
      </section>

      {/* Location Details */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-heading-h1 text-textdefault text-4xl lg:text-5xl tracking-wider mb-4">
              TOMODACHI SUSHI
            </h2>
            <p className="font-text-meta text-textmuted text-lg tracking-wider">
              友達寿司 - Where tradition meets innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="font-heading-h4 text-textdefault text-xl tracking-wider mb-4">
                  ADDRESS
                </h3>
                <p className="font-text-meta text-textmuted text-base tracking-wider leading-relaxed">
                  123 Nihonbashi Street
                  <br />
                  New York, NY 10001
                  <br />
                  United States
                </p>
              </div>

              <div>
                <h3 className="font-heading-h4 text-textdefault text-xl tracking-wider mb-4">
                  CONTACT
                </h3>
                <div className="space-y-2 font-text-meta text-textmuted text-base tracking-wider">
                  <p>Phone: (555) 123-SUSHI</p>
                  <p>Email: hello@tomodachi.com</p>
                  <p>Reservations: reservations@tomodachi.com</p>
                </div>
              </div>

              <div>
                <h3 className="font-heading-h4 text-textdefault text-xl tracking-wider mb-4">
                  HOURS
                </h3>
                <div className="space-y-2 font-text-meta text-textmuted text-base tracking-wider">
                  <p>Monday - Thursday: 5:00 PM - 10:00 PM</p>
                  <p>Friday - Saturday: 5:00 PM - 11:00 PM</p>
                  <p>Sunday: 5:00 PM - 9:00 PM</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-backgroundmuted rounded-2xl p-8 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-backgroundprimary rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-textinverse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-heading-h5 text-textdefault text-lg tracking-wider">
                  FIND US
                </h4>
                <p className="font-text-meta text-textmuted text-sm tracking-wider">
                  Interactive map coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
