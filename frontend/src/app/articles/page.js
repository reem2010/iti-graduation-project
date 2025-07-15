"use client";
import Post from "../../components/Post";
import { useEffect, useState } from "react";
export default async function Articles() {
  // const [role, setRole] = useState("");
  // useEffect(() => {
  //   const data = localStorage.getItem("user");
  //   if (data) {
  //     setRole(JSON.parse(data));
  //   }
  // }, []);
  // console.log("Role", role);
  let posts = null;
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}article`);
    if (!data.ok) {
      throw new Error(`HTTP error! status: ${data.status}`);
    }
    posts = await data.json();
  } catch (error) {
    console.error("Error fetching articles:", error);
    posts = null;
  }

  return (
    <main className="min-h-screen py-10 px-4">
      {posts && posts.length > 0 ? (
        posts.map((post) => <Post {...post} key={post.id} />)
      ) : (
        <div className="flex items-center justify-center py-20">
          <div className="text-center p-10 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm border border-emerald-100 max-w-md">
            <div className="w-14 h-14 mx-auto mb-8 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center shadow-sm">
              <img src={"/siraj_logo.svg"} className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-semibold text-emerald-800 mb-3">
              No Articles Yet
            </h3>
            <p className="text-emerald-600/80 text-sm leading-relaxed max-w-xs mx-auto">
              We're working on bringing you fresh content. Check back soon for
              new articles and updates.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
