import React from "react";
import Image from "next/image";
import Link from "next/link";
import { log } from "node:console";
export default function Post({
  doctorProfile,
  content,
  media,
  createdAt,
  updatedAt,
  id,
}) {
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
    const fileType = ImageExtensions.includes(ext)
      ? "image"
      : videoExtensions.includes(ext)
      ? "video"
      : undefined;
    return fileType;
  };
  console.log(media);

  return (
    <article className="prose prose-lg prose-neutral dark:prose-invert mx-auto max-w-3xl px-4 py-8">
      {/* Author Info */}
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={
            doctorProfile.user.avatarUrl
              ? doctorProfile.user.avatarUrl
              : "/image.png"
          }
          alt={doctorProfile.user.firstName}
          width={56}
          height={56}
          className="rounded-full object-cover"
        />

        <div>
          <p className="text-base font-medium">
            {doctorProfile.user.firstName} {doctorProfile.user.lastName}
          </p>
          <p className="text-sm text-gray-500">
            {doctorProfile.specialization} • {doctorProfile.yearsOfExperience}{" "}
            yrs experience
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="text-justify text-[1.05rem] leading-7">{content}</div>

      {/* Optional Media */}
      {media && (
        <div className="my-6">
          {fileType(media) === "image" ? (
            <Image
              src={media}
              alt="post media"
              width={800}
              height={500}
              className="rounded-lg mx-auto w-full object-cover"
            />
          ) : (
            <video
              controls
              className="rounded-lg mx-auto w-full max-h-[500px] object-cover"
            >
              <source src={media} />
            </video>
          )}
        </div>
      )}
      <Link href={`/articles/${id}/edit`}>Edit</Link>

      {/* Footer */}
      <footer className="mt-8 text-sm text-gray-500 border-t pt-4">
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
