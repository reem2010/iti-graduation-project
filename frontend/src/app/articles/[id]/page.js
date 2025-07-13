import React from "react";
import { BASE_URL } from "../../../lib/config";
import Post from "../../../components/Post";
export default async function Article({ params }) {
  const { id } = await params;
  const data = await fetch(`${BASE_URL}/article/${id}`);
  const post = await data.json();
  console.log(post);

  console.log(post);
  return (
    <div className="min-h-screen flex items-center justify-center px-4 min-w-2xl">
      <div className="w-[80%]">
        <Post {...post} />
      </div>
    </div>
  );
}
