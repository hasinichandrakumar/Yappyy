import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Camera, Mic } from 'lucide-react';

export default function RecordingTest() {
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const testPermissions = async () => {
    setIsTesting(true);
    setErrorMessage('');
    
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      // Check if we're on HTTPS (required for getUserMedia in most browsers)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        throw new Error('getUserMedia requires HTTPS (except on localhost)');
      }

      // Test camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Display the video stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setPermissionStatus('granted');
      
      // Clean up after 5 seconds
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }, 5000);

    } catch (error: any) {
      console.error('Recording test failed:', error);
      setPermissionStatus('denied');
      
      if (error.name === 'NotAllowedError') {
        setErrorMessage('Camera and microphone permissions were denied. Please allow access in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        setErrorMessage('No camera or microphone found on this device.');
      } else if (error.name === 'NotSupportedError') {
        setErrorMessage('This browser does not support video/audio recording.');
      } else if (error.name === 'NotReadableError') {
        setErrorMessage('Camera or microphone is already in use by another application.');
      } else {
        setErrorMessage(`Recording failed: ${error.message}`);
      }
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = () => {
    switch (permissionStatus) {
      case 'granted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'denied':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (permissionStatus) {
      case 'granted':
        return 'Permissions granted - recording should work!';
      case 'denied':
        return 'Permissions denied - recording will not work';
      default:
        return 'Click "Test Recording" to check permissions';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            <Mic className="h-5 w-5" />
            Recording Permission Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            This test will check if your browser can access your camera and microphone.
            This is required for the recording feature to work.
          </p>
          
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={testPermissions} 
            disabled={isTesting}
            className="w-full"
          >
            {isTesting ? 'Testing...' : 'Test Recording Permissions'}
          </Button>

          {permissionStatus === 'granted' && (
            <div className="mt-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg border"
                style={{ maxHeight: '300px' }}
              />
              <p className="text-sm text-gray-500 mt-2">
                If you can see your camera feed above, recording should work!
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Troubleshooting Tips:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Make sure you're using a modern browser (Chrome, Firefox, Safari, Edge)</li>
              <li>• Check that your camera and microphone are not being used by other apps</li>
              <li>• If on mobile, make sure the app has camera/microphone permissions</li>
              <li>• Try refreshing the page and testing again</li>
              <li>• Check your browser's site settings for camera/microphone permissions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}





