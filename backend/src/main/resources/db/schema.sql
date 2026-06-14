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
);

-- 2. Student Grades table
CREATE TABLE IF NOT EXISTS student_grades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    gpa DOUBLE NOT NULL,
    korean_standard INT,
    math_standard INT,
    english_grade INT,
    inquiry1_standard INT,
    inquiry2_standard INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Universities table
CREATE TABLE IF NOT EXISTS universities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    region VARCHAR(50) NOT NULL,
    logo_url VARCHAR(255),
    website_url VARCHAR(255),
    description TEXT
);

-- 4. Admission Types table
CREATE TABLE IF NOT EXISTS admission_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    university_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL,
    description TEXT,
    FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
);

-- 5. Competition Rates table
CREATE TABLE IF NOT EXISTS competition_rates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admission_type_id BIGINT NOT NULL,
    year INT NOT NULL,
    rate DOUBLE NOT NULL,
    FOREIGN KEY (admission_type_id) REFERENCES admission_types(id) ON DELETE CASCADE
);

-- 6. Admission Results table
CREATE TABLE IF NOT EXISTS admission_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admission_type_id BIGINT NOT NULL,
    year INT NOT NULL,
    cut_off_gpa DOUBLE,
    cut_off_standard INT,
    FOREIGN KEY (admission_type_id) REFERENCES admission_types(id) ON DELETE CASCADE
);

-- 7. Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    university_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_university (user_id, university_id)
);

-- 8. Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    event_time TIMESTAMP NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
