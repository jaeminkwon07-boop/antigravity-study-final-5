package com.ipsi.platform.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admission_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmissionType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", nullable = false)
    private University university;

    @Column(nullable = false, length = 100)
    private String name; // 전형명

    @Column(nullable = false, length = 20)
    private String category; // 수시, 정시

    @Column(nullable = false, length = 20)
    private String type; // 교과, 종합, 논술, 실기, 수능

    @Column(columnDefinition = "TEXT")
    private String description; // 설명
}
