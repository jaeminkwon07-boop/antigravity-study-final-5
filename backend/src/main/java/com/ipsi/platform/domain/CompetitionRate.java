package com.ipsi.platform.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "competition_rates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetitionRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_type_id", nullable = false)
    private AdmissionType admissionType;

    @Column(nullable = false)
    private Integer year; // 연도

    @Column(nullable = false)
    private Double rate; // 경쟁률
}
