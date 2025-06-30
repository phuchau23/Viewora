'use client';
import { useMemo } from "react";
import {
  calculatePasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthText,
} from "@/utils/passwordStrength";

export const usePasswordStrength = (password: string) => {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);
  const color = getPasswordStrengthColor(strength);
  const text = getPasswordStrengthText(strength);

  return { strength, color, text };
};