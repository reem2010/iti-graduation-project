import React from "react";
import Image from "next/image";

export default function Post({
  doctorProfile,
  content,
  media,
  createdAt,
  updatedAt,
}) {
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
          {media.type === "image" ? (
            <Image
              src={media.url}
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
              <source src={media.url} />
            </video>
          )}
        </div>
      )}

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
