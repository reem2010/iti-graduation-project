import Post from "../../components/Post";
import { BASE_URL } from "../../lib/config";
export default async function page() {
  const data = await fetch(`${BASE_URL}/article`);
  const result = await data.json();
  console.log(result);
  const post = {
    content: "Important updates on post-op care for heart surgery patients.",
    createdAt: "2025-07-06T09:00:00Z",
    updatedAt: "2025-07-07T10:00:00Z",
    media: [
      { type: "image", url: "/heart-care.jpg" },
      //   { type: "video", url: "/post-op-guide.mp4" },
    ],
    doctor: {
      name: "Dr. Anaya Rios",
      //   photo: "/doctor-anaya.jpg",
      specialization: "Cardiothoracic Surgery",
      yearsOfExperience: 18,
    },
  };
  return (
    <main className="min-h-screen py-10 px-4">
      <Post {...post} />
    </main>
  );
}
