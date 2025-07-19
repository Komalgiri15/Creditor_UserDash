import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

// Dummy data for groups
const groups = [
  { id: 1, name: "Web Development", members: 24, description: "Learn modern web development techniques together" },
  { id: 2, name: "Data Science", members: 18, description: "Explore data analysis and machine learning" },
  { id: 3, name: "Mobile App Development", members: 15, description: "Build cross-platform mobile applications" },
  { id: 4, name: "UI/UX Design", members: 12, description: "Master user interface and experience design principles" },
];

export function Groups() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Groups</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="bg-primary/5">
              <CardTitle>{group.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {group.members} members
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p>{group.description}</p>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 py-3 flex justify-end">
              <Button variant="outline" asChild className="mr-2">
                <Link to={`/groups/${group.id}/news`}>View Group</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Groups;