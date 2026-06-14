package com.ipsi.platform.repository;

import com.ipsi.platform.domain.StudentGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StudentGradeRepository extends JpaRepository<StudentGrade, Long> {
    Optional<StudentGrade> findByUserId(Long userId);
}
