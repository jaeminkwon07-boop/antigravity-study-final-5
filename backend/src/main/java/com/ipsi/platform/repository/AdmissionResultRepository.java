package com.ipsi.platform.repository;

import com.ipsi.platform.domain.AdmissionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdmissionResultRepository extends JpaRepository<AdmissionResult, Long> {
    List<AdmissionResult> findByAdmissionTypeId(Long admissionTypeId);
}
