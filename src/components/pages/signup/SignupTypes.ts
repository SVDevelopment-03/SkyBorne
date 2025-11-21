export interface Step1Data {
  motivation?: string;
}

export interface Step2Data {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreeTerms: boolean;
  authProvider: "google" | "apple" | "email";
  googleId?: string;
  appleId?: string;
}

export interface Step3Data {
  phoneNumber: string;
}

export interface Step4Data {
  otp: string;
  tempUserId: string;
}

export interface Step5Data {
  ageGroup: string;
  wellnessRole: string;
}

export interface Step6Data {
  goal: string;
}

export interface Step7Data {
  selectedPlan: string;
}

export interface Step8Data {
  tourCompleted: boolean;
}

export interface SignupFormData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5Data;
  step6: Step6Data;
  step7: Step7Data;
  step8: Step8Data;
}

export interface SignupFormValidation {
  motivation?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreeTerms: boolean;
  phoneNumber: string;
  otp: string;
  tempUserId: string;
  ageGroup: string;
  wellnessRole: string;
  goal: string;
  authProvider: string;
  googleId?: string;
  appleId?: string;
}
