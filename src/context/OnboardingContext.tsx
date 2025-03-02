"use client";

import React, { createContext, useContext, useState } from "react";

type BusinessInfo = {
  name: string;
  description: string;
  logo: string | null;
};

type PaymentDetails = {
  solanaPublicKey: string;
  webhookUrl: string;
};

type OnboardingData = {
  businessInfo: BusinessInfo;
  paymentDetails: PaymentDetails;
  step: number;
  isSubmitted: boolean;
};

type OnboardingContextType = {
  data: OnboardingData;
  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;
  updatePaymentDetails: (details: Partial<PaymentDetails>) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  submitOnboarding: () => void;
  reset: () => void;
};

const initialState: OnboardingData = {
  businessInfo: {
    name: "",
    description: "",
    logo: null,
  },
  paymentDetails: {
    solanaPublicKey: "",
    webhookUrl: "",
  },
  step: 1,
  isSubmitted: false,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<OnboardingData>(initialState);

  const updateBusinessInfo = (info: Partial<BusinessInfo>) => {
    setData((prev) => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        ...info,
      },
      step: prev.step + 1,
    }));
  };

  const updatePaymentDetails = (details: Partial<PaymentDetails>) => {
    setData((prev) => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        ...details,
      },
      step: Math.min(2, prev.step + 1),
    }));
  };

  const nextStep = () => {
    setData((prev) => ({
      ...prev,
      step: prev.step + 1,
    }));
  };

  const prevStep = () => {
    setData((prev) => ({
      ...prev,
      step: Math.max(1, prev.step - 1),
    }));
  };

  const setStep = (step: number) => {
    setData((prev) => ({
      ...prev,
      step,
    }));
  };

  const submitOnboarding = () => {
    setData((prev) => ({
      ...prev,
      isSubmitted: true,
    }));


    console.log("Onboarding submitted:", data);
  };

  const reset = () => {
    setData(initialState);
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateBusinessInfo,
        updatePaymentDetails,
        nextStep,
        prevStep,
        setStep,
        submitOnboarding,
        reset,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);

  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};