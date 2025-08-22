import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Seed Categories
  const parentCategories = [
    { id: 1, name: '상의' },
    { id: 2, name: '하의' },
  ];
  for (const cat of parentCategories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: { id: cat.id, name: cat.name },
    });
  }

  const subCategories = [
    { id: 3, name: '티셔츠', parentId: 1 },
    { id: 4, name: '셔츠', parentId: 1 },
    { id: 5, name: '상의 트레이닝', parentId: 1 },
    { id: 6, name: '자켓', parentId: 1 },
    { id: 7, name: '슬랙스', parentId: 2 },
    { id: 8, name: '청바지', parentId: 2 },
    { id: 9, name: '하의 트레이닝', parentId: 2 },
  ];
  for (const cat of subCategories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: { id: cat.id, name: cat.name, parentId: cat.parentId },
    });
  }

  // Seed Products
  const products = [
    { id: 1, name: '기본 라운드넥 티셔츠', description: '부드러운 면 소재의 기본 티셔츠입니다.', price: 15000, stock: 100, categoryId: 3 },
    { id: 2, name: '옥스포드 셔츠', description: '클래식한 디자인의 옥스포드 셔츠.', price: 45000, stock: 50, categoryId: 4 },
    { id: 3, name: '테크 플리스 자켓', description: '가볍고 따뜻한 테크 플리스 소재의 자켓.', price: 89000, stock: 30, categoryId: 6 },
    { id: 4, name: '와이드 슬랙스', description: '트렌디한 와이드 핏의 슬랙스입니다.', price: 55000, stock: 70, categoryId: 7 },
    { id: 5, name: '스트레이트 데님 팬츠', description: '어디에나 잘 어울리는 스트레이트 핏 청바지.', price: 65000, stock: 80, categoryId: 8 },
    { id: 6, name: '여성용 크롭 후드티', description: '편안하고 스타일리시한 크롭 후드티.', price: 38000, stock: 90, categoryId: 5 },
    { id: 7, name: '남성용 린넨 셔츠', description: '시원한 린넨 소재의 여름 셔츠.', price: 52000, stock: 60, categoryId: 4 },
    { id: 8, name: '스포츠 트레이닝 팬츠', description: '운동 시 편안한 착용감의 트레이닝 팬츠.', price: 42000, stock: 120, categoryId: 9 },
    { id: 9, name: '오버핏 맨투맨', description: '트렌디한 오버핏 디자인의 맨투맨.', price: 35000, stock: 110, categoryId: 3 },
    { id: 10, name: '경량 패딩 조끼', description: '간절기에 활용하기 좋은 경량 패딩 조끼.', price: 75000, stock: 40, categoryId: 6 },
    { id: 11, name: '슬림핏 청바지', description: '다리 라인을 살려주는 슬림핏 청바지.', price: 60000, stock: 75, categoryId: 8 },
    { id: 12, name: '카고 조거 팬츠', description: '활동성과 스타일을 겸비한 카고 조거 팬츠.', price: 48000, stock: 85, categoryId: 9 },
    { id: 13, name: '루즈핏 반팔 티셔츠', description: '데일리로 입기 좋은 루즈핏 반팔 티셔츠.', price: 22000, stock: 130, categoryId: 3 },
    { id: 14, name: '체크 패턴 셔츠', description: '클래식한 체크 패턴의 캐주얼 셔츠.', price: 49000, stock: 55, categoryId: 4 },
    { id: 15, name: '방수 바람막이 자켓', description: '야외 활동에 적합한 방수 바람막이.', price: 95000, stock: 25, categoryId: 6 },
  ];
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
