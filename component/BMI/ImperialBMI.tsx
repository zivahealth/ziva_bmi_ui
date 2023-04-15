import React, { useState } from "react";
import { Formik } from "formik";
import { Form } from "reactstrap";
import { InputField } from "../../core/FormField/InputField";
import * as Yup from "yup";

export const ImperialBMI = (props: any) => {
  const [response, setResponse] = useState<any>({});
  const LoginFormSchema = Yup.object().shape({
    weight_lbs: Yup.string().required("Please enter the weight."),
    height_ft: Yup.string().required("Please enter the height in feet."),
    sex_num: Yup.number().required("Select gender."),
    waist_circum_in: Yup.number().required("Enter waist_circum_in."),
    age_yrs: Yup.number().required("Please enter the age."),
  });
  return (
    <>
      <div className="p-2">
        <pre>{JSON.stringify(response, null, 4)}</pre>
        metric_system: Annotated[str, Form()], age_yrs: Annotated[int, Form()],
        sex_num: Annotated[int, Form()], height_in: Annotated[int, Form()],
        weight_lbs: Annotated[float, Form()], waist_circum_in: Annotated[int,
        Form()],
        <Formik
          initialValues={{
            weight_lbs: 140,
            height_ft: "6'0",
            sex_num: 0,
            waist_circum_in: 28,
            age_yrs: 25,
          }}
          validationSchema={LoginFormSchema}
          validateOnChange={true}
          enableReinitialize={true}
          onSubmit={(values: any) => {
            let [heightFeet, heightInch] = values.height_ft.split(`'`);
            heightInch = heightInch ? parseInt(heightInch) : 0;
            heightFeet = heightFeet ? parseInt(heightFeet) : 0;
            const height_in =
              parseFloat(heightFeet) * 12 + parseFloat(heightInch);
            const form = new FormData();
            Object.keys(values).forEach((item) => {
              form.append(item, values[item]);
            });
            form.append(`height_in`, `${height_in}`);
            form.append(`metric_system`, `${`imperial`}`);
            // props.updateBMI(values);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            setFieldValue,
            submitForm,
          }) => (
            <Form>
              {/* <pre>{JSON.stringify(values, null, 4)}</pre> */}
              <div className="mb-3">
                <div className="form-group">
                  <InputField
                    name="weight_lbs"
                    label="Weight(LBS)"
                    placeholder="Enter Weight in lbs"
                    type="number"
                    data-id="weight"
                    errors={errors}
                    values={values}
                    touched={touched}
                    handleChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <InputField
                  name="height_ft"
                  label="Height ex(5'0)"
                  type={"text"}
                  placeholder="Enter Height in meeter"
                  errors={errors}
                  values={values}
                  touched={touched}
                  handleChange={handleChange}
                ></InputField>
              </div>
              <div className="form-group">
                <InputField
                  name="waist_circum_in"
                  label="Waist Circum(Inch)"
                  type={"text"}
                  placeholder="Enter Waist Circum in Inch"
                  errors={errors}
                  values={values}
                  touched={touched}
                  handleChange={handleChange}
                ></InputField>
              </div>
              <div className="form-group">
                <InputField
                  name="age_yrs"
                  label="Age"
                  type={"number"}
                  placeholder="Enter Age"
                  errors={errors}
                  values={values}
                  touched={touched}
                  handleChange={handleChange}
                ></InputField>
              </div>

              <div className="mb-3">
                <div className="form-group">
                  <span className="mb-2 d-block">Gender</span>
                  <select
                    name={`sex_num`}
                    onChange={(event) => {
                      setFieldValue(`sex_num`, event.currentTarget.value);
                    }}
                  >
                    <option value={`1`}>Female</option>
                    <option value={`0`}>Male</option>
                  </select>
                </div>
              </div>

              <div className="mt-3 d-grid">
                <button
                  className="btn btn-primary btn-block"
                  //   type="submit"
                  onClick={submitForm}
                >
                  Calculate
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
