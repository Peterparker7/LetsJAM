// import { Formik, Form, Field } from "formik";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateDetailForm = () => {
  const formik = useFormik({
    initialValues: {
      title: "",
      email: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .max(5, "Must be 5 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        onChange={formik.handleChange}
      />
      {formik.touched.title && formik.errors.title ? (
        <div>{formik.errors.title}</div>
      ) : null}

      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email ? (
        <div>{formik.errors.email}</div>
      ) : null}
    </form>
  );
};

export default CreateDetailForm;
