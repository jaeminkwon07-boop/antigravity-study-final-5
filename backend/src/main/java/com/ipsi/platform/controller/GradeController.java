package com.ipsi.platform.controller;

import com.ipsi.platform.domain.User;
import com.ipsi.platform.dto.GradeDTO;
import com.ipsi.platform.service.GradeService;
import com.ipsi.platform.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
public class GradeController {

    private final GradeService gradeService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<GradeDTO.GradeResponse> getGrade(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        GradeDTO.GradeResponse response = gradeService.getGrade(user);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<GradeDTO.GradeResponse> saveOrUpdateGrade(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody GradeDTO.GradeRequest request) {
        User user = userService.findByUsername(userDetails.getUsername());
        GradeDTO.GradeResponse response = gradeService.saveOrUpdateGrade(user, request);
        return ResponseEntity.ok(response);
    }
}
