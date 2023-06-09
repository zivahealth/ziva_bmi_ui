import Link from "next/link";
import React, { useState } from "react";
import { Row, Col, CardBody, Card, Alert, Container } from "reactstrap";
import { InputField } from "../../core/FormField/InputField";
import { PasswordField } from "../../core/FormField/PasswordField";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import lotus from "../../public/images/lotus.png";
import profileImg from "../../public/images/profile-img.png";

import Image from "next/image";
import AuthService from "../Services/AuthService/AuthService";
import { ToastUtil } from "../../shared/utils/toast";
import axios from "axios";

// import "./style"

const LoginFormSchema = Yup.object().shape({
  weight_lbs: Yup.string().required("Please enter the weight."),
  body_fat_pred: Yup.string().required("Please enter the Body Fat(%)."),
  height_ft: Yup.string().required("Please enter the height in feet."),
  sex_num: Yup.number().required("Select gender."),
  waist_circum_in: Yup.number().required("Enter waist_circum_in."),
  age_yrs: Yup.number().required("Please enter the age."),
});
// metric_system: "",
// weight_kg: 0,
// height_ft: 0,
// sex_num: 1,
// waist_circum_cm: 0,
// age: 0,
// Do you prefer metric system or imperial system? (m/i)
// weight_kg, height_cm, sex_num, age_yrs, waist_circum_cm
// weight_lbs, height_in, sex_num, age_yrs, waist_circum_in
export const BMI = () => {
  const [response, setResponse] = useState<any>({});
  const [metric_system, setMetricSystem] = useState("imperial");
  const [bmi, setBMI] = useState({ count: 0, message: `` });

  const getBMICount = (heightInch: number, weightLBS: number) => {
    console.log(`weightLBS ,heightInch: `, weightLBS, heightInch);
    const count = (weightLBS / (heightInch * heightInch)) * 703;
    let message = ``;
    if (count < 18.5) {
      message = `Under weight`;
    } else if (count <= 24.9) {
      message = `Normal`;
    } else if (count <= 29.9) {
      message = `Overweight`;
    } else {
      message = `Obese`;
    }
    return { count, message };
  };

  const getFemaleBodyFatPer = (zivaBodyFatPercentage: number, bmi: number) => {
    let score = bmi;

    const bmi25 = (25 / 100) * bmi + bmi;
    const bmiFinal = bmi + bmi25;
    if (zivaBodyFatPercentage < bmi) {
      return zivaBodyFatPercentage.toFixed(2);
    } else {
      if (zivaBodyFatPercentage > bmiFinal) {
        return (zivaBodyFatPercentage - zivaBodyFatPercentage * 0.25).toFixed(
          2
        );
      } else {
        return (zivaBodyFatPercentage - zivaBodyFatPercentage * 0.15).toFixed(
          2
        );
      }
    }
  };
  const updateBMI = (values: any) => {
    let [heightFeet, heightInch] = values.height_ft.split(`'`);
    heightInch = heightInch ? parseInt(heightInch) : 0;
    heightFeet = heightFeet ? parseInt(heightFeet) : 0;
    const height_in = parseFloat(heightFeet) * 12 + parseFloat(heightInch);
    const form = new FormData();
    const bmi = getBMICount(height_in, values.weight_lbs);
    setBMI(bmi);
    Object.keys(values).forEach((item) => {
      form.append(item, values[item]);
    });
    form.append(`height_in`, `${height_in}`);
    form.append(`metric_system`, `${metric_system}`);
    let subURL = metric_system === "imperial" ? `imperial_bmi` : "metric_bmi";
    const URL =
      location.host === "localhost:3000"
        ? `http://localhost/${subURL}`
        : `https://ziva-bmi.pacewisdom.in/${subURL}`;
    axios
      .post(URL, form)
      .then((res) => {
        console.log(`response: `, res.data);
        setResponse(res.data.bmi);
        ToastUtil.info(`Health Score: ${res?.data?.bmi?.health_score_per}%`);
      })
      .catch((err) => {});
  };
  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={10} xl={10}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">
                          Welcome to Ziva Health BMI Calculator !
                        </h5>
                        <p>Enter details</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <Image
                        src={profileImg}
                        alt="profile"
                        className="img-fluid"
                      ></Image>
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link href="/" className="auth-logo-light">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          {/* <Image
                            src={lotus}
                            alt="lotus"
                            className="rounded-circle"
                          ></Image> */}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="mb-3">
                    <div className="form-group h5">
                      Health Score(%) = {response?.health_score_per}%
                    </div>
                    <div className="form-group h5">
                      Body Fat Pred(%) ={" "}
                      {getFemaleBodyFatPer(
                        response?.body_fat_pred_per,
                        bmi.count
                      )}
                      %
                    </div>
                    <div className="form-group h5">
                      Feedback = {response?.grade_feedback}
                    </div>
                    {/* <div className="form-group h5">
                      Note = {response?.output}
                    </div> */}
                    <div className="form-group h5">
                      BMI ={bmi.count?.toFixed(2)} ({bmi.message})
                    </div>
                    {/* <div className="form-group h5">
                      BMI2 =
                      {getFemaleBodyFatPer(
                        response?.body_fat_pred_per,
                        bmi.count
                      )}
                    </div> */}
                  </div>
                  <div className="p-2">
                    {/* <div className="mb-3">
                      <div className="form-group">
                        <span className="mb-2 d-block">Metric System</span>
                        <select
                          name={`metric_system`}
                          value={metric_system}
                          onChange={(event) => {
                            console.log(event.currentTarget.value);
                            setMetricSystem(event.currentTarget.value);
                          }}
                        >
                          <option value={`metric`}>Metric</option>
                          <option value={`imperial`}>Imperial</option>
                        </select>
                      </div>
                    </div> */}
                    <Formik
                      initialValues={{
                        weight_lbs: 140,
                        height_ft: "6'0",
                        sex_num: 0,
                        body_fat_pred: "0",
                        waist_circum_in: 28,
                        age_yrs: 25,
                      }}
                      validationSchema={LoginFormSchema}
                      validateOnChange={true}
                      enableReinitialize={true}
                      onSubmit={(values: any) => {
                        updateBMI(values);
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
                              name="body_fat_pred"
                              label="Body Fat(%)"
                              type={"text"}
                              placeholder="Enter Body Fat Percentage"
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
                                  setFieldValue(
                                    `sex_num`,
                                    event.currentTarget.value
                                  );

                                  console.log(event.currentTarget.value);
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
                              type="submit"
                              onClick={(item) => {
                                console.log(`errors: `, errors);
                                submitForm();
                              }}
                            >
                              Calculate
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  © {new Date().getFullYear()} ZivaHealth. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by{" "}
                  {`<Pacewisdom>`}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
