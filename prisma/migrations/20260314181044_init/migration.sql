-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionName" TEXT NOT NULL,
    "sessionCategory" TEXT NOT NULL,
    "sessionLength" DOUBLE PRECISION,
    "sessionRating" INTEGER,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
