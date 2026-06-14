package com.ipsi.platform.controller;

import com.ipsi.platform.dto.UniversityDTO;
import com.ipsi.platform.service.UniversityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/universities")
@RequiredArgsConstructor
public class UniversityController {

    private final UniversityService universityService;

    @GetMapping
    public ResponseEntity<List<UniversityDTO.UniversityListResponse>> searchUniversities(
            @RequestParam(value = "query", required = false) String query) {
        return ResponseEntity.ok(universityService.searchUniversities(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UniversityDTO.UniversityDetailResponse> getUniversityDetail(
            @PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(universityService.getUniversityDetail(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
