import Post from "../../components/Post";

export default async function Articles() {
  let posts = null;
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}article`);
    if (!data.ok) {
      throw new Error(`HTTP error! status: ${data.status}`);
    }
    posts = await data.json();
    console.log("Posts are", posts);
  } catch (error) {
    console.error("Error fetching articles:", error);
    posts = null;
  }

  return (
    <main className="min-h-screen py-10 px-4">
      {posts && posts.length > 0 ? (
        posts.map((post) => <Post {...post} key={post.id} />)
      ) : (
        <div className="flex items-center justify-center py-16">
          <div className="text-center p-8 rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-emerald-800 mb-2">
              No Articles Available
            </h3>
            <p className="text-emerald-600 text-sm">
              We couldn't find any articles at the moment. Check back later for
              new content.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
