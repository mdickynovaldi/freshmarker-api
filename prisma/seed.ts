import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.image.deleteMany();

  await prisma.product.deleteMany();

  const products = [
    {
      name: "Fuji Apple",
      slug: "fuji-apple",
      description: "Fresh imported apples from Japan",
      price: 25000,
      stock: 100,
      weight: 100,
      images: {
        create: [
          {
            url: "https://s3-publishing-cmn-svc-prd.s3.ap-southeast-1.amazonaws.com/article/L_0LCFtvHjXicJvX6F9rv/original/003102700_1525316788-5-Buah-Ini-Harus-Ada-dalam-Menu-Harian-Anda-By-Alexander-Raths-shutterstock.jpg",
            alt: "Front view of Fuji Apple",
          },
          {
            url: "https://s3-publishing-cmn-svc-prd.s3.ap-southeast-1.amazonaws.com/article/L_0LCFtvHjXicJvX6F9rv/original/003102700_1525316788-5-Buah-Ini-Harus-Ada-dalam-Menu-Harian-Anda-By-Alexander-Raths-shutterstock.jpg",
            alt: "Side view of Fuji Apple",
          },
        ],
      },
    },
    {
      name: "Cavendish Banana",
      slug: "cavendish-banana",
      description: "Premium quality fresh bananas",
      price: 15000,
      stock: 150,
      weight: 100,
      images: {
        create: [
          {
            url: "https://s3-publishing-cmn-svc-prd.s3.ap-southeast-1.amazonaws.com/article/L_0LCFtvHjXicJvX6F9rv/original/003102700_1525316788-5-Buah-Ini-Harus-Ada-dalam-Menu-Harian-Anda-By-Alexander-Raths-shutterstock.jpg",
            alt: "Front view of Cavendish Banana",
          },
        ],
      },
    },
    {
      name: "Mandarin Orange",
      slug: "mandarin-orange",
      description: "Sweet imported oranges from China",
      price: 30000,
      stock: 80,
      weight: 100,
      images: {
        create: [
          {
            url: "https://s3-publishing-cmn-svc-prd.s3.ap-southeast-1.amazonaws.com/article/L_0LCFtvHjXicJvX6F9rv/original/003102700_1525316788-5-Buah-Ini-Harus-Ada-dalam-Menu-Harian-Anda-By-Alexander-Raths-shutterstock.jpg",
            alt: "Front view of Mandarin Orange",
          },
        ],
      },
    },
  ];

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
