import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, Mail, AlertCircle, CheckCircle, Clock, ChevronDown, ChevronUp, Send, User, MessageSquare } from 'lucide-react';
import { getAllTickets, addReplyToTicket, updateTicketStatus } from '@/services/ticketService';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const SupportTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [submittingReply, setSubmittingReply] = useState(false);
  const { toast } = useToast();

  // Modal state
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [statusDraft, setStatusDraft] = useState('PENDING');

  // Fetch tickets from backend
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getAllTickets();
      
              // Transform the data to match our component's expected format
        const transformedTickets = response.data.data.map(ticket => ({
          id: ticket.id,
          userId: ticket.student_id,
          userName: ticket.student ? `${ticket.student.first_name} ${ticket.student.last_name}`.trim() : 'Unknown User',
          userEmail: ticket.student?.email || 'No email',
          subject: ticket.subject,
          message: ticket.description || ticket.message, // Use description field from backend
          status: mapToFrontendStatus(ticket.status), // Map backend status to frontend format
          priority: ticket.priority?.toLowerCase() || 'medium',
          createdAt: ticket.created_at,
          updatedAt: ticket.updated_at,
          attachments: ticket.attachments ? JSON.parse(ticket.attachments) : [],
          replies: ticket.replies || []
        }));
      
      // Sort tickets by creation date (newest first)
      const sortedTickets = transformedTickets.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTickets(sortedTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch support tickets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [toast]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ticket.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const toggleTicketExpansion = (ticketId) => {
    setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
    setReplyingTo(null);
    setReplyText('');
  };

  const handleReply = async (ticketId) => {
    if (!replyText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmittingReply(true);
      await addReplyToTicket(ticketId, {
        message: replyText.trim()
      });

      // Refresh tickets to get the updated data
      const response = await getAllTickets();
      const transformedTickets = response.data.data.map(ticket => ({
        id: ticket.id,
        userId: ticket.student_id,
        userName: ticket.student ? `${ticket.student.first_name} ${ticket.student.last_name}`.trim() : 'Unknown User',
        userEmail: ticket.student?.email || 'No email',
        subject: ticket.subject,
        message: ticket.description || ticket.message,
        status: ticket.status?.toLowerCase() || 'pending',
        priority: ticket.priority?.toLowerCase() || 'medium',
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
        attachments: ticket.attachments ? JSON.parse(ticket.attachments) : [],
        replies: ticket.replies || []
      }));
      
      // Sort tickets by creation date (newest first)
      const sortedTickets = transformedTickets.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTickets(sortedTickets);
      setReplyText('');
      setReplyingTo(null);
      setIsReplyDialogOpen(false);

      toast({
        title: "Success",
        description: "Reply sent successfully!",
      });
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReply(false);
    }
  };

  const openReplyDialog = (ticketId) => {
    setActiveTicketId(ticketId);
    setReplyingTo(ticketId);
    setReplyText('');
    setIsReplyDialogOpen(true);
  };

  const openStatusDialog = (ticketId, currentStatus) => {
    setActiveTicketId(ticketId);
    // Map frontend status to backend status format
    const backendStatus = mapToBackendStatus(currentStatus);
    setStatusDraft(backendStatus);
    setIsStatusDialogOpen(true);
  };

  // Update ticket status via backend API
  const applyStatusChange = async () => {
    if (!activeTicketId) return;
    
    try {
      setSubmittingReply(true);
      await updateTicketStatus(activeTicketId, statusDraft);
      
      // Refresh tickets list to get updated data from backend
      await fetchTickets();
      
      setIsStatusDialogOpen(false);
      toast({ 
        title: 'Status updated', 
        description: `Ticket status changed to ${statusDraft}.` 
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReply(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
      case 'pending':
      case 'PENDING':
        return <Badge variant="destructive">Open</Badge>;
      case 'in-progress':
      case 'IN_PROGRESS':
        return <Badge variant="warning">In Progress</Badge>;
      case 'resolved':
      case 'RESOLVED':
        return <Badge variant="success">Resolved</Badge>;
      case 'closed':
      case 'CLOSED':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Map frontend status to backend status format
  const mapToBackendStatus = (frontendStatus) => {
    switch (frontendStatus?.toLowerCase()) {
      case 'open':
      case 'pending':
        return 'PENDING';
      case 'in-progress':
        return 'IN_PROGRESS';
      case 'resolved':
        return 'RESOLVED';
      case 'closed':
        return 'CLOSED';
      default:
        return 'PENDING';
    }
  };

  // Map backend status to frontend display format
  const mapToFrontendStatus = (backendStatus) => {
    switch (backendStatus?.toUpperCase()) {
      case 'PENDING':
        return 'open';
      case 'IN_PROGRESS':
        return 'in-progress';
      case 'RESOLVED':
        return 'resolved';
      case 'CLOSED':
        return 'closed';
      default:
        return 'pending';
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="pb-2 flex-shrink-0">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5" />
            Support Tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 flex-1 flex flex-col overflow-hidden">
          {/* Search and Filter Section */}
          <div className="flex flex-col lg:flex-row gap-3 mb-3 flex-shrink-0">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tickets..."
                className="pl-10 w-full h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full lg:w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex items-center gap-2 w-full h-9">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-32 flex-1">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-8 flex-1">
              <Mail className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-900 mt-2">No tickets found</h3>
              <p className="text-xs text-gray-500 mt-1">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter' 
                  : 'No support tickets have been created yet'}
              </p>
            </div>
          ) : (
            /* Responsive Table Container */
            <div className="flex-1 overflow-auto">
              <div className="min-w-[800px] w-full">
                <Table>
                  <TableCaption className="text-xs">A list of recent support tickets raised by users.</TableCaption>
                  <TableHeader>
                    <TableRow className="sticky top-0 z-10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
                      <TableHead className="w-32 text-xs font-semibold text-gray-600">Ticket ID</TableHead>
                      <TableHead className="w-48 text-xs font-semibold text-gray-600">User</TableHead>
                      <TableHead className="w-[24rem] text-xs font-semibold text-gray-600">Subject</TableHead>
                      <TableHead className="w-20 text-xs font-semibold text-gray-600">Priority</TableHead>
                      <TableHead className="w-24 text-xs font-semibold text-gray-600">Status</TableHead>
                      <TableHead className="w-32 text-xs font-semibold text-gray-600">Date</TableHead>
                      <TableHead className="w-12 text-xs font-semibold text-gray-600">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <React.Fragment key={ticket.id}>
                        <TableRow className="hover:bg-gray-50/60 border-b align-top">
                          <TableCell className="font-medium text-xs py-2">
                            <div className="truncate" title={ticket.id}>
                              #{ticket.id.slice(0, 8)}...
                            </div>
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="font-medium text-xs truncate" title={ticket.userName}>
                              {ticket.userName}
                            </div>
                            <div className="text-xs text-gray-500 truncate" title={ticket.userEmail}>
                              {ticket.userEmail}
                            </div>
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="truncate text-xs" title={ticket.subject}>
                              {ticket.subject}
                            </div>
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="flex items-center gap-1">
                              {getPriorityIcon(ticket.priority)}
                              <span className="capitalize text-xs hidden sm:inline">{ticket.priority}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-2">{getStatusBadge(ticket.status)}</TableCell>
                          <TableCell className="py-2">
                            <div className="text-xs whitespace-nowrap">
                              {formatDate(ticket.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell className="py-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleTicketExpansion(ticket.id)}
                              className="h-6 w-6 p-0"
                            >
                              {expandedTicket === ticket.id ? (
                                <ChevronUp className="h-3 w-3" />
                              ) : (
                                <ChevronDown className="h-3 w-3" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                        {expandedTicket === ticket.id && (
                          <TableRow>
                            <TableCell colSpan={7} className="bg-gray-50 p-3">
                              <div className="grid gap-4">
                                {/* Original Message */}
                                <div>
                                  <h4 className="font-medium mb-1 flex items-center gap-2 text-sm">
                                    <User className="h-3 w-3" />
                                    Message:
                                  </h4>
                                  <div className="bg-white p-2 rounded-lg border">
                                    <p className="text-gray-700 whitespace-pre-line text-xs leading-5">{ticket.message}</p>
                                    {ticket.attachments && ticket.attachments.length > 0 && (
                                      <div className="mt-2 pt-2 border-t">
                                        <h5 className="text-xs font-medium text-gray-600 mb-1">Attachments:</h5>
                                        <div className="flex flex-wrap gap-1">
                                          {ticket.attachments.map((attachment, index) => (
                                            <a
                                              key={index}
                                              href={attachment}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-600 hover:text-blue-800 text-xs underline"
                                            >
                                              Attachment {index + 1}
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Ticket Details + Actions */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                                  <div className="lg:col-span-2">
                                    <h4 className="font-medium mb-1 text-sm">Details:</h4>
                                    <div className="bg-white p-2 rounded-lg border text-xs space-y-1">
                                      <div>
                                        <span className="text-gray-500">Created: </span>
                                        {formatDate(ticket.createdAt)}
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Last Updated: </span>
                                        {formatDate(ticket.updatedAt)}
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Status: </span>
                                        <span className="capitalize">{mapToBackendStatus(ticket.status)}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Priority: </span>
                                        <span className="capitalize">{ticket.priority}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2 justify-start">
                                    <Button size="sm" onClick={() => openStatusDialog(ticket.id, ticket.status)}>
                                      Change Status
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => openReplyDialog(ticket.id)}>
                                      Reply to User
                                    </Button>
                                  </div>
                                </div>

                                {/* Replies */}
                                {ticket.replies && ticket.replies.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-1 flex items-center gap-2 text-sm">
                                      <MessageSquare className="h-3 w-3" />
                                      Replies ({ticket.replies.length}):
                                    </h4>
                                    <div className="space-y-2">
                                      {ticket.replies.map((reply, index) => (
                                        <div key={index} className="bg-white p-2 rounded-lg border">
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-gray-700">
                                              {reply.sender?.name || 'Admin'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                              {formatDate(reply.created_at)}
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-700 whitespace-pre-line leading-5">{reply.message}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to User</DialogTitle>
            <DialogDescription>Write your response and send it to the user.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Textarea
              placeholder="Type your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => handleReply(activeTicketId)}
              disabled={submittingReply || !replyText.trim()}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {submittingReply ? 'Sending...' : 'Send Reply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
            <DialogDescription>Select a new status for this ticket.</DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            <Select value={statusDraft} onValueChange={setStatusDraft}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
                              <SelectContent>
                  <SelectItem value="PENDING">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button 
              onClick={applyStatusChange} 
              disabled={submittingReply}
            >
              {submittingReply ? 'Updating...' : 'Apply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportTicketsPage;