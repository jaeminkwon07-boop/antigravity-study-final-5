package com.ipsi.platform.service;

import com.ipsi.platform.domain.StudentGrade;
import com.ipsi.platform.domain.User;
import com.ipsi.platform.dto.GradeDTO;
import com.ipsi.platform.repository.StudentGradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GradeService {

    private final StudentGradeRepository studentGradeRepository;

    @Transactional(readOnly = true)
    public GradeDTO.GradeResponse getGrade(User user) {
        return studentGradeRepository.findByUserId(user.getId())
                .map(this::convertToResponse)
                .orElse(null); // 아직 등록하지 않은 경우 null 반환
    }

    @Transactional
    public GradeDTO.GradeResponse saveOrUpdateGrade(User user, GradeDTO.GradeRequest request) {
        StudentGrade grade = studentGradeRepository.findByUserId(user.getId())
                .orElseGet(() -> StudentGrade.builder().user(user).build());

        grade.setGpa(request.getGpa());
        grade.setKoreanStandard(request.getKoreanStandard());
        grade.setMathStandard(request.getMathStandard());
        grade.setEnglishGrade(request.getEnglishGrade());
        grade.setInquiry1Standard(request.getInquiry1Standard());
        grade.setInquiry2Standard(request.getInquiry2Standard());

        StudentGrade saved = studentGradeRepository.save(grade);
        return convertToResponse(saved);
    }

    private GradeDTO.GradeResponse convertToResponse(StudentGrade grade) {
        return GradeDTO.GradeResponse.builder()
                .id(grade.getId())
                .gpa(grade.getGpa())
                .koreanStandard(grade.getKoreanStandard())
                .mathStandard(grade.getMathStandard())
                .englishGrade(grade.getEnglishGrade())
                .inquiry1Standard(grade.getInquiry1Standard())
                .inquiry2Standard(grade.getInquiry2Standard())
                .build();
    }
}
