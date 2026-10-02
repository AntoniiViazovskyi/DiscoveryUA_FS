"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import * as Yup from "yup";

import Button from "@/components/Button/Button";
import Select from "@/components/Select/Select";
import Textarea from "@/components/Textarea/Textarea";
import {
  type LocationTypeCategory,
  type RegionCategory,
  createLocation,
  fetchLocationTypes,
  fetchRegions,
  updateLocation,
} from "@/lib/api/clientApi";
import css from "./LocationForm.module.css";

type LocationFormValues = {
  images: File | null;
  name: string;
  type: string;
  region: string;
  description: string;
};

type LocationFormProps = {
  mode?: "create" | "edit";
  locationId?: string;
  initialImage?: string | null;
  initialValues?: Partial<Omit<LocationFormValues, "images">>;
};

const emptyValues: LocationFormValues = {
  images: null,
  name: "",
  type: "",
  region: "",
  description: "",
};

const toTypeOptions = (categories: LocationTypeCategory[]) =>
  categories.map((category) => ({
    value: category.slug,
    label: category.type,
  }));

const toRegionOptions = (categories: RegionCategory[]) =>
  categories.map((category) => ({
    value: category.slug,
    label: category.region,
  }));

export default function LocationForm({
  mode = "create",
  locationId,
  initialImage = null,
  initialValues = {},
}: LocationFormProps = {}) {
  const router = useRouter();
  const fieldId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = mode === "edit";

  const formInitialValues: LocationFormValues = {
    ...emptyValues,
    ...initialValues,
  };

  const LocationFormSchema = Yup.object().shape({
    images: Yup.mixed<File>()
      .nullable()
      .test(
        "imageRequired",
        "Додайте фото локації",
        (file) => (isEditMode && initialImage ? true : file instanceof File),
      )
      .test(
        "fileType",
        "Дозволені тільки JPG та PNG",
        (file) => !file || ["image/jpeg", "image/png"].includes(file.type),
      )
      .test(
        "fileSize",
        "Розмір фото має бути менше 1 МБ",
        (file) => !file || file.size < 1024 * 1024,
      ),
    name: Yup.string()
      .trim()
      .min(3, "Назва має містити щонайменше 3 символи")
      .max(96, "Назва має містити не більше 96 символів")
      .required("Вкажіть назву місця"),
    type: Yup.string()
      .max(64, "Тип місця має містити не більше 64 символів")
      .required("Оберіть тип місця"),
    region: Yup.string()
      .max(64, "Регіон має містити не більше 64 символів")
      .required("Оберіть регіон"),
    description: Yup.string()
      .min(20, "Опис має містити щонайменше 20 символів")
      .max(6000, "Опис має містити не більше 6000 символів")
      .required("Додайте детальний опис"),
  });

  const [regions, setRegions] = useState<RegionCategory[]>([]);
  const [locationTypes, setLocationTypes] = useState<LocationTypeCategory[]>(
    [],
  );
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadOptions = async () => {
      try {
        const [regionsData, typesData] = await Promise.all([
          fetchRegions(),
          fetchLocationTypes(),
        ]);

        if (cancelled) return;
        setRegions(regionsData);
        setLocationTypes(typesData);
      } catch {
        if (!cancelled) {
          toast.error("Не вдалося завантажити дані для форми");
        }
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    };

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (values: LocationFormValues) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("type", values.type);
      formData.append("region", values.region);
      formData.append("description", values.description);

      if (values.images) {
        formData.append("images", values.images);
      }

      if (isEditMode) {
        if (!locationId) {
          throw new Error("Не знайдено id локації для редагування");
        }

        await updateLocation(locationId, formData);

        toast.success("Зміни збережено");
        router.push(`/locations/${locationId}`);
        return;
      }

      const data = await createLocation(formData);
      router.push(`/locations/${data._id}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : isEditMode
            ? "Не вдалося зберегти зміни, спробуйте ще раз"
            : "Не вдалось створити локацію, спробуйте ще раз",
      );
    }
  };

  const handleCancel = (resetForm: () => void) => {
    resetForm();

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={formInitialValues}
      validationSchema={LocationFormSchema}
      onSubmit={handleSubmit}
    >
      {({
        dirty,
        errors,
        handleBlur,
        handleChange,
        isSubmitting,
        isValid,
        resetForm,
        setFieldTouched,
        setFieldValue,
        touched,
        values,
      }) => {
        const previewSrc = imagePreview ?? initialImage;

        return (
        <Form className={css.form} noValidate>
          <div className={css.imageField}>
            <span className={css.label}>Обкладинка</span>

            <div className={css.imageUpload}>
              <div className={css.imagePreview}>
                {previewSrc ? (
                  <Image
                    className={css.previewImage}
                    src={previewSrc}
                    alt="Попередній перегляд фото"
                    fill
                    unoptimized
                    sizes="(min-width: 1440px) 1091px, (min-width: 768px) 704px, 335px"
                  />
                ) : (
                  <svg
                    className={css.imageIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                )}
              </div>

              <label className={css.imageButton} htmlFor={`${fieldId}-images`}>
                Завантажити фото
              </label>

              <input
                ref={fileInputRef}
                className={css.fileInput}
                type="file"
                id={`${fieldId}-images`}
                accept="image/jpeg,image/png"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0] ?? null;

                  setFieldValue("images", file);
                  setFieldTouched("images", true, false);
                  setImagePreview(file ? URL.createObjectURL(file) : null);
                }}
              />
            </div>

            <ErrorMessage name="images">
              {(message) => <span className={css.error}>{message}</span>}
            </ErrorMessage>
          </div>

          <div className={css.field}>
            <label className={css.label} htmlFor={`${fieldId}-name`}>
              Назва місця
            </label>

            <Field
              className={`${css.input} ${
                touched.name && errors.name ? css.inputError : ""
              }`}
              type="text"
              name="name"
              id={`${fieldId}-name`}
              placeholder="Введіть назву місця"
              aria-invalid={touched.name && errors.name ? true : undefined}
            />

            <ErrorMessage name="name">
              {(message) => <span className={css.error}>{message}</span>}
            </ErrorMessage>
          </div>

          <Select
            name="type"
            label="Тип Місця"
            id={`${fieldId}-type`}
            options={toTypeOptions(locationTypes)}
            value={values.type}
            onChange={(value) => setFieldValue("type", value)}
            onBlur={() => setFieldTouched("type", true)}
            placeholder="Оберіть тип місця"
            error={touched.type && errors.type ? errors.type : null}
            loading={optionsLoading}
          />

          <Select
            name="region"
            label="Регіон"
            id={`${fieldId}-region`}
            options={toRegionOptions(regions)}
            value={values.region}
            onChange={(value) => setFieldValue("region", value)}
            onBlur={() => setFieldTouched("region", true)}
            placeholder="Оберіть регіон"
            error={touched.region && errors.region ? errors.region : null}
            loading={optionsLoading}
          />

          <Textarea
            name="description"
            label="Детальний опис"
            id={`${fieldId}-description`}
            placeholder="Детальний опис локації"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.description && errors.description
                ? errors.description
                : null
            }
          />

          <div className={css.actions}>
            <Button
              className={css.submitButton}
              type="submit"
              disabled={!dirty || !isValid || isSubmitting}
            >
              {isSubmitting ? (
                <span
                  className={css.loaderWrap}
                  role="status"
                  aria-label="Завантаження"
                >
                  <Oval
                    height={22}
                    width={22}
                    color="#ffffff"
                    visible
                    ariaLabel="oval-loading"
                    secondaryColor="rgba(255, 255, 255, 0.4)"
                    strokeWidth={4}
                    strokeWidthSecondary={4}
                  />
                </span>
              ) : isEditMode ? (
                "Зберегти зміни"
              ) : (
                "Опублікувати"
              )}
            </Button>

            <Button
              className={css.cancelButton}
              type="button"
              disabled={isSubmitting}
              onClick={() => handleCancel(resetForm)}
            >
              {isEditMode ? "Відмінити зміни" : "Відмінити"}
            </Button>
          </div>

          <Toaster position="top-right" />
        </Form>
        );
      }}
    </Formik>
  );
}
