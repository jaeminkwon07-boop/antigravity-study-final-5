package com.ipsi.platform.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime eventTime;
    private Boolean isRead;
}
