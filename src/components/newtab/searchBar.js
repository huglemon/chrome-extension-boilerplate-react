import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '../../components/ui/button';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
        searchTerm
      )}`;
      window.open(searchUrl, '_blank');
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-xl mx-auto rounded-full overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10"
    >
      <div className="flex items-center ml-4">
        <FcGoogle className="h-5 w-5" />
      </div>
      <div className="relative flex-grow flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="输入你要搜索的内容，按回车键将进入Google完成搜索"
          className="w-full px-5 pl-2 py-3.5 text-white bg-transparent border-none focus:outline-none placeholder-white/70"
        />
      </div>
      <Button
        type="submit"
        className="bg-transparent hover:bg-white/10 border-none rounded-r-full p-3 px-4 h-auto"
        aria-label="搜索"
      >
        <Search className="h-5 w-5 text-white" />
      </Button>
    </form>
  );
}
