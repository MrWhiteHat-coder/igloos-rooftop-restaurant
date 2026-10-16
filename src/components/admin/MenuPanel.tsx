import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  adminFetchMenu,
  deleteMenuCategory,
  deleteMenuItem,
  saveMenuCategory,
  saveMenuItem,
} from "../../lib/adminData";
import type { MenuCategory, MenuItem } from "../../lib/types";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/form";
import { Modal, Spinner } from "../ui/misc";

interface ItemDraft {
  id?: number;
  category_id: number;
  name: string;
  description: string;
  price_inr: string;
  is_veg: boolean;
  is_available: boolean;
  sort_order: number;
}

const blankItem = (categoryId: number): ItemDraft => ({
  category_id: categoryId,
  name: "",
  description: "",
  price_inr: "",
  is_veg: true,
  is_available: true,
  sort_order: 0,
});

export default function MenuPanel() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ItemDraft | null>(null);
  const [categoryEditing, setCategoryEditing] = useState<Partial<MenuCategory> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetchMenu();
      setCategories(data.categories);
      setItems(data.items);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load menu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const catName = (id: number) => categories.find((c) => c.id === id)?.name ?? "—";

  async function submitItem(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      await saveMenuItem({
        id: editing.id,
        category_id: editing.category_id,
        name: editing.name.trim(),
        description: editing.description.trim() || null,
        price_inr: editing.price_inr === "" ? null : Number(editing.price_inr),
        is_veg: editing.is_veg,
        is_available: editing.is_available,
        sort_order: editing.sort_order,
      });
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Saving the item failed.");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(item: MenuItem) {
    if (!window.confirm(`Delete “${item.name}” from the menu?`)) return;
    try {
      await deleteMenuItem(item.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deleting the item failed.");
    }
  }

  async function removeCategory(c: MenuCategory) {
    if (!window.confirm(`Delete category “${c.name}” and all its items?`)) return;
    try {
      await deleteMenuCategory(c.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deleting the category failed.");
    }
  }

  return (
    <div className="space-y-12">
      {error && (
        <p role="alert" className="rounded-xl border border-red-400/50 bg-red-500/10 px-5 py-4 text-sm text-red-200">
          {error}
        </p>
      )}

      <section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-3xl text-cream">Menu items</h2>
          <Button
            disabled={categories.length === 0}
            onClick={() =>
              setEditing(
                blankItem(categories[0]?.id ?? 0)
              )
            }
          >
            + New item
          </Button>
        </div>
        {loading ? (
          <Spinner label="Loading menu" />
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-line">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-night-2/80 text-[0.7rem] uppercase tracking-[0.16em] text-cream/50">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Flags</th>
                  <th className="px-4 py-3">Sort</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-line">
                {items.map((i) => (
                  <tr key={i.id} className="hover:bg-night-2/40">
                    <td className="px-4 py-3 text-cream/85">{i.name}</td>
                    <td className="px-4 py-3 text-cream/60">{catName(i.category_id)}</td>
                    <td className="px-4 py-3 text-gold">
                      {i.price_inr != null ? `₹${i.price_inr}` : "on request"}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {i.is_veg === true ? "veg" : i.is_veg === false ? "non-veg" : "—"} ·{" "}
                      {i.is_available ? "available" : "unavailable"}
                    </td>
                    <td className="px-4 py-3 text-cream/50">{i.sort_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setEditing({
                              id: i.id,
                              category_id: i.category_id,
                              name: i.name,
                              description: i.description ?? "",
                              price_inr: i.price_inr != null ? String(i.price_inr) : "",
                              is_veg: i.is_veg === true,
                              is_available: i.is_available,
                              sort_order: i.sort_order,
                            })
                          }
                        >
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => void removeItem(i)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-3xl text-cream">Categories</h2>
          <Button onClick={() => setCategoryEditing({ name: "", slug: "", sort_order: 0 })}>
            + New category
          </Button>
        </div>
        <ul className="mt-6 space-y-3">
          {categories.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-line bg-night-2/70 px-6 py-4"
            >
              <div>
                <p className="text-cream/85">{c.name}</p>
                <p className="text-xs text-cream/45">slug: {c.slug} · sort {c.sort_order}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCategoryEditing(c)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => void removeCategory(c)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Item editor */}
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit menu item" : "New menu item"}
      >
        {editing && (
          <form onSubmit={submitItem} className="space-y-5" noValidate>
            <SelectField
              label="Category"
              value={editing.category_id}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              onChange={(v) => setEditing({ ...editing, category_id: v })}
            />
            <Input
              label="Name"
              required
              maxLength={120}
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
            <Textarea
              label="Description"
              optional
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price (₹)"
                optional
                hint="blank = on request"
                type="number"
                min={0}
                step="0.01"
                value={editing.price_inr}
                onChange={(e) => setEditing({ ...editing, price_inr: e.target.value })}
              />
              <Input
                label="Sort order"
                type="number"
                value={editing.sort_order}
                onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="flex flex-wrap gap-8">
              <label className="flex items-center gap-3 text-sm text-cream/75">
                <input
                  type="checkbox"
                  checked={editing.is_veg}
                  onChange={(e) => setEditing({ ...editing, is_veg: e.target.checked })}
                  className="h-4 w-4 accent-[#cfa35a]"
                />
                Vegetarian (untick for non-veg)
              </label>
              <label className="flex items-center gap-3 text-sm text-cream/75">
                <input
                  type="checkbox"
                  checked={editing.is_available}
                  onChange={(e) => setEditing({ ...editing, is_available: e.target.checked })}
                  className="h-4 w-4 accent-[#cfa35a]"
                />
                Available
              </label>
            </div>
            <Button type="submit" loading={saving} className="w-full">
              Save item
            </Button>
          </form>
        )}
      </Modal>

      {/* Category editor */}
      <CategoryEditor
        draft={categoryEditing}
        onClose={() => setCategoryEditing(null)}
        onDone={async () => {
          setCategoryEditing(null);
          await load();
        }}
        onError={setError}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: { value: number; label: string }[];
  onChange: (value: number) => void;
}) {
  const id = `select-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs uppercase tracking-[0.18em] text-cream/70">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-cream/15 bg-night-2/70 px-4 py-3 text-cream focus:border-gold/70"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CategoryEditor({
  draft,
  onClose,
  onDone,
  onError,
}: {
  draft: Partial<MenuCategory> | null;
  onClose: () => void;
  onDone: () => Promise<void>;
  onError: (msg: string) => void;
}) {
  const [local, setLocal] = useState<Partial<MenuCategory> | null>(draft);
  const [busy, setBusy] = useState(false);

  useEffect(() => setLocal(draft), [draft]);

  return (
    <Modal open={draft !== null} onClose={onClose} title={draft?.id ? "Edit category" : "New category"}>
      {local && (
        <form
          onSubmit={async (e: FormEvent) => {
            e.preventDefault();
            setBusy(true);
            try {
              await saveMenuCategory(local);
              await onDone();
            } catch (err) {
              onError(err instanceof Error ? err.message : "Saving the category failed.");
            } finally {
              setBusy(false);
            }
          }}
          className="space-y-5"
          noValidate
        >
          <Input
            label="Name"
            required
            value={local.name ?? ""}
            onChange={(e) => setLocal({ ...local, name: e.target.value })}
          />
          <Input
            label="Slug"
            required
            hint="lowercase-with-dashes"
            pattern="[a-z0-9-]{2,60}"
            value={local.slug ?? ""}
            onChange={(e) => setLocal({ ...local, slug: e.target.value })}
          />
          <Textarea
            label="Description"
            optional
            value={local.description ?? ""}
            onChange={(e) => setLocal({ ...local, description: e.target.value })}
          />
          <Input
            label="Sort order"
            type="number"
            value={local.sort_order ?? 0}
            onChange={(e) => setLocal({ ...local, sort_order: Number(e.target.value) || 0 })}
          />
          <Button type="submit" loading={busy} className="w-full">
            Save category
          </Button>
        </form>
      )}
    </Modal>
  );
}
