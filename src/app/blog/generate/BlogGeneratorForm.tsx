'use client';

import { useState } from 'react';

export default function BlogGeneratorForm() {
  const [wordCount, setWordCount] = useState(1100);

  const blogTypes = [
    'Edukatív', 'Vicces', 'Érdekesség', 'Toplista', 
    'Termékajánló', 'Kategória ajánló', 'Márka ajánló'
  ];

  return (
    <form className="space-y-8">
      {/* Vezérlőpult Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700">
        
        {/* Terjedelem */}
        <div className="space-y-4">
          <label htmlFor="wordCount" className="text-lg font-semibold">Választható terjedelem: <span className="font-bold text-blue-400">{wordCount} szó</span></label>
          <input
            id="wordCount"
            type="range"
            min="200"
            max="2000"
            step="50"
            value={wordCount}
            onChange={(e) => setWordCount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Hangnem */}
        <div className="space-y-2">
          <label className="text-lg font-semibold">Választható hangnem</label>
          <div className="flex gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="tone" value="Közvetlen" className="radio radio-primary" defaultChecked />
              <span>Közvetlen</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="tone" value="Szakmai" className="radio radio-primary" />
              <span>Szakmai</span>
            </label>
          </div>
        </div>

        {/* Típus */}
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label htmlFor="blogType" className="text-lg font-semibold">Választható blogbejegyzés típus</label>
          <select id="blogType" className="w-full px-4 py-3 text-white bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            {blogTypes.map(type => <option key={type}>{type}</option>)}
          </select>
        </div>

        {/* Téma vagy URL */}
        <div className="col-span-1 md:col-span-2 space-y-4">
            <div>
                <label htmlFor="topic" className="text-lg font-semibold">Téma (kulcsszó vagy kifejezés)</label>
                <input
                    id="topic"
                    type="text"
                    placeholder="pl. professzionális padlótisztítás"
                    className="w-full mt-2 px-4 py-2 text-white bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="text-center text-gray-400">VAGY</div>
            <div>
                <label htmlFor="urls" className="text-lg font-semibold">Termék/Kategória URL-ek</label>
                <textarea
                    id="urls"
                    rows={3}
                    placeholder="Minden URL-t új sorba írj..."
                    className="w-full mt-2 px-4 py-2 text-white bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
            </div>
        </div>
      </div>
      
      {/* Generálás gomb */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg"
        >
          Cikk Generálása
        </button>
      </div>
    </form>
  );
} 