//form edit

import ArticleForm from "../../../../components/ArticleForm";
import { BASE_URL } from "../../../../lib/config";

export default async function EditArticle({ params }) {
  const { id } = await params;
  const data = await fetch(`${BASE_URL}/article/${id}`);
  const article = await data.json();
  // const onSubmit = async (data) => {
  //   const res = await fetch(`${BASE_URL}/article/${article.id}`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(data),
  //   });

  //   if (res.ok) {
  //     alert("Article updated!");
  //   } else {
  //     alert("Failed to update article.");
  //   }
  // };
  return (
    <>
      <ArticleForm
        initialContent={article.content}
        initialMediaUrl={article.media}
        mode="edit"
      />
    </>
  );
}
