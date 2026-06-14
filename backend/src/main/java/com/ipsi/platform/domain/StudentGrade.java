package com.ipsi.platform.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_grades")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentGrade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private Double gpa; // 내신 평균 등급

    @Column(name = "korean_standard")
    private Integer koreanStandard; // 국어 표준점수

    @Column(name = "math_standard")
    private Integer mathStandard; // 수학 표준점수

    @Column(name = "english_grade")
    private Integer englishGrade; // 영어 등급

    @Column(name = "inquiry1_standard")
    private Integer inquiry1Standard; // 탐구1 표준점수

    @Column(name = "inquiry2_standard")
    private Integer inquiry2Standard; // 탐구2 표준점수

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
