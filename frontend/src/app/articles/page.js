"use client";

import Post from "../../components/Post";
import { useEffect, useState } from "react";
import Link from "next/link";
import svgs from "@/lib/svgs";
export default function Articles() {
  const [data, setData] = useState(null);
  const [posts, setPosts] = useState(null);

  // Fetch user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setData(parsedData);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    } else {
      console.log("No user found in localStorage");
    }
  }, []);

  // Fetch articles from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}article`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setPosts(null);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen py-10 px-4 ">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <Post {...post} key={post.id} currentUser={data.id} />
        ))
      ) : (
        <div className="flex items-center justify-center py-20">
          <div className="text-center p-10 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm border border-emerald-100 max-w-md">
            <div className="w-14 h-14 mx-auto mb-8 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center shadow-sm">
              <img src="/siraj_logo.svg" className="w-9 h-9" alt="Siraj Logo" />
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

      {data && data.role == "doctor" && (
        <div className="fixed top-21 right-4 z-50">
          <Link
            href="/articles/new"
            className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-medium shadow-lg hover:bg-emerald-700 transition"
          >
            Add
          </Link>
        </div>
      )}
    </main>
  );
}
