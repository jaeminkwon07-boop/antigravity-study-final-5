package com.ipsi.platform.dto;

import lombok.*;

public class BookmarkDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookmarkRequest {
        private Long universityId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookmarkResponse {
        private Long id;
        private Long universityId;
        private String universityName;
        private String region;
        private String logoUrl;
    }
}
