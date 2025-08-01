-- CreateTable
CREATE TABLE "UnasProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT,
    "priceNet" REAL NOT NULL,
    "priceGross" REAL NOT NULL,
    "state" TEXT NOT NULL,
    "createTime" TEXT NOT NULL,
    "lastModTime" TEXT NOT NULL,
    "stock" TEXT,
    "stockStatus" BOOLEAN NOT NULL DEFAULT false,
    "minimumQty" TEXT,
    "categoryId" TEXT,
    "categoryName" TEXT,
    "allCategories" JSONB,
    "description" TEXT DEFAULT '',
    "shortDescription" TEXT DEFAULT '',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "url" TEXT,
    "sefUrl" TEXT,
    "imageUrl" TEXT,
    "imageSefUrl" TEXT,
    "imageAlt" TEXT,
    "weight" TEXT,
    "parameters" JSONB,
    "specialPrices" JSONB,
    "salePrice" JSONB,
    "groupSalePrices" JSONB,
    "syncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UnasSyncLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "syncType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "productCount" INTEGER NOT NULL DEFAULT 0,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "errorMessages" JSONB,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "UnasProduct_sku_key" ON "UnasProduct"("sku");

-- CreateIndex
CREATE INDEX "UnasProduct_sku_idx" ON "UnasProduct"("sku");

-- CreateIndex
CREATE INDEX "UnasProduct_state_idx" ON "UnasProduct"("state");

-- CreateIndex
CREATE INDEX "UnasProduct_categoryId_idx" ON "UnasProduct"("categoryId");

-- CreateIndex
CREATE INDEX "UnasProduct_lastModTime_idx" ON "UnasProduct"("lastModTime");

-- CreateIndex
CREATE INDEX "UnasSyncLog_status_idx" ON "UnasSyncLog"("status");

-- CreateIndex
CREATE INDEX "UnasSyncLog_startedAt_idx" ON "UnasSyncLog"("startedAt");
