import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import { getAuthToken } from "../utils/auth";
import Draft from "../components/Draft";

const DraftPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <Layout>
      <div>{isLoggedIn ? <Draft /> : <p>You must be logged in to create a draft.</p>}</div>
    </Layout>
  );
};

export default DraftPage;
