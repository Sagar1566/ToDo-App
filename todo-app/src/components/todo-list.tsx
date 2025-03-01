"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Trash2, Plus, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [remainingTasks, setRemainingTasks] = useState(0)

  useEffect(() => {
    setRemainingTasks(todos.filter((todo) => !todo.completed).length)
  }, [todos])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim() !== "") {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* About Me Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6" />
            About Me
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hi, I'm <span className="font-semibold">Sagar Navnath Gajbhar</span>, a passionate developer and a second-year student at JDCOE, Nagpur 
            I love coding and creating projects that solve real-world problems This is my simple Todo App built using Next-js and React
          </p>
        </CardContent>
      </Card>

      {/* Todo List Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            My Todo List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTodo} className="flex space-x-2 mb-4">
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task"
              className="flex-grow"
            />
            <Button type="submit" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </form>
          <Separator className="my-4" />
          <ScrollArea className="h-[300px] pr-4">
            <AnimatePresence initial={false}>
              {todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center space-x-2 mb-2 bg-secondary p-2 rounded-md">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      id={`todo-${todo.id}`}
                    />
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`flex-grow ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {todo.text}
                    </label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTodo(todo.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Badge variant="secondary">
            {remainingTasks} task{remainingTasks !== 1 ? "s" : ""} remaining
          </Badge>
          <Button variant="outline" size="sm" onClick={clearCompleted}>
            Clear completed
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
