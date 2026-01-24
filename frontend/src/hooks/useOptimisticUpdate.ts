import { useState, useCallback } from 'react';

interface OptimisticUpdateOptions<T> {
  updateFn: (item: T, updates: Partial<T>) => Promise<T>;
  rollbackFn?: (originalItem: T) => void;
}

const useOptimisticUpdate = <T extends { id: string }>() => {
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, Partial<T>>>({});

  const startOptimisticUpdate = useCallback((
    item: T,
    updates: Partial<T>,
    options: OptimisticUpdateOptions<T>
  ) => {
    // Apply optimistic update locally
    setOptimisticUpdates(prev => ({
      ...prev,
      [item.id]: { ...prev[item.id], ...updates }
    }));

    // Perform the actual update
    return options.updateFn(item, updates)
      .then(result => {
        // Remove from optimistic updates on success
        setOptimisticUpdates(prev => {
          const newUpdates = { ...prev };
          delete newUpdates[item.id];
          return newUpdates;
        });
        return result;
      })
      .catch(error => {
        // Rollback on error
        setOptimisticUpdates(prev => {
          const newUpdates = { ...prev };
          delete newUpdates[item.id];
          return newUpdates;
        });

        if (options.rollbackFn) {
          options.rollbackFn(item);
        }

        throw error;
      });
  }, []);

  const getOptimisticValue = useCallback((item: T): T => {
    const updates = optimisticUpdates[item.id];
    if (!updates) {
      return item;
    }

    return { ...item, ...updates } as T;
  }, [optimisticUpdates]);

  return {
    startOptimisticUpdate,
    getOptimisticValue,
    hasOptimisticUpdate: (id: string) => !!optimisticUpdates[id],
    clearOptimisticUpdate: (id: string) => {
      setOptimisticUpdates(prev => {
        const newUpdates = { ...prev };
        delete newUpdates[id];
        return newUpdates;
      });
    }
  };
};

export default useOptimisticUpdate;