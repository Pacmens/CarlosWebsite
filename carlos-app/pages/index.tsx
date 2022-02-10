import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-xl">Welcome to the Carlos Website</h2>
      </div>
    </Layout>
  );
};

export default Home;
