import Draft from "../../components/Draft";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";

const Edit: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout>
      <p>{id}</p>
      <Draft postId={id} />
    </Layout>
  );
};

export default Edit;
