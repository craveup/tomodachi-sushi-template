"use client";

import React, { useState } from "react";
import { Calendar, Clock, Users, ChefHat, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "../components/navbar";

const timeSlots = [
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
];

const partySizes = [
  { value: "1", label: "1 Guest" },
  { value: "2", label: "2 Guests" },
  { value: "3", label: "3 Guests" },
  { value: "4", label: "4 Guests" },
  { value: "5", label: "5 Guests" },
  { value: "6", label: "6 Guests" },
  { value: "7", label: "7+ Guests" },
];

const specialRequests = [
  { id: "birthday", label: "Birthday Celebration" },
  { id: "anniversary", label: "Anniversary" },
  { id: "business", label: "Business Dinner" },
  { id: "dietary", label: "Dietary Restrictions" },
  { id: "wheelchair", label: "Wheelchair Accessible" },
  { id: "quiet", label: "Quiet Table Preferred" },
];

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    partySize: "2",
    specialRequests: [] as string[],
    notes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecialRequestChange = (requestId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      specialRequests: checked
        ? [...prev.specialRequests, requestId]
        : prev.specialRequests.filter((id) => id !== requestId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Reservation submitted:", formData);
    // You would typically send this to your backend API
  };

  // Generate next 30 days for date selection
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      });
    }
    return dates;
  };

  return (
    <div className="min-h-screen bg-backgrounddefault">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/sushi/reservation-card.jpg)",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        {/* Header */}
        <header className="absolute top-6 left-6 lg:top-12 lg:left-12 z-20">
          <Navbar title="TOMODACHI SUSHI" />
        </header>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center space-y-6 px-6">
            {/* Japanese Characters */}
            <div className="font-yuji-mai text-white text-3xl lg:text-5xl opacity-60">
              予約
            </div>

            {/* Main Title */}
            <h1 className="font-heading-xlarge text-white text-5xl lg:text-7xl tracking-wider leading-none">
              RESERVATIONS
            </h1>

            {/* Subtitle */}
            <p className="font-text-meta text-white/80 text-lg lg:text-xl tracking-wider max-w-2xl mx-auto">
              Book your table for an unforgettable sushi experience
            </p>
          </div>
        </div>
      </section>

      {/* Reservation Form Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-heading-h1 text-textdefault text-4xl lg:text-5xl tracking-wider mb-4">
              RESERVE YOUR TABLE
            </h2>
            <p className="font-text-meta text-textmuted text-lg tracking-wider">
              Experience the art of sushi in our intimate dining room
            </p>
          </div>

          <Card className="bg-backgrounddefault border-borderdefault rounded-2xl">
            <CardHeader className="pb-8">
              <CardTitle className="font-heading-h3 text-textdefault text-2xl tracking-wider text-center">
                RESERVATION DETAILS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="font-heading-h4 text-textdefault text-xl tracking-wider flex items-center gap-3">
                    <User className="w-5 h-5" />
                    CONTACT INFORMATION
                  </h3>
                  <Separator className="bg-borderdefault" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-text-meta text-textdefault text-sm tracking-wider font-medium">
                        First Name *
                      </Label>
                      <Input
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="bg-backgroundmuted border-borderdefault rounded-xl px-4 py-3 text-textdefault placeholder:text-textmuted"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-text-meta text-textdefault text-sm tracking-wider font-medium">
                        Last Name *
                      </Label>
                      <Input
                        required
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="bg-backgroundmuted border-borderdefault rounded-xl px-4 py-3 text-textdefault placeholder:text-textmuted"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-text-meta text-textdefault text-sm tracking-wider font-medium">
                        Email Address *
                      </Label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="bg-backgroundmuted border-borderdefault rounded-xl px-4 py-3 text-textdefault placeholder:text-textmuted"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-text-meta text-textdefault text-sm tracking-wider font-medium">
                        Phone Number *
                      </Label>
                      <Input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="bg-backgroundmuted border-borderdefault rounded-xl px-4 py-3 text-textdefault placeholder:text-textmuted"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Reservation Details */}
                <div className="space-y-6">
                  <h3 className="font-heading-h4 text-textdefault text-xl tracking-wider flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    RESERVATION DETAILS
                  </h3>
                  <Separator className="bg-borderdefault" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Date Selection */}
                    <div className="space-y-2">
                      <Label className="font-text-meta text-textdefault text-sm tracking-wider font-medium">
                        Date *
                      </Label>
                      <select
                        required
                        value={formData.date}
                        onChange={(e) =>
                          handleInputChange("date", e.target.value)
                        }
                        className="w-full bg-backgroundmuted border border-borderdefault rounded-xl px-4 py-3 text-textdefault"
                      >
                        <option value="">Select Date</option>
                        {generateAvailableDates().map((date) => (
                          <option key={date.value} value={date.value}>
                            {date.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Time Selection */}
                    <div className="space-y-2">
                      <Label className="font-text-meta text-textdefault text-sm tracking-wider font-medium">
                        Time *
                      </Label>
                      <select
                        required
                        value={formData.time}
                        onChange={(e) =>
                          handleInputChange("time", e.target.value)
                        }
                        className="w-full bg-backgroundmuted border border-borderdefault rounded-xl px-4 py-3 text-textdefault"
                      >
                        <option value="">Select Time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Party Size */}
                    <div className="space-y-2">
                      <Label className="font-text-meta text-textdefault text-sm tracking-wider font-medium">
                        Party Size *
                      </Label>
                      <select
                        required
                        value={formData.partySize}
                        onChange={(e) =>
                          handleInputChange("partySize", e.target.value)
                        }
                        className="w-full bg-backgroundmuted border border-borderdefault rounded-xl px-4 py-3 text-textdefault"
                      >
                        {partySizes.map((size) => (
                          <option key={size.value} value={size.value}>
                            {size.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-6">
                  <h3 className="font-heading-h4 text-textdefault text-xl tracking-wider flex items-center gap-3">
                    <ChefHat className="w-5 h-5" />
                    SPECIAL REQUESTS
                  </h3>
                  <Separator className="bg-borderdefault" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specialRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center space-x-3"
                      >
                        <input
                          type="checkbox"
                          id={request.id}
                          checked={formData.specialRequests.includes(
                            request.id
                          )}
                          onChange={(e) =>
                            handleSpecialRequestChange(
                              request.id,
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-backgroundprimary bg-backgroundmuted border-borderdefault rounded focus:ring-backgroundprimary"
                        />
                        <Label
                          htmlFor={request.id}
                          className="font-text-meta text-textdefault text-sm tracking-wider cursor-pointer"
                        >
                          {request.label}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-text-meta text-textdefault text-sm tracking-wider font-medium">
                      Additional Notes
                    </Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      className="bg-backgroundmuted border-borderdefault rounded-xl px-4 py-3 text-textdefault placeholder:text-textmuted min-h-[100px]"
                      placeholder="Any special requests, dietary restrictions, or additional information..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full h-14 text-base font-heading-h6 tracking-wider bg-backgroundprimary hover:bg-backgroundprimary/90 text-textinverse rounded-2xl transition-colors"
                  >
                    CONFIRM RESERVATION
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Restaurant Info */}
      <section className="py-16 bg-backgroundmuted">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-backgroundprimary rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6 text-textinverse" />
              </div>
              <h3 className="font-heading-h5 text-textdefault text-lg tracking-wider">
                HOURS
              </h3>
              <div className="space-y-1 text-textmuted font-text-meta text-sm tracking-wider">
                <p>Monday - Thursday: 5:00 PM - 10:00 PM</p>
                <p>Friday - Saturday: 5:00 PM - 11:00 PM</p>
                <p>Sunday: 5:00 PM - 9:00 PM</p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-backgroundprimary rounded-full flex items-center justify-center mx-auto">
                <Phone className="w-6 h-6 text-textinverse" />
              </div>
              <h3 className="font-heading-h5 text-textdefault text-lg tracking-wider">
                CONTACT
              </h3>
              <div className="space-y-1 text-textmuted font-text-meta text-sm tracking-wider">
                <p>(555) 123-SUSHI</p>
                <p>reservations@tomodachi.com</p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-backgroundprimary rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-textinverse" />
              </div>
              <h3 className="font-heading-h5 text-textdefault text-lg tracking-wider">
                PARTIES
              </h3>
              <div className="space-y-1 text-textmuted font-text-meta text-sm tracking-wider">
                <p>Groups of 8+ please call</p>
                <p>Private dining available</p>
                <p>Special events welcome</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
