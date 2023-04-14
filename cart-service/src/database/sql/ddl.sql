DROP TABLE IF EXISTS "carts" CASCADE;
DROP TABLE IF EXISTS "cart_items" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TYPE IF EXISTS "status_enum" CASCADE;
DROP TYPE IF EXISTS "orders_status_enum" CASCADE;
DROP TYPE IF EXISTS "carts_status_enum" CASCADE;


CREATE TABLE "products"
(
    "id"          uuid    NOT NULL DEFAULT uuid_generate_v4(),
    "title"       text    NOT NULL,
    "description" text    NOT NULL,
    "price"       integer NOT NULL,
    CONSTRAINT "products_id_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "cart_items"
(
    "count"      integer NOT NULL,
    "cart_id"    uuid    NOT NULL,
    "product_id" uuid    NOT NULL,
    CONSTRAINT "cart_items_cart_id_product_id_pkey" PRIMARY KEY ("cart_id", "product_id")
);

CREATE TABLE "users"
(
    "id"       uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name"     text NOT NULL,
    "password" text NOT NULL,
    CONSTRAINT "users_id_pkey" PRIMARY KEY ("id")
);

CREATE TYPE "carts_status_enum" AS ENUM('OPEN', 'ORDERED');

CREATE TABLE "carts"
(
    "id"         uuid                         NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP                    NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP                    NOT NULL DEFAULT now(),
    "status"     "carts_status_enum" NOT NULL,
    "user_id"    uuid,
    CONSTRAINT "carts_id_pkey" PRIMARY KEY ("id")
);

CREATE TYPE "public"."orders_status_enum" AS ENUM('OPEN', 'APPROVED', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED');

CREATE TABLE "orders"
(
    "id"       uuid                          NOT NULL DEFAULT uuid_generate_v4(),
    "payment"  jsonb                         NOT NULL,
    "delivery" jsonb                         NOT NULL,
    "comments" text,
    "status"   "orders_status_enum" NOT NULL,
    "total"    integer                       NOT NULL,
    "user_id"  uuid,
    "cart_id"  uuid,
    CONSTRAINT "orders_cart_id_key" UNIQUE ("cart_id"),
    CONSTRAINT "orders_id_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "cart_items"
    ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "cart_items"
    ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "carts"
    ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "orders"
    ADD CONSTRAINT "orders_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
