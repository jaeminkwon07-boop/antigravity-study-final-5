package com.ipsi.platform.dto;

import lombok.*;

public class GradeDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GradeRequest {
        private Double gpa;
        private Integer koreanStandard;
        private Integer mathStandard;
        private Integer englishGrade;
        private Integer inquiry1Standard;
        private Integer inquiry2Standard;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GradeResponse {
        private Long id;
        private Double gpa;
        private Integer koreanStandard;
        private Integer mathStandard;
        private Integer englishGrade;
        private Integer inquiry1Standard;
        private Integer inquiry2Standard;
    }
}
