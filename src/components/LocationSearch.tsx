import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockApiService } from '../services/mockApi';
import { ArrowLeft, MapPin, Search, Star, Clock, Navigation, Users } from 'lucide-react';

interface LocationSearchProps {
  onBack: () => void;
}

interface GuruLocation {
  id: string;
  name: string;
  skills: string[];
  hourly_rate: number;
  location: string;
  distance_km: number;
  latitude: number;
  longitude: number;
  rating: number;
  reviews_count: number;
  availability: string;
}

export function LocationSearch({ onBack }: LocationSearchProps) {
  const [searchRadius, setSearchRadius] = useState('10');
  const [searchSkill, setSearchSkill] = useState('');
  const [nearbyGurus, setNearbyGurus] = useState<GuruLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 23.03, lng: 72.57 }); // Default to Ahmedabad
  const [selectedGuru, setSelectedGuru] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 23.03, lng: 72.57 });
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await mockApiService.getLocationResults(
        userLocation.lat, 
        userLocation.lng, 
        parseInt(searchRadius), 
        10
      );
      
      // Add mock coordinates for map display
      const gurusWithCoords = response.data.nearby_gurus.map((guru: any, index: number) => ({
        ...guru,
        latitude: userLocation.lat + (Math.random() - 0.5) * 0.1,
        longitude: userLocation.lng + (Math.random() - 0.5) * 0.1,
        availability: ['Available now', 'Available tomorrow', 'Available this week'][index % 3]
      }));
      
      setNearbyGurus(gurusWithCoords);
    } catch (error) {
      console.error('Location search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          setMapCenter(newLocation);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Keep default location
        }
      );
    }
  };

  useEffect(() => {
    getUserLocation();
    handleSearch();
  }, []);

  const handleMarkerClick = (guruId: string) => {
    setSelectedGuru(guruId);
    const guru = nearbyGurus.find(g => g.id === guruId);
    if (guru) {
      setMapCenter({ lat: guru.latitude, lng: guru.longitude });
    }
  };

  // Filter gurus based on search skill input
  const filteredGurus = nearbyGurus.filter(guru => {
    if (!searchSkill.trim()) return true; // Show all if no skill filter
    
    return guru.skills.some(skill => 
      skill.toLowerCase().includes(searchSkill.toLowerCase())
    );
  });

  const selectedGuruData = filteredGurus.find(g => g.id === selectedGuru);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3)); // Max zoom 3x
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5)); // Min zoom 0.5x
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
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
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center space-y-4 mb-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Location-Based Search
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find expert gurus near your location or anywhere you'd like to learn. 
              Discover local talent or connect virtually with mentors worldwide.
            </p>
          </div>

          {/* Search Controls */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search Nearby Gurus</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Search by skill..."
                  value={searchSkill}
                  onChange={(e) => setSearchSkill(e.target.value)}
                  className="md:col-span-2"
                />
                <Select value={searchRadius} onValueChange={setSearchRadius}>
                  <SelectTrigger>
                    <SelectValue placeholder="Search radius" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Within 5 km</SelectItem>
                    <SelectItem value="10">Within 10 km</SelectItem>
                    <SelectItem value="25">Within 25 km</SelectItem>
                    <SelectItem value="50">Within 50 km</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={getUserLocation}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Use My Location
                </Button>
                <Badge variant="secondary">
                  {filteredGurus.length} gurus found
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map Section */}
            <Card className="lg:sticky lg:top-8">
              <CardHeader>
                <CardTitle>Interactive Map</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative h-96 rounded-lg overflow-hidden">
                  {/* Ahmedabad Satellite Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 ease-out"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1561784493-88b0a3ce0c76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaG1lZGFiYWQlMjBpbmRpYSUyMGNpdHklMjBvdmVyaGVhZCUyMGRyb25lJTIwYWVyaWFsfGVufDF8fHx8MTc1Nzg2NjMxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: 'center center'
                    }}
                  >
                    {/* Subtle overlay for better marker visibility */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    
                    {/* User Location Marker */}
                    <div 
                      className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-x-2 -translate-y-2 z-10"
                      style={{ 
                        left: '50%', 
                        top: '50%',
                      }}
                      title="Your Location"
                    >
                      <div className="absolute w-8 h-8 bg-blue-500/30 rounded-full -top-2 -left-2 animate-ping"></div>
                    </div>

                    {/* Guru Location Markers - Only Filtered Results */}
                    {filteredGurus.map((guru, index) => {
                      const offsetX = (Math.random() - 0.5) * 60 + 50; // Random position around center
                      const offsetY = (Math.random() - 0.5) * 60 + 50;
                      const isSelected = selectedGuru === guru.id;
                      
                      return (
                        <div
                          key={guru.id}
                          className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-3 -translate-y-3 transition-all hover:scale-110 ${
                            isSelected ? 'bg-orange-500 z-20 scale-125' : 'bg-purple-500 z-10'
                          }`}
                          style={{ 
                            left: `${offsetX}%`, 
                            top: `${offsetY}%` 
                          }}
                          onClick={() => handleMarkerClick(guru.id)}
                          title={`${guru.name} - ${guru.skills[0]}`}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Users className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      );
                    })}

                  </div>

                  {/* Map Controls - Fixed Position Outside Scaled Container */}
                  <div className="absolute top-4 right-4 space-y-2 z-30">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white/90 hover:bg-white/100 shadow-lg"
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 3}
                    >
                      <span className="text-lg">+</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white/90 hover:bg-white/100 shadow-lg"
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 1}
                    >
                      <span className="text-lg">−</span>
                    </Button>
                  </div>

                  {/* Map Legend - Fixed Position Outside Scaled Container */}
                  <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 space-y-2 text-sm z-30 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Your Location</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Available Gurus</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>Selected Guru</span>
                    </div>
                  </div>
                </div>

                {/* Selected Guru Info */}
                {selectedGuruData && (
                  <div className="p-4 border-t">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4>{selectedGuruData.name}</h4>
                        <p className="text-sm text-gray-600">{selectedGuruData.location}</p>
                      </div>
                      <Badge>₹{selectedGuruData.hourly_rate}/hr</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{selectedGuruData.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{selectedGuruData.distance_km}km away</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{selectedGuruData.availability}</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      Connect with {selectedGuruData.name.split(' ')[0]}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results List */}
            <div className="space-y-6">
              <h2 className="text-2xl">
                {searchSkill.trim() ? (
                  <>Gurus with "{searchSkill}" ({filteredGurus.length})</>
                ) : (
                  <>Nearby Gurus ({filteredGurus.length})</>
                )}
              </h2>
              
              <div className="space-y-4">
                {filteredGurus.map((guru) => (
                  <Card 
                    key={guru.id} 
                    className={`hover:shadow-lg transition-all cursor-pointer ${
                      selectedGuru === guru.id ? 'ring-2 ring-orange-500 shadow-lg' : ''
                    }`}
                    onClick={() => handleMarkerClick(guru.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg">{guru.name}</h3>
                          <p className="text-gray-600">{guru.location}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge className="bg-purple-100 text-purple-700">
                            ₹{guru.hourly_rate}/hr
                          </Badge>
                          <div className="text-sm text-gray-600">{guru.distance_km}km away</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{guru.rating} ({guru.reviews_count} reviews)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span className="text-green-600">{guru.availability}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {guru.skills.map((skill, index) => {
                            const isMatching = searchSkill.trim() && 
                              skill.toLowerCase().includes(searchSkill.toLowerCase());
                            
                            return (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className={`text-xs ${
                                  isMatching ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : ''
                                }`}
                              >
                                {skill}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button className="flex-1" variant="outline">
                          View Profile
                        </Button>
                        <Button className="flex-1">
                          Connect Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredGurus.length === 0 && nearbyGurus.length > 0 && !loading && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg mb-2">No gurus found with "{searchSkill}"</h3>
                    <p className="text-gray-600 mb-4">Try searching for different skills or clear the search to see all nearby gurus.</p>
                    <Button variant="outline" onClick={() => setSearchSkill('')}>
                      Clear Skill Filter
                    </Button>
                  </CardContent>
                </Card>
              )}

              {nearbyGurus.length === 0 && !loading && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg mb-2">No gurus found nearby</h3>
                    <p className="text-gray-600 mb-4">Try expanding your search radius or searching for different skills.</p>
                    <Button variant="outline" onClick={() => setSearchRadius('50')}>
                      Expand Search to 50km
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}