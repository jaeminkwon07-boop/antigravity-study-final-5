package com.ipsi.platform.repository;

import com.ipsi.platform.domain.AdmissionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdmissionTypeRepository extends JpaRepository<AdmissionType, Long> {
    List<AdmissionType> findByUniversityId(Long universityId);
    List<AdmissionType> findByType(String type);
}
