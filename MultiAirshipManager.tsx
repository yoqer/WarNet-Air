import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Airship {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  location: { lat: number; lng: number };
  altitude: number;
  battery: number;
  sensors: string[];
  lastUpdate: string;
}

interface AirshipFormation {
  id: string;
  name: string;
  airships: string[];
  formation: 'line' | 'triangle' | 'square' | 'circle';
  spacing: number;
}

export const MultiAirshipManager: React.FC = () => {
  const [airships, setAirships] = useState<Airship[]>([
    {
      id: 'airship-1',
      name: 'WarNet-Alpha',
      status: 'active',
      location: { lat: 40.7128, lng: -74.0060 },
      altitude: 500,
      battery: 85,
      sensors: ['radar', 'thermal', 'lidar'],
      lastUpdate: new Date().toISOString(),
    },
    {
      id: 'airship-2',
      name: 'WarNet-Beta',
      status: 'active',
      location: { lat: 40.7580, lng: -73.9855 },
      altitude: 450,
      battery: 72,
      sensors: ['radar', 'optical'],
      lastUpdate: new Date().toISOString(),
    },
  ]);

  const [formations, setFormations] = useState<AirshipFormation[]>([
    {
      id: 'formation-1',
      name: 'Reconnaissance Line',
      airships: ['airship-1', 'airship-2'],
      formation: 'line',
      spacing: 500,
    },
  ]);

  const [selectedAirship, setSelectedAirship] = useState<string>('airship-1');
  const [selectedFormation, setSelectedFormation] = useState<string>('formation-1');

  const getStatusColor = (status: Airship['status']): string => {
    const colors = {
      active: 'bg-green-500',
      idle: 'bg-yellow-500',
      maintenance: 'bg-orange-500',
      offline: 'bg-red-500',
    };
    return colors[status];
  };

  const handleFormationChange = useCallback((formationType: AirshipFormation['formation']) => {
    setFormations(prev =>
      prev.map(f =>
        f.id === selectedFormation ? { ...f, formation: formationType } : f
      )
    );
  }, [selectedFormation]);

  const handleSpacingChange = useCallback((spacing: number) => {
    setFormations(prev =>
      prev.map(f =>
        f.id === selectedFormation ? { ...f, spacing } : f
      )
    );
  }, [selectedFormation]);

  const handleAirshipCommand = useCallback((airshipId: string, command: string) => {
    setAirships(prev =>
      prev.map(a => {
        if (a.id === airshipId) {
          switch (command) {
            case 'takeoff':
              return { ...a, status: 'active' };
            case 'land':
              return { ...a, status: 'idle' };
            case 'maintenance':
              return { ...a, status: 'maintenance' };
            default:
              return a;
          }
        }
        return a;
      })
    );
  }, []);

  const currentAirship = airships.find(a => a.id === selectedAirship);
  const currentFormation = formations.find(f => f.id === selectedFormation);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🚁 Multi-Airship Management System</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fleet" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fleet">Fleet Overview</TabsTrigger>
              <TabsTrigger value="formations">Formations</TabsTrigger>
              <TabsTrigger value="control">Control Panel</TabsTrigger>
            </TabsList>

            {/* Fleet Overview */}
            <TabsContent value="fleet" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {airships.map(airship => (
                  <div
                    key={airship.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                      selectedAirship === airship.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedAirship(airship.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg">{airship.name}</h3>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(airship.status)}`} />
                    </div>

                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">Status:</span> {airship.status.toUpperCase()}
                      </p>
                      <p>
                        <span className="font-semibold">Location:</span> {airship.location.lat.toFixed(4)}, {airship.location.lng.toFixed(4)}
                      </p>
                      <p>
                        <span className="font-semibold">Altitude:</span> {airship.altitude}m
                      </p>
                      <p>
                        <span className="font-semibold">Battery:</span>
                        <div className="w-full bg-gray-300 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${
                              airship.battery > 50 ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${airship.battery}%` }}
                          />
                        </div>
                        {airship.battery}%
                      </p>
                      <p>
                        <span className="font-semibold">Sensors:</span> {airship.sensors.join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Formations */}
            <TabsContent value="formations" className="space-y-4">
              <div className="space-y-4">
                {formations.map(formation => (
                  <div
                    key={formation.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                      selectedFormation === formation.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedFormation(formation.id)}
                  >
                    <h3 className="font-bold mb-3">{formation.name}</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">Airships:</span> {formation.airships.length}
                      </p>
                      <p>
                        <span className="font-semibold">Formation:</span> {formation.formation.toUpperCase()}
                      </p>
                      <p>
                        <span className="font-semibold">Spacing:</span> {formation.spacing}m
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {currentFormation && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-bold mb-4">Formation Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold">Formation Type</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {(['line', 'triangle', 'square', 'circle'] as const).map(type => (
                          <button
                            key={type}
                            onClick={() => handleFormationChange(type)}
                            className={`p-2 rounded text-sm font-medium transition ${
                              currentFormation.formation === type
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                          >
                            {type.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold">Spacing: {currentFormation.spacing}m</label>
                      <input
                        type="range"
                        min="100"
                        max="2000"
                        step="100"
                        value={currentFormation.spacing}
                        onChange={e => handleSpacingChange(parseInt(e.target.value))}
                        className="w-full mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Control Panel */}
            <TabsContent value="control" className="space-y-4">
              {currentAirship && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-bold mb-4">Control: {currentAirship.name}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button
                      onClick={() => handleAirshipCommand(currentAirship.id, 'takeoff')}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      ✈️ Takeoff
                    </Button>
                    <Button
                      onClick={() => handleAirshipCommand(currentAirship.id, 'land')}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      🛬 Land
                    </Button>
                    <Button
                      onClick={() => handleAirshipCommand(currentAirship.id, 'maintenance')}
                      className="bg-yellow-500 hover:bg-yellow-600"
                    >
                      🔧 Maintenance
                    </Button>
                    <Button
                      onClick={() => handleAirshipCommand(currentAirship.id, 'sync')}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      🔄 Sync
                    </Button>
                  </div>
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold mb-3">Fleet Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Airships</p>
                    <p className="text-2xl font-bold">{airships.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">
                      {airships.filter(a => a.status === 'active').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Battery</p>
                    <p className="text-2xl font-bold">
                      {Math.round(airships.reduce((sum, a) => sum + a.battery, 0) / airships.length)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Formations</p>
                    <p className="text-2xl font-bold">{formations.length}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
