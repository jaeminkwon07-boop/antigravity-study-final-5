package com.ipsi.platform.repository;

import com.ipsi.platform.domain.CompetitionRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CompetitionRateRepository extends JpaRepository<CompetitionRate, Long> {
    List<CompetitionRate> findByAdmissionTypeId(Long admissionTypeId);
}
