-- 1. Insert dummy users (password: 'password123' hashed using BCrypt)
-- Note: IGNORE or INSERT if not exists. Since this SQL executes on empty DB, simple INSERT is fine.
INSERT INTO users (username, password, email, nickname, role) VALUES
('student1', '$2a$10$dMsw2aFq/K/2r1B7K1x7k.wJ0B.f8v5f3uXzQ/8R07B/q2q3j9WqS', 'student1@test.com', '수험생1', 'ROLE_USER'),
('student2', '$2a$10$dMsw2aFq/K/2r1B7K1x7k.wJ0B.f8v5f3uXzQ/8R07B/q2q3j9WqS', 'student2@test.com', '의대지망생', 'ROLE_USER'),
('admin1', '$2a$10$dMsw2aFq/K/2r1B7K1x7k.wJ0B.f8v5f3uXzQ/8R07B/q2q3j9WqS', 'admin@ipsi.com', '관리자', 'ROLE_ADMIN');

-- 2. Insert dummy student grades
INSERT INTO student_grades (user_id, gpa, korean_standard, math_standard, english_grade, inquiry1_standard, inquiry2_standard) VALUES
(1, 1.8, 125, 130, 2, 60, 62),
(2, 1.1, 138, 145, 1, 70, 68);

-- 3. Insert Universities
INSERT INTO universities (name, region, logo_url, website_url, description) VALUES
('서울대학교', '서울', 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Seoul_National_University_seal.svg', 'https://www.snu.ac.kr', '대한민국 최고의 국립대학교로 학문적 수월성과 글로벌 리더십을 지향합니다.'),
('연세대학교', '서울', 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Yonsei_University_seal.svg', 'https://www.yonsei.ac.kr', '진리와 자유의 정신에 따라 세계적인 교육 및 연구 기관으로 발돋움하고 있습니다.'),
('고려대학교', '서울', 'https://upload.wikimedia.org/wikipedia/commons/1/14/Korea_University_Shield.svg', 'https://www.korea.ac.kr', '자유, 정의, 진리의 이념 아래 창조적 인재 양성과 학문 발전에 기여합니다.'),
('서강대학교', '서울', 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Sogang_University_seal.svg', 'https://www.sogang.ac.kr', '예수회 교육이념에 기초하여 지성과 인성을 겸비한 전인교육을 실시합니다.'),
('성균관대학교', '서울', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Sungkyunkwan_University_seal.svg', 'https://www.skku.edu', '600년 역사의 명문 사학으로, 산학협력과 혁신적 교육을 선도합니다.');

-- 4. Insert Admission Types
-- 서울대 (id: 1, 2, 3)
INSERT INTO admission_types (university_id, name, category, type, description) VALUES
(1, '지역균형전형 (학생부종합)', '수시', '종합', '고등학교별 2명 이내 추천 필요. 서류 70% + 면접 30% 반영.'),
(1, '일반전형 (학생부종합)', '수시', '종합', '1단계 서류 100%(2배수), 2단계 1단계 50% + 면접 50% 반영.'),
(1, '일반전형 (수능위주)', '정시', '수능', '수능 100% 반영(교과평가 일부 반영).');

-- 연세대 (id: 4, 5, 6)
INSERT INTO admission_types (university_id, name, category, type, description) VALUES
(2, '추천형 (학생부교과)', '수시', '교과', '고교별 추천 인원 제한. 학생부 교과 100% 반영.'),
(2, '활동우수형 (학생부종합)', '수시', '종합', '서류 100% 후 면접 반영. 수능 최저학력기준 적용.'),
(2, '논술전형', '수시', '논술', '논술 100% 반영. 수능 최저학력기준 없음.');

-- 고려대 (id: 7, 8, 9)
INSERT INTO admission_types (university_id, name, category, type, description) VALUES
(3, '학교추천 (학생부교과)', '수시', '교과', '학생부 교과 80% + 서류 20% 반영. 수능 최저기준 있음.'),
(3, '학업우수전형 (학생부종합)', '수시', '종합', '서류 100% 후 면접 반영. 수능 최저기준 높은 편.'),
(3, '일반전형 (수능위주)', '정시', '수능', '수능 100% 반영.');

-- 5. Insert Competition Rates (2024, 2025)
-- 서울대
INSERT INTO competition_rates (admission_type_id, year, rate) VALUES
(1, 2024, 5.25),
(1, 2025, 4.90),
(2, 2024, 8.31),
(2, 2025, 8.56),
(3, 2024, 4.35),
(3, 2025, 4.10);

-- 연세대
INSERT INTO competition_rates (admission_type_id, year, rate) VALUES
(4, 2024, 6.12),
(4, 2025, 5.85),
(5, 2024, 11.60),
(5, 2025, 12.10),
(6, 2024, 42.15),
(6, 2025, 50.38);

-- 고려대
INSERT INTO competition_rates (admission_type_id, year, rate) VALUES
(7, 2024, 10.32),
(7, 2025, 9.80),
(8, 2024, 15.05),
(8, 2025, 16.20),
(9, 2024, 3.85),
(9, 2025, 4.21);

-- 6. Insert Admission Results (2024, 2025 Cut-offs)
-- 서울대 지역균형 (종합): 내신 컷 1.15 / 1.20
INSERT INTO admission_results (admission_type_id, year, cut_off_gpa, cut_off_standard) VALUES
(1, 2024, 1.15, NULL),
(1, 2025, 1.20, NULL),
-- 서울대 일반 (종합): 내신 컷 1.45 / 1.48
(2, 2024, 1.45, NULL),
(2, 2025, 1.48, NULL),
-- 서울대 정시: 수능 표점합 컷 405 / 412
(3, 2024, NULL, 405),
(3, 2025, NULL, 412),
-- 연세대 추천형 (교과): 내신 컷 1.30 / 1.35
(4, 2024, 1.30, NULL),
(4, 2025, 1.35, NULL),
-- 연세대 활동우수 (종합): 내신 컷 1.70 / 1.75
(5, 2024, 1.70, NULL),
(5, 2025, 1.75, NULL),
-- 고려대 학교추천 (교과): 내신 컷 1.40 / 1.45
(7, 2024, 1.40, NULL),
(7, 2025, 1.45, NULL);

-- 7. Bookmarks
INSERT INTO bookmarks (user_id, university_id) VALUES
(1, 1),
(1, 2),
(2, 1);

-- 8. Notifications
INSERT INTO notifications (user_id, title, content, event_time, is_read) VALUES
(1, '서울대학교 수시 원서접수 마감', '서울대학교 수시 모집 원서접수가 오늘 오후 6시에 마감됩니다. 서류를 최종 점검하세요.', '2026-09-12 18:00:00', FALSE),
(1, '연세대학교 논술고사 안내', '연세대학교 논술고사가 10월 3일 신촌캠퍼스에서 진행됩니다. 수험표와 신분증을 지참하세요.', '2026-10-03 09:00:00', FALSE),
(2, '수능 성적 발표일', '2027학년도 대학수학능력시험 성적이 오늘 발표됩니다. 한국교육과정평가원 홈페이지를 확인하세요.', '2026-12-08 09:00:00', FALSE);
