import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Login } from "../component/Login/Login";
import styles from "../styles/Home.module.css";
import { BMI } from "../component/BMI/BMI";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Ziva Health Care| BMI Calculator</title>
        <meta name="description" content="BMI Calculator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BMI></BMI>
    </div>
  );
};

export default Home;
