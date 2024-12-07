import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Hapus semua data image terlebih dahulu
  await prisma.image.deleteMany();

  // Baru kemudian hapus data produk
  await prisma.product.deleteMany();

  // Seed data produk
  const products = [
    {
      name: "Apel Fuji",
      slug: "apel-fuji",
      description: "Apel segar import dari Jepang",
      price: 25000,
      stock: 100,
      weight: 100,
      images: {
        create: [
          {
            url: "https://s3-publishing-cmn-svc-prd.s3.ap-southeast-1.amazonaws.com/article/L_0LCFtvHjXicJvX6F9rv/original/003102700_1525316788-5-Buah-Ini-Harus-Ada-dalam-Menu-Harian-Anda-By-Alexander-Raths-shutterstock.jpg",
            alt: "Apel Fuji tampak depan",
          },
          {
            url: "https://s3-publishing-cmn-svc-prd.s3.ap-southeast-1.amazonaws.com/article/L_0LCFtvHjXicJvX6F9rv/original/003102700_1525316788-5-Buah-Ini-Harus-Ada-dalam-Menu-Harian-Anda-By-Alexander-Raths-shutterstock.jpg",
            alt: "Apel Fuji tampak samping",
          },
        ],
      },
    },
    {
      name: "Pisang Cavendish",
      slug: "pisang-cavendish",
      description: "Pisang segar berkualitas premium",
      price: 15000,
      stock: 150,
      weight: 100,
      images: {
        create: [
          {
            url: "https://s3-publishing-cmn-svc-prd.s3.ap-southeast-1.amazonaws.com/article/L_0LCFtvHjXicJvX6F9rv/original/003102700_1525316788-5-Buah-Ini-Harus-Ada-dalam-Menu-Harian-Anda-By-Alexander-Raths-shutterstock.jpg",
            alt: "Pisang Cavendish tampak depan",
          },
        ],
      },
    },
    {
      name: "Jeruk Mandarin",
      slug: "jeruk-mandarin",
      description: "Jeruk manis import dari China",
      price: 30000,
      stock: 80,
      weight: 100,
      images: {
        create: [
          {
            url: "https://s3-publishing-cmn-svc-prd.s3.ap-southeast-1.amazonaws.com/article/L_0LCFtvHjXicJvX6F9rv/original/003102700_1525316788-5-Buah-Ini-Harus-Ada-dalam-Menu-Harian-Anda-By-Alexander-Raths-shutterstock.jpg",
            alt: "Jeruk Mandarin tampak depan",
          },
        ],
      },
    },
  ];

  // Insert data produk
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(products);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
