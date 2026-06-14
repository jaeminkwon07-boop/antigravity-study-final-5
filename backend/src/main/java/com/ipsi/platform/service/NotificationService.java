package com.ipsi.platform.service;

import com.ipsi.platform.domain.Notification;
import com.ipsi.platform.domain.User;
import com.ipsi.platform.dto.NotificationDTO;
import com.ipsi.platform.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public List<NotificationDTO> getNotifications(User user) {
        List<Notification> list = notificationRepository.findByUserIdOrderByEventTimeAsc(user.getId());
        return list.stream()
                .map(n -> NotificationDTO.builder()
                        .id(n.getId())
                        .title(n.getTitle())
                        .content(n.getContent())
                        .eventTime(n.getEventTime())
                        .isRead(n.getIsRead())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 알림입니다."));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
}
