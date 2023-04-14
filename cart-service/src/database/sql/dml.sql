INSERT INTO "users"("name", "password")
VALUES ('apyrkh', '$2b$10$8XzUPb/16c6G3ZEmL8mqiugvtmjX4dxgiNYJcis6/eMpEvChGtoYK');

INSERT INTO "products"("id","title", "description", "price")
VALUES ('590e9eae-6381-41c7-b7d7-df065616f22c',
        'CloudX: AWS Practitioner for JS',
        'The training program gives hands-on full-stack experience with the main focus on  AWS Cloud from an e2e application perspective.',
        29),
       ('fe7f7e82-aec1-425d-a91c-3c6dc68f6a3b',
        'CloudX Associate: AWS DevOps',
        'The program is designed to prepare engineers who have hands-on experience on driving available, cost-efficient, fault-tolerant, and scalable distributed systems on Cloud.',
        49),
       ('47b66772-6a87-4a99-8d14-75bc37b5a069',
        'CloudX Associate: MS Azure DevOps',
        'The program is designed to prepare engineers who have hands-on experience on driving available, cost-efficient, fault-tolerant, and scalable distributed systems on Cloud.',
        49),
       ('d8426654-ead6-49bf-ba42-f96fba4ccb64',
        'CloudX Associate: GCP DevOps',
        'The program is designed to prepare engineers who have hands-on experience on driving available, cost-efficient, fault-tolerant, and scalable distributed systems on Cloud.',
        49),
       ('813203c8-bfde-42f9-b49f-8593f0acfad9',
        'CloudX Professional: AWS',
        'The program is designed to prepare architects who have hands-on experience on proposing, designing, maintaining, managing, and provisioning systems in cloud environments.',
        99),
       ('31e36550-4ae6-437d-b4d4-37b3180ae83d',
        'CloudX Professional: MS Azure',
        'The program is designed to prepare architects who have hands-on experience on proposing, designing, maintaining, managing, and provisioning systems in cloud environments.',
        99),
       ('6e516505-a070-4da1-917a-d9ba499ad2a5',
        'CloudX Professional: GCP',
        'The program is designed to prepare architects who have hands-on experience on proposing, designing, maintaining, managing, and provisioning systems in cloud environments.',
        99);

INSERT INTO "carts"("user_id", "status")
SELECT (SELECT id
        FROM "users"
        WHERE name = 'apyrkh'),
       'OPEN'
;

INSERT INTO "cart_items"("cart_id", "product_id", "count")
SELECT (SELECT id FROM carts WHERE status = 'OPEN' LIMIT 1),
       (SELECT id FROM products where title = 'CloudX: AWS Practitioner for JS'),
       1;
