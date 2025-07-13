import { useState, useEffect } from 'react';
import { authApi } from '@/lib/api';

type ResourceType = 'patient' | 'doctor' | 'any';

export const useResourceOwner = (
  resourceUserId?: number, 
  resourceType: ResourceType = 'any'
) => {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyOwnership = async () => {
      try {
        setLoading(true);
        const userRes = await authApi.getUser();
        
        // Handle different resource types if needed
        if (resourceType === 'doctor') {
          // Additional doctor-specific checks if any
        } else if (resourceType === 'patient') {
          // Additional patient-specific checks if any
        }
        
        setIsOwner(resourceUserId ? userRes.id === resourceUserId : true);
      } catch (err: any) {
        setError(err.message);
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };

    verifyOwnership();
  }, [resourceUserId, resourceType]);

  return { isOwner, loading, error };
};