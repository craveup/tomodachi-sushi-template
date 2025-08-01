"use client";

import { useState } from "react";
import { Button } from "../button";
import { Card } from "../card";
import { Phone, User, Shield } from "lucide-react";
import PhoneSigninModal from "@/components/crave-ui/modal-components/phone-sign-in-modal";

export default function PhoneSigninModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneData, setPhoneData] = useState<{
    countryCode: string;
    phoneNumber: string;
  } | null>(null);

  const handleContinue = (data: {
    countryCode: string;
    phoneNumber: string;
  }) => {
    setPhoneData(data);
    setIsOpen(false);
    console.log("Phone data submitted:", data);
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Phone Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Sign in or create an account using your phone number
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <User className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Quick Account Creation</p>
                <p className="text-xs text-muted-foreground">
                  New users get accounts automatically
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Secure Verification</p>
                <p className="text-xs text-muted-foreground">
                  SMS code verification for security
                </p>
              </div>
            </div>
          </div>

          <Button onClick={() => setIsOpen(true)} className="w-full" size="lg">
            <Phone className="w-4 h-4 mr-2" />
            Sign In with Phone
          </Button>
        </div>
      </Card>

      {phoneData && (
        <Card className="p-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                Phone Number Submitted
              </h4>
              <div className="text-sm text-green-700 dark:text-green-300">
                <p>Country Code: {phoneData.countryCode}</p>
                <p>Phone Number: {phoneData.phoneNumber}</p>
                <p className="mt-1 text-xs">
                  Next step: Send verification code to {phoneData.countryCode}{" "}
                  {phoneData.phoneNumber}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <PhoneSigninModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onContinue={handleContinue}
      />
    </div>
  );
}
