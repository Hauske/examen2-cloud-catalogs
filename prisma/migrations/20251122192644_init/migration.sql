-- CreateEnum
CREATE TYPE "TipoSociedad" AS ENUM ('S_EN_NC', 'S_EN_CS', 'S_DE_RL', 'SA', 'S_EN_C_POR_A', 'S_COOP', 'SAS');

-- CreateEnum
CREATE TYPE "TipoDireccion" AS ENUM ('FACTURACION', 'ENVIO');

-- CreateEnum
CREATE TYPE "UnidadMedia" AS ENUM ('H87', 'KGM', 'LTR', 'MTR', 'E48');

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "razonSocial" "TipoSociedad" NOT NULL,
    "nombreComercial" TEXT NOT NULL,
    "rfc" TEXT NOT NULL,
    "correoElectronico" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domicilio" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "domicilio" TEXT NOT NULL,
    "colonia" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "tipo" "TipoDireccion" NOT NULL,

    CONSTRAINT "Domicilio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "unidadMedida" "UnidadMedia" NOT NULL,
    "precioBase" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotaVenta" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "domicilioId" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "NotaVenta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContenidoNotaVenta" (
    "id" TEXT NOT NULL,
    "notaVentaId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,
    "importe" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ContenidoNotaVenta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_rfc_key" ON "Cliente"("rfc");

-- CreateIndex
CREATE UNIQUE INDEX "NotaVenta_folio_key" ON "NotaVenta"("folio");

-- AddForeignKey
ALTER TABLE "Domicilio" ADD CONSTRAINT "Domicilio_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotaVenta" ADD CONSTRAINT "NotaVenta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotaVenta" ADD CONSTRAINT "NotaVenta_domicilioId_fkey" FOREIGN KEY ("domicilioId") REFERENCES "Domicilio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContenidoNotaVenta" ADD CONSTRAINT "ContenidoNotaVenta_notaVentaId_fkey" FOREIGN KEY ("notaVentaId") REFERENCES "NotaVenta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContenidoNotaVenta" ADD CONSTRAINT "ContenidoNotaVenta_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
