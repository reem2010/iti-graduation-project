//form edit

import ArticleForm from "../../../../components/ArticleForm";
export default async function EditArticle({ params }) {
  const { id } = await params;
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}article/${id}`
  );
  const article = await data.json();

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-8">
      <ArticleForm
        initialContent={article.content}
        initialMediaUrl={article.media}
        articleId={id}
        mode="edit"
      />
    </div>
  );
}
