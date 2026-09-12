 "use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Menu as MenuIcon,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  available: boolean;
}

const defaultCategories = [
  "Breakfast",
  "Main Course",
  "Pizza",
  "Burger",
  "Drinks",
  "Dessert",
  "Other",
];

export default function BusinessMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [businessName, setBusinessName] = useState("Your business");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [saved, setSaved] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    const information = JSON.parse(
      localStorage.getItem("meder-business-information") || "[]",
    );

    if (information.length > 0) {
      setBusinessName(
        information[information.length - 1].businessName || "Your business",
      );
    }

    const storedMenu = JSON.parse(
      localStorage.getItem("meder-business-menu") || "[]",
    );

    setMenuItems(storedMenu);
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleItemSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const item: MenuItem = {
      id: editingItem?.id || Date.now().toString(),
      name: String(form.get("name") || ""),
      category: String(form.get("category") || "Other"),
      description: String(form.get("description") || ""),
      price: String(form.get("price") || ""),
      available: form.get("available") === "on",
    };

    setMenuItems((current) => {
      if (editingItem) {
        return current.map((existing) =>
          existing.id === editingItem.id ? item : existing,
        );
      }

      return [...current, item];
    });

    closeModal();
  };

  const deleteItem = (id: string) => {
    setMenuItems((current) =>
      current.filter((item) => item.id !== id),
    );
  };

  const toggleAvailability = (id: string) => {
    setMenuItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, available: !item.available }
          : item,
      ),
    );
  };

  const saveMenu = () => {
    localStorage.setItem(
      "meder-business-menu",
      JSON.stringify(menuItems),
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const categories = Array.from(
    new Set([
      ...defaultCategories,
      ...menuItems.map((item) => item.category),
    ]),
  );

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/for-business/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />
          Business dashboard
        </Link>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Business profile
            </p>

            <h1 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
              Menu
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Keep {businessName}'s menu and prices accurate for customers.
            </p>
          </div>
 <button
            type="button"
            onClick={openAddModal}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
          >
            <Plus className="h-4 w-4" />
            Add item
          </button>
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          {menuItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                <MenuIcon className="h-6 w-6 text-[#D4AF37]" />
              </div>

              <h2 className="mt-5 font-serif text-2xl text-white">
                Your menu is empty
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
                Add your first menu item so people can understand what you
                offer before visiting.
              </p>

              <button
                type="button"
                onClick={openAddModal}
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D4AF37]/30 px-5 text-sm text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
              >
                <Plus className="h-4 w-4" />
                Add first item
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => {
                const items = menuItems.filter(
                  (item) => item.category === category,
                );

                if (items.length === 0) {
                  return null;
                }

                const isOpen = openCategory === category;

                return (
                  <div
                    key={category}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenCategory(isOpen ? null : category)
                      }
                      className="flex w-full items-center justify-between p-5 text-left"
                    >
                      <div>
                        <h2 className="font-serif text-xl text-white">
                          {category}
                        </h2>

                        <p className="mt-1 text-xs text-white/30">
                          {items.length}{" "}
                          {items.length === 1 ? "item" : "items"}
                        </p>
                      </div>

                      <ChevronDown
                        className={`h-5 w-5 text-white/40 transition ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-white/10">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="border-b border-white/5 p-5 last:border-b-0"
                          >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-sm font-medium text-white">
                                    {item.name}
                                  </h3>
 <span
                                    className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                                      item.available
                                        ? "bg-green-500/10 text-green-400"
                                        : "bg-red-500/10 text-red-400"
                                    }`}
                                  >
                                    {item.available
                                      ? "Available"
                                      : "Unavailable"}
                                  </span>
                                </div>

                                {item.description && (
                                  <p className="mt-2 text-xs leading-5 text-white/35">
                                    {item.description}
                                  </p>
                                )}

                                <p className="mt-3 text-sm font-semibold text-[#D4AF37]">
                                  {item.price} ETB
                                </p>
                              </div>

                              <div className="flex shrink-0 items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleAvailability(item.id)
                                  }
                                  className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/50 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
                                >
                                  {item.available
                                    ? "Mark unavailable"
                                    : "Mark available"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => openEditModal(item)}
                                  title="Edit item"
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/40 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => deleteItem(item.id)}
                                  title="Delete item"
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/40 transition hover:border-red-500/40 hover:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {saved && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4 text-sm text-[#D4AF37]">
              <CheckCircle2 className="h-4 w-4" />
              Menu saved successfully.
            </div>
          )}

          <button
            type="button"
            onClick={saveMenu}
            className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
          >
            <Save className="h-4 w-4" />
            Save menu
          </button>
        </section>
      </div>
 {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 px-4 py-8 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center">
            <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111] p-6 shadow-2xl sm:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                    Menu item
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-white">
                    {editingItem ? "Edit item" : "Add item"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleItemSubmit} className="mt-7 space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-white/80"
                  >
                    Item name
                  </label>

                  <input
                    id="name"
                    name="name"
                    required
                    defaultValue={editingItem?.name || ""}
                    placeholder="e.g. Chicken Burger"
                    className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="category"
                      className="text-sm font-medium text-white/80"
                    >
                      Category
                    </label>

                    <select
                      id="category"
                      name="category"
                      defaultValue={editingItem?.category || "Other"}
                      className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-[#D4AF37]/50"
                    >
                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-black"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="text-sm font-medium text-white/80"
                    >
                      Price (ETB)
                    </label>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      required
                      defaultValue={editingItem?.price || ""}
                      placeholder="450"
                      className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-white/80"
                  >
                    Description
                  </label>
 <textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={editingItem?.description || ""}
                    placeholder="Short description of the item..."
                    className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/50"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
                  <input
                    type="checkbox"
                    name="available"
                    defaultChecked={editingItem?.available ?? true}
                    className="h-4 w-4 accent-[#D4AF37]"
                  />

                  <div>
                    <p className="text-sm text-white">
                      Currently available
                    </p>
                    <p className="mt-1 text-xs text-white/30">
                      Customers will see whether this item is available.
                    </p>
                  </div>
                </label>

                <button
                  type="submit"
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {editingItem ? "Update item" : "Add item"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}