//new article
import ArticleForm from "../../../components/ArticleForm";
import { BASE_URL } from "../../../lib/config";

export default function NewArticle() {
  /*
  onSubmit={async (data) => {
          const res = await fetch(`${BASE_URL}/article`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (res.ok) {
            alert("Article created!");
          } else {
            alert("Failed to create article.");
          }
        }} */
  return (
    <>
      <ArticleForm mode="create" />
    </>
  );
}
