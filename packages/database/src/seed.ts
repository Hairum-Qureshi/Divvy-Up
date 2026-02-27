import { PrismaClient, Status } from '../generated/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function loadJSON(fileName: string) {
  const filePath = path.join(__dirname, fileName);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

async function main() {
  console.log('Seeding from JSON files...');

  // USERS
  const usersData = loadJSON('users.json');
  const users = [];
  for (const user of usersData) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        username: user.username,
        email: user.email,
        joinDate: user.joinDate ? new Date(user.joinDate) : undefined,
      },
    });
    users.push(created);
  }
  console.log(`✅ Seeded ${users.length} users`);

  // GROUPS
  const groupsData = loadJSON('groups.json');
  const groups = [];

  for (const group of groupsData) {
    const creatorId =
      group.createdBy && group.createdBy !== 'user-id-will-be-replaced'
        ? group.createdBy
        : users[0]!.id;

    const created = await prisma.group.create({
      data: {
        id: group.id,
        groupName: group.groupName,
        creator: { connect: { id: creatorId } },
      },
    });

    groups.push(created);
  }
  console.log(`✅ Seeded ${groups.length} groups`);

  // MEMBERSHIPS
  if (fs.existsSync(path.join(__dirname, 'memberships.json'))) {
    const membershipsData = loadJSON('memberships.json');
    for (const m of membershipsData) {
      await prisma.membership.create({
        data: {
          id: m.id,
          role: m.role || 'member',
          user: { connect: { id: m.userId || users[0]!.id } },
          group: { connect: { id: m.groupId || groups[0]!.id } },
        },
      });
    }
    console.log(`✅ Seeded ${membershipsData.length} memberships`);
  }

  //EXPENSES
  if (fs.existsSync(path.join(__dirname, 'expenses.json'))) {
    const expensesData = loadJSON('expenses.json');
    for (const e of expensesData) {
      await prisma.expense.create({
        data: {
          id: e.id,
          amount: e.amount,
          description: e.description,
          dateAdded: e.dateAdded ? new Date(e.dateAdded) : undefined,
          group: { connect: { id: e.groupId || groups[0]!.id } },
          paidBy: { connect: { id: e.paidById || users[0]!.id } },
        },
      });
    }
    console.log(`✅ Seeded ${expensesData.length} expenses`);
  }

  // EXPENSE SPLITS
  if (fs.existsSync(path.join(__dirname, 'expenseSplits.json'))) {
    const splitsData = loadJSON('expenseSplits.json');
    for (const s of splitsData) {
      await prisma.expenseSplit.create({
        data: {
          id: s.id,
          amountOwed: s.amountOwed,
          status: s.status || Status.UNPAID,
          expense: { connect: { id: s.expenseId } },
          user: { connect: { id: s.userId } },
        },
      });
    }
    console.log(`✅ Seeded ${splitsData.length} expense splits`);
  }

  // SETTLEMENTS
  if (fs.existsSync(path.join(__dirname, 'settlements.json'))) {
    const settlementsData = loadJSON('settlements.json');
    for (const s of settlementsData) {
      await prisma.settlement.create({
        data: {
          id: s.id,
          amount: s.amount,
          status:
            s.status && Object.values(Status).includes(s.status)
              ? s.status
              : Status.UNPAID,
          dateSettled: s.dateSettled ? new Date(s.dateSettled) : undefined,
          group: { connect: { id: s.groupId || groups[0]!.id } },
          payer: { connect: { id: s.payerId } },
          receiver: { connect: { id: s.receiverId } },
        },
      });
    }
    console.log(`✅ Seeded ${settlementsData.length} settlements`);
  }

  // BADGES
  await prisma.badge.createMany({
    data: [
      {id: 1, name: 'First Expense', description: 'Created your first expense!', iconUrl: '/badges/big-spender.PNG'},
      {id: 2, name: 'Group Organizer', description: 'Created a group!', iconUrl: '/badges/group-organizer.PNG'},
      {id: 3, name: 'Settler', description: 'Settled an expense!', iconUrl: '/badges/settler.PNG'},
      {id: 4, name: 'Frequent Spender', description: 'Created 10 expenses!', iconUrl: '/badges/frequent-spender.PNG'},
      {id: 5, name: 'Super Organizer', description: 'Created 5 groups!', iconUrl: '/badges/super-organizer.PNG'},
      {id: 6, name: 'Master Settler', description: 'Settled 10 expenses!', iconUrl: '/badges/master-settler.PNG'},
      {id: 7, name: 'Social Butterfly', description: 'Joined 3 groups!', iconUrl: '/badges/social-butterfly.PNG'},
      {id: 8, name: 'Big Spender', description: 'Created an expense over $1000!', iconUrl: '/badges/big-spender.PNG'},
      {id: 9, name: 'Generous Payer', description: 'Paid for an expense for more than 5 people!', iconUrl: '/badges/generous-payer.PNG'},
    ]
  })

  console.log('🎉 Seeding complete!');
}

main()
  .catch((err) => {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
