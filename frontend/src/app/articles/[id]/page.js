import React from "react";
import { BASE_URL } from "../../../lib/config";
import Post from "../../../components/Post";
import Link from "next/link";

export default async function Article({ params }) {
  const { id } = await params;
  let post = null;

  try {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}article/${id}`
    );
    if (!data.ok) {
      throw new Error(`HTTP error! status: ${data.status}`);
    }
    post = await data.json();
    console.log("Posts are", post);
  } catch (error) {
    console.error("Error fetching articles:", error);
    post = null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {post && Object.keys(post).length > 0 ? (
          <Post {...post} />
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center p-10 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm border border-emerald-100 max-w-lg">
              <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center shadow-sm">
                <img src={"/siraj_logo.svg"} />
              </div>
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">
                Article Not Found
              </h3>
              <p className="text-emerald-600/80 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                The article you're looking for might have been moved, deleted,
                or doesn't exist. Let's get you back to our content.
              </p>

              <div className="space-y-3">
                <Link
                  href="/articles"
                  className="inline-block w-full px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-all duration-300 ease-out shadow-sm hover:shadow-md"
                >
                  Browse Articles
                </Link>

                <Link
                  href="/"
                  className="inline-block w-full px-6 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-medium hover:bg-emerald-100 transition-all duration-300 ease-out"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
