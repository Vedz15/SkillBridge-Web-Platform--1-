import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { mockApiService } from '../services/mockApi';
import { ArrowLeft, Users, Star, MapPin, Clock, Search } from 'lucide-react';

interface SmartMatchingProps {
  onBack: () => void;
}

interface Guru {
  id: string;
  name: string;
  skills: string[];
  hourly_rate: number;
  location: string;
  distance_km: number;
  rating: number;
  reviews_count: number;
}

export function SmartMatching({ onBack }: SmartMatchingProps) {
  const [searchSkills, setSearchSkills] = useState('');
  const [matchedGurus, setMatchedGurus] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchSkills.trim()) return;
    
    setLoading(true);
    try {
      const response = await mockApiService.getMatches(searchSkills, 23.03, 72.57, 5);
      setMatchedGurus(response.data.recommended_gurus);
      setHasSearched(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load initial matches on component mount
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-4 max-w-7xl mx-auto w-full">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white">S</span>
            </div>
            <span className="text-xl">SkillBridge</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center space-y-4 mb-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              Smart Matching
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI connects you with the perfect mentor based on your skills, location, and learning goals. 
              Enter your desired skills to find the best gurus near you.
            </p>
          </div>

          {/* Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Find Your Perfect Guru</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Enter skills (e.g., yoga, cooking, music, programming)"
                  value={searchSkills}
                  onChange={(e) => setSearchSkills(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={loading || !searchSkills.trim()}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  {loading ? 'Searching...' : 'Find Matches'}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchSkills('yoga')}>
                  Yoga
                </Badge>
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchSkills('cooking')}>
                  Cooking
                </Badge>
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchSkills('music')}>
                  Music
                </Badge>
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchSkills('programming')}>
                  Programming
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {hasSearched && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl">Recommended Gurus</h2>
                <Badge className="bg-green-100 text-green-700">
                  {matchedGurus.length} matches found
                </Badge>
              </div>

              {matchedGurus.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedGurus.map((guru) => (
                    <Card key={guru.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium">{guru.name}</h3>
                            <p className="text-gray-600">{guru.location}</p>
                          </div>
                          <Badge className="bg-orange-100 text-orange-700">
                            ₹{guru.hourly_rate}/hr
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{guru.rating} ({guru.reviews_count} reviews)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{guru.distance_km}km away</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {guru.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button className="w-full" variant="outline">
                            Connect with {guru.name.split(' ')[0]}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg mb-2">No matches found</h3>
                    <p className="text-gray-600">Try searching for different skills or check your spelling.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* How It Works Section */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>How Smart Matching Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Search className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4>1. Enter Skills</h4>
                  <p className="text-sm text-gray-600">Tell us what you want to learn</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4>2. AI Matching</h4>
                  <p className="text-sm text-gray-600">Our AI finds the best gurus for you</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <h4>3. Connect & Learn</h4>
                  <p className="text-sm text-gray-600">Start learning from verified experts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}