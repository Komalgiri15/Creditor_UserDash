import React from 'react';
import { Card } from "@/components/ui/card";
import { CheckSquare, ListTodo, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from 'framer-motion';

const todoItems = [
  {
    id: 1,
    title: "Complete Constitutional Law quiz",
    completed: false,
    priority: 'high'
  },
  {
    id: 2,
    title: "Review legal cases",
    completed: true,
    priority: 'medium'
  },
  {
    id: 3,
    title: "Prepare debate arguments",
    completed: false,
    priority: 'high'
  },
  {
    id: 4,
    title: "Read chapter on Civil Procedure",
    completed: false,
    priority: 'low'
  },
  {
    id: 5,
    title: "Submit legal brief draft",
    completed: false,
    priority: 'high'
  }
];

export function DashboardTodo() {
  const [todos, setTodos] = React.useState(todoItems);
  
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 dark:bg-red-950/30';
      case 'medium': return 'bg-amber-100 dark:bg-amber-950/30';
      case 'low': return 'bg-green-100 dark:bg-green-950/30';
      default: return '';
    }
  };

  const getPriorityHoverColor = (priority) => {
    switch(priority) {
      case 'high': return 'hover:bg-red-200 dark:hover:bg-red-950/50';
      case 'medium': return 'hover:bg-amber-200 dark:hover:bg-amber-950/50';
      case 'low': return 'hover:bg-green-200 dark:hover:bg-green-950/50';
      default: return '';
    }
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <Card className="border h-full shadow hover:shadow-lg transition-all duration-300 hover:border-primary/20 group">
      <div className="p-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <ListTodo size={18} className="text-primary group-hover:animate-bounce-subtle" />
          <h3 className="font-medium text-sm group-hover:text-primary transition-colors duration-300">Task List</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-6 px-2 transition-colors duration-300 hover:text-primary" asChild>
          <Link to="/todo">View all</Link>
        </Button>
      </div>
      
      <ScrollArea className="h-[240px] p-3">
        <motion.div 
          className="space-y-2 pr-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {todos.map(todo => (
            <motion.div 
              key={todo.id} 
              variants={item}
              whileHover={{ scale: 1.01, x: 3 }}
              className={`flex items-center gap-2 p-1.5 rounded-md transition-all duration-300 cursor-pointer ${
                todo.completed ? 'bg-muted/30 hover:bg-muted/50' : 
                `${getPriorityColor(todo.priority)} ${getPriorityHoverColor(todo.priority)} bg-opacity-30`
              }`}
            >
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="h-3.5 w-3.5 transition-transform duration-200 hover:scale-110 data-[state=checked]:animate-scale-in"
              />
              <label 
                htmlFor={`todo-${todo.id}`}
                className={`flex-1 text-xs select-none cursor-pointer group/label ${
                  todo.completed ? 'line-through text-muted-foreground' : ''
                }`}
              >
                <span className="inline-block transition-all duration-500 group-hover/label:text-primary">{todo.title}</span>
              </label>
            </motion.div>
          ))}
        </motion.div>
      </ScrollArea>
      
      <div className="p-3 pt-2 border-t relative overflow-hidden">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs transition-all duration-300 bg-gradient-to-r hover:from-primary/10 hover:to-purple-400/10 hover:border-primary/30 hover:shadow-sm group/btn"
          asChild
        >
          <Link to="/todo">
            <Plus size={14} className="mr-1 transition-transform duration-200 group-hover/btn:rotate-90" />
            <span className="group-hover/btn:text-primary transition-colors duration-300">Add task</span>
          </Link>
        </Button>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rainbow-gradient bg-size-200 opacity-0 group-hover:opacity-100 group-hover:animate-bg-pan transition-all duration-500"></div>
      </div>
    </Card>
  );
}

export default DashboardTodo;