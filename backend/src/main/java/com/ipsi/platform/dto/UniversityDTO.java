package com.ipsi.platform.dto;

import lombok.*;
import java.util.List;

public class UniversityDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UniversityListResponse {
        private Long id;
        private String name;
        private String region;
        private String logoUrl;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UniversityDetailResponse {
        private Long id;
        private String name;
        private String region;
        private String logoUrl;
        private String websiteUrl;
        private String description;
        private List<AdmissionTypeResponse> admissionTypes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdmissionTypeResponse {
        private Long id;
        private String name;
        private String category;
        private String type;
        private String description;
        private List<CompetitionRateResponse> competitionRates;
        private List<AdmissionResultResponse> admissionResults;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CompetitionRateResponse {
        private Integer year;
        private Double rate;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdmissionResultResponse {
        private Integer year;
        private Double cutOffGpa;
        private Integer cutOffStandard;
    }
}
