INSERT INTO users (id, name, email, password, role, created_at, updated_at)
VALUES (
           'f648b5f1-91e2-4818-b99e-81d431ae1263',
           'admin',
           'admin@admin.com',
           '$2a$10$k9fJ...Q8YxkZ',
           1,
           NOW(),
           NOW()
       );

INSERT INTO users (id, name, email, password, role, created_at, updated_at)
VALUES (
           '830f5b41-915c-4839-acf0-e5964ab92e0f',
           'spuffy',
           'user@user.com',
           '$2a$10$ZP3B...R91Lm',
           0,
           NOW(),
           NOW()
       );
