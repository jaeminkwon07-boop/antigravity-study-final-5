package com.ipsi.platform.service;

import com.ipsi.platform.domain.*;
import com.ipsi.platform.dto.RecommendDTO;
import com.ipsi.platform.repository.AdmissionResultRepository;
import com.ipsi.platform.repository.AdmissionTypeRepository;
import com.ipsi.platform.repository.StudentGradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final StudentGradeRepository studentGradeRepository;
    private final AdmissionTypeRepository admissionTypeRepository;
    private final AdmissionResultRepository admissionResultRepository;

    @Transactional(readOnly = true)
    public List<RecommendDTO> recommendUniversities(User user) {
        List<RecommendDTO> recommendations = new ArrayList<>();

        StudentGrade grade = studentGradeRepository.findByUserId(user.getId())
                .orElse(null);

        if (grade == null) {
            return recommendations; // 성적이 없으면 추천 불가
        }

        // 전체 전형 리스트를 순회하며 조건 비교
        List<AdmissionType> admissionTypes = admissionTypeRepository.findAll();

        for (AdmissionType type : admissionTypes) {
            List<AdmissionResult> results = admissionResultRepository.findByAdmissionTypeId(type.getId());
            if (results.isEmpty()) continue;

            // 가장 최근 연도의 입시 결과를 기준
            AdmissionResult targetResult = results.stream()
                    .max((r1, r2) -> r1.getYear().compareTo(r2.getYear()))
                    .orElse(null);

            if (targetResult == null) continue;

            RecommendDTO.RecommendDTOBuilder builder = RecommendDTO.builder()
                    .universityId(type.getUniversity().getId())
                    .universityName(type.getUniversity().getName())
                    .region(type.getUniversity().getRegion())
                    .logoUrl(type.getUniversity().getLogoUrl())
                    .admissionTypeName(type.getName())
                    .category(type.getCategory())
                    .type(type.getType())
                    .description(type.getDescription());

            // 1. 수시(교과/종합) - 내신 성적 기반 비교
            if (type.getCategory().equals("수시") && targetResult.getCutOffGpa() != null) {
                double cutOff = targetResult.getCutOffGpa();
                double myGpa = grade.getGpa();
                builder.cutOffGpa(cutOff);

                // GPA는 낮을수록 우수함 (1.0등급이 최상위)
                if (myGpa <= cutOff - 0.2) {
                    builder.matchScore("안정");
                } else if (myGpa <= cutOff + 0.1) {
                    builder.matchScore("적정");
                } else if (myGpa <= cutOff + 0.3) {
                    builder.matchScore("소신");
                } else {
                    builder.matchScore("상향");
                }
                recommendations.add(builder.build());
            }
            // 2. 정시 - 수능 표준점수 기반 비교
            else if (type.getCategory().equals("정시") && targetResult.getCutOffStandard() != null) {
                int cutOff = targetResult.getCutOffStandard();
                builder.cutOffStandard(cutOff);

                // 수능 국+수+탐1+탐구2 표준점수 합산 계산
                int myScore = 0;
                if (grade.getKoreanStandard() != null) myScore += grade.getKoreanStandard();
                if (grade.getMathStandard() != null) myScore += grade.getMathStandard();
                if (grade.getInquiry1Standard() != null) myScore += grade.getInquiry1Standard();
                if (grade.getInquiry2Standard() != null) myScore += grade.getInquiry2Standard();

                if (myScore == 0) continue; // 수능 점수가 미입력된 경우 제외

                if (myScore >= cutOff + 10) {
                    builder.matchScore("안정");
                } else if (myScore >= cutOff - 5) {
                    builder.matchScore("적정");
                } else if (myScore >= cutOff - 15) {
                    builder.matchScore("소신");
                } else {
                    builder.matchScore("상향");
                }
                recommendations.add(builder.build());
            }
        }

        // matchScore 순 정렬 (안정 -> 적정 -> 소신 -> 상향 순서로 출력하기 위해 정렬)
        recommendations.sort((r1, r2) -> {
            int score1 = getMatchOrder(r1.getMatchScore());
            int score2 = getMatchOrder(r2.getMatchScore());
            return Integer.compare(score1, score2);
        });

        return recommendations;
    }

    private int getMatchOrder(String score) {
        switch (score) {
            case "안정": return 1;
            case "적정": return 2;
            case "소신": return 3;
            case "상향": return 4;
            default: return 5;
        }
    }
}
