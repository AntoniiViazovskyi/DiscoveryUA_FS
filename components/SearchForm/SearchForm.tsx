"use client";
import { Form, Formik, Field, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./SearchForm.module.css";
import { useRouter } from "next/navigation";
import Button from "../Button/Button";

interface SearchFormValues {
  search: string;
}

const initialValues: SearchFormValues = {
  search: "",
};

const searchFormSchema = Yup.object().shape({
  search: Yup.string()
    .required("Введіть запит")
    .min(3, "Введіть щонайменше 3 літери для пошуку"),
});

export default function SearchForm() {
  const router = useRouter();
  const handleSubmit = (
    values: SearchFormValues,
    actions: FormikHelpers<SearchFormValues>,
  ) => {
    router.push(`/locations?search=${encodeURIComponent(values.search.trim())}`);
    actions.resetForm();
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={searchFormSchema}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ errors, touched,  isSubmitting }) => (
      <Form className={css.searchForm} noValidate>
        <div className={css.formGroup}>
          <Field
            type="text"
            name="search"
            placeholder="Введіть назву, тип або регіон..."
            aria-label="Пошук локації або регіону"
            id="searchQuery"
            className={css.searchInput}         
        
            aria-invalid={errors.search && touched.search ? "true" : "false"}
          />
          <ErrorMessage name="search" component="span" className={css.error} />
        </div>
        
      <Button type={'submit'}  disabled={isSubmitting}></Button>
      </Form>
    )}
    </Formik>
  );
}
