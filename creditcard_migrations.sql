CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

CREATE TABLE "Users" (
    "Id" uuid NOT NULL,
    "Username" text NOT NULL,
    "Email" text NOT NULL,
    "PasswordHash" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
);

CREATE TABLE "CreditCards" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "CardNumber" text NOT NULL,
    "HolderName" text NOT NULL,
    "Expiry" text NOT NULL,
    "CvvHash" text NOT NULL,
    "Limit" numeric NOT NULL,
    "Balance" numeric NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_CreditCards" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_CreditCards_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Transactions" (
    "Id" uuid NOT NULL,
    "CardId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "Amount" numeric NOT NULL,
    "Type" text NOT NULL,
    "Timestamp" timestamp with time zone NOT NULL,
    "Description" text,
    "BalanceAfter" numeric NOT NULL,
    CONSTRAINT "PK_Transactions" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Transactions_CreditCards_CardId" FOREIGN KEY ("CardId") REFERENCES "CreditCards" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Transactions_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_CreditCards_UserId" ON "CreditCards" ("UserId");

CREATE INDEX "IX_Transactions_CardId" ON "Transactions" ("CardId");

CREATE INDEX "IX_Transactions_UserId" ON "Transactions" ("UserId");

CREATE UNIQUE INDEX "IX_Users_Username" ON "Users" ("Username");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260114130541_InitialCreate', '8.0.0');

COMMIT;

