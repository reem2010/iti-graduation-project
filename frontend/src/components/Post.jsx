"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import svgs from "@/lib/svgs";
import Router from "next/router";
import { BASE_URL } from "@/lib/config";
export default function Post({
  doctorProfile,
  content,
  media,
  createdAt,
  updatedAt,
  id,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const MAX_CHARS = 350;

  const ImageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "tiff",
    "webp",
    "heif",
    "raw",
  ];
  const videoExtensions = [
    "mp4",
    "mov",
    "avi",
    "mkv",
    "flv",
    "wmv",
    "webm",
    "m4v",
    "3gp",
  ];

  const fileType = (file) => {
    const ext = file.split(".").pop().toLowerCase();
    return ImageExtensions.includes(ext)
      ? "image"
      : videoExtensions.includes(ext)
      ? "video"
      : undefined;
  };
  const handleDelete = async (postId) => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${BASE_URL}/articles/${postId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Post deleted.");
        Router.push("/articles");
      } else {
        alert("Failed to delete post.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting post.");
    }
  };

  const showReadMore = content.length > MAX_CHARS;
  const displayedContent = isExpanded
    ? content
    : content.slice(0, MAX_CHARS) + (showReadMore ? "..." : "");

  return (
    <article className="bg-card text-card-foreground rounded-2xl shadow-sm p-6 md:p-8 max-w-3xl mx-auto space-y-6 border border-border mt-9">
      {/* Author */}
      <div className="flex items-center gap-4">
        <Image
          src={doctorProfile.user.avatarUrl || "/anonymous.png"}
          alt={`${doctorProfile.user.firstName} ${doctorProfile.user.lastName}`}
          width={56}
          height={56}
          className="rounded-full object-cover border border-emerald-500 "
        />
        <div>
          <p className="text-lg font-semibold">
            {doctorProfile.user.firstName} {doctorProfile.user.lastName}
          </p>
          <p className="text-sm text-muted-foreground">
            {doctorProfile.specialization} • {doctorProfile.yearsOfExperience}{" "}
            yrs experience
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="text-[1.05rem] leading-7 text-justify text-foreground">
        {displayedContent}
        {showReadMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 text-siraj-emerald-600 hover:text-siraj-emerald-700 font-medium transition"
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>

      {/* Media */}
      {media && (
        <div className="relative group rounded-lg border border-muted bg-muted p-2">
          {fileType(media) === "image" ? (
            <div className="overflow-hidden">
              <Image
                src={media}
                alt="Post media"
                width={800}
                height={500}
                className="mx-auto h-64 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <video controls className="w-full max-h-[500px] object-contain">
              <source src={media} />
            </video>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <Link
          href={`/articles/${id}/edit`}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted transition"
          title="Edit post"
        >
          {svgs.pencil}
          <span>Edit</span>
        </Link>
        <button
          onClick={() => handleDelete(id)}
          className="btn-subtle"
          title="Delete post"
        >
          {svgs.eraser}
          <span>Delete</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="pt-4 mt-4 border-t   border-emerald-500 text-sm text-muted-foreground">
        Posted on{" "}
        {new Date(createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        {createdAt !== updatedAt && (
          <span>
            {" "}
            • Updated{" "}
            {new Date(updatedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
      </footer>
    </article>
  );
}
