'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PersonalityTraits {
  tone: 'közvetlen' | 'szakmai' | 'humoros' | 'barátságos' | 'magázódó';
  formality: 'informális' | 'félformális' | 'formális';
  enthusiasm: 'alacsony' | 'közepes' | 'magas';
  creativity: 'konzervatív' | 'kiegyensúlyozott' | 'kreatív';
  technicality: 'egyszerű' | 'kiegyensúlyozott' | 'szakmai';
}

interface PersonalityContext {
  keywords: string[];
  useCases: string[];
  contentTypes: string[];
  targetAudience: string[];
  priority: number;
}

interface Personality {
  id: string;
  name: string;
  description: string;
  traits: PersonalityTraits;
  systemPrompt?: string;
  examples?: string[];
  context?: PersonalityContext;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  exampleCount: number;
}

interface PersonalitiesResponse {
  success: boolean;
  data?: {
    personalities: Personality[];
    total: number;
  };
  error?: string;
}

export default function PersonalitiesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPersonality, setSelectedPersonality] = useState<Personality | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' }>({ text: '', type: 'success' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      loadPersonalities();
    }
  }, [session]);

  const loadPersonalities = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/personalities');
      const data: PersonalitiesResponse = await response.json();

      if (data.success && data.data) {
        setPersonalities(data.data.personalities);
      } else {
        setMessage({ text: data.error || 'Hiba a személyiségek betöltésekor', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Hálózati hiba történt', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (personalityId: string) => {
    if (!confirm('Biztosan törölni szeretnéd ezt a személyiséget?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/personalities?id=${personalityId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ text: 'Személyiség sikeresen törölve', type: 'success' });
        loadPersonalities();
      } else {
        setMessage({ text: result.error || 'Törlés sikertelen', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Hálózati hiba történt', type: 'error' });
    }
  };

  const handleToggleActive = async (personalityId: string, currentActive: boolean) => {
    try {
      const response = await fetch('/api/admin/personalities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: personalityId,
          isActive: !currentActive
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ 
          text: `Személyiség ${!currentActive ? 'aktiválva' : 'deaktiválva'}`, 
          type: 'success' 
        });
        loadPersonalities();
      } else {
        setMessage({ text: result.error || 'Frissítés sikertelen', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Hálózati hiba történt', type: 'error' });
    }
  };

  const handleEdit = async (updatedPersonality: Personality) => {
    try {
      const response = await fetch('/api/admin/personalities', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPersonality),
      });

      if (response.ok) {
        setMessage({ text: 'Személyiség sikeresen frissítve!', type: 'success' });
        setIsEditing(false);
        setSelectedPersonality(null);
        loadPersonalities(); // Frissítjük a listát
      } else {
        setMessage({ text: 'Hiba történt a frissítés során', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Hálózati hiba történt', type: 'error' });
    }
  };

  const handleCreate = async (newPersonality: Omit<Personality, 'id' | 'createdAt' | 'updatedAt' | 'exampleCount'>) => {
    try {
      const response = await fetch('/api/admin/personalities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPersonality),
      });

      if (response.ok) {
        setMessage({ text: 'Új személyiség sikeresen létrehozva!', type: 'success' });
        setIsCreating(false);
        loadPersonalities(); // Frissítjük a listát
      } else {
        setMessage({ text: 'Hiba történt a létrehozás során', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Hálózati hiba történt', type: 'error' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('hu-HU');
  };

  const getTraitsBadges = (traits: PersonalityTraits) => {
    return [
      { label: 'Hangnem', value: traits.tone, description: 'Beszédstílus és kommunikációs mód' },
      { label: 'Formalitás', value: traits.formality, description: 'Hivatalosság szintje' },
      { label: 'Lelkesedés', value: traits.enthusiasm, description: 'Energikusság és motiváció' },
      { label: 'Kreativitás', value: traits.creativity, description: 'Ötletgazdagság és újszerűség' },
      { label: 'Technikai szint', value: traits.technicality, description: 'Szakmai részletességi szint' }
    ];
  };

  const getTraitsDescription = (traits: PersonalityTraits) => {
    const badges = getTraitsBadges(traits);
    return badges.map(badge => `${badge.label}: ${badge.value}`).join(' • ');
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Betöltés...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎭 Personality Manager</h1>
          <p className="text-gray-600">AI személyiségek kezelése és konfigurálása</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Admin Dashboard
          </Link>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ Új Személyiség
          </button>
        </div>
      </div>

      {/* Üzenetek */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Statisztikák */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Összes Személyiség</p>
              <p className="text-2xl font-semibold text-gray-900">{personalities.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aktív Személyiségek</p>
              <p className="text-2xl font-semibold text-gray-900">
                {personalities.filter(p => p.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Átlag Példaválaszok</p>
              <p className="text-2xl font-semibold text-gray-900">
                {personalities.length > 0 
                  ? Math.round(personalities.reduce((sum, p) => sum + p.exampleCount, 0) / personalities.length)
                  : 0
                }
              </p>
              <p className="text-xs text-gray-500">Mintaválaszok száma</p>
            </div>
          </div>
        </div>
      </div>

      {/* Személyiségek Lista */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Personalities</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Betöltés...</p>
          </div>
        ) : personalities.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Nincs személyiség az adatbázisban.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Név
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jellemzők
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Státusz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mintaválaszok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Módosítva
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Műveletek
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {personalities.map((personality) => (
                  <tr key={personality.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{personality.name}</div>
                        <div className="text-sm text-gray-500">{personality.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {getTraitsBadges(personality.traits).slice(0, 3).map((trait, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            title={`${trait.label}: ${trait.value} - ${trait.description}`}
                          >
                            {trait.label}: {trait.value}
                          </span>
                        ))}
                        {getTraitsBadges(personality.traits).length > 3 && (
                          <span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                            title={getTraitsDescription(personality.traits)}
                          >
                            +{getTraitsBadges(personality.traits).length - 3} több
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        personality.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {personality.isActive ? 'Aktív' : 'Inaktív'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {personality.exampleCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(personality.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleActive(personality.id, personality.isActive)}
                          className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white transition-colors ${
                            personality.isActive
                              ? 'bg-gray-600 hover:bg-gray-700'
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {personality.isActive ? 'Deaktiválás' : 'Aktiválás'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPersonality(personality);
                            setIsEditing(true);
                          }}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                          Szerkesztés
                        </button>
                        {!personality.id.startsWith('deepo_') && (
                          <button
                            onClick={() => handleDelete(personality.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 transition-colors"
                          >
                            Törlés
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Szerkesztési Modal */}
      {isEditing && selectedPersonality && (
        <PersonalityEditModal
          personality={selectedPersonality}
          onSave={handleEdit}
          onCancel={() => {
            setIsEditing(false);
            setSelectedPersonality(null);
          }}
        />
      )}

      {/* Létrehozási Modal */}
      {isCreating && (
        <PersonalityCreateModal
          onSave={handleCreate}
          onCancel={() => setIsCreating(false)}
        />
      )}
    </div>
  );
}

// Szerkesztési Modal Komponens
interface PersonalityEditModalProps {
  personality: Personality;
  onSave: (updatedPersonality: Personality) => void;
  onCancel: () => void;
}

function PersonalityEditModal({ personality, onSave, onCancel }: PersonalityEditModalProps) {
  const [formData, setFormData] = useState<Personality>({ ...personality });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateTraits = (field: keyof PersonalityTraits, value: string) => {
    setFormData(prev => ({
      ...prev,
      traits: {
        ...prev.traits,
        [field]: value
      }
    }));
  };

  const updateContext = (field: keyof PersonalityContext, value: any) => {
    setFormData(prev => ({
      ...prev,
      context: {
        ...prev.context!,
        [field]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Személyiség szerkesztése: {personality.name}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Alapadatok */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Név
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leírás
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Jellemzők */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Jellemzők</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hangnem
                  </label>
                  <select
                    value={formData.traits.tone}
                    onChange={(e) => updateTraits('tone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="közvetlen">közvetlen</option>
                    <option value="szakmai">szakmai</option>
                    <option value="humoros">humoros</option>
                    <option value="barátságos">barátságos</option>
                    <option value="magázódó">magázódó</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Formalitás
                  </label>
                  <select
                    value={formData.traits.formality}
                    onChange={(e) => updateTraits('formality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="informális">informális</option>
                    <option value="félformális">félformális</option>
                    <option value="formális">formális</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lelkesedés
                  </label>
                  <select
                    value={formData.traits.enthusiasm}
                    onChange={(e) => updateTraits('enthusiasm', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="alacsony">alacsony</option>
                    <option value="közepes">közepes</option>
                    <option value="magas">magas</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kreativitás
                  </label>
                  <select
                    value={formData.traits.creativity}
                    onChange={(e) => updateTraits('creativity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="konzervatív">konzervatív</option>
                    <option value="kiegyensúlyozott">kiegyensúlyozott</option>
                    <option value="kreatív">kreatív</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technikai szint
                  </label>
                  <select
                    value={formData.traits.technicality}
                    onChange={(e) => updateTraits('technicality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="egyszerű">egyszerű</option>
                    <option value="kiegyensúlyozott">kiegyensúlyozott</option>
                    <option value="szakmai">szakmai</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioritás (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.context?.priority || 5}
                    onChange={(e) => updateContext('priority', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* System Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                System Prompt
              </label>
              <textarea
                value={formData.systemPrompt || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={8}
                placeholder="A személyiség rendszer promptja..."
              />
            </div>

            {/* Context - Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kulcsszavak (vesszővel elválasztva)
              </label>
              <input
                type="text"
                value={formData.context?.keywords.join(', ') || ''}
                onChange={(e) => updateContext('keywords', e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="pl.: blog, marketing, seo"
              />
            </div>

            {/* Examples */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Példaválaszok (soronként egy)
              </label>
              <textarea
                value={formData.examples?.join('\n') || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  examples: e.target.value.split('\n').filter(s => s.trim().length > 0)
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Minden sorba egy példaválaszt írj..."
              />
            </div>

            {/* Gombok */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Mégse
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Mentés
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Létrehozási Modal Komponens
interface PersonalityCreateModalProps {
  onSave: (newPersonality: Omit<Personality, 'id' | 'createdAt' | 'updatedAt' | 'exampleCount'>) => void;
  onCancel: () => void;
}

function PersonalityCreateModal({ onSave, onCancel }: PersonalityCreateModalProps) {
  const [formData, setFormData] = useState<Omit<Personality, 'id' | 'createdAt' | 'updatedAt' | 'exampleCount'>>({
    name: '',
    description: '',
    traits: {
      tone: 'közvetlen',
      formality: 'félformális',
      enthusiasm: 'közepes',
      creativity: 'kiegyensúlyozott',
      technicality: 'kiegyensúlyozott'
    },
    systemPrompt: '',
    examples: [],
    context: {
      keywords: [],
      useCases: [],
      contentTypes: [],
      targetAudience: [],
      priority: 5
    },
    isActive: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Név és leírás megadása kötelező!');
      return;
    }
    onSave(formData);
  };

  const updateTraits = (field: keyof PersonalityTraits, value: string) => {
    setFormData(prev => ({
      ...prev,
      traits: {
        ...prev.traits,
        [field]: value
      }
    }));
  };

  const updateContext = (field: keyof PersonalityContext, value: any) => {
    setFormData(prev => ({
      ...prev,
      context: {
        ...prev.context!,
        [field]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Új személyiség létrehozása
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Alapadatok */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Név *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="pl.: DeepO Vendéglátás"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leírás *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="pl.: Szakmai kommunikáció vendéglátóipar számára"
                  required
                />
              </div>
            </div>

            {/* Jellemzők */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Jellemzők</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hangnem
                  </label>
                  <select
                    value={formData.traits.tone}
                    onChange={(e) => updateTraits('tone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="közvetlen">közvetlen</option>
                    <option value="szakmai">szakmai</option>
                    <option value="humoros">humoros</option>
                    <option value="barátságos">barátságos</option>
                    <option value="magázódó">magázódó</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Formalitás
                  </label>
                  <select
                    value={formData.traits.formality}
                    onChange={(e) => updateTraits('formality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="informális">informális</option>
                    <option value="félformális">félformális</option>
                    <option value="formális">formális</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lelkesedés
                  </label>
                  <select
                    value={formData.traits.enthusiasm}
                    onChange={(e) => updateTraits('enthusiasm', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="alacsony">alacsony</option>
                    <option value="közepes">közepes</option>
                    <option value="magas">magas</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kreativitás
                  </label>
                  <select
                    value={formData.traits.creativity}
                    onChange={(e) => updateTraits('creativity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="konzervatív">konzervatív</option>
                    <option value="kiegyensúlyozott">kiegyensúlyozott</option>
                    <option value="kreatív">kreatív</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technikai szint
                  </label>
                  <select
                    value={formData.traits.technicality}
                    onChange={(e) => updateTraits('technicality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="egyszerű">egyszerű</option>
                    <option value="kiegyensúlyozott">kiegyensúlyozott</option>
                    <option value="szakmai">szakmai</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioritás (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.context?.priority || 5}
                    onChange={(e) => updateContext('priority', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* System Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                System Prompt
              </label>
              <textarea
                value={formData.systemPrompt || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={8}
                placeholder="A személyiség részletes rendszer promptja..."
              />
            </div>

            {/* Context - Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kulcsszavak (vesszővel elválasztva)
              </label>
              <input
                type="text"
                value={formData.context?.keywords.join(', ') || ''}
                onChange={(e) => updateContext('keywords', e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="pl.: vendéglátás, étterem, szálloda, menü"
              />
            </div>

            {/* Context - Use Cases */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Használati esetek (vesszővel elválasztva)
              </label>
              <input
                type="text"
                value={formData.context?.useCases.join(', ') || ''}
                onChange={(e) => updateContext('useCases', e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="pl.: menü írás, vendég kommunikáció, éttermi promóció"
              />
            </div>

            {/* Examples */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Példaválaszok (soronként egy)
              </label>
              <textarea
                value={formData.examples?.join('\n') || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  examples: e.target.value.split('\n').filter(s => s.trim().length > 0)
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Minden sorba egy példaválaszt írj..."
              />
            </div>

            {/* Aktív státusz */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Aktív személyiség</span>
              </label>
            </div>

            {/* Gombok */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Mégse
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Létrehozás
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}