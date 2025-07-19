import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ListTodo, Plus, Trash2, Edit3, CheckSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialTodos = [
  {
    id: 1,
    title: "Complete Constitutional Law quiz",
    description: "Review chapters 3-5 before taking the quiz",
    completed: false,
    priority: 'high',
    dueDate: "2024-02-15",
    category: "Assignments"
  },
  {
    id: 2,
    title: "Review legal cases for Civil Procedure",
    description: "Study landmark cases and their implications",
    completed: true,
    priority: 'medium',
    dueDate: "2024-02-10",
    category: "Study"
  },
  {
    id: 3,
    title: "Prepare debate arguments for next session",
    description: "Research both sides of the constitutional law debate",
    completed: false,
    priority: 'high',
    dueDate: "2024-02-18",
    category: "Preparation"
  },
  {
    id: 4,
    title: "Read chapter on Civil Procedure",
    description: "Chapter 7: Discovery and Evidence",
    completed: false,
    priority: 'low',
    dueDate: "2024-02-20",
    category: "Reading"
  },
  {
    id: 5,
    title: "Submit legal brief draft",
    description: "First draft of the legal brief for Constitutional Law course",
    completed: false,
    priority: 'high',
    dueDate: "2024-02-12",
    category: "Assignments"
  },
  {
    id: 6,
    title: "Attend study group meeting",
    description: "Weekly study group for Bar Exam preparation",
    completed: true,
    priority: 'medium',
    dueDate: "2024-02-08",
    category: "Events"
  }
];

function TodoPage() {
  const [todos, setTodos] = useState(initialTodos);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    category: "General"
  });
  const [filter, setFilter] = useState('all');

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const addTodo = () => {
    if (!newTodo.title.trim()) return;
    
    const todo = {
      id: Math.max(...todos.map(t => t.id)) + 1,
      title: newTodo.title,
      description: newTodo.description,
      completed: false,
      priority: newTodo.priority,
      dueDate: newTodo.dueDate,
      category: newTodo.category
    };
    
    setTodos([todo, ...todos]);
    setNewTodo({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      category: "General"
    });
    setIsAddDialogOpen(false);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      case 'low': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'pending') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="container max-w-4xl py-8 px-4 md:px-0">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft size={16} />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ListTodo className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold">Task List</h1>
        </div>
        <p className="text-muted-foreground">Manage all your tasks and assignments in one place</p>
        <Separator className="mt-4" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{pendingCount}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{todos.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  placeholder="Enter task title..."
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  placeholder="Enter task description..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTodo.priority} onValueChange={(value) => setNewTodo({ ...newTodo, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTodo.dueDate}
                    onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newTodo.category}
                  onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
                  placeholder="e.g., Assignments, Study, Reading..."
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={addTodo} className="flex-1">Add Task</Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 mb-6">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({todos.length})
        </Button>
        <Button 
          variant={filter === 'pending' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('pending')}
        >
          Pending ({pendingCount})
        </Button>
        <Button 
          variant={filter === 'completed' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Completed ({completedCount})
        </Button>
      </div>

      {filteredTodos.length > 0 ? (
        <div className="space-y-4">
          {filteredTodos.map((todo) => (
            <Card key={todo.id} className={`p-4 transition-all hover:shadow-md ${todo.completed ? 'bg-muted/30' : ''}`}>
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="mt-1"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {todo.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(todo.priority)}>
                        {todo.priority}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteTodo(todo.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  {todo.description && (
                    <p className={`text-sm mb-2 ${todo.completed ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                      {todo.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="bg-muted px-2 py-1 rounded">{todo.category}</span>
                    {todo.dueDate && (
                      <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card text-card-foreground rounded-lg">
          <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {filter === 'pending' ? 'No Pending Tasks' : 
             filter === 'completed' ? 'No Completed Tasks' : 
             'No Tasks Yet'}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {filter === 'pending' ? 'All tasks are completed! Great job.' :
             filter === 'completed' ? 'No completed tasks found.' :
             'Create your first task to get started with organizing your work.'}
          </p>
        </div>
      )}
    </div>
  );
}

export default TodoPage;