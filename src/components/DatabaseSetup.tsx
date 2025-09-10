import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertCircle, Database, Play } from 'lucide-react';

export function DatabaseSetup() {
  const [setupStatus, setSetupStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const checkTablesExist = async () => {
    setSetupStatus('checking');
    setErrorMessage('');

    try {
      // Check if workout_sessions table exists
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('workout_sessions')
        .select('id')
        .limit(1);

      if (sessionsError && sessionsError.code !== 'PGRST116') {
        throw sessionsError;
      }

      // Check if personal_records table exists
      const { data: recordsData, error: recordsError } = await supabase
        .from('personal_records')
        .select('id')
        .limit(1);

      if (recordsError && recordsError.code !== 'PGRST116') {
        throw recordsError;
      }

      if (sessionsData && recordsData) {
        setSetupStatus('success');
      } else {
        setSetupStatus('error');
        setErrorMessage('Progress tracking tables are not set up. Please run the SQL setup script in Supabase.');
      }
    } catch (error: any) {
      setSetupStatus('error');
      setErrorMessage(error.message || 'Error checking database setup');
    }
  };

  const getStatusIcon = () => {
    switch (setupStatus) {
      case 'checking':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Database className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (setupStatus) {
      case 'checking':
        return 'Checking database setup...';
      case 'success':
        return 'Database is properly set up!';
      case 'error':
        return 'Database setup required';
      default:
        return 'Check database setup';
    }
  };

  const getStatusColor = () => {
    switch (setupStatus) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-4 border-gray-300 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Database className="w-6 h-6 mr-2 text-blue-500" />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Progress Tracking Database Setup
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>
          <Badge className={getStatusColor()}>
            {setupStatus.toUpperCase()}
          </Badge>
        </div>

        {setupStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Setup Required</h4>
            <p className="text-sm text-red-700 mb-3">
              {errorMessage}
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-800">To fix this:</p>
              <ol className="text-sm text-red-700 space-y-1 ml-4">
                <li>1. Go to your Supabase dashboard</li>
                <li>2. Navigate to SQL Editor</li>
                <li>3. Run the setup script from: <code className="bg-red-100 px-1 rounded">src/lib/api/setup-progress-tracking.sql</code></li>
                <li>4. Click "Check Setup" again</li>
              </ol>
            </div>
          </div>
        )}

        {setupStatus === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">✅ All Set!</h4>
            <p className="text-sm text-green-700">
              Your progress tracking database is properly configured. Workouts and personal records will now be saved automatically.
            </p>
          </div>
        )}

        <Button 
          onClick={checkTablesExist}
          disabled={setupStatus === 'checking'}
          className="w-full"
        >
          <Play className="w-4 h-4 mr-2" />
          Check Database Setup
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Note:</strong> This feature requires the progress tracking tables to be set up in your Supabase database.</p>
          <p>If you haven't set up the tables yet, follow the instructions above.</p>
        </div>
      </CardContent>
    </Card>
  );
}
