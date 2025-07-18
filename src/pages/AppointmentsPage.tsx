// import { CrudManager } from "@/components/CrudManager";
import { appointmentFields } from "@/config/appointmentFields";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppointments,
  // createAppointment,
  updateAppointment,
  // deleteAppointment,
  selectAppointments,
  // selectAppointmentLoading,
  selectAppointmentError
} from "@/store/appointmentSlice";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AppointmentsPage() {
  const dispatch = useDispatch();
  const appointmentsRaw = useSelector(selectAppointments);
  const error = useSelector(selectAppointmentError);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; id: string | null; newStatus: string | null }>({ open: false, id: null, newStatus: null });
  const [pendingUpdate, setPendingUpdate] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchAppointments() as any);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "An error occurred");
    }
  }, [error]);

  // Map payment fields for table display
  const appointments = (appointmentsRaw || []).map((a: any) => ({
    ...a,
    paymentStatus: a.payment?.status || "",
    paymentOrderId: a.payment?.orderId || "",
  }));

  // Filter appointments by search query
  const filteredAppointments = appointments.filter((item: any) =>
    appointmentFields.some(field => {
      const value = item[field.name];
      return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
    })
  );

  const handleStatusChange = (id: string, newStatus: string) => {
    const appt = appointments.find((a: any) => a.id === id);
    if (!appt) return;
    setPendingUpdate({ ...appt, status: newStatus });
    setConfirmDialog({ open: true, id, newStatus });
  };

  const confirmStatusUpdate = async () => {
    if (!pendingUpdate) return;
    await dispatch(updateAppointment({ id: pendingUpdate.id, form: pendingUpdate }) as any);
    setConfirmDialog({ open: false, id: null, newStatus: null });
    setPendingUpdate(null);
  };

  return (
    <div className="p-2 sm:p-6 space-y-6 w-full max-w-[90vw]">
      <h1 className="text-2xl font-bold mb-4 text-left">Appointments</h1>
      <div className="relative w-full flex justify-start mb-2">
        <div className="w-full max-w-md flex justify-start">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 w-full text-left"
          />
        </div>
      </div>
      <div className="rounded-md border w-full md:max-w-[70vw] px-2 md:max-h-[70vh] max-h-[80vh]">
        <div className="overflow-x-auto overflow-y-auto md:max-w-[70vw] md:max-h-[70vh] max-h-[80vh] w-full max-w-screen relative">
          <Table className="min-w-[600px] w-full">
            <TableHeader>
              <TableRow>
                {appointmentFields.map(field => (
                  <TableHead key={field.name} className="sticky top-0 z-10 bg-white">{field.label}</TableHead>
                ))}
                <TableHead className="sticky top-0 z-10 bg-white">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((item: any) => (
                <TableRow key={item.id}>
                  {appointmentFields.map(field => (
                    <TableCell key={field.name} className="text-center px-2 py-1">
                      {field.type === "image" && item[field.name] ? (
                        <img src={item[field.name]} alt="preview" className="w-16 h-12 object-cover rounded border" />
                      ) : field.type === "date" && item[field.name] ? (
                        typeof item[field.name] === "string"
                          ? new Date(item[field.name]).toLocaleDateString('en-GB')
                          : typeof item[field.name] === "number"
                          ? new Date(item[field.name]).toLocaleDateString('en-GB')
                          : item[field.name] && typeof item[field.name] === "object" && "seconds" in item[field.name]
                          ? new Date(item[field.name].seconds * 1000).toLocaleDateString('en-GB')
                          : "—"
                      ) : typeof item[field.name] === "string" ? (
                        item[field.name].length > 60 ? item[field.name].slice(0, 60) + "…" : item[field.name]
                      ) : (
                        item[field.name] ?? "—"
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-center px-2 py-1">
                    <Select value={item.status || "Pending"} onValueChange={val => handleStatusChange(item.id, val)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={confirmDialog.open} onOpenChange={open => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to change the status to <b>{confirmDialog.newStatus}</b>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, id: null, newStatus: null })}>Cancel</Button>
            <Button onClick={confirmStatusUpdate}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 