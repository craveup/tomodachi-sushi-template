"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ChevronRight,
  Edit,
  Trash2,
  CreditCard,
  Tag,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import FulfillmentScheduleModal from "../modal-components/fulfillment-schedule-modal";

interface CheckoutPageDesktopProps {
  onBackToStore?: () => void;
  onPlaceOrder?: (orderData: any) => void;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const defaultCartItems: CartItem[] = [
  {
    id: "1",
    name: "Brioche with Chocolate Chips",
    price: 5.5,
    quantity: 1,
    imageUrl:
      "https://img.cdn4dd.com/p/fit=cover,width=100,height=100,format=auto,quality=50/media/photosV2/7bb0efbd-1141-4518-bfe1-2cab3571478f-retina-large.jpg",
  },
  {
    id: "2",
    name: "Blueberry Muffin",
    price: 4.95,
    quantity: 1,
    imageUrl:
      "https://img.cdn4dd.com/p/fit=cover,width=100,height=100,format=auto,quality=50/media/photosV2/f9f26ecf-7690-4108-8446-4b562f462cf3-retina-large.jpg",
  },
  {
    id: "3",
    name: "Two Chip Chocolate Chip Cookie",
    price: 6.33,
    quantity: 1,
    imageUrl:
      "https://img.cdn4dd.com/p/fit=cover,width=100,height=100,format=auto,quality=50/media/photosV2/d1edfa6f-0b34-4919-9833-237faa20feae-retina-large.jpg",
  },
];

export default function CheckoutPageDesktop({
  onBackToStore,
  onPlaceOrder,
}: CheckoutPageDesktopProps) {
  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "pickup">(
    "delivery"
  );
  const [orderTime, setOrderTime] = useState<"standard" | "schedule">(
    "schedule"
  );
  const [scheduledTime, setScheduledTime] = useState("7/13 6:00 PM-6:20 PM");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Contact Info
  const [countryCode, setCountryCode] = useState("US");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Payment & Preferences
  const [selectedPayment, setSelectedPayment] = useState("");
  const [saveDetails, setSaveDetails] = useState(true);
  const [textOffers, setTextOffers] = useState(false);

  const [cartItems] = useState<CartItem[]>(defaultCartItems);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleScheduleEdit = () => {
    setIsScheduleModalOpen(true);
  };

  const handleScheduleUpdate = (scheduleData: {
    date: string;
    timeSlot: string;
  }) => {
    setScheduledTime(`${scheduleData.date} ${scheduleData.timeSlot}`);
    setIsScheduleModalOpen(false);
  };

  const handlePlaceOrder = () => {
    const orderData = {
      fulfillmentType,
      orderTime,
      scheduledTime: orderTime === "schedule" ? scheduledTime : null,
      contact: { countryCode, phoneNumber, email, firstName, lastName },
      payment: selectedPayment,
      preferences: { saveDetails, textOffers },
      items: cartItems,
      subtotal,
    };
    onPlaceOrder?.(orderData);
  };

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <Button
          variant="ghost"
          onClick={onBackToStore}
          className="flex items-center gap-2 text-primary hover:text-primary/80 p-0"
          data-testid="backToStoreButton"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to store</span>
        </Button>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form Sections */}
          <div className="space-y-6">
            {/* Fulfillment Method */}
            <section
              className="bg-white rounded-lg p-6 shadow-sm"
              data-testid="fulfillmentTypePanel"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Method
              </h2>
              <RadioGroup
                value={fulfillmentType}
                onValueChange={(value: "delivery" | "pickup") =>
                  setFulfillmentType(value)
                }
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="delivery"
                    id="delivery"
                    data-testid="DeliveryMethodToggle"
                  />
                  <Label htmlFor="delivery" className="text-base font-medium">
                    Delivery
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="pickup"
                    id="pickup"
                    data-testid="PickupMethodToggle"
                  />
                  <Label htmlFor="pickup" className="text-base font-medium">
                    Pickup
                  </Label>
                </div>
              </RadioGroup>
            </section>

            {/* Time */}
            <section
              className="bg-white rounded-lg p-6 shadow-sm"
              data-testid="checkoutTimePanel"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Time
              </h2>
              <RadioGroup
                value={orderTime}
                onValueChange={(value: "standard" | "schedule") =>
                  setOrderTime(value)
                }
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg opacity-50">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="standard"
                        id="standard"
                        disabled
                        data-testid="OrderTimePickerToggle-STANDARD"
                      />
                      <Label htmlFor="standard" className="text-base">
                        <div>
                          <span className="font-medium">Standard</span>
                          <span className="text-muted-foreground">
                            {" "}
                            · Unavailable
                          </span>
                        </div>
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="schedule"
                        id="schedule"
                        data-testid="OrderTimePickerToggle-SCHEDULE"
                      />
                      <Label htmlFor="schedule" className="text-base">
                        <div>
                          <span className="font-medium">
                            Schedule for later
                          </span>
                          <div className="text-sm text-muted-foreground">
                            {scheduledTime}
                          </div>
                        </div>
                      </Label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleScheduleEdit}
                      aria-label="Edit delivery time"
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </RadioGroup>
            </section>

            {/* Delivery Address */}
            <section
              className="bg-white rounded-lg p-6 shadow-sm"
              data-testid="deliveryPanel"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {fulfillmentType === "delivery"
                  ? "Delivery address"
                  : "Pickup address"}
              </h2>
              <div className="space-y-4">
                {/* Map placeholder */}
                <div className="h-36 bg-gray-100 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
                    <div className="absolute inset-0 opacity-20">
                      <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                        {Array.from({ length: 48 }).map((_, i) => (
                          <div key={i} className="border border-gray-300" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">
                    300 N Beaudry Ave #4063, Los Angeles, CA 90012, USA
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80"
                  >
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">
                    Drop-off: Leave it at my door
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80"
                  >
                    Add / Edit
                  </Button>
                </div>
              </div>
            </section>

            {/* Contact and Payment */}
            <section
              className="bg-white rounded-lg p-6 shadow-sm"
              data-testid="contactInfoPanel"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Contact and payment
              </h2>

              <div className="space-y-6">
                {/* Auto-detect disclaimer */}
                <p
                  className="text-sm text-muted-foreground"
                  data-testid="auto-detect-disclaimer"
                >
                  To maximize your benefits, we'll check if you have an account
                  with us or our partner DoorDash, and we'll text you a code to
                  sign in.
                </p>

                {/* Phone and Country */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="country"
                      className="text-sm font-medium text-foreground"
                    >
                      Country
                    </Label>
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">+1 (US)</SelectItem>
                        <SelectItem value="CA">+1 (CA)</SelectItem>
                        <SelectItem value="AU">+61 (AU)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-foreground"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(xxx) xxx-xxxx"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      data-testid="Phone"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Use a phone number that can receive text messages
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="Email"
                    required
                  />
                </div>

                {/* Name */}
                <div className="grid grid-cols-2 gap-4" data-testid="NameRow">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-foreground"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      data-testid="FirstNameField"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-foreground"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      data-testid="LastNameField"
                      required
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div
                  className="space-y-4"
                  data-testid="CheckoutPaymentInfoPanel"
                >
                  <span className="text-sm font-medium text-foreground">
                    Payment method
                  </span>

                  <RadioGroup
                    value={selectedPayment}
                    onValueChange={setSelectedPayment}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem
                            value="card"
                            id="card"
                            data-testid="PaymentMethodAdd"
                          />
                          <Label
                            htmlFor="card"
                            className="flex items-center gap-3"
                          >
                            <CreditCard className="w-6 h-6 text-muted-foreground" />
                            <span>Credit/Debit Card</span>
                          </Label>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>

                      <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem
                            value="paypal"
                            id="paypal"
                            data-testid="PaymentMethodAddPaypal"
                          />
                          <Label
                            htmlFor="paypal"
                            className="flex items-center gap-3"
                          >
                            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                              P
                            </div>
                            <span>PayPal</span>
                          </Label>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>

                      <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem
                            value="venmo"
                            id="venmo"
                            data-testid="PaymentMethodAddVenmo"
                          />
                          <Label
                            htmlFor="venmo"
                            className="flex items-center gap-3"
                          >
                            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                              V
                            </div>
                            <span>Venmo</span>
                          </Label>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Save Details Toggle */}
                <div
                  className="flex items-start space-x-3"
                  data-testid="savePaymentDetailsToggle"
                >
                  <Checkbox
                    id="saveDetails"
                    checked={saveDetails}
                    onCheckedChange={(checked) =>
                      setSaveDetails(checked as boolean)
                    }
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="saveDetails"
                      className="text-sm font-medium"
                    >
                      Save Contact and Payment Details
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Create an account for faster checkout on future orders.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  We'll text you a verification code after checkout.
                </p>
              </div>
            </section>

            {/* Rewards & Promos */}
            <section
              className="bg-white rounded-lg p-6 shadow-sm"
              data-testid="rewardsAndPromo"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Rewards & promos
              </h2>

              <div className="space-y-4">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-3 h-auto border border-border rounded-lg hover:bg-gray-50"
                  data-testid="Add Promo Code"
                >
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-muted-foreground" />
                    <span>Promotions Available</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Button>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="textOffers"
                    checked={textOffers}
                    onCheckedChange={(checked) =>
                      setTextOffers(checked as boolean)
                    }
                  />
                  <Label htmlFor="textOffers" className="text-sm">
                    Text me offers and news
                  </Label>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <section
              className="bg-white rounded-lg p-6 shadow-sm"
              data-testid="Summary"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Summary
              </h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 border border-border rounded-lg"
                    data-testid="OrderItemContainer"
                  >
                    {/* Quantity Badge */}
                    <div className="flex items-center gap-3">
                      <button
                        className="text-sm font-medium bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded transition-colors"
                        aria-label={`${item.quantity} in cart. click to edit quantity`}
                        data-testid="CollapsedQuantity"
                      >
                        <span className="font-semibold">{item.quantity} ×</span>
                      </button>
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">
                        {item.name}
                      </h3>
                      <p className="text-lg font-semibold text-foreground">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-600"
                      data-testid="RemoveOrderCartItemButton"
                      aria-label={`Remove ${item.name} from order`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  onClick={onBackToStore}
                  className="w-full flex items-center justify-center gap-2 text-primary hover:text-primary/80 hover:bg-primary/5 py-3 mt-4"
                  data-testid="backToStoreButton"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Add Additional Items</span>
                </Button>
              </div>
            </section>

            {/* Checkout Footer */}
            <div
              className="bg-white rounded-lg p-6 shadow-sm"
              data-testid="checkoutSubmitPanel"
            >
              {/* Place Order Button */}
              <div className="mb-4">
                <Button
                  onClick={handlePlaceOrder}
                  className="w-full h-12 text-lg font-semibold"
                  size="lg"
                  data-testid="PlaceOrderButton"
                  data-anchor-id="PlaceOrderButton"
                >
                  Place Order
                </Button>
              </div>

              {/* Order Summary */}
              <div data-testid="lineItemsSection" className="space-y-3">
                {/* Subtotal */}
                <div
                  data-testid="Subtotal"
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-foreground">
                    <span>Subtotal</span>
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Estimated Tax */}
                <div
                  data-testid="Estimated Tax"
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-foreground">
                      Estimated Tax
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      aria-label="More Information"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="text-muted-foreground"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14ZM8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
                          fill="currentColor"
                        />
                        <path d="M7 7.5H9V12H7V7.5Z" fill="currentColor" />
                        <path
                          d="M9.25 5.25C9.25 5.94036 8.69036 6.5 8 6.5C7.30964 6.5 6.75 5.94036 6.75 5.25C6.75 4.55964 7.30964 4 8 4C8.69036 4 9.25 4.55964 9.25 5.25Z"
                          fill="currentColor"
                        />
                      </svg>
                    </Button>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    ${(subtotal * 0.0975).toFixed(2)}
                  </span>
                </div>

                {/* Separator */}
                <hr className="border-border" />

                {/* Total */}
                <div
                  data-testid="Total"
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-foreground">
                    Total
                  </span>
                  <span
                    data-testid="OrderCartTotal"
                    className="text-sm font-medium text-foreground"
                  >
                    ${(subtotal * 1.0975).toFixed(2)}
                  </span>
                </div>

                {/* Separator */}
                <hr className="border-border" />

                {/* Amount Due */}
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-foreground">
                    Amount Due
                  </span>
                  <span
                    data-testid="AmountDue"
                    className="text-base font-semibold text-foreground"
                  >
                    ${(subtotal * 1.0975).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mt-4 pt-4">
                <span
                  data-testid="termsAndConditions"
                  className="text-xs text-muted-foreground leading-relaxed"
                >
                  By clicking Place Order, you agree to our{" "}
                  <a
                    href="https://help.doordash.com/consumers/s/storefront-terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline"
                  >
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://help.doordash.com/consumers/s/storefront-privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline"
                  >
                    Privacy statement
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <FulfillmentScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleScheduleUpdate}
        fulfillmentType={fulfillmentType}
      />
    </div>
  );
}
