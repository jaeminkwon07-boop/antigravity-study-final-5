package com.ipsi.platform.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admission_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmissionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_type_id", nullable = false)
    private AdmissionType admissionType;

    @Column(nullable = false)
    private Integer year; // 연도

    @Column(name = "cut_off_gpa")
    private Double cutOffGpa; // 수시 내신 70% 컷

    @Column(name = "cut_off_standard")
    private Integer cutOffStandard; // 정시 수능 표준점수합 70% 컷
}
