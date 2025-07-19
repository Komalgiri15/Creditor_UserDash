import React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock ticket data
const mockTickets = [
  {
    id: "12495",
    subject: "Unable to access course materials",
    status: "Open",
    date: "2024-06-01",
  },
  {
    id: "12496",
    subject: "Billing issue with last payment",
    status: "Closed",
    date: "2024-05-28",
  },
  {
    id: "12497",
    subject: "Feature request: Dark mode",
    status: "Pending",
    date: "2024-05-25",
  },
];

const statusColor = (status) => {
  switch (status) {
    case "Open": return "outline";
    case "Closed": return "secondary";
    case "Pending": return "default";
    default: return "outline";
  }
};

export default function MyTickets() {
  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">My Support Tickets</h1>
      <Card className="p-6">
        {mockTickets.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            You have not submitted any support tickets yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>#{ticket.id}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>
                    <Badge variant={statusColor(ticket.status)}>{ticket.status}</Badge>
                  </TableCell>
                  <TableCell>{ticket.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
} 