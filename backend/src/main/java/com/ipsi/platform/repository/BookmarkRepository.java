package com.ipsi.platform.repository;

import com.ipsi.platform.domain.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserId(Long userId);
    Optional<Bookmark> findByUserIdAndUniversityId(Long userId, Long universityId);
    boolean existsByUserIdAndUniversityId(Long userId, Long universityId);
}
