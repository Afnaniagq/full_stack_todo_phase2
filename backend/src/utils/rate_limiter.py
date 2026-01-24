from typing import Dict, Optional
from datetime import datetime, timedelta
import time
from fastapi import HTTPException
from collections import defaultdict


class RateLimiter:
    """
    Simple in-memory rate limiter to prevent API abuse
    """
    def __init__(self):
        self.requests: Dict[str, list] = defaultdict(list)

    def is_allowed(self, identifier: str, max_requests: int, window_seconds: int) -> bool:
        """
        Check if a request from the given identifier is allowed
        """
        now = datetime.now()
        # Clean up old requests outside the window
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if now - req_time < timedelta(seconds=window_seconds)
        ]

        # Check if we're under the limit
        if len(self.requests[identifier]) < max_requests:
            self.requests[identifier].append(now)
            return True

        return False


class PerformanceMonitor:
    """
    Performance monitoring utility for tracking API response times
    """
    def __init__(self):
        self.metrics = {}

    def start_timer(self, operation_id: str) -> float:
        """
        Start timing an operation
        """
        start_time = time.time()
        self.metrics[operation_id] = {'start_time': start_time}
        return start_time

    def stop_timer(self, operation_id: str) -> float:
        """
        Stop timing an operation and return elapsed time
        """
        if operation_id in self.metrics:
            elapsed = time.time() - self.metrics[operation_id]['start_time']
            self.metrics[operation_id]['elapsed_time'] = elapsed
            self.metrics[operation_id]['timestamp'] = datetime.now()
            return elapsed

        return 0.0

    def get_metrics(self) -> Dict:
        """
        Get all collected metrics
        """
        return self.metrics

    def get_average_response_time(self, operation_name: str) -> float:
        """
        Get average response time for a specific operation
        """
        matching_ops = [
            metric for op_id, metric in self.metrics.items()
            if operation_name in op_id and 'elapsed_time' in metric
        ]

        if not matching_ops:
            return 0.0

        total_time = sum(metric['elapsed_time'] for metric in matching_ops)
        return total_time / len(matching_ops)


# Global instances
rate_limiter = RateLimiter()
perf_monitor = PerformanceMonitor()