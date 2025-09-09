import React, { useState, useEffect } from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Database,
  Target,
  Search,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BODY_PART_MAP, getAvailableSvgIds, getAvailableInternalKeys, getExerciseDBBodyPart } from '@/lib/bodypart-map';
import { getExercisesByBodyPart } from '@/lib/api/exercises.getByBodyPart';
import { ExerciseDBExercise } from '@/lib/api/exercisedb';

interface ExerciseResult {
  exercises: ExerciseDBExercise[];
  count: number;
  error?: string;
  loading: boolean;
}

const ExerciseTaxonomyDebug = () => {
  const navigate = useNavigate();
  const [selectedSvgId, setSelectedSvgId] = useState<string>('');
  const [selectedDbKey, setSelectedDbKey] = useState<string>('');
  const [exerciseResult, setExerciseResult] = useState<ExerciseResult>({
    exercises: [],
    count: 0,
    loading: false
  });
  const [mappingStatus, setMappingStatus] = useState<'valid' | 'invalid' | 'unknown'>('unknown');

  // Get available options
  const svgIds = getAvailableSvgIds();
  const internalKeys = getAvailableInternalKeys();

  // Validate mapping when selections change
  useEffect(() => {
    if (selectedSvgId && selectedDbKey) {
      const mappedKey = BODY_PART_MAP[selectedSvgId];
      if (mappedKey === selectedDbKey) {
        setMappingStatus('valid');
      } else {
        setMappingStatus('invalid');
      }
    } else {
      setMappingStatus('unknown');
    }
  }, [selectedSvgId, selectedDbKey]);

  // Fetch exercises when a valid combination is selected
  useEffect(() => {
    const fetchExercises = async () => {
      if (!selectedDbKey || mappingStatus !== 'valid') return;

      setExerciseResult(prev => ({ ...prev, loading: true, error: undefined }));

      try {
        const exercises = await getExercisesByBodyPart(selectedDbKey, 50);
        setExerciseResult({
          exercises: exercises.slice(0, 10), // Show first 10
          count: exercises.length,
          loading: false
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch exercises';
        setExerciseResult({
          exercises: [],
          count: 0,
          error: errorMessage,
          loading: false
        });
      }
    };

    fetchExercises();
  }, [selectedDbKey, mappingStatus]);

  const handleSvgIdChange = (value: string) => {
    setSelectedSvgId(value);
    // Auto-select the mapped internal key
    const mappedKey = BODY_PART_MAP[value];
    if (mappedKey) {
      setSelectedDbKey(mappedKey);
    }
  };

  const handleDbKeyChange = (value: string) => {
    setSelectedDbKey(value);
  };

  const getStatusIcon = () => {
    switch (mappingStatus) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'invalid':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (mappingStatus) {
      case 'valid':
        return 'Mapping is valid - SVG ID correctly maps to database key';
      case 'invalid':
        return 'Mapping is invalid - SVG ID does not match selected database key';
      default:
        return 'Select both SVG ID and database key to validate mapping';
    }
  };

  const getStatusColor = () => {
    switch (mappingStatus) {
      case 'valid':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'invalid':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Exercise Taxonomy Debug
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Validate the mapping between SVG body part IDs and database keys. 
            This helps ensure the BODY_PART_MAP correctly matches the database taxonomy.
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mapping Validation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Mapping Validation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* SVG ID Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  SVG Body Part ID
                </label>
                <Select value={selectedSvgId} onValueChange={handleSvgIdChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select SVG ID..." />
                  </SelectTrigger>
                  <SelectContent>
                    {svgIds.map((svgId) => (
                      <SelectItem key={svgId} value={svgId}>
                        <div className="flex items-center justify-between w-full">
                          <span>{svgId}</span>
                          <Badge variant="outline" className="ml-2">
                            {BODY_PART_MAP[svgId] || 'unmapped'}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Database Key Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Database Key
                </label>
                <Select value={selectedDbKey} onValueChange={handleDbKeyChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select database key..." />
                  </SelectTrigger>
                  <SelectContent>
                    {internalKeys.map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mapping Status */}
              <Alert className={getStatusColor()}>
                <div className="flex items-center">
                  {getStatusIcon()}
                  <AlertDescription className="ml-2">
                    {getStatusMessage()}
                  </AlertDescription>
                </div>
              </Alert>

              {/* Mapping Details */}
              {selectedSvgId && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Mapping Details:</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>SVG ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{selectedSvgId}</code></p>
                    <p><strong>Mapped Key:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{BODY_PART_MAP[selectedSvgId] || 'None'}</code></p>
                    <p><strong>Selected Key:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{selectedDbKey || 'None'}</code></p>
                    <p><strong>ExerciseDB Name:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{selectedDbKey ? getExerciseDBBodyPart(selectedDbKey) : 'None'}</code></p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Exercise Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Exercise Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {exerciseResult.loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading exercises...</span>
                </div>
              )}

              {exerciseResult.error && (
                <Alert className="bg-red-50 border-red-200 text-red-800">
                  <XCircle className="w-4 h-4" />
                  <AlertDescription className="ml-2">
                    <strong>Error:</strong> {exerciseResult.error}
                  </AlertDescription>
                </Alert>
              )}

              {!exerciseResult.loading && !exerciseResult.error && exerciseResult.count > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="bg-blue-500">
                      {exerciseResult.count} exercises found
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Showing first 10 results
                    </span>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {exerciseResult.exercises.map((exercise, index) => (
                      <div key={exercise.id} className="border rounded-lg p-3 bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {index + 1}. {exercise.name}
                            </h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span><strong>Target:</strong> {exercise.target}</span>
                              <span><strong>Equipment:</strong> {exercise.equipment}</span>
                            </div>
                            {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                              <div className="mt-1">
                                <span className="text-xs text-gray-500">
                                  <strong>Secondary:</strong> {exercise.secondaryMuscles.slice(0, 3).join(', ')}
                                  {exercise.secondaryMuscles.length > 3 && ` +${exercise.secondaryMuscles.length - 3} more`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!exerciseResult.loading && !exerciseResult.error && exerciseResult.count === 0 && mappingStatus === 'valid' && (
                <div className="text-center py-8">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-yellow-500" />
                  <p className="text-gray-600">No exercises found for this body part</p>
                  <p className="text-sm text-gray-500 mt-1">
                    The mapping is valid but no exercises exist in the database
                  </p>
                </div>
              )}

              {mappingStatus !== 'valid' && (
                <div className="text-center py-8">
                  <Info className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Select valid SVG ID and database key to see exercises</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mapping Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Complete Mapping Table
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">SVG ID</th>
                    <th className="text-left py-2 px-3">Internal Key</th>
                    <th className="text-left py-2 px-3">ExerciseDB Name</th>
                    <th className="text-left py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {svgIds.map((svgId) => {
                    const internalKey = BODY_PART_MAP[svgId];
                    const exerciseDbName = internalKey ? getExerciseDBBodyPart(internalKey) : 'N/A';
                    const isMapped = !!internalKey;
                    
                    return (
                      <tr key={svgId} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">{svgId}</code>
                        </td>
                        <td className="py-2 px-3">
                          {isMapped ? (
                            <code className="bg-green-100 px-2 py-1 rounded text-xs">{internalKey}</code>
                          ) : (
                            <span className="text-gray-400">Unmapped</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isMapped ? (
                            <code className="bg-blue-100 px-2 py-1 rounded text-xs">{exerciseDbName}</code>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isMapped ? (
                            <Badge variant="default" className="bg-green-500">Mapped</Badge>
                          ) : (
                            <Badge variant="outline">Unmapped</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExerciseTaxonomyDebug;
