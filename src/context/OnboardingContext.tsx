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
  userId: string;
  businessInfo: BusinessInfo;
  paymentDetails: PaymentDetails;
  step: number;
  isSubmitted: boolean;
};

type OnboardingContextType = {
  data: OnboardingData;
  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;
  updatePaymentDetails: (details: Partial<PaymentDetails>) => void;
  setUserId: (userId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  submitOnboarding: () => void;
  reset: () => void;
};

const initialState: OnboardingData = {
  userId: "",
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

  const setUserId = (userId: string) => {
    setData((prev) => ({
      ...prev,
      userId,
    }));
  };

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
    fetch('/api/merchant/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: data.userId,
        businessName: data.businessInfo.name,
        businessDescription: data.businessInfo.description,
        solanaPubKey: data.paymentDetails.solanaPublicKey,
        webhookUrl: data.paymentDetails.webhookUrl,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to create merchant');
        }
        setData(prev => ({
          ...prev,
          isSubmitted: true
        }));
        return response.json();
      })
      .catch((error) => {
        console.error('Error submitting onboarding:', error);
      });
  };

  const reset = () => {
    setData(initialState);
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        setUserId,
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