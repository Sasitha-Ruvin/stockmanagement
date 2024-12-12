
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {

    const hashedPassword = await bcrypt.hash('admin',10);

    await prisma.user.create({
        data:{
            name:"Admin",
            username:'admin',
            password:hashedPassword
        }
    })
    console.log('COO seeded successfully');

    
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