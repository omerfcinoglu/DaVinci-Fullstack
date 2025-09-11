import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-700/50 py-6 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-zinc-400">
              © 2025 Wubaluba dub dub.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
