import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Mail, AlertCircle, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const SupportTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedTicket, setExpandedTicket] = useState(null);

  // Mock data - replace with API calls in a real application
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockTickets = [
          {
            id: 'TKT-001',
            userId: 'USR-101',
            userName: 'John Doe',
            userEmail: 'john@example.com',
            subject: 'Login issues',
            message: "I can't login to my account since yesterday. Getting error 500.",
            status: 'open',
            priority: 'high',
            createdAt: '2023-05-15T10:30:00Z',
            updatedAt: '2023-05-15T10:30:00Z',
          },
          {
            id: 'TKT-002',
            userId: 'USR-102',
            userName: 'Jane Smith',
            userEmail: 'jane@example.com',
            subject: 'Payment not processed',
            message: "My payment was deducted but the course wasn't unlocked.",
            status: 'in-progress',
            priority: 'medium',
            createdAt: '2023-05-14T14:15:00Z',
            updatedAt: '2023-05-15T09:45:00Z',
          },
          {
            id: 'TKT-003',
            userId: 'USR-103',
            userName: 'Robert Johnson',
            userEmail: 'robert@example.com',
            subject: 'Course content missing',
            message: "Module 3 videos are not loading properly.",
            status: 'resolved',
            priority: 'low',
            createdAt: '2023-05-10T08:20:00Z',
            updatedAt: '2023-05-12T16:30:00Z',
          },
        ];
        
        setTickets(mockTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ticket.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const toggleTicketExpansion = (ticketId) => {
    setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive">Open</Badge>;
      case 'in-progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <AlertCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            Support Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tickets..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mt-4">No tickets found</h3>
              <p className="text-gray-500 mt-1">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter' 
                  : 'No support tickets have been created yet'}
              </p>
            </div>
          ) : (
            <Table>
              <TableCaption>A list of recent support tickets raised by users.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <React.Fragment key={ticket.id}>
                    <TableRow>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{ticket.userName}</div>
                        <div className="text-sm text-gray-500">{ticket.userEmail}</div>
                      </TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(ticket.priority)}
                          <span className="capitalize">{ticket.priority}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTicketExpansion(ticket.id)}
                        >
                          {expandedTicket === ticket.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedTicket === ticket.id && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-gray-50 p-4">
                          <div className="grid gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Message:</h4>
                              <p className="text-gray-700 whitespace-pre-line">{ticket.message}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Details:</h4>
                                <div className="text-sm space-y-1">
                                  <div>
                                    <span className="text-gray-500">Created: </span>
                                    {new Date(ticket.createdAt).toLocaleString()}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Last Updated: </span>
                                    {new Date(ticket.updatedAt).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button variant="outline" size="sm">
                                  Change Status
                                </Button>
                                <Button variant="outline" size="sm">
                                  Reply to User
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTicketsPage;