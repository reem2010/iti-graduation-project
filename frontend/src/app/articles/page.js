import Post from "../../components/Post";
import { BASE_URL } from "../../lib/config";

export default async function Articles() {
  const data = await fetch(`${BASE_URL}/article`);
  const posts = await data.json();
  return (
    <main className="min-h-screen py-10 px-4">
      {posts.map((post) => (
        <Post {...post} key={post.id} />
      ))}
    </main>
  );
}
