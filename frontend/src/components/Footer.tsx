export default function Footer() {
  return (
    <footer className="bg-secondary text-text border-t border-border mt-12">
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} MyWebsite. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-accent">Privacy</a>
          <a href="#" className="hover:text-accent">Terms</a>
          <a href="#" className="hover:text-accent">Help</a>
        </div>
      </div>
    </footer>
  );
}
