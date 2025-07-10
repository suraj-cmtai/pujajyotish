import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, MoreHorizontal, Search } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export interface CrudField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "image" | "date" | "array" | "object";
  required?: boolean;
  options?: { label: string; value: string }[];
  readOnly?: boolean;
  fields?: CrudField[]; // for array/object
}

interface CrudManagerProps<T> {
  resourceName: string;
  fields: CrudField[];
  data: T[];
  loading: boolean;
  error?: string | null;
  onCreate: (form: any) => Promise<any>;
  onEdit: (id: string, form: any) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  formInitialState: any;
  formValidation: (form: any) => string | null;
}

export function CrudManager<T>({
  resourceName,
  fields,
  data,
  loading,
  error,
  onCreate,
  onEdit,
  onDelete,
  formInitialState,
  formValidation,
}: CrudManagerProps<T>) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newForm, setNewForm] = useState<any>(formInitialState);
  const [editForm, setEditForm] = useState<any | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const prevError = useRef<string | null>(null);
  // Add state for array modal
  const [arrayModal, setArrayModal] = useState<{ field: string; mode: 'add' | 'edit'; idx?: number; value: any } | null>(null);

  useEffect(() => {
    setNewForm(formInitialState);
  }, [formInitialState]);

  useEffect(() => {
    if (error && error !== prevError.current) {
      toast.error(typeof error === "string" ? error : "An error occurred");
      prevError.current = error;
    }
    if (!error) {
      prevError.current = null;
    }
  }, [error]);

  const filteredData = data.filter((item: any) => {
    return fields.some(field => {
      const value = item[field.name];
      return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  const resetCreateForm = () => setNewForm(formInitialState);
  const resetEditForm = () => { setEditForm(null); setSelectedId(null); };

  const handleCreate = async () => {
    const validationError = formValidation(newForm);
    if (validationError) { toast.error(validationError); return; }
    setIsSubmitting(true);
    try {
      await onCreate(newForm);
      resetCreateForm();
      setIsCreateDialogOpen(false);
      toast.success(`${resourceName} created successfully!`);
    } catch (err: any) {
      toast.error(err?.message || err || `Failed to create ${resourceName.toLowerCase()}`);
    } finally { setIsSubmitting(false); }
  };

  const openEditDialog = (item: any) => {
    setSelectedId(item.id);
    setEditForm({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleEdit = async () => {
    if (!editForm || !selectedId) return;
    const validationError = formValidation(editForm);
    if (validationError) { toast.error(validationError); return; }
    setIsSubmitting(true);
    try {
      await onEdit(selectedId, editForm);
      setIsEditDialogOpen(false);
      resetEditForm();
      toast.success(`${resourceName} updated successfully!`);
    } catch (err: any) {
      toast.error(err?.message || err || `Failed to update ${resourceName.toLowerCase()}`);
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setIsSubmitting(true);
    try {
      await onDelete(selectedId);
      setIsDeleteDialogOpen(false);
      setSelectedId(null);
      toast.success(`${resourceName} deleted successfully!`);
    } catch (err: any) {
      toast.error(err?.message || `Failed to delete ${resourceName.toLowerCase()}`);
    } finally { setIsSubmitting(false); }
  };

  const renderFormFields = (formState: any, setFormState: any) => (
    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4 overflow-x-auto">
      {fields.map(field => {
        // Special case for Blog: show blogImage only if type==='image', videoUrl only if type==='video'
        if (resourceName === "Blog") {
          if (field.name === "blogImage" && formState.type !== "image") return null;
          if (field.name === "videoUrl" && formState.type !== "video") return null;
          // If type is video and field is videoUrl, show file input instead of text
          if (field.name === "videoUrl" && formState.type === "video") {
            return (
              <div className="grid gap-2" key={field.name}>
                <Label>Video Upload</Label>
                {formState.videoUrl && (
                  <video src={formState.videoUrl} controls className="w-32 h-20 rounded border mb-2" style={{ maxWidth: 128, maxHeight: 80 }} />
                )}
                <Input
                  type="file"
                  accept="video/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setFormState({ ...formState, videoUrl: url, videoFile: file });
                    }
                  }}
                />
              </div>
            );
          }
        }
        if (field.type === "array" && field.fields) {
          // Array of objects: render as sub-table with add/edit/delete
          const arr = Array.isArray(formState[field.name]) ? formState[field.name] : [];
          return (
            <div key={field.name} className="border rounded p-2">
              <Label className="mb-2 block">{field.label}</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    {field.fields.map(f => <TableHead key={f.name}>{f.label}</TableHead>)}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {arr.map((item: any, idx: number) => (
                    <TableRow key={idx}>
                      {field.fields!.map(f => (
                        <TableCell key={f.name}>{item[f.name] ?? "—"}</TableCell>
                      ))}
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => setArrayModal({ field: field.name, mode: 'edit', idx, value: { ...item } })}><Pencil className="w-4 h-4" /></Button>
                        <Button size="sm" variant="outline" className="ml-2" onClick={() => {
                          const newArr = arr.slice();
                          newArr.splice(idx, 1);
                          setFormState({ ...formState, [field.name]: newArr });
                        }}><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                size="sm"
                className="mt-2"
                onClick={() => setArrayModal({ field: field.name, mode: 'add', value: Object.fromEntries(field.fields!.map(f => [f.name, f.type === "image" ? null : ""])) })}
              >Add {field.label.slice(0, -1)}</Button>
              {/* Modal for add/edit array item */}
              <Dialog open={!!arrayModal && arrayModal.field === field.name} onOpenChange={open => { if (!open) setArrayModal(null); }}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{arrayModal?.mode === 'add' ? `Add ${field.label.slice(0, -1)}` : `Edit ${field.label.slice(0, -1)}`}</DialogTitle>
                  </DialogHeader>
                  {arrayModal && arrayModal.field === field.name && (
                    <div className="space-y-3">
                      {field.fields!.map(f => (
                        <div className="mb-2" key={f.name}>
                          {f.type === "textarea" ? (
                            <Textarea
                              value={arrayModal.value[f.name] || ""}
                              onChange={e => setArrayModal({ ...arrayModal, value: { ...arrayModal.value, [f.name]: e.target.value } })}
                              placeholder={f.label}
                            />
                          ) : f.type === "image" ? (
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = URL.createObjectURL(file);
                                  setArrayModal({ ...arrayModal, value: { ...arrayModal.value, [f.name]: url } });
                                }
                              }}
                            />
                          ) : (
                            <Input
                              type={f.type}
                              value={arrayModal.value[f.name] || ""}
                              onChange={e => setArrayModal({ ...arrayModal, value: { ...arrayModal.value, [f.name]: e.target.value } })}
                              placeholder={f.label}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setArrayModal(null)}>Cancel</Button>
                    <Button
                      onClick={() => {
                        if (!arrayModal) return;
                        const newArr = arr.slice();
                        if (arrayModal.mode === 'add') {
                          newArr.push(arrayModal.value);
                        } else if (arrayModal.mode === 'edit' && typeof arrayModal.idx === 'number') {
                          newArr[arrayModal.idx] = arrayModal.value;
                        }
                        setFormState({ ...formState, [field.name]: newArr });
                        setArrayModal(null);
                      }}
                    >{arrayModal?.mode === 'add' ? 'Add' : 'Save'}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          );
        }
        if (field.type === "object" && field.fields) {
          // Object: render as sub-form
          const obj = formState[field.name] || {};
          return (
            <div key={field.name} className="border rounded p-2">
              <Label className="mb-2 block">{field.label}</Label>
              {field.fields.map(f => (
                <div className="mb-2" key={f.name}>
                  {f.type === "textarea" ? (
                    <Textarea
                      value={obj[f.name] || ""}
                      onChange={e => setFormState({ ...formState, [field.name]: { ...obj, [f.name]: e.target.value } })}
                      placeholder={f.label}
                    />
                  ) : f.type === "image" ? (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setFormState({ ...formState, [field.name]: { ...obj, [f.name]: url } });
                        }
                      }}
                    />
                  ) : (
                    <Input
                      type={f.type}
                      value={obj[f.name] || ""}
                      onChange={e => setFormState({ ...formState, [field.name]: { ...obj, [f.name]: e.target.value } })}
                      placeholder={f.label}
                    />
                  )}
                </div>
              ))}
            </div>
          );
        }
        if (field.type === "textarea") {
          return (
            <div className="grid gap-2" key={field.name}>
              <Label htmlFor={field.name}>{field.label}{field.required && <span className="text-red-500">*</span>}</Label>
              <Textarea
                id={field.name}
                value={formState[field.name] || ""}
                onChange={e => setFormState({ ...formState, [field.name]: e.target.value })}
                rows={4}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                disabled={field.readOnly}
              />
            </div>
          );
        }
        if (field.type === "select") {
          return (
            <div className="grid gap-2" key={field.name}>
              <Label htmlFor={field.name}>{field.label}{field.required && <span className="text-red-500">*</span>}</Label>
              <Select
                value={formState[field.name] || ""}
                onValueChange={val => setFormState({ ...formState, [field.name]: val })}
                disabled={field.readOnly}
              >
                <SelectTrigger id={field.name} className="w-full">
                  <SelectValue placeholder={`Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }
        if (field.type === "image") {
          return (
            <div className="grid gap-2" key={field.name}>
              <Label>{field.label}</Label>
              {formState[field.name] && typeof formState[field.name] === "string" && (
                <img src={formState[field.name]} alt="preview" className="w-32 h-20 object-cover rounded border mb-2" />
              )}
              {!field.readOnly && (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setFormState({ ...formState, [field.name]: url, [field.name + 'File']: file });
                    }
                  }}
                />
              )}
            </div>
          );
        }
        if (field.type === "date") {
          return (
            <div className="grid gap-2" key={field.name}>
              <Label>{field.label}</Label>
              <Input
                type="date"
                value={
                  typeof formState[field.name] === "string"
                    ? formState[field.name].slice(0, 10)
                    : typeof formState[field.name] === "number"
                    ? new Date(formState[field.name]).toISOString().slice(0, 10)
                    : formState[field.name] && typeof formState[field.name] === "object" && "seconds" in formState[field.name]
                    ? new Date(formState[field.name].seconds * 1000).toISOString().slice(0, 10)
                    : formState[field.name]
                    ? String(formState[field.name]).slice(0, 10)
                    : ""
                }
                onChange={e => setFormState({ ...formState, [field.name]: e.target.value })}
                disabled={field.readOnly}
              />
            </div>
          );
        }
        // Default: text/number
        return (
          <div className="grid gap-2" key={field.name}>
            <Label htmlFor={field.name}>{field.label}{field.required && <span className="text-red-500">*</span>}</Label>
            <Input
              id={field.name}
              type={field.type}
              value={formState[field.name] || ""}
              onChange={e => setFormState({ ...formState, [field.name]: e.target.value })}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              disabled={field.readOnly}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
      <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
        <h1 className="text-2xl font-bold">{resourceName} Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={open => { setIsCreateDialogOpen(open); if (!open) resetCreateForm(); }}>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />Create {resourceName}
          </Button>
          <DialogContent className="sm:max-w-[900px] overflow-x-auto">
            <DialogHeader>
              <DialogTitle>Create New {resourceName}</DialogTitle>
              <DialogDescription>
                Fill in the details for your new {resourceName.toLowerCase()}. Click create when you're done.
              </DialogDescription>
            </DialogHeader>
            {renderFormFields(newForm, setNewForm)}
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetCreateForm(); }}>Cancel</Button>
              <Button onClick={handleCreate} disabled={isSubmitting}>
                {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>) : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input placeholder={`Search ${resourceName.toLowerCase()}s...`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
      </div>
      <motion.div layout className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {fields.map(field => (
                <TableHead key={field.name}>{field.label}</TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={fields.length + 1} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={fields.length + 1} className="text-center py-8">
                  {searchQuery ? `No ${resourceName.toLowerCase()}s found matching your search` : `No ${resourceName.toLowerCase()}s found`}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item: any) => (
                <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout className="group">
                  {fields.map(field => (
                    <TableCell key={field.name}>
                      {field.type === "image" && item[field.name] ? (
                        <img src={item[field.name]} alt="preview" className="w-16 h-12 object-cover rounded border" />
                      ) : field.name === "videoUrl" && item[field.name] ? (
                        <video src={item[field.name]} controls className="w-32 h-20 rounded border" style={{ maxWidth: 128, maxHeight: 80 }} />
                      ) : field.type === "date" && item[field.name] ? (
                        // Format date using en-GB, handle string, number, Firestore timestamp
                        typeof item[field.name] === "string"
                          ? new Date(item[field.name]).toLocaleDateString('en-GB')
                          : typeof item[field.name] === "number"
                          ? new Date(item[field.name]).toLocaleDateString('en-GB')
                          : item[field.name] && typeof item[field.name] === "object" && "seconds" in item[field.name]
                          ? new Date(item[field.name].seconds * 1000).toLocaleDateString('en-GB')
                          : "—"
                      ) : field.type === "array" && Array.isArray(item[field.name]) ? (
                        item[field.name].length === 0 ? "—" :
                          field.name === "rashis"
                            ? item[field.name].map((r: any) => r.name).join(", ")
                            : `${item[field.name].length} items`
                      ) : field.type === "object" && item[field.name] && typeof item[field.name] === "object" ? (
                        field.name === "panchang"
                          ? Object.entries(item[field.name])
                              .filter(([, v]) => v && typeof v !== 'object')
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(", ")
                          : "[object]"
                      ) : typeof item[field.name] === "object" && item[field.name] !== null ? (
                        JSON.stringify(item[field.name])
                      ) : typeof item[field.name] === "string" ? (
                        item[field.name].length > 60 ? item[field.name].slice(0, 60) + "…" : item[field.name]
                      ) : (
                        item[field.name] ?? "—"
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEditDialog(item)}>
                          <Pencil className="mr-2 h-4 w-4" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => { setSelectedId(item.id); setIsDeleteDialogOpen(true); }}>
                          <Trash2 className="mr-2 h-4 w-4" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={open => { setIsEditDialogOpen(open); if (!open) resetEditForm(); }}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit {resourceName}</DialogTitle>
            <DialogDescription>Make changes to your {resourceName.toLowerCase()}. Click save when you're done.</DialogDescription>
          </DialogHeader>
          {editForm && renderFormFields(editForm, setEditForm)}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetEditForm(); }}>Cancel</Button>
            <Button onClick={handleEdit} disabled={isSubmitting}>
              {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {resourceName}</DialogTitle>
            <DialogDescription>Are you sure you want to delete this {resourceName.toLowerCase()}? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteDialogOpen(false); setSelectedId(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Deleting...</>) : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
} 