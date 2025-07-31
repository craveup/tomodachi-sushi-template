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
import { useFormatters } from "@/lib/i18n/hooks";
import FulfillmentScheduleModal from "../modal-components/fulfillment-schedule-modal";
import PaymentMethodModal from "../modal-components/payment-method-modal";

interface CheckoutPageProps {
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

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "venmo";
  displayName: string;
  lastFour?: string;
  expiryMonth?: string;
  expiryYear?: string;
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
];

export default function CheckoutPage({
  onBackToStore,
  onPlaceOrder,
}: CheckoutPageProps) {
  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "pickup">(
    "pickup"
  );
  const [orderTime, setOrderTime] = useState<"standard" | "schedule">(
    "schedule"
  );
  const [scheduledTime, setScheduledTime] = useState("7/13 8:10 AM-8:20 AM");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalType, setPaymentModalType] = useState<
    "card" | "paypal" | "venmo"
  >("card");
  const { currency } = useFormatters();

  // Contact Info
  const [countryCode, setCountryCode] = useState("US");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Payment & Preferences
  const [selectedPayment, setSelectedPayment] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
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

  const handlePaymentMethodAdd = (type: "card" | "paypal" | "venmo") => {
    setPaymentModalType(type);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentMethodSave = (paymentData: {
    type: "card" | "paypal" | "venmo";
    cardData?: {
      number: string;
      expiryMonth: string;
      expiryYear: string;
      cvv: string;
      name: string;
      zipCode: string;
    };
    saveForFuture: boolean;
  }) => {
    const newPaymentMethod: PaymentMethod = {
      id: `payment-${Date.now()}`,
      type: paymentData.type,
      displayName:
        paymentData.type === "card"
          ? `•••• •••• •••• ${paymentData.cardData?.number.slice(-4)}`
          : paymentData.type === "paypal"
            ? "PayPal"
            : "Venmo",
      lastFour: paymentData.cardData?.number.replace(/\s/g, "").slice(-4),
      expiryMonth: paymentData.cardData?.expiryMonth,
      expiryYear: paymentData.cardData?.expiryYear,
    };

    setPaymentMethods((prev) => [...prev, newPaymentMethod]);
    setSelectedPayment(newPaymentMethod.id);
    setIsPaymentModalOpen(false);

    // Payment method saved
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

  const getPaymentMethodIcon = (type: "card" | "paypal" | "venmo") => {
    switch (type) {
      case "card":
        return <CreditCard className="w-6 h-6 text-muted-foreground" />;
      case "paypal":
        return (
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
            P
          </div>
        );
      case "venmo":
        return (
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
            V
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b px-4 py-4">
        <Button
          variant="ghost"
          onClick={onBackToStore}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 p-0"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to store</span>
        </Button>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Fulfillment Method */}
        <section className="bg-card rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Method</h2>
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

        {/* Pickup/Delivery Time */}
        <section
          className="bg-card rounded-lg p-6 shadow-sm border"
          data-testid="checkoutTimePanel"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {fulfillmentType === "pickup" ? "Pickup time" : "Delivery time"}
          </h2>
          <RadioGroup
            value={orderTime}
            onValueChange={(value: "standard" | "schedule") =>
              setOrderTime(value)
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="standard"
                    id="standard"
                    disabled
                    data-testid="OrderTimePickerToggle-STANDARD"
                  />
                  <Label htmlFor="standard" className="text-base">
                    <div>
                      <span className="font-medium text-base">Standard</span>
                      <span className="text-muted-foreground text-sm">
                        {" "}
                        · Unavailable
                      </span>
                    </div>
                  </Label>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="schedule"
                    id="schedule"
                    data-testid="OrderTimePickerToggle-SCHEDULE"
                  />
                  <Label htmlFor="schedule" className="text-base">
                    <div>
                      <span className="font-medium">Schedule for later</span>
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

        {/* Pickup Address (only show for pickup) */}
        {fulfillmentType === "pickup" && (
          <section
            className="bg-card rounded-lg p-6 shadow-sm border"
            data-testid="pickupPanel"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Pickup address
            </h2>
            <div className="space-y-4">
              {/* Map placeholder */}
              <div className="h-36 bg-muted rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20">
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="border border-border" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-background" />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">
                  Store Address
                </span>
                <div className="font-medium text-sm text-foreground mt-2">
                  227 N Larchmont Blvd, Los Angeles, CA 90004, USA
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact and Payment */}
        <section
          className="bg-card rounded-lg p-6 shadow-sm border w-full"
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
              To maximize your benefits, we'll check if you have an account with
              us or our partner DoorDash, and we'll text you a code to sign in.
            </p>

            {/* Phone and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">
                  Country
                </Label>
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="py-1 cursor-pointer w-24">
                    <SelectItem value="US" className="hover:bg-muted">
                      +1 (US)
                    </SelectItem>
                    <SelectItem value="CA" className="hover:bg-muted">
                      +1 (CA)
                    </SelectItem>
                    <SelectItem value="AU" className="hover:bg-muted">
                      +61 (AU)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
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
              <Label htmlFor="email" className="text-sm font-medium">
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
                <Label htmlFor="firstName" className="text-sm font-medium">
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
                <Label htmlFor="lastName" className="text-sm font-medium">
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
            <div className="space-y-4" data-testid="CheckoutPaymentInfoPanel">
              <span className="text-sm font-medium">Payment method</span>

              <RadioGroup
                value={selectedPayment}
                onValueChange={setSelectedPayment}
              >
                <div className="space-y-2">
                  {/* Saved Payment Methods */}
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label
                          htmlFor={method.id}
                          className="flex items-center gap-3"
                        >
                          {getPaymentMethodIcon(method.type)}
                          <span>{method.displayName}</span>
                          {method.type === "card" &&
                            method.expiryMonth &&
                            method.expiryYear && (
                              <span className="text-sm text-muted-foreground">
                                Expires {method.expiryMonth}/{method.expiryYear}
                              </span>
                            )}
                        </Label>
                      </div>
                    </div>
                  ))}

                  {/* Add New Payment Methods */}
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                    <button
                      onClick={() => handlePaymentMethodAdd("card")}
                      className="flex items-center gap-3 w-full text-left"
                      data-testid="PaymentMethodAdd"
                    >
                      <CreditCard className="w-6 h-6 text-muted-foreground" />
                      <span>Add Credit/Debit Card</span>
                    </button>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                    <button
                      onClick={() => handlePaymentMethodAdd("paypal")}
                      className="flex items-center gap-3 w-full text-left"
                      data-testid="PaymentMethodAddPaypal"
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                        P
                      </div>
                      <span>Add PayPal</span>
                    </button>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                    <button
                      onClick={() => handlePaymentMethodAdd("venmo")}
                      className="flex items-center gap-3 w-full text-left"
                      data-testid="PaymentMethodAddVenmo"
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                        V
                      </div>
                      <span>Add Venmo</span>
                    </button>
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
                <Label htmlFor="saveDetails" className="text-sm font-medium">
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
          className="bg-card rounded-lg p-6 shadow-sm border"
          data-testid="rewardsAndPromo"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Rewards & promos
          </h2>

          <div className="space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto border rounded-lg hover:bg-accent"
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
                onCheckedChange={(checked) => setTextOffers(checked as boolean)}
              />
              <Label htmlFor="textOffers" className="text-sm">
                Text me offers and news
              </Label>
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <section
          className="bg-card rounded-xl shadow-sm border border-border/50"
          data-testid="Summary"
        >
          {/* Header */}
          <div className="p-4 border-b border-border/30">
            <h2 className="text-xl font-bold text-foreground">Summary</h2>
          </div>

          {/* Cart Items */}
          <div className="p-4 space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-border/30"
                data-testid="OrderItemContainer"
              >
                {/* Quantity Badge */}
                <div className="flex flex-col items-center justify-center w-8">
                  <span className="text-base font-bold text-foreground">
                    <span className="text-xs text-muted-foreground">×</span>
                    {item.quantity}
                  </span>
                </div>

                {/* Item Image */}
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">
                    {item.name}
                  </h3>
                  <p className="text-base font-bold text-foreground">
                    {currency(item.price * item.quantity)}
                  </p>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                  data-testid="RemoveOrderCartItemButton"
                  aria-label={`Remove ${item.name} from order`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add More Items Button */}
          <div className="px-4 pb-4">
            <Button
              variant="ghost"
              onClick={onBackToStore}
              className="w-full h-12 justify-start text-left font-medium text-foreground hover:bg-muted/50 rounded-xl"
              data-testid="backToStoreButton"
            >
              <ArrowLeft className="h-5 w-5 mr-3 text-muted-foreground" />
              <span>Add Additional Items</span>
            </Button>
          </div>
        </section>

        {/* Checkout Footer */}
        <div
          className="sticky bottom-0 bg-background border-t -mx-4"
          data-testid="checkoutSubmitPanel"
        >
          <div className="p-4">
            {/* Place Order Button */}
            <div className="mb-4">
              <Button
                onClick={handlePlaceOrder}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
                data-testid="PlaceOrderButton"
                data-anchor-id="PlaceOrderButton"
              >
                Place {fulfillmentType === "pickup" ? "Pickup" : "Delivery"}{" "}
                Order
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
                  {currency(subtotal)}
                </span>
              </div>

              {/* Estimated Tax */}
              <div
                data-testid="Estimated Tax"
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm text-foreground">Estimated Tax</span>
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
                  {currency(subtotal * 0.0975)}
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
                  {currency(subtotal * 1.0975)}
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
                  {currency(subtotal * 1.0975)}
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
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="https://help.doordash.com/consumers/s/storefront-privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Privacy statement
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <FulfillmentScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleScheduleUpdate}
        fulfillmentType={fulfillmentType}
      />

      <PaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSave={handlePaymentMethodSave}
        initialPaymentType={paymentModalType}
      />
    </div>
  );
}
