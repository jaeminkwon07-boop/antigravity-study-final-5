-- Database initialization script for MySQL
CREATE DATABASE IF NOT EXISTS ipsi_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ipsi_db;

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    nickname VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Student Grades table
CREATE TABLE IF NOT EXISTS student_grades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    gpa DOUBLE NOT NULL COMMENT '내신 평균 등급',
    korean_standard INT COMMENT '수능 국어 표준점수',
    math_standard INT COMMENT '수능 수학 표준점수',
    english_grade INT COMMENT '수능 영어 등급',
    inquiry1_standard INT COMMENT '수능 탐구1 표준점수',
    inquiry2_standard INT COMMENT '수능 탐구2 표준점수',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Universities table
CREATE TABLE IF NOT EXISTS universities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '대학명',
    region VARCHAR(50) NOT NULL COMMENT '지역',
    logo_url VARCHAR(255) COMMENT '로고 이미지 경로',
    website_url VARCHAR(255) COMMENT '대학 공식 홈페이지',
    description TEXT COMMENT '대학 설명'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Admission Types table
CREATE TABLE IF NOT EXISTS admission_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    university_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT '전형명',
    category VARCHAR(20) NOT NULL COMMENT '수시 / 정시',
    type VARCHAR(20) NOT NULL COMMENT '교과, 종합, 논술, 실기, 수능',
    description TEXT COMMENT '전형 세부 내용',
    FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Competition Rates table
CREATE TABLE IF NOT EXISTS competition_rates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admission_type_id BIGINT NOT NULL,
    year INT NOT NULL COMMENT '연도',
    rate DOUBLE NOT NULL COMMENT '경쟁률',
    FOREIGN KEY (admission_type_id) REFERENCES admission_types(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Admission Results table
CREATE TABLE IF NOT EXISTS admission_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admission_type_id BIGINT NOT NULL,
    year INT NOT NULL COMMENT '연도',
    cut_off_gpa DOUBLE COMMENT '수시 70% 컷 내신등급',
    cut_off_standard INT COMMENT '정시 70% 컷 수능 표준점수합',
    FOREIGN KEY (admission_type_id) REFERENCES admission_types(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    university_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_university (user_id, university_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    event_time TIMESTAMP NOT NULL COMMENT '입시 일정 시간',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
