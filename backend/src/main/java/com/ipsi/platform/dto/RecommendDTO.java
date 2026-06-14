package com.ipsi.platform.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendDTO {
    private Long universityId;
    private String universityName;
    private String region;
    private String logoUrl;
    private String admissionTypeName;
    private String category; // 수시, 정시
    private String type; // 교과, 종합, 수능 등
    private Double cutOffGpa;
    private Integer cutOffStandard;
    private String matchScore; // "안정", "적정", "소신", "상향" 등 매칭 상태
    private String description;
}
