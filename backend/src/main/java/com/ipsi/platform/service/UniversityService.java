package com.ipsi.platform.service;

import com.ipsi.platform.domain.AdmissionResult;
import com.ipsi.platform.domain.AdmissionType;
import com.ipsi.platform.domain.CompetitionRate;
import com.ipsi.platform.domain.University;
import com.ipsi.platform.dto.UniversityDTO;
import com.ipsi.platform.repository.AdmissionResultRepository;
import com.ipsi.platform.repository.AdmissionTypeRepository;
import com.ipsi.platform.repository.CompetitionRateRepository;
import com.ipsi.platform.repository.UniversityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UniversityService {

    private final UniversityRepository universityRepository;
    private final AdmissionTypeRepository admissionTypeRepository;
    private final CompetitionRateRepository competitionRateRepository;
    private final AdmissionResultRepository admissionResultRepository;

    @Transactional(readOnly = true)
    public List<UniversityDTO.UniversityListResponse> searchUniversities(String query) {
        List<University> list;
        if (query == null || query.trim().isEmpty()) {
            list = universityRepository.findAll();
        } else {
            list = universityRepository.findByNameContaining(query);
        }

        return list.stream()
                .map(u -> UniversityDTO.UniversityListResponse.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .region(u.getRegion())
                        .logoUrl(u.getLogoUrl())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UniversityDTO.UniversityDetailResponse getUniversityDetail(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 대학입니다."));

        List<AdmissionType> admissionTypes = admissionTypeRepository.findByUniversityId(id);

        List<UniversityDTO.AdmissionTypeResponse> typeDTOs = admissionTypes.stream()
                .map(t -> {
                    List<CompetitionRate> rates = competitionRateRepository.findByAdmissionTypeId(t.getId());
                    List<AdmissionResult> results = admissionResultRepository.findByAdmissionTypeId(t.getId());

                    List<UniversityDTO.CompetitionRateResponse> rateDTOs = rates.stream()
                            .map(r -> UniversityDTO.CompetitionRateResponse.builder()
                                    .year(r.getYear())
                                    .rate(r.getRate())
                                    .build())
                            .collect(Collectors.toList());

                    List<UniversityDTO.AdmissionResultResponse> resultDTOs = results.stream()
                            .map(res -> UniversityDTO.AdmissionResultResponse.builder()
                                    .year(res.getYear())
                                    .cutOffGpa(res.getCutOffGpa())
                                    .cutOffStandard(res.getCutOffStandard())
                                    .build())
                            .collect(Collectors.toList());

                    return UniversityDTO.AdmissionTypeResponse.builder()
                            .id(t.getId())
                            .name(t.getName())
                            .category(t.getCategory())
                            .type(t.getType())
                            .description(t.getDescription())
                            .competitionRates(rateDTOs)
                            .admissionResults(resultDTOs)
                            .build();
                })
                .collect(Collectors.toList());

        return UniversityDTO.UniversityDetailResponse.builder()
                .id(university.getId())
                .name(university.getName())
                .region(university.getRegion())
                .logoUrl(university.getLogoUrl())
                .websiteUrl(university.getWebsiteUrl())
                .description(university.getDescription())
                .admissionTypes(typeDTOs)
                .build();
    }
}
