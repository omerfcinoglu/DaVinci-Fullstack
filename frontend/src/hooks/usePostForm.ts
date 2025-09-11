import React, { useState, useEffect } from "react";
import type { Post } from "@/domain/types";
import { ValidationFactory } from "@/utils/validation";

export interface PostFormData {
  title: string;
  body: string;
  userId: string; // String for form input, will be converted to number
}

export interface UsePostFormProps {
  mode: "edit" | "create";
  post: Post | null;
  availableUsers?: Array<{ id: number; name: string }>;
}

export interface UsePostFormReturn {
  form: PostFormData;
  updateField: (field: keyof PostFormData, value: string) => void;
  resetForm: () => void;
  isFormValid: boolean;
  validationErrors: Partial<Record<keyof PostFormData, string>>;
  validateAllFields: () => boolean;
}

const INITIAL_FORM_STATE: PostFormData = {
  title: "",
  body: "",
  userId: "",
};

export const usePostForm = ({
  mode,
  post,
  availableUsers = [],
}: UsePostFormProps): UsePostFormReturn => {
  const [form, setForm] = useState<PostFormData>(INITIAL_FORM_STATE);
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof PostFormData, string>>
  >({});

  useEffect(() => {
    if (mode === "edit" && post) {
      setForm({
        title: post.title,
        body: post.body || "",
        userId: String(post.userId),
      });
    } else if (mode === "create") {
      setForm(INITIAL_FORM_STATE);
    }
    setValidationErrors({});
  }, [mode, post]);

  const validators = React.useMemo(
    () => ({
      title: ValidationFactory.createPostTitleValidator(),
      body: ValidationFactory.createPostBodyValidator(),
      userId: ValidationFactory.createUserIdValidator(),
    }),
    []
  );

  const validateField = (
    field: keyof PostFormData,
    value: string
  ): string | null => {
    // Special validation for userId - check if it exists in available users
    if (field === "userId" && value) {
      const userId = Number(value);
      if (!isNaN(userId) && availableUsers.length > 0) {
        const userExists = availableUsers.some((user) => user.id === userId);
        if (!userExists) {
          return "Please select a valid user";
        }
      }
    }

    return validators[field].validate(value);
  };

  const updateField = (field: keyof PostFormData, value: string): void => {
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
        const field = key as keyof PostFormData;
        const error = validateField(field, form[field]);
        if (error) acc[field] = error;
        return acc;
      },
      {} as Partial<Record<keyof PostFormData, string>>
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
