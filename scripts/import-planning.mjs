import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) {
    return null;
  }

  return process.argv[index + 1];
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function resolveVendorIdFromText(text, vendorRecords) {
  const normalized = normalizeText(text);
  if (!normalized) {
    return null;
  }

  const sortedVendors = [...vendorRecords].sort((a, b) => b.normalizedName.length - a.normalizedName.length);
  for (const vendor of sortedVendors) {
    if (!vendor.normalizedName) {
      continue;
    }

    if (normalized.includes(vendor.normalizedName)) {
      return vendor.id;
    }
  }

  return null;
}

async function main() {
  const fileArg = getArgValue("--file");
  const shouldClear = hasFlag("--clear");
  const shouldLinkExistingExpenses = hasFlag("--link-existing-expenses");

  if (!fileArg) {
    console.error("Missing required argument: --file <path-to-json>");
    console.error("Example: npm run planning:import -- --file data/planning-import.example.json");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required.");
    process.exit(1);
  }

  const absoluteFile = path.resolve(process.cwd(), fileArg);
  const fileContent = await fs.readFile(absoluteFile, "utf8");
  const payload = JSON.parse(fileContent);

  const vendorsPayload = Array.isArray(payload.vendors) ? payload.vendors : [];
  const expensesPayload = Array.isArray(payload.expenses) ? payload.expenses : [];
  const tasksPayload = Array.isArray(payload.tasks) ? payload.tasks : [];

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    if (shouldClear) {
      await prisma.task.deleteMany({});
      await prisma.expense.deleteMany({});
      await prisma.vendor.deleteMany({});
    }

    const vendorIndex = new Map();

    for (const vendorInput of vendorsPayload) {
      if (!vendorInput?.name || !vendorInput?.category) {
        continue;
      }

      const existing = await prisma.vendor.findFirst({
        where: { name: vendorInput.name },
      });

      const data = {
        name: vendorInput.name,
        category: vendorInput.category,
        contactName: vendorInput.contactName || null,
        email: vendorInput.email || null,
        phone: vendorInput.phone || null,
        website: vendorInput.website || null,
        driveUrl: vendorInput.driveUrl || null,
        deliverables: vendorInput.deliverables || null,
        notes: vendorInput.notes || null,
        contractedAmount: parseNumber(vendorInput.contractedAmount),
        paymentStatus: vendorInput.paymentStatus || undefined,
        dueDate: parseDate(vendorInput.dueDate),
      };

      const vendor = existing
        ? await prisma.vendor.update({ where: { id: existing.id }, data })
        : await prisma.vendor.create({ data });

      vendorIndex.set(normalizeText(vendor.name), vendor.id);
    }

    const currentVendors = await prisma.vendor.findMany({
      select: { id: true, name: true },
    });

    const vendorRecords = currentVendors.map((vendor) => ({
      id: vendor.id,
      name: vendor.name,
      normalizedName: normalizeText(vendor.name),
    }));

    for (const expenseInput of expensesPayload) {
      if (!expenseInput?.title || !expenseInput?.category) {
        continue;
      }

      const amount = parseNumber(expenseInput.amount);
      if (amount === null) {
        continue;
      }

      const byName = expenseInput.vendorName ? vendorIndex.get(normalizeText(expenseInput.vendorName)) : null;
      const linkedVendorId =
        expenseInput.vendorId ||
        byName ||
        resolveVendorIdFromText(`${expenseInput.title} ${expenseInput.note || ""}`, vendorRecords);

      const dueDate = parseDate(expenseInput.dueDate);
      const existing = await prisma.expense.findFirst({
        where: {
          title: expenseInput.title,
          amount,
          dueDate,
        },
      });

      const data = {
        title: expenseInput.title,
        category: expenseInput.category,
        amount,
        status: expenseInput.status || "PENDING",
        dueDate,
        paidDate: parseDate(expenseInput.paidDate),
        note: expenseInput.note || null,
        vendorId: linkedVendorId || null,
      };

      if (existing) {
        await prisma.expense.update({ where: { id: existing.id }, data });
      } else {
        await prisma.expense.create({ data });
      }
    }

    for (const taskInput of tasksPayload) {
      if (!taskInput?.title) {
        continue;
      }

      const byVendorName = taskInput.vendorName ? vendorIndex.get(normalizeText(taskInput.vendorName)) : null;
      let partyId = null;
      if (taskInput.partySlug) {
        const party = await prisma.party.findUnique({ where: { slug: taskInput.partySlug } });
        partyId = party?.id || null;
      }

      const dueDate = parseDate(taskInput.dueDate);
      const existing = await prisma.task.findFirst({
        where: {
          title: taskInput.title,
          dueDate,
        },
      });

      const data = {
        title: taskInput.title,
        details: taskInput.details || null,
        status: taskInput.status || "TODO",
        dueDate,
        owner: taskInput.owner || "BOTH",
        vendorId: taskInput.vendorId || byVendorName || null,
        partyId,
      };

      if (existing) {
        await prisma.task.update({ where: { id: existing.id }, data });
      } else {
        await prisma.task.create({ data });
      }
    }

    if (shouldLinkExistingExpenses) {
      const unlinkedExpenses = await prisma.expense.findMany({
        where: { vendorId: null },
      });

      for (const expense of unlinkedExpenses) {
        const matchedVendorId = resolveVendorIdFromText(`${expense.title} ${expense.note || ""}`, vendorRecords);
        if (!matchedVendorId) {
          continue;
        }

        await prisma.expense.update({
          where: { id: expense.id },
          data: { vendorId: matchedVendorId },
        });
      }
    }

    const [vendorCount, expenseCount, taskCount, linkedExpenseCount] = await Promise.all([
      prisma.vendor.count(),
      prisma.expense.count(),
      prisma.task.count(),
      prisma.expense.count({ where: { vendorId: { not: null } } }),
    ]);

    console.log("Planning import complete.");
    console.log(`Vendors: ${vendorCount}`);
    console.log(`Expenses: ${expenseCount}`);
    console.log(`Tasks: ${taskCount}`);
    console.log(`Expenses linked to vendors: ${linkedExpenseCount}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Planning import failed:", error);
  process.exit(1);
});
