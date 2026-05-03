"use client";

import { useEffect, useState } from "react";

type PartyOption = {
  id: string;
  name: string;
  slug: string;
};

type Vendor = {
  id: string;
  name: string;
  category: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  driveUrl?: string | null;
  deliverables?: string | null;
  notes?: string | null;
  contractedAmount?: string | number | null;
  paymentStatus: string;
  dueDate?: string | null;
};

type Expense = {
  id: string;
  title: string;
  category: string;
  amount: string | number;
  status: string;
  dueDate?: string | null;
  paidDate?: string | null;
  note?: string | null;
  vendor?: {
    id: string;
    name: string;
    category: string;
  } | null;
};

type Task = {
  id: string;
  title: string;
  details?: string | null;
  status: string;
  dueDate?: string | null;
  owner: string;
  vendor?: {
    id: string;
    name: string;
    category: string;
  } | null;
  party?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

type Section = "vendors" | "expenses" | "tasks";

const vendorCategories = [
  "VENUE",
  "CATERING",
  "BAR",
  "PHOTOGRAPHY",
  "MUSIC",
  "FLORAL",
  "ATTIRE",
  "TRANSPORTATION",
  "STATIONERY",
  "RENTALS",
  "GIFTS",
  "BEAUTY",
  "OTHER",
];

const expenseCategories = [
  "VENUE",
  "FOOD_AND_BEVERAGE",
  "ATTIRE",
  "TRANSPORTATION",
  "FLORALS",
  "STATIONERY",
  "GIFTS",
  "BEAUTY",
  "RENTALS",
  "MUSIC",
  "PHOTOGRAPHY",
  "MISC",
];

const paymentStatuses = ["PENDING", "SCHEDULED", "PAID"];
const taskStatuses = ["TODO", "IN_PROGRESS", "DONE"];
const taskOwners = ["JESS", "EM", "BOTH"];

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
}

function toInputDate(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatCurrency(value?: string | number | null) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(amount) ? amount : 0);
}

export default function PlanningDashboard({ section }: { section: Section }) {
  const [partyOptions, setPartyOptions] = useState<PartyOption[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [vendorEditForm, setVendorEditForm] = useState({
    name: "",
    category: "OTHER",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    contractedAmount: "",
    paymentStatus: "PENDING",
    dueDate: "",
    driveUrl: "",
    deliverables: "",
    notes: "",
  });
  const [expenseEditForm, setExpenseEditForm] = useState({
    title: "",
    category: "MISC",
    amount: "",
    status: "PENDING",
    dueDate: "",
    paidDate: "",
    vendorId: "",
    note: "",
  });
  const [taskEditForm, setTaskEditForm] = useState({
    title: "",
    details: "",
    status: "TODO",
    dueDate: "",
    owner: "BOTH",
    vendorId: "",
    partyId: "",
  });

  const [vendorForm, setVendorForm] = useState({
    name: "",
    category: "OTHER",
    contactName: "",
    email: "",
    phone: "",
    contractedAmount: "",
    dueDate: "",
    driveUrl: "",
    deliverables: "",
    notes: "",
  });
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category: "MISC",
    amount: "",
    dueDate: "",
    vendorId: "",
    note: "",
  });
  const [taskForm, setTaskForm] = useState({
    title: "",
    details: "",
    dueDate: "",
    owner: "BOTH",
    vendorId: "",
    partyId: "",
  });

  const loadPlanningData = async () => {
    try {
      setError(null);
      const [vendorsRes, expensesRes, tasksRes] = await Promise.all([
        fetch("/api/admin/vendors"),
        fetch("/api/admin/expenses"),
        fetch("/api/admin/tasks"),
      ]);

      const partiesRes = await fetch("/api/rsvp");

      if (!vendorsRes.ok || !expensesRes.ok || !tasksRes.ok || !partiesRes.ok) {
        throw new Error("Failed to load planning data");
      }

      const [vendorsData, expensesData, tasksData, partiesData] = await Promise.all([
        vendorsRes.json(),
        expensesRes.json(),
        tasksRes.json(),
        partiesRes.json(),
      ]);

      setVendors(vendorsData.vendors);
      setExpenses(expensesData.expenses);
      setTasks(tasksData.tasks);
      setPartyOptions(
        (partiesData.parties ?? []).map((party: PartyOption) => ({
          id: party.id,
          name: party.name,
          slug: party.slug,
        }))
      );
    } catch (loadError) {
      setError("Failed to load planning dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlanningData();
  }, []);

  const handleCreateVendor = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/admin/vendors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...vendorForm,
        contractedAmount: vendorForm.contractedAmount || undefined,
        dueDate: vendorForm.dueDate || undefined,
      }),
    });

    if (!response.ok) {
      alert("Failed to save vendor");
      return;
    }

    setVendorForm({
      name: "",
      category: "OTHER",
      contactName: "",
      email: "",
      phone: "",
      contractedAmount: "",
      dueDate: "",
      driveUrl: "",
      deliverables: "",
      notes: "",
    });
    await loadPlanningData();
  };

  const handleCreateExpense = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/admin/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...expenseForm,
        dueDate: expenseForm.dueDate || undefined,
        vendorId: expenseForm.vendorId || undefined,
      }),
    });

    if (!response.ok) {
      alert("Failed to save expense");
      return;
    }

    setExpenseForm({
      title: "",
      category: "MISC",
      amount: "",
      dueDate: "",
      vendorId: "",
      note: "",
    });
    await loadPlanningData();
  };

  const handleCreateTask = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/admin/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...taskForm,
        dueDate: taskForm.dueDate || undefined,
        vendorId: taskForm.vendorId || undefined,
        partyId: taskForm.partyId || undefined,
      }),
    });

    if (!response.ok) {
      alert("Failed to save task");
      return;
    }

    setTaskForm({
      title: "",
      details: "",
      dueDate: "",
      owner: "BOTH",
      vendorId: "",
      partyId: "",
    });
    await loadPlanningData();
  };

  const updateVendorStatus = async (id: string, paymentStatus: string) => {
    const response = await fetch(`/api/admin/vendors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus }),
    });

    if (!response.ok) {
      alert("Failed to update vendor");
      return;
    }

    await loadPlanningData();
  };

  const startEditingVendor = (vendor: Vendor) => {
    setEditingVendorId(vendor.id);
    setVendorEditForm({
      name: vendor.name,
      category: vendor.category,
      contactName: vendor.contactName || "",
      email: vendor.email || "",
      phone: vendor.phone || "",
      website: vendor.website || "",
      contractedAmount: vendor.contractedAmount ? String(vendor.contractedAmount) : "",
      paymentStatus: vendor.paymentStatus,
      dueDate: toInputDate(vendor.dueDate),
      driveUrl: vendor.driveUrl || "",
      deliverables: vendor.deliverables || "",
      notes: vendor.notes || "",
    });
  };

  const cancelEditingVendor = () => {
    setEditingVendorId(null);
    setVendorEditForm({
      name: "",
      category: "OTHER",
      contactName: "",
      email: "",
      phone: "",
      website: "",
      contractedAmount: "",
      paymentStatus: "PENDING",
      dueDate: "",
      driveUrl: "",
      deliverables: "",
      notes: "",
    });
  };

  const saveVendorEdit = async (id: string) => {
    const response = await fetch(`/api/admin/vendors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: vendorEditForm.name,
        category: vendorEditForm.category,
        contactName: vendorEditForm.contactName || null,
        email: vendorEditForm.email || null,
        phone: vendorEditForm.phone || null,
        website: vendorEditForm.website || null,
        contractedAmount: vendorEditForm.contractedAmount || null,
        paymentStatus: vendorEditForm.paymentStatus,
        dueDate: vendorEditForm.dueDate || null,
        driveUrl: vendorEditForm.driveUrl || null,
        deliverables: vendorEditForm.deliverables || null,
        notes: vendorEditForm.notes || null,
      }),
    });

    if (!response.ok) {
      alert("Failed to update vendor");
      return;
    }

    cancelEditingVendor();
    await loadPlanningData();
  };

  const updateExpenseStatus = async (id: string, status: string) => {
    const response = await fetch(`/api/admin/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        paidDate: status === "PAID" ? new Date().toISOString() : null,
      }),
    });

    if (!response.ok) {
      alert("Failed to update expense");
      return;
    }

    await loadPlanningData();
  };

  const startEditingExpense = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setExpenseEditForm({
      title: expense.title,
      category: expense.category,
      amount: String(expense.amount ?? ""),
      status: expense.status,
      dueDate: toInputDate(expense.dueDate),
      paidDate: toInputDate(expense.paidDate),
      vendorId: expense.vendor?.id ?? "",
      note: expense.note ?? "",
    });
  };

  const cancelEditingExpense = () => {
    setEditingExpenseId(null);
    setExpenseEditForm({
      title: "",
      category: "MISC",
      amount: "",
      status: "PENDING",
      dueDate: "",
      paidDate: "",
      vendorId: "",
      note: "",
    });
  };

  const saveExpenseEdit = async (id: string) => {
    const response = await fetch(`/api/admin/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: expenseEditForm.title,
        category: expenseEditForm.category,
        amount: expenseEditForm.amount,
        status: expenseEditForm.status,
        dueDate: expenseEditForm.dueDate || null,
        paidDate: expenseEditForm.paidDate || null,
        vendorId: expenseEditForm.vendorId || null,
        note: expenseEditForm.note || null,
      }),
    });

    if (!response.ok) {
      alert("Failed to update expense");
      return;
    }

    cancelEditingExpense();
    await loadPlanningData();
  };

  const updateTaskStatus = async (id: string, status: string) => {
    const response = await fetch(`/api/admin/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      alert("Failed to update task");
      return;
    }

    await loadPlanningData();
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setTaskEditForm({
      title: task.title,
      details: task.details ?? "",
      status: task.status,
      dueDate: toInputDate(task.dueDate),
      owner: task.owner,
      vendorId: task.vendor?.id ?? "",
      partyId: task.party?.id ?? "",
    });
  };

  const cancelEditingTask = () => {
    setEditingTaskId(null);
    setTaskEditForm({
      title: "",
      details: "",
      status: "TODO",
      dueDate: "",
      owner: "BOTH",
      vendorId: "",
      partyId: "",
    });
  };

  const saveTaskEdit = async (id: string) => {
    const response = await fetch(`/api/admin/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: taskEditForm.title,
        details: taskEditForm.details || null,
        status: taskEditForm.status,
        dueDate: taskEditForm.dueDate || null,
        owner: taskEditForm.owner,
        vendorId: taskEditForm.vendorId || null,
        partyId: taskEditForm.partyId || null,
      }),
    });

    if (!response.ok) {
      alert("Failed to update task");
      return;
    }

    cancelEditingTask();
    await loadPlanningData();
  };

  const deleteResource = async (path: string, label: string) => {
    if (!window.confirm(`Delete ${label}?`)) {
      return;
    }

    const response = await fetch(path, { method: "DELETE" });
    if (!response.ok) {
      alert(`Failed to delete ${label}`);
      return;
    }

    await loadPlanningData();
  };

  const unpaidExpenses = expenses.filter((expense) => expense.status !== "PAID");
  const outstandingAmount = unpaidExpenses.reduce((total, expense) => total + Number(expense.amount), 0);
  const overdueTasks = tasks.filter((task) => task.status !== "DONE" && task.dueDate && new Date(task.dueDate) < new Date());
  const vendorsAwaitingPayment = vendors.filter((vendor) => vendor.paymentStatus !== "PAID");
  const sectionTitle = {
    vendors: "Vendor management",
    expenses: "Expense tracking",
    tasks: "Task tracking",
  }[section];
  const sectionDescription = {
    vendors: "Keep contacts, deliverables, contract amounts, and payment state in one place while linking out to Drive for files.",
    expenses: "Track what is due, what is paid, and which vendor or category each payment belongs to.",
    tasks: "Keep your planning checklist visible with owners, due dates, vendor links, and guest or party context.",
  }[section];
  const paidExpenseCount = expenses.filter((expense) => expense.status === "PAID").length;
  const openTaskCount = tasks.filter((task) => task.status !== "DONE").length;

  return (
    <section className="mb-10 space-y-6">
      <div className="rounded-2xl border border-[#d6ddd8] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#6a7f72]">Planning Hub</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#2D4D3A]">{sectionTitle}</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-600">
              {sectionDescription}
            </p>
          </div>
          <button
            onClick={loadPlanningData}
            className="rounded-md border border-[#c8d3cd] px-3 py-2 text-sm text-[#2D4D3A] transition hover:bg-[#f5f7f6]"
          >
            Refresh planning data
          </button>
        </div>

        {section === "vendors" ? (
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-[#f5f7f6] p-4">
              <p className="text-2xl font-semibold text-[#2D4D3A]">{vendors.length}</p>
              <p className="text-sm text-gray-600">Tracked vendors</p>
            </div>
            <div className="rounded-xl bg-[#f1f6ff] p-4">
              <p className="text-2xl font-semibold text-[#355c98]">{vendorsAwaitingPayment.length}</p>
              <p className="text-sm text-gray-600">Not fully paid</p>
            </div>
            <div className="rounded-xl bg-[#f8f3ea] p-4">
              <p className="text-2xl font-semibold text-[#7b5b26]">{formatCurrency(vendors.reduce((total, vendor) => total + Number(vendor.contractedAmount ?? 0), 0))}</p>
              <p className="text-sm text-gray-600">Total contracts</p>
            </div>
          </div>
        ) : null}

        {section === "expenses" ? (
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-[#f5f7f6] p-4">
              <p className="text-2xl font-semibold text-[#2D4D3A]">{expenses.length}</p>
              <p className="text-sm text-gray-600">Tracked expenses</p>
            </div>
            <div className="rounded-xl bg-[#f8f3ea] p-4">
              <p className="text-2xl font-semibold text-[#7b5b26]">{formatCurrency(outstandingAmount)}</p>
              <p className="text-sm text-gray-600">Unpaid amount</p>
            </div>
            <div className="rounded-xl bg-[#f1f6ff] p-4">
              <p className="text-2xl font-semibold text-[#355c98]">{paidExpenseCount}</p>
              <p className="text-sm text-gray-600">Paid expenses</p>
            </div>
          </div>
        ) : null}

        {section === "tasks" ? (
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-[#f5f7f6] p-4">
              <p className="text-2xl font-semibold text-[#2D4D3A]">{tasks.length}</p>
              <p className="text-sm text-gray-600">Tracked tasks</p>
            </div>
            <div className="rounded-xl bg-[#f1f6ff] p-4">
              <p className="text-2xl font-semibold text-[#355c98]">{openTaskCount}</p>
              <p className="text-sm text-gray-600">Open tasks</p>
            </div>
            <div className="rounded-xl bg-[#fff5f5] p-4">
              <p className="text-2xl font-semibold text-[#b03f3f]">{overdueTasks.length}</p>
              <p className="text-sm text-gray-600">Overdue tasks</p>
            </div>
          </div>
        ) : null}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        {section === "vendors" ? (
        <form onSubmit={handleCreateVendor} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-1">
          <h3 className="text-lg font-semibold text-[#2D4D3A]">Add Vendor</h3>
          <div className="mt-4 space-y-3">
            <input
              value={vendorForm.name}
              onChange={(event) => setVendorForm({ ...vendorForm, name: event.target.value })}
              placeholder="Vendor name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              required
            />
            <select
              value={vendorForm.category}
              onChange={(event) => setVendorForm({ ...vendorForm, category: event.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {vendorCategories.map((category) => (
                <option key={category} value={category}>{formatLabel(category)}</option>
              ))}
            </select>
            <input
              value={vendorForm.contactName}
              onChange={(event) => setVendorForm({ ...vendorForm, contactName: event.target.value })}
              placeholder="Contact name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              value={vendorForm.email}
              onChange={(event) => setVendorForm({ ...vendorForm, email: event.target.value })}
              placeholder="Email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              value={vendorForm.phone}
              onChange={(event) => setVendorForm({ ...vendorForm, phone: event.target.value })}
              placeholder="Phone"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={vendorForm.contractedAmount}
                onChange={(event) => setVendorForm({ ...vendorForm, contractedAmount: event.target.value })}
                placeholder="Contracted amount"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={vendorForm.dueDate}
                onChange={(event) => setVendorForm({ ...vendorForm, dueDate: event.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <input
              value={vendorForm.driveUrl}
              onChange={(event) => setVendorForm({ ...vendorForm, driveUrl: event.target.value })}
              placeholder="Drive link"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              value={vendorForm.deliverables}
              onChange={(event) => setVendorForm({ ...vendorForm, deliverables: event.target.value })}
              placeholder="What they're handling"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <textarea
              value={vendorForm.notes}
              onChange={(event) => setVendorForm({ ...vendorForm, notes: event.target.value })}
              placeholder="Notes"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <button className="w-full rounded-md bg-[#2D4D3A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f3528]">
              Save Vendor
            </button>
          </div>
        </form>
        ) : null}

        {section === "expenses" ? (
        <form onSubmit={handleCreateExpense} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-1">
          <h3 className="text-lg font-semibold text-[#2D4D3A]">Add Expense</h3>
          <div className="mt-4 space-y-3">
            <input
              value={expenseForm.title}
              onChange={(event) => setExpenseForm({ ...expenseForm, title: event.target.value })}
              placeholder="Expense title"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              required
            />
            <select
              value={expenseForm.category}
              onChange={(event) => setExpenseForm({ ...expenseForm, category: event.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {expenseCategories.map((category) => (
                <option key={category} value={category}>{formatLabel(category)}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input
                value={expenseForm.amount}
                onChange={(event) => setExpenseForm({ ...expenseForm, amount: event.target.value })}
                placeholder="Amount"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              />
              <input
                type="date"
                value={expenseForm.dueDate}
                onChange={(event) => setExpenseForm({ ...expenseForm, dueDate: event.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <select
              value={expenseForm.vendorId}
              onChange={(event) => setExpenseForm({ ...expenseForm, vendorId: event.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">No linked vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
              ))}
            </select>
            <textarea
              value={expenseForm.note}
              onChange={(event) => setExpenseForm({ ...expenseForm, note: event.target.value })}
              placeholder="Payment note or milestone"
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <button className="w-full rounded-md bg-[#2D4D3A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f3528]">
              Save Expense
            </button>
          </div>
        </form>
        ) : null}

        {section === "tasks" ? (
        <form onSubmit={handleCreateTask} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-1">
          <h3 className="text-lg font-semibold text-[#2D4D3A]">Add Task</h3>
          <div className="mt-4 space-y-3">
            <input
              value={taskForm.title}
              onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
              placeholder="Task title"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              required
            />
            <textarea
              value={taskForm.details}
              onChange={(event) => setTaskForm({ ...taskForm, details: event.target.value })}
              placeholder="Details"
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={taskForm.owner}
                onChange={(event) => setTaskForm({ ...taskForm, owner: event.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                {taskOwners.map((owner) => (
                  <option key={owner} value={owner}>{formatLabel(owner)}</option>
                ))}
              </select>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <select
              value={taskForm.vendorId}
              onChange={(event) => setTaskForm({ ...taskForm, vendorId: event.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">No linked vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
              ))}
            </select>
            <select
              value={taskForm.partyId}
              onChange={(event) => setTaskForm({ ...taskForm, partyId: event.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">No linked party</option>
              {partyOptions.map((party) => (
                <option key={party.id} value={party.id}>{party.name}</option>
              ))}
            </select>
            <button className="w-full rounded-md bg-[#2D4D3A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f3528]">
              Save Task
            </button>
          </div>
        </form>
        ) : null}
      </div>

      <div className="grid gap-6">
        {section === "vendors" ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-[#2D4D3A]">Vendors</h3>
            <span className="text-sm text-gray-500">{vendors.length} total</span>
          </div>
          <div className="mt-4 space-y-3">
            {loading ? <p className="text-sm text-gray-500">Loading vendors...</p> : null}
            {!loading && vendors.length === 0 ? <p className="text-sm text-gray-500">No vendors yet.</p> : null}
            {vendors.map((vendor) => (
              <div key={vendor.id} className="rounded-xl border border-gray-100 bg-[#fafbfa] p-4">
                {editingVendorId === vendor.id ? (
                  <div className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        value={vendorEditForm.name}
                        onChange={(event) => setVendorEditForm({ ...vendorEditForm, name: event.target.value })}
                        placeholder="Vendor name"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                      <select
                        value={vendorEditForm.category}
                        onChange={(event) => setVendorEditForm({ ...vendorEditForm, category: event.target.value })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      >
                        {vendorCategories.map((category) => (
                          <option key={category} value={category}>{formatLabel(category)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <input
                        value={vendorEditForm.contactName}
                        onChange={(event) => setVendorEditForm({ ...vendorEditForm, contactName: event.target.value })}
                        placeholder="Contact name"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={vendorEditForm.email}
                        onChange={(event) => setVendorEditForm({ ...vendorEditForm, email: event.target.value })}
                        placeholder="Email"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={vendorEditForm.phone}
                        onChange={(event) => setVendorEditForm({ ...vendorEditForm, phone: event.target.value })}
                        placeholder="Phone"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="grid gap-3 md:grid-cols-4">
                      <input
                        value={vendorEditForm.contractedAmount}
                        onChange={(event) => setVendorEditForm({ ...vendorEditForm, contractedAmount: event.target.value })}
                        placeholder="Contract amount"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                      <select
                        value={vendorEditForm.paymentStatus}
                        onChange={(event) => setVendorEditForm({ ...vendorEditForm, paymentStatus: event.target.value })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      >
                        {paymentStatuses.map((status) => (
                          <option key={status} value={status}>{formatLabel(status)}</option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={vendorEditForm.dueDate}
                        onChange={(event) => setVendorEditForm({ ...vendorEditForm, dueDate: event.target.value })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={vendorEditForm.website}
                        onChange={(event) => setVendorEditForm({ ...vendorEditForm, website: event.target.value })}
                        placeholder="Website"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <input
                      value={vendorEditForm.driveUrl}
                      onChange={(event) => setVendorEditForm({ ...vendorEditForm, driveUrl: event.target.value })}
                      placeholder="Drive link"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                    <input
                      value={vendorEditForm.deliverables}
                      onChange={(event) => setVendorEditForm({ ...vendorEditForm, deliverables: event.target.value })}
                      placeholder="What they're handling"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                    <textarea
                      value={vendorEditForm.notes}
                      onChange={(event) => setVendorEditForm({ ...vendorEditForm, notes: event.target.value })}
                      rows={3}
                      placeholder="Notes"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => saveVendorEdit(vendor.id)}
                        className="rounded-md bg-[#2D4D3A] px-3 py-2 text-sm text-white hover:bg-[#1f3528]"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditingVendor}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-[#2D4D3A]">{vendor.name}</p>
                        <span className="rounded-full bg-[#e8ebe9] px-2 py-0.5 text-xs text-[#45624f]">{formatLabel(vendor.category)}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {vendor.contactName || vendor.email || vendor.phone || "No contact details yet"}
                      </p>
                      {vendor.deliverables ? <p className="mt-2 text-sm text-gray-600">{vendor.deliverables}</p> : null}
                      {vendor.notes ? <p className="mt-2 text-sm text-gray-500">{vendor.notes}</p> : null}
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>Contract: {formatCurrency(vendor.contractedAmount)}</span>
                        <span>Due: {formatDate(vendor.dueDate)}</span>
                        {vendor.driveUrl ? (
                          <a href={vendor.driveUrl} target="_blank" rel="noreferrer" className="text-[#2D4D3A] underline">
                            Drive link
                          </a>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={vendor.paymentStatus}
                        onChange={(event) => updateVendorStatus(vendor.id, event.target.value)}
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                      >
                        {paymentStatuses.map((status) => (
                          <option key={status} value={status}>{formatLabel(status)}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => startEditingVendor(vendor)}
                        className="text-sm text-blue-600 transition hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteResource(`/api/admin/vendors/${vendor.id}`, vendor.name)}
                        className="text-sm text-red-600 transition hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        ) : null}

        {section === "expenses" ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-[#2D4D3A]">Expenses</h3>
              <span className="text-sm text-gray-500">{expenses.length} items</span>
            </div>
            <div className="mt-4 space-y-3">
              {loading ? <p className="text-sm text-gray-500">Loading expenses...</p> : null}
              {!loading && expenses.length === 0 ? <p className="text-sm text-gray-500">No expenses yet.</p> : null}
              {expenses.map((expense) => (
                <div key={expense.id} className="rounded-xl border border-gray-100 bg-[#fafbfa] p-4">
                  {editingExpenseId === expense.id ? (
                    <div className="space-y-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          value={expenseEditForm.title}
                          onChange={(event) => setExpenseEditForm({ ...expenseEditForm, title: event.target.value })}
                          placeholder="Expense title"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                        <select
                          value={expenseEditForm.category}
                          onChange={(event) => setExpenseEditForm({ ...expenseEditForm, category: event.target.value })}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        >
                          {expenseCategories.map((category) => (
                            <option key={category} value={category}>{formatLabel(category)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid gap-3 md:grid-cols-4">
                        <input
                          value={expenseEditForm.amount}
                          onChange={(event) => setExpenseEditForm({ ...expenseEditForm, amount: event.target.value })}
                          placeholder="Amount"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                        <select
                          value={expenseEditForm.status}
                          onChange={(event) => setExpenseEditForm({ ...expenseEditForm, status: event.target.value })}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        >
                          {paymentStatuses.map((status) => (
                            <option key={status} value={status}>{formatLabel(status)}</option>
                          ))}
                        </select>
                        <input
                          type="date"
                          value={expenseEditForm.dueDate}
                          onChange={(event) => setExpenseEditForm({ ...expenseEditForm, dueDate: event.target.value })}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="date"
                          value={expenseEditForm.paidDate}
                          onChange={(event) => setExpenseEditForm({ ...expenseEditForm, paidDate: event.target.value })}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <select
                        value={expenseEditForm.vendorId}
                        onChange={(event) => setExpenseEditForm({ ...expenseEditForm, vendorId: event.target.value })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="">No linked vendor</option>
                        {vendors.map((vendor) => (
                          <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                        ))}
                      </select>
                      <textarea
                        value={expenseEditForm.note}
                        onChange={(event) => setExpenseEditForm({ ...expenseEditForm, note: event.target.value })}
                        placeholder="Payment note"
                        rows={3}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => saveExpenseEdit(expense.id)}
                          className="rounded-md bg-[#2D4D3A] px-3 py-2 text-sm text-white hover:bg-[#1f3528]"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingExpense}
                          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-[#2D4D3A]">{expense.title}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          {formatLabel(expense.category)}
                          {expense.vendor ? ` · ${expense.vendor.name}` : ""}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>{formatCurrency(expense.amount)}</span>
                          <span>Due: {formatDate(expense.dueDate)}</span>
                          <span>Paid: {formatDate(expense.paidDate)}</span>
                        </div>
                        {expense.note ? <p className="mt-2 text-sm text-gray-500">{expense.note}</p> : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditingExpense(expense)}
                          className="text-sm text-blue-600 transition hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => updateExpenseStatus(expense.id, expense.status === "PAID" ? "PENDING" : "PAID")}
                          className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {expense.status === "PAID" ? "Mark unpaid" : "Mark paid"}
                        </button>
                        <button
                          onClick={() => deleteResource(`/api/admin/expenses/${expense.id}`, expense.title)}
                          className="text-sm text-red-600 transition hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {section === "tasks" ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-[#2D4D3A]">Tasks</h3>
              <span className="text-sm text-gray-500">{tasks.length} items</span>
            </div>
            <div className="mt-4 space-y-3">
              {loading ? <p className="text-sm text-gray-500">Loading tasks...</p> : null}
              {!loading && tasks.length === 0 ? <p className="text-sm text-gray-500">No tasks yet.</p> : null}
              {tasks.map((task) => (
                <div key={task.id} className="rounded-xl border border-gray-100 bg-[#fafbfa] p-4">
                  {editingTaskId === task.id ? (
                    <div className="space-y-3">
                      <input
                        value={taskEditForm.title}
                        onChange={(event) => setTaskEditForm({ ...taskEditForm, title: event.target.value })}
                        placeholder="Task title"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                      <textarea
                        value={taskEditForm.details}
                        onChange={(event) => setTaskEditForm({ ...taskEditForm, details: event.target.value })}
                        placeholder="Details"
                        rows={3}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                      <div className="grid gap-3 md:grid-cols-4">
                        <select
                          value={taskEditForm.status}
                          onChange={(event) => setTaskEditForm({ ...taskEditForm, status: event.target.value })}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        >
                          {taskStatuses.map((status) => (
                            <option key={status} value={status}>{formatLabel(status)}</option>
                          ))}
                        </select>
                        <select
                          value={taskEditForm.owner}
                          onChange={(event) => setTaskEditForm({ ...taskEditForm, owner: event.target.value })}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        >
                          {taskOwners.map((owner) => (
                            <option key={owner} value={owner}>{formatLabel(owner)}</option>
                          ))}
                        </select>
                        <input
                          type="date"
                          value={taskEditForm.dueDate}
                          onChange={(event) => setTaskEditForm({ ...taskEditForm, dueDate: event.target.value })}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                        <select
                          value={taskEditForm.vendorId}
                          onChange={(event) => setTaskEditForm({ ...taskEditForm, vendorId: event.target.value })}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        >
                          <option value="">No linked vendor</option>
                          {vendors.map((vendor) => (
                            <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                          ))}
                        </select>
                      </div>
                      <select
                        value={taskEditForm.partyId}
                        onChange={(event) => setTaskEditForm({ ...taskEditForm, partyId: event.target.value })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="">No linked party</option>
                        {partyOptions.map((party) => (
                          <option key={party.id} value={party.id}>{party.name}</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => saveTaskEdit(task.id)}
                          className="rounded-md bg-[#2D4D3A] px-3 py-2 text-sm text-white hover:bg-[#1f3528]"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingTask}
                          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-[#2D4D3A]">{task.title}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          {formatLabel(task.owner)}
                          {task.vendor ? ` · ${task.vendor.name}` : ""}
                          {task.party ? ` · ${task.party.name}` : ""}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">Due: {formatDate(task.dueDate)}</p>
                        {task.details ? <p className="mt-2 text-sm text-gray-500">{task.details}</p> : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditingTask(task)}
                          className="text-sm text-blue-600 transition hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => updateTaskStatus(task.id, task.status === "DONE" ? "TODO" : "DONE")}
                          className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {task.status === "DONE" ? "Reopen" : "Mark done"}
                        </button>
                        <button
                          onClick={() => deleteResource(`/api/admin/tasks/${task.id}`, task.title)}
                          className="text-sm text-red-600 transition hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}