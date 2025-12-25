package com.carrental.backend.service.analytics;

import com.carrental.backend.dto.analytics.RevenueAnalyticsDTO;

public interface AnalyticsService {
    RevenueAnalyticsDTO getOwnerAnalytics(Long ownerId, Integer year);
}
