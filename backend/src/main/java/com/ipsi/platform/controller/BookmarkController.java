package com.ipsi.platform.controller;

import com.ipsi.platform.domain.User;
import com.ipsi.platform.dto.BookmarkDTO;
import com.ipsi.platform.service.BookmarkService;
import com.ipsi.platform.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<BookmarkDTO.BookmarkResponse>> getBookmarks(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        return ResponseEntity.ok(bookmarkService.getBookmarks(user));
    }

    @PostMapping("/toggle/{universityId}")
    public ResponseEntity<String> toggleBookmark(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("universityId") Long universityId) {
        try {
            User user = userService.findByUsername(userDetails.getUsername());
            bookmarkService.toggleBookmark(user, universityId);
            return ResponseEntity.ok("북마크 상태가 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/check/{universityId}")
    public ResponseEntity<Boolean> checkBookmark(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("universityId") Long universityId) {
        User user = userService.findByUsername(userDetails.getUsername());
        return ResponseEntity.ok(bookmarkService.isBookmarked(user, universityId));
    }
}
