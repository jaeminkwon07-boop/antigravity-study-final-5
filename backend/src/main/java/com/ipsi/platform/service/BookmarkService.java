package com.ipsi.platform.service;

import com.ipsi.platform.domain.Bookmark;
import com.ipsi.platform.domain.University;
import com.ipsi.platform.domain.User;
import com.ipsi.platform.dto.BookmarkDTO;
import com.ipsi.platform.repository.BookmarkRepository;
import com.ipsi.platform.repository.UniversityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UniversityRepository universityRepository;

    @Transactional
    public void toggleBookmark(User user, Long universityId) {
        Optional<Bookmark> bookmarkOpt = bookmarkRepository.findByUserIdAndUniversityId(user.getId(), universityId);

        if (bookmarkOpt.isPresent()) {
            bookmarkRepository.delete(bookmarkOpt.get());
        } else {
            University university = universityRepository.findById(universityId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 대학입니다."));
            Bookmark bookmark = Bookmark.builder()
                    .user(user)
                    .university(university)
                    .build();
            bookmarkRepository.save(bookmark);
        }
    }

    @Transactional(readOnly = true)
    public List<BookmarkDTO.BookmarkResponse> getBookmarks(User user) {
        List<Bookmark> bookmarks = bookmarkRepository.findByUserId(user.getId());
        return bookmarks.stream()
                .map(b -> BookmarkDTO.BookmarkResponse.builder()
                        .id(b.getId())
                        .universityId(b.getUniversity().getId())
                        .universityName(b.getUniversity().getName())
                        .region(b.getUniversity().getRegion())
                        .logoUrl(b.getUniversity().getLogoUrl())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isBookmarked(User user, Long universityId) {
        return bookmarkRepository.existsByUserIdAndUniversityId(user.getId(), universityId);
    }
}
