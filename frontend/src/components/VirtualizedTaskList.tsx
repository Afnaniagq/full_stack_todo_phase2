import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import TaskCard from './TaskCard';
import { Task } from '@/types/task';
import useBulkSelection from '@/hooks/useBulkSelection';

interface VirtualizedTaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: string, isCompleted: boolean) => void;
  onTaskDelete: (taskId: string) => void;
  selectedTaskIds: string[];
  onSelectionChange: (id: string) => void;
}

const VirtualizedTaskList: React.FC<VirtualizedTaskListProps> = ({
  tasks,
  onTaskToggle,
  onTaskDelete,
  selectedTaskIds,
  onSelectionChange
}) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const task = tasks[index];

    return (
      <div style={style}>
        <TaskCard
          task={task}
          onUpdate={(updatedTask) => onTaskToggle(updatedTask.id, updatedTask.is_completed)}
          onDelete={onTaskDelete}
          isSelected={selectedTaskIds.includes(task.id)}
          onSelectionChange={onSelectionChange}
        />
      </div>
    );
  };

  return (
    <div className="virtualized-task-list" style={{ height: '100%', width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={tasks.length}
            itemSize={80} // Adjust based on your TaskItem height
            width={width}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default VirtualizedTaskList;