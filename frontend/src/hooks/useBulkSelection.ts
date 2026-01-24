import { useState, useCallback } from 'react';

interface UseBulkSelectionReturn {
  selectedIds: string[];
  isSelected: (id: string) => boolean;
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  deselectAll: () => void;
  toggleSelectAll: (allIds: string[]) => void;
  selectionCount: number;
}

const useBulkSelection = (): UseBulkSelectionReturn => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isSelected = useCallback((id: string) => {
    return selectedIds.includes(id);
  }, [selectedIds]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds([...ids]);
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const toggleSelectAll = useCallback((allIds: string[]) => {
    if (selectedIds.length === allIds.length) {
      deselectAll();
    } else {
      selectAll(allIds);
    }
  }, [selectedIds.length, selectAll, deselectAll]);

  return {
    selectedIds,
    isSelected,
    toggleSelection,
    selectAll,
    deselectAll,
    toggleSelectAll,
    selectionCount: selectedIds.length
  };
};

export default useBulkSelection;