-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_days" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "day" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "counterId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "days_counterId_fkey" FOREIGN KEY ("counterId") REFERENCES "counters" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "days_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_days" ("counterId", "createdAt", "day", "id", "updatedAt", "userId") SELECT "counterId", "createdAt", "day", "id", "updatedAt", "userId" FROM "days";
DROP TABLE "days";
ALTER TABLE "new_days" RENAME TO "days";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
