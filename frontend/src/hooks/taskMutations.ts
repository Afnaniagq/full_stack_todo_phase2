import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/services/task_api';
import { Task } from '@/types/task';

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Partial<Task>; }) =>
      taskApi.updateTask(taskId, data),
    onMutate: async ({ taskId, data }) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks']);

      // Optimistically update the cache
      queryClient.setQueryData(['tasks'], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          tasks: old.tasks.map((task: Task) =>
            task.id === taskId ? { ...task, ...data } : task
          ),
        };
      });

      return { previousTasks };
    },
    onError: (err, { taskId }, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const toggleTaskCompletionMutation = useMutation({
    mutationFn: ({ taskId, isCompleted }: { taskId: string; isCompleted: boolean; }) =>
      taskApi.toggleTaskCompletion(taskId),
    onMutate: async ({ taskId, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          tasks: old.tasks.map((task: Task) =>
            task.id === taskId ? { ...task, is_completed: isCompleted } : task
          ),
        };
      });

      return { previousTasks };
    },
    onError: (err, { taskId }, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => taskApi.deleteTask(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          tasks: old.tasks.filter((task: Task) => task.id !== taskId),
        };
      });

      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: ({ taskIds, updateType, params }: {
      taskIds: string[];
      updateType: 'status' | 'category' | 'priority';
      params: any;
    }) => taskApi.bulkUpdateTasks(taskIds, updateType, params),
    onMutate: async ({ taskIds, updateType, params }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: any) => {
        if (!old) return old;

        const updateField = updateType === 'status' ? 'is_completed' :
                          updateType === 'category' ? 'category' : 'priority';

        return {
          ...old,
          tasks: old.tasks.map((task: Task) =>
            taskIds.includes(task.id) ? { ...task, [updateField]: params[updateType] } : task
          ),
        };
      });

      return { previousTasks };
    },
    onError: (err, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (taskIds: string[]) => taskApi.bulkDeleteTasks(taskIds),
    onMutate: async (taskIds) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          tasks: old.tasks.filter((task: Task) => !taskIds.includes(task.id)),
        };
      });

      return { previousTasks };
    },
    onError: (err, taskIds, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    updateTaskMutation,
    toggleTaskCompletionMutation,
    deleteTaskMutation,
    bulkUpdateMutation,
    bulkDeleteMutation,
  };
};