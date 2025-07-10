'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import { generateBlogPost, FormState } from './actions';
import ReactMarkdown from 'react-markdown';

// Külön komponens a gombnak, hogy a useFormStatus működjön
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-8 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      {pending ? 'Generálás folyamatban...' : 'Cikk Generálása'}
    </button>
  );
}

export default function BlogGeneratorForm() {
  const [wordCount, setWordCount] = useState(1100);

  const blogTypes = [
    'Edukatív', 'Vicces', 'Érdekesség', 'Toplista',
    'Termékajánló', 'Kategória ajánló', 'Márka ajánló'
  ];
  
  const initialState: FormState = {
    status: 'idle',
    message: '',
    generatedContent: '',
  };

  const [state, formAction] = useFormState(generateBlogPost, initialState);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
        wordCount: parseInt(formData.get('wordCount') as string, 10),
        tone: formData.get('tone') as string,
        blogType: formData.get('blogType') as string,
        topic: formData.get('topic') as string,
        urls: formData.get('urls') as string,
    }
    formAction(data);
  };


  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* Vezérlőpult Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700">
          
          {/* Terjedelem */}
          <div className="space-y-4">
            <label htmlFor="wordCount" className="text-lg font-semibold">Választható terjedelem: <span className="font-bold text-blue-400">{wordCount} szó</span></label>
            <input
              id="wordCount"
              name="wordCount"
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
            <select id="blogType" name="blogType" className="w-full px-4 py-3 text-white bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              {blogTypes.map(type => <option key={type}>{type}</option>)}
            </select>
          </div>

          {/* Téma vagy URL */}
          <div className="col-span-1 md:col-span-2 space-y-4">
              <div>
                  <label htmlFor="topic" className="text-lg font-semibold">Téma (kulcsszó vagy kifejezés)</label>
                  <input
                      id="topic"
                      name="topic"
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
                      name="urls"
                      rows={3}
                      placeholder="Minden URL-t új sorba írj..."
                      className="w-full mt-2 px-4 py-2 text-white bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
              </div>
          </div>
        </div>
        
        {/* Generálás gomb */}
        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>

      {/* Eredmény Szekció */}
      {state.status !== 'idle' && (
        <div className="mt-8 p-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Generált Tartalom</h2>
          {state.status === 'loading' && <p>Generálás folyamatban...</p>}
          {state.status === 'error' && <p className="text-red-400">{state.message}</p>}
          {state.status === 'success' && (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{state.generatedContent}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </>
  );
} 