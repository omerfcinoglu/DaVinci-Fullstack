import React, { useState, useEffect } from "react";
import type { User } from "@/domain/types";
import { ValidationFactory } from "@/utils/validation";

export interface UserFormData {
  name: string;
  username: string;
  email: string;
}

export interface UseUserFormProps {
  mode: "edit" | "create";
  user: User | null;
}

export interface UseUserFormReturn {
  form: UserFormData;
  updateField: (field: keyof UserFormData, value: string) => void;
  resetForm: () => void;
  isFormValid: boolean;
  validationErrors: Partial<Record<keyof UserFormData, string>>;
  validateAllFields: () => boolean;
}

const INITIAL_FORM_STATE: UserFormData = {
  name: "",
  username: "",
  email: "",
};

export const useUserForm = ({
  mode,
  user,
}: UseUserFormProps): UseUserFormReturn => {
  const [form, setForm] = useState<UserFormData>(INITIAL_FORM_STATE);
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof UserFormData, string>>
  >({});

  useEffect(() => {
    if (mode === "edit" && user) {
      setForm({
        name: user.name,
        username: user.username,
        email: user.email,
      });
    } else if (mode === "create") {
      setForm(INITIAL_FORM_STATE);
    }
    setValidationErrors({});
  }, [mode, user]);

  const validators = React.useMemo(
    () => ({
      name: ValidationFactory.createNameValidator(),
      username: ValidationFactory.createUsernameValidator(),
      email: ValidationFactory.createEmailValidator(),
    }),
    []
  );

  const validateField = (
    field: keyof UserFormData,
    value: string
  ): string | null => {
    return validators[field].validate(value);
  };

  const updateField = (field: keyof UserFormData, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Real-time validation
    const error = validateField(field, value);
    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const resetForm = (): void => {
    setForm(INITIAL_FORM_STATE);
    setValidationErrors({});
  };

  const validateAllFields = (): boolean => {
    const errors = Object.keys(form).reduce(
      (acc, key) => {
        const field = key as keyof UserFormData;
        const error = validateField(field, form[field]);
        if (error) acc[field] = error;
        return acc;
      },
      {} as Partial<Record<keyof UserFormData, string>>
    );

    setValidationErrors(errors);
    return (
      Object.keys(errors).length === 0 &&
      Object.values(form).every((value) => value.trim().length > 0)
    );
  };

  // Calculate form validity without side effects
  const isFormValid =
    Object.values(validationErrors).every((error) => !error) &&
    Object.values(form).every((value) => value.trim().length > 0);

  return {
    form,
    updateField,
    resetForm,
    isFormValid,
    validationErrors,
    validateAllFields,
  };
};
